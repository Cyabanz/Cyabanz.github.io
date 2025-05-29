// Firebase Configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyDNUmJcXRL_6pkqpCRwiZ5V9m0d_K28GQo",
    authDomain: "chatsite-f0fb9.firebaseapp.com",
    projectId: "chatsite-f0fb9",
    storageBucket: "chatsite-f0fb9.firebasestorage.app",
    messagingSenderId: "834593399363",
    appId: "1:834593399363:web:d60c035f9fe86fd16e2af6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const messagesContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const googleLoginBtn = document.getElementById('google-login');
const profileModal = document.getElementById('profile-modal');
const closeModal = document.querySelector('.close-modal');
const saveProfileBtn = document.getElementById('save-profile');
const usernameInput = document.getElementById('username');
const profilePicInput = document.getElementById('profile-pic');
const clearChatBtn = document.getElementById('clear-chat');
const banUserBtn = document.getElementById('ban-user');
const activeUsersList = document.getElementById('active-users-list');
const moderationPanel = document.getElementById('moderation-panel');
const channels = document.querySelectorAll('.channel');

// App State
let currentUser = null;
let currentChannel = 'general';
let lastMessageTime = 0;
let cooldownActive = false;
let bannedWords = ['badword1', 'badword2', 'badword3']; // Add your banned words here
let adminUsers = ['admin@example.com']; // Add admin emails here

// Initialize the app
function init() {
    setupEventListeners();
    checkAuthState();
    loadChannels();
}

// Set up event listeners
function setupEventListeners() {
    // Channel selection
    channels.forEach(channel => {
        channel.addEventListener('click', () => {
            currentChannel = channel.dataset.channel;
            updateActiveChannel();
            loadMessages();
        });
    });

    // Message form
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });

    // Auth buttons
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', signInWithGoogle);
    }

    // Profile modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            profileModal.style.display = 'none';
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }

    // Moderation tools
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }

    if (banUserBtn) {
        banUserBtn.addEventListener('click', banUser);
    }

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
}

// Check auth state
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            checkUserProfile(user.uid);
            updateUIForLoggedInUser();
            loadMessages();
            trackUserActivity();
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
            clearMessages();
        }
    });
}

// Sign in with Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            console.log('Login successful', result.user);
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        });
}

// Check if user has a profile
function checkUserProfile(uid) {
    db.collection('users').doc(uid).get()
        .then(doc => {
            if (!doc.exists) {
                showProfileModal();
            }
        })
        .catch(error => {
            console.error('Error checking user profile:', error);
        });
}

// Show profile modal
function showProfileModal() {
    if (!profileModal) return;
    
    usernameInput.value = currentUser.displayName || '';
    profilePicInput.value = currentUser.photoURL || '';
    profileModal.style.display = 'block';
}

// Save profile
function saveProfile() {
    const username = usernameInput.value.trim();
    const profilePic = profilePicInput.value.trim();

    if (!username) {
        alert('Please enter a username');
        return;
    }

    db.collection('users').doc(currentUser.uid).set({
        username: username,
        profilePic: profilePic,
        email: currentUser.email,
        isAdmin: adminUsers.includes(currentUser.email)
    }, { merge: true })
    .then(() => {
        profileModal.style.display = 'none';
        updateUserPanel();
        loadMessages(); // Refresh to show new profile info
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        alert('Error saving profile: ' + error.message);
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const loginPrompt = document.querySelector('.login-prompt');
    if (loginPrompt) loginPrompt.style.display = 'none';
    
    if (messageInput) messageInput.disabled = false;
    if (messageForm) messageForm.querySelector('button').disabled = false;
    
    updateUserPanel();
    
    // Show moderation panel for admins
    if (adminUsers.includes(currentUser.email)) {
        if (moderationPanel) moderationPanel.style.display = 'block';
    }
}

// Update user panel
function updateUserPanel() {
    const userInfo = document.getElementById('user-info');
    if (!userInfo) return;
    
    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                userInfo.innerHTML = `
                    <div class="user-profile">
                        <img src="${userData.profilePic || 'https://via.placeholder.com/40'}" class="user-avatar" alt="Avatar">
                        <span class="user-name">${userData.username || 'User'}</span>
                        ${userData.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
                    </div>
                    <button id="logout-btn">Logout</button>
                `;
                
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => {
                        auth.signOut();
                    });
                }
            }
        });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const loginPrompt = document.querySelector('.login-prompt');
    if (loginPrompt) loginPrompt.style.display = 'block';
    
    if (messageInput) messageInput.disabled = true;
    if (messageForm) messageForm.querySelector('button').disabled = true;
    if (moderationPanel) moderationPanel.style.display = 'none';
    
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="login-prompt">
                <button id="google-login">Login with Google</button>
            </div>
        `;
        
        const loginBtn = document.getElementById('google-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', signInWithGoogle);
        }
    }
}

// Update active channel UI
function updateActiveChannel() {
    channels.forEach(channel => {
        channel.classList.remove('active');
        if (channel.dataset.channel === currentChannel) {
            channel.classList.add('active');
        }
    });
}

// Load messages for current channel
function loadMessages() {
    if (!currentUser) {
        clearMessages();
        return;
    }

    clearMessages();

    db.collection('messages')
        .where('channel', '==', currentChannel)
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    displayMessage(change.doc.data());
                }
            });
            scrollToBottom();
        }, error => {
            console.error('Error loading messages:', error);
        });
}

// Display a message
function displayMessage(message) {
    if (!messagesContainer) return;
    
    // Skip if message is from a banned user
    if (message.isBanned) return;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    if (currentUser && message.userId === currentUser.uid) {
        messageElement.classList.add('current-user');
    }

    const userDoc = db.collection('users').doc(message.userId);
    userDoc.get().then(doc => {
        if (!doc.exists) return;
        
        const userData = doc.data();
        
        messageElement.innerHTML = `
            <img src="${userData.profilePic || 'https://via.placeholder.com/40'}" class="message-avatar" alt="Avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-username">${userData.username || 'Unknown'}</span>
                    ${userData.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
                    <span class="message-time">${formatTime(message.timestamp)}</span>
                </div>
                <div class="message-text">${message.text}</div>
                ${message.imageUrl ? `<img src="${message.imageUrl}" class="message-image" alt="Uploaded image">` : ''}
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }).catch(error => {
        console.error('Error loading user data:', error);
    });
}

// Format timestamp
function formatTime(timestamp) {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Clear messages
function clearMessages() {
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to #${currentChannel}!</h2>
            <p>Start chatting in this channel.</p>
        </div>
    `;
}

// Send message
function sendMessage() {
    if (!currentUser || cooldownActive || !messageInput) return;
    
    const messageText = messageInput.value.trim();
    const isImageChannel = currentChannel === 'images';
    
    if (!messageText && !isImageChannel) return;
    
    // Check for banned words
    if (containsBannedWords(messageText)) {
        alert('Your message contains inappropriate language');
        return;
    }
    
    // Check cooldown
    const now = Date.now();
    if (now - lastMessageTime < 2500) {
        showCooldownNotice();
        return;
    }
    
    lastMessageTime = now;
    startCooldown();
    
    // Get user data
    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            if (!doc.exists) return;
            
            const message = {
                text: isImageChannel && isValidImageUrl(messageText) ? '' : messageText,
                imageUrl: isImageChannel && isValidImageUrl(messageText) ? messageText : '',
                userId: currentUser.uid,
                userEmail: currentUser.email,
                channel: currentChannel,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                isBanned: false
            };
            
            return db.collection('messages').add(message);
        })
        .then(() => {
            if (messageInput) messageInput.value = '';
        })
        .catch(error => {
            console.error('Error sending message:', error);
            alert('Error sending message: ' + error.message);
        });
}

// Check for banned words
function containsBannedWords(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word.toLowerCase()));
}

// Validate image URL
function isValidImageUrl(url) {
    if (!url) return false;
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());
}

// Show cooldown notice
function showCooldownNotice() {
    if (!messageForm) return;
    
    const existingNotice = messageForm.querySelector('.cooldown-notice');
    if (existingNotice) return;
    
    const notice = document.createElement('div');
    notice.classList.add('cooldown-notice');
    notice.textContent = 'Please wait 2.5 seconds before sending another message';
    messageForm.appendChild(notice);
    
    notice.style.display = 'block';
    setTimeout(() => {
        notice.style.display = 'none';
        setTimeout(() => {
            messageForm.removeChild(notice);
        }, 300);
    }, 2000);
}

// Start cooldown timer
function startCooldown() {
    cooldownActive = true;
    if (messageForm) messageForm.querySelector('button').disabled = true;
    
    setTimeout(() => {
        cooldownActive = false;
        if (currentUser && messageForm) {
            messageForm.querySelector('button').disabled = false;
        }
    }, 2500);
}

// Clear chat
function clearChat() {
    if (!currentUser || !adminUsers.includes(currentUser.email)) return;
    
    if (!confirm('Are you sure you want to clear all messages in this channel?')) return;
    
    db.collection('messages')
        .where('channel', '==', currentChannel)
        .get()
        .then(snapshot => {
            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            console.log('Chat cleared successfully');
        })
        .catch(error => {
            console.error('Error clearing chat:', error);
            alert('Error clearing chat: ' + error.message);
        });
}

// Ban user
function banUser() {
    if (!currentUser || !adminUsers.includes(currentUser.email)) return;
    
    const messages = messagesContainer.querySelectorAll('.message:not(.current-user)');
    if (messages.length === 0) {
        alert('No messages to ban users from');
        return;
    }
    
    const lastMessage = messages[messages.length - 1];
    const userId = lastMessage.dataset.userId;
    const userEmail = lastMessage.dataset.userEmail;
    
    if (!userId || !userEmail) {
        alert('Could not identify user to ban');
        return;
    }
    
    if (!confirm(`Ban user ${userEmail}? All their messages will be hidden.`)) return;
    
    // Mark all user's messages as banned
    db.collection('messages')
        .where('userId', '==', userId)
        .get()
        .then(snapshot => {
            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.update(doc.ref, { isBanned: true });
            });
            return batch.commit();
        })
        .then(() => {
            alert(`User ${userEmail} has been banned`);
        })
        .catch(error => {
            console.error('Error banning user:', error);
            alert('Error banning user: ' + error.message);
        });
}

// Track user activity
function trackUserActivity() {
    if (!currentUser) return;
    
    const userStatusRef = db.collection('status').doc(currentUser.uid);
    
    // Set up presence detection
    firebase.database().ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val() === false) {
            return;
        }
        
        userStatusRef.set({
            state: 'online',
            lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        userStatusRef.onDisconnect().set({
            state: 'offline',
            lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
        });
    });
    
    // Load active users
    loadActiveUsers();
}

// Load active users
function loadActiveUsers() {
    if (!activeUsersList) return;
    
    db.collection('status')
        .where('state', '==', 'online')
        .onSnapshot(snapshot => {
            activeUsersList.innerHTML = '';
            
            snapshot.forEach(doc => {
                const userId = doc.id;
                
                db.collection('users').doc(userId).get().then(userDoc => {
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        
                        const userItem = document.createElement('li');
                        userItem.innerHTML = `
                            <img src="${userData.profilePic || 'https://via.placeholder.com/30'}" 
                                 class="active-users-avatar" alt="Avatar">
                            <span>${userData.username || 'User'}</span>
                            ${userData.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
                        `;
                        
                        activeUsersList.appendChild(userItem);
                    }
                });
            });
        });
}

// Load channels
function loadChannels() {
    updateActiveChannel();
}

// Scroll to bottom of messages
function scrollToBottom() {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
});
