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
let activeUsers = {};
let messageListener = null;
let usersListener = null;

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
        
        // Remove previous listener if exists
        if (messageListener) {
            messageListener();
        }
        
        // Load messages for the new channel
        loadMessages();
    });
});

// Message form submission
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendMessage();
});

// Google login
googleLoginBtn.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // User signed in - handled by auth state observer
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        });
});

// Save profile
saveProfileBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const profilePic = profilePicInput.value.trim();
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    try {
        // Save to Firestore
        await db.collection('users').doc(currentUser.uid).set({
            uid: currentUser.uid,
            email: currentUser.email,
            username: username,
            profilePic: profilePic || currentUser.photoURL,
            isModerator: false, // Default to false, can be changed manually in DB
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        // Update local user object
        currentUser.username = username;
        currentUser.profilePic = profilePic || currentUser.photoURL;
        
        updateUserUI();
        profileModal.style.display = 'none';
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile: ' + error.message);
    }
});

// Close modal
closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Clear chat (moderator only)
clearChatBtn.addEventListener('click', async () => {
    if (!isModerator) {
        alert('You are not authorized to perform this action');
        return;
    }
    
    if (confirm('Are you sure you want to clear all messages in this channel?')) {
        try {
            const querySnapshot = await db.collection('messages')
                .where('channel', '==', currentChannel)
                .get();
            
            const batch = db.batch();
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            messagesContainer.innerHTML = '';
            alert('Chat cleared successfully');
        } catch (error) {
            console.error('Error clearing chat:', error);
            alert('Error clearing chat: ' + error.message);
        }
    }
});

// Ban user (moderator only)
banUserBtn.addEventListener('click', async () => {
    if (!isModerator) {
        alert('You are not authorized to perform this action');
        return;
    }
    
    // Show list of active users to ban
    let userList = "Active Users:\n";
    Object.keys(activeUsers).forEach(uid => {
        userList += `${uid}: ${activeUsers[uid].username || activeUsers[uid].email}\n`;
    });
    
    const selectedUid = prompt(`${userList}\nEnter the UID of the user to ban:`);
    if (selectedUid) {
        try {
            // Get user data first
            const userDoc = await db.collection('users').doc(selectedUid).get();
            
            if (!userDoc.exists) {
                alert('User not found');
                return;
            }
            
            const userData = userDoc.data();
            
            // Add to banned collection
            await db.collection('bannedUsers').doc(selectedUid).set({
                uid: selectedUid,
                username: userData.username,
                email: userData.email,
                bannedAt: firebase.firestore.FieldValue.serverTimestamp(),
                bannedBy: currentUser.uid,
                bannedByName: currentUser.username || currentUser.email
            });
            
            alert(`User ${userData.username || userData.email} banned successfully`);
            
            // Force banned user to logout
            if (activeUsers[selectedUid]) {
                // In a real app, you'd use Firebase Functions to force logout
                alert(`User ${userData.username || userData.email} will be logged out on their next action`);
            }
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Error banning user: ' + error.message);
        }
    }
});

// Check if user has a profile
async function checkUserProfile() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        
        if (!userDoc.exists) {
            // Show profile setup modal
            profileModal.style.display = 'block';
            usernameInput.value = currentUser.displayName || '';
            profilePicInput.value = currentUser.photoURL || '';
        } else {
            // Update user data
            const userData = userDoc.data();
            currentUser.username = userData.username;
            currentUser.profilePic = userData.profilePic;
            currentUser.isModerator = userData.isModerator || false;
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
    } catch (error) {
        console.error('Error checking user profile:', error);
    }
}

// Update user UI
function updateUserUI() {
    userInfoDiv.innerHTML = `
        <img src="${currentUser.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" alt="Avatar" class="user-avatar">
        <div class="user-name">${currentUser.username || currentUser.email}</div>
        ${isModerator ? '<span class="admin-badge">Mod</span>' : ''}
    `;
    
    // Enable message input
    messageInput.disabled = false;
    messageForm.querySelector('button').disabled = false;
}

// Update last active time
async function updateLastActive() {
    try {
        await db.collection('users').doc(currentUser.uid).update({
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating last active:', error);
    }
}

// Send message
async function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    // Check cooldown
    const now = Date.now();
    if (now - lastMessageTime < messageCooldown) {
        showCooldownNotice();
        return;
    }
    
    try {
        // Check if user is banned
        const banDoc = await db.collection('bannedUsers').doc(currentUser.uid).get();
        
        if (banDoc.exists) {
            alert('You are banned from sending messages');
            await firebase.auth().signOut();
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
        await db.collection('messages').add(message);
        
        // Clear input
        messageInput.value = '';
        // Update last message time
        lastMessageTime = now;
        // Update last active time
        updateLastActive();
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Handle permission denied specifically
        if (error.code === 'permission-denied') {
            alert('Error: You don\'t have permission to perform this action');
        } else {
            alert('Error sending message: ' + error.message);
        }
    }
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
    return /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/.test(url) || 
           /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|svg|bmp)/.test(url) ||
           /^https?:\/\/.*(imgur|flickr|giphy|tenor|gfycat)/.test(url);
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
    messagesContainer.innerHTML = '<div class="loading">Loading messages...</div>';
    
    messageListener = db.collection('messages')
        .where('channel', '==', currentChannel)
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            // Clear loading message
            if (messagesContainer.querySelector('.loading')) {
                messagesContainer.innerHTML = '';
            }
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    displayMessage(change.doc.data());
                }
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, (error) => {
            console.error('Error loading messages:', error);
            messagesContainer.innerHTML = '<div class="error">Error loading messages</div>';
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
              `<img src="${message.text}" class="message-image" alt="User image" onerror="this.parentNode.innerHTML='<div class=\'message-text\'>[Invalid image URL]</div>'">` : 
              `<div class="message-text">${message.text}</div>`}
        </div>
    `;
    
    // Add delete button for moderators or message owners
    if (isModerator || message.userId === currentUser?.uid) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-message';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete message';
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Delete this message?')) {
                try {
                    // We need to find the message ID to delete it
                    // This is a limitation of our current structure
                    // In a production app, you'd want to include message IDs
                    alert('Message deletion requires message IDs to be stored. This is a demo limitation.');
                } catch (error) {
                    console.error('Error deleting message:', error);
                    alert('Error deleting message: ' + error.message);
                }
            }
        });
        
        messageDiv.querySelector('.message-content').appendChild(deleteBtn);
    }
    
    messagesContainer.appendChild(messageDiv);
}

// Load active users
function loadActiveUsers() {
    // Users active in the last 5 minutes
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    usersListener = db.collection('users')
        .where('lastActive', '>', fiveMinutesAgo)
        .onSnapshot((snapshot) => {
            activeUsersList.innerHTML = '';
            activeUsers = {};
            
            snapshot.forEach(doc => {
                const user = doc.data();
                activeUsers[user.uid] = user;
                
                const userItem = document.createElement('li');
                userItem.className = 'active-user';
                userItem.dataset.uid = user.uid;
                
                userItem.innerHTML = `
                    <img src="${user.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" alt="Avatar" class="active-users-avatar">
                    <span>${user.username || user.email}</span>
                    ${user.isModerator ? '<span class="admin-badge">Mod</span>' : ''}
                `;
                
                // Add click handler for moderators
                if (isModerator) {
                    userItem.style.cursor = 'pointer';
                    userItem.addEventListener('click', () => {
                        if (confirm(`Moderate user: ${user.username || user.email}\n\nOptions:`)) {
                            // In a real app, you'd have moderation options here
                        }
                    });
                }
                
                activeUsersList.appendChild(userItem);
            });
        }, (error) => {
            console.error('Error loading active users:', error);
        });
}

// Auth state observer
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        try {
            currentUser = user;
            
            // Check if user is banned first
            const banDoc = await db.collection('bannedUsers').doc(user.uid).get();
            if (banDoc.exists) {
                alert('Your account is banned from this chat');
                await firebase.auth().signOut();
                return;
            }
            
            // Continue with normal flow if not banned
            await checkUserProfile();
            loadMessages();
            loadActiveUsers();
        } catch (error) {
            console.error('Error checking ban status:', error);
            // Continue anyway if there's an error checking ban status
            await checkUserProfile();
            loadMessages();
            loadActiveUsers();
        }
    } else {
        currentUser = null;
        isModerator = false;
        
        // Clean up listeners
        if (messageListener) {
            messageListener();
        }
        if (usersListener) {
            usersListener();
        }
        
        userInfoDiv.innerHTML = `
            <div class="login-prompt">
                <button id="google-login">Login with Google</button>
            </div>
        `;
        
        // Re-attach login handler
        document.getElementById('google-login').addEventListener('click', () => {
            firebase.auth().signInWithPopup(provider);
        });
        
        // Disable message input
        messageInput.disabled = true;
        messageForm.querySelector('button').disabled = true;
        
        // Hide moderation panel
        moderationPanel.style.display = 'none';
        
        // Show welcome message
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to Widget Cord!</h2>
                <p>Please login to start chatting.</p>
            </div>
        `;
        
        // Clear active users
        activeUsersList.innerHTML = '';
        activeUsers = {};
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.style.display = 'none';
    }
});

// Add some CSS for new elements
const style = document.createElement('style');
style.textContent = `
    .loading, .error {
        padding: 20px;
        text-align: center;
        color: #aaa;
    }
    
    .delete-message {
        background: none;
        border: none;
        color: #aaa;
        cursor: pointer;
        margin-left: 10px;
        font-size: 0.8em;
        opacity: 0;
        transition: opacity 0.2s;
    }
    
    .message:hover .delete-message {
        opacity: 1;
    }
    
    .delete-message:hover {
        color: var(--error-color);
    }
    
    .active-user {
        transition: background 0.2s;
    }
    
    .active-user:hover {
        background: rgba(255,255,255,0.1);
    }
`;
document.head.appendChild(style);
