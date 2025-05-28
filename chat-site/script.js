// DOM Elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const channels = document.querySelectorAll('.channel');
const googleLoginBtn = document.getElementById('google-login');
const userInfoDiv = document.getElementById('user-info');
const moderationPanel = document.getElementById('moderation-panel');
const clearChatBtn = document.getElementById('clear-chat');
const banUserBtn = document.getElementById('ban-user');
const activeUsersList = document.getElementById('active-users-list');
const profileModal = document.getElementById('profile-modal');
const closeModal = document.querySelector('.close-modal');
const saveProfileBtn = document.getElementById('save-profile');
const usernameInput = document.getElementById('username');
const profilePicInput = document.getElementById('profile-pic');

// App State
let currentChannel = 'general';
let currentUser = null;
let lastMessageTime = 0;
const messageCooldown = 2500; // 2.5 seconds in milliseconds
let isModerator = false;
const bannedWords = ['badword1', 'badword2', 'offensive', 'hate']; // Add more as needed

// Initialize Firebase
const provider = new firebase.auth.GoogleAuthProvider();

// Channel click handler
channels.forEach(channel => {
    channel.addEventListener('click', () => {
        // Remove active class from all channels
        channels.forEach(c => c.classList.remove('active'));
        // Add active class to clicked channel
        channel.classList.add('active');
        // Update current channel
        currentChannel = channel.getAttribute('data-channel');
        // Clear messages container
        messagesContainer.innerHTML = '';
        // Load messages for the new channel
        loadMessages();
    });
});

// Message form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

// Google login
googleLoginBtn.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // User signed in
            currentUser = result.user;
            checkUserProfile();
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        });
});

// Save profile
saveProfileBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const profilePic = profilePicInput.value.trim();
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    // Save to Firestore
    db.collection('users').doc(currentUser.uid).set({
        uid: currentUser.uid,
        email: currentUser.email,
        username: username,
        profilePic: profilePic || currentUser.photoURL,
        isModerator: false, // Default to false, can be changed manually in DB
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => {
        updateUserUI();
        profileModal.style.display = 'none';
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        alert('Error saving profile: ' + error.message);
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Clear chat (moderator only)
clearChatBtn.addEventListener('click', () => {
    if (!isModerator) {
        alert('You are not authorized to perform this action');
        return;
    }
    
    if (confirm('Are you sure you want to clear all messages in this channel?')) {
        db.collection('messages')
            .where('channel', '==', currentChannel)
            .get()
            .then((querySnapshot) => {
                const batch = db.batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(() => {
                messagesContainer.innerHTML = '';
                alert('Chat cleared successfully');
            })
            .catch(error => {
                console.error('Error clearing chat:', error);
                alert('Error clearing chat: ' + error.message);
            });
    }
});

// Ban user (moderator only)
banUserBtn.addEventListener('click', () => {
    if (!isModerator) {
        alert('You are not authorized to perform this action');
        return;
    }
    
    const selectedUser = prompt('Enter the UID of the user to ban:');
    if (selectedUser) {
        db.collection('bannedUsers').doc(selectedUser).set({
            uid: selectedUser,
            bannedAt: firebase.firestore.FieldValue.serverTimestamp(),
            bannedBy: currentUser.uid
        })
        .then(() => {
            alert('User banned successfully');
        })
        .catch(error => {
            console.error('Error banning user:', error);
            alert('Error banning user: ' + error.message);
        });
    }
});

// Check if user has a profile
function checkUserProfile() {
    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            if (!doc.exists) {
                // Show profile setup modal
                profileModal.style.display = 'block';
                usernameInput.value = currentUser.displayName || '';
                profilePicInput.value = currentUser.photoURL || '';
            } else {
                // Update user data
                currentUser.username = doc.data().username;
                currentUser.profilePic = doc.data().profilePic;
                currentUser.isModerator = doc.data().isModerator || false;
                isModerator = currentUser.isModerator;
                
                // Update UI
                updateUserUI();
                
                // Show moderation panel if moderator
                if (isModerator) {
                    moderationPanel.style.display = 'block';
                }
                
                // Update last active time
                updateLastActive();
            }
        })
        .catch(error => {
            console.error('Error checking user profile:', error);
        });
}

// Update user UI
function updateUserUI() {
    userInfoDiv.innerHTML = `
        <img src="${currentUser.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" alt="Avatar" class="user-avatar">
        <div class="user-name">${currentUser.username || currentUser.email}</div>
    `;
    
    // Enable message input
    messageInput.disabled = false;
    messageForm.querySelector('button').disabled = false;
}

// Update last active time
function updateLastActive() {
    db.collection('users').doc(currentUser.uid).update({
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Send message
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    // Check cooldown
    const now = Date.now();
    if (now - lastMessageTime < messageCooldown) {
        showCooldownNotice();
        return;
    }
    
    // Check if user is banned
    db.collection('bannedUsers').doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                alert('You are banned from sending messages');
                return;
            }
            
            // Apply word filter
            const filteredMessage = filterMessage(messageText);
            
            // Check if message is empty after filtering
            if (!filteredMessage.trim()) {
                alert('Message contains inappropriate content');
                return;
            }
            
            // For images channel, check if message is a URL
            if (currentChannel === 'images' && !isValidImageUrl(filteredMessage)) {
                alert('Please enter a valid image URL in the images channel');
                return;
            }
            
            // Create message object
            const message = {
                text: filteredMessage,
                channel: currentChannel,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                username: currentUser.username,
                userProfilePic: currentUser.profilePic,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                isModerator: isModerator
            };
            
            // Add to Firestore
            db.collection('messages').add(message)
                .then(() => {
                    // Clear input
                    messageInput.value = '';
                    // Update last message time
                    lastMessageTime = now;
                    // Update last active time
                    updateLastActive();
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                    alert('Error sending message: ' + error.message);
                });
        })
        .catch(error => {
            console.error('Error checking ban status:', error);
        });
}

// Filter message for banned words
function filterMessage(text) {
    let filteredText = text;
    bannedWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });
    return filteredText;
}

// Check if URL is an image
function isValidImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url) || 
           /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)/.test(url);
}

// Show cooldown notice
function showCooldownNotice() {
    const notice = document.createElement('div');
    notice.className = 'cooldown-notice';
    notice.textContent = 'Please wait before sending another message';
    messageForm.appendChild(notice);
    
    notice.style.display = 'block';
    
    setTimeout(() => {
        notice.style.display = 'none';
        setTimeout(() => {
            messageForm.removeChild(notice);
        }, 300);
    }, 2000);
}

// Load messages for current channel
function loadMessages() {
    messagesContainer.innerHTML = '';
    
    db.collection('messages')
        .where('channel', '==', currentChannel)
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    displayMessage(change.doc.data());
                }
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
}

// Display message
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const messageDate = message.timestamp ? message.timestamp.toDate() : new Date();
    const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <img src="${message.userProfilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" alt="Avatar" class="message-avatar">
        <div class="message-content">
            <div class="message-header">
                <span class="message-username">${message.username || message.userEmail}</span>
                ${message.isModerator ? '<span class="admin-badge">Mod</span>' : ''}
                <span class="message-time">${timeString}</span>
            </div>
            ${currentChannel === 'images' && isValidImageUrl(message.text) ? 
              `<img src="${message.text}" class="message-image" alt="User image">` : 
              `<div class="message-text">${message.text}</div>`}
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
}

// Load active users
function loadActiveUsers() {
    // Users active in the last 5 minutes
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    db.collection('users')
        .where('lastActive', '>', fiveMinutesAgo)
        .onSnapshot((snapshot) => {
            activeUsersList.innerHTML = '';
            
            snapshot.forEach(doc => {
                const user = doc.data();
                const userItem = document.createElement('li');
                
                userItem.innerHTML = `
                    <img src="${user.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" alt="Avatar" class="active-users-avatar">
                    <span>${user.username || user.email}</span>
                    ${user.isModerator ? '<span class="admin-badge">Mod</span>' : ''}
                `;
                
                activeUsersList.appendChild(userItem);
            });
        });
}

// Auth state observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        checkUserProfile();
        loadMessages();
        loadActiveUsers();
    } else {
        currentUser = null;
        userInfoDiv.innerHTML = `
            <div class="login-prompt">
                <button id="google-login">Login with Google</button>
            </div>
        `;
        document.getElementById('google-login').addEventListener('click', () => {
            firebase.auth().signInWithPopup(provider);
        });
        
        messageInput.disabled = true;
        messageForm.querySelector('button').disabled = true;
        moderationPanel.style.display = 'none';
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.style.display = 'none';
    }
});
