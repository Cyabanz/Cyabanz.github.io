// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyADCVIINCBgvTBvClWqWI5o3SlVS47IJnw",
  authDomain: "fusioncya-cc20a.firebaseapp.com",
  databaseURL: "https://fusioncya-cc20a-default-rtdb.firebaseio.com",
  projectId: "fusioncya-cc20a",
  storageBucket: "fusioncya-cc20a.appspot.com",
  messagingSenderId: "765164293111",
  appId: "1:765164293111:web:43e051c755c4690c0c3cf2",
  measurementId: "G-4DT52P7MPB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');
const signInButton = document.getElementById('signInButton');
const usernameDisplay = document.getElementById('username');
const userAvatar = document.getElementById('user-avatar');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const friendsContainer = document.getElementById('friends-container');
const chatName = document.getElementById('chat-name');
const chatAvatar = document.getElementById('chat-avatar');
const chatStatus = document.getElementById('chat-status');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const addFriendBtn = document.getElementById('add-friend-btn');
const addFriendModal = document.getElementById('add-friend-modal');
const friendEmailInput = document.getElementById('friend-email');
const confirmAddFriendBtn = document.getElementById('confirm-add-friend');
const cancelAddFriendBtn = document.getElementById('cancel-add-friend');
const settingsModal = document.getElementById('settings-modal');
const settingsUsername = document.getElementById('settings-username');
const saveSettingsBtn = document.getElementById('save-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

// Global Variables
let currentUser = null;
let currentChatFriend = null;
let friends = [];
let friendRequests = [];
let unsubscribeMessages = null;
let unsubscribeFriends = null;
let unsubscribeStatus = null;

// Initialize the app
function init() {
    // Auth state listener
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            currentUser = user;
            setupUser(user);
            loginView.style.display = 'none';
            appContainer.style.display = 'block';
            
            // Set up real-time listeners
            setupRealTimeListeners();
            
            // Set user as online
            setUserStatus('online');
        } else {
            // User is signed out
            currentUser = null;
            loginView.style.display = 'flex';
            appContainer.style.display = 'none';
            
            // Clean up listeners
            if (unsubscribeMessages) unsubscribeMessages();
            if (unsubscribeFriends) unsubscribeFriends();
            if (unsubscribeStatus) unsubscribeStatus();
        }
    });

    // Event Listeners
    signInButton.addEventListener('click', signInWithGoogle);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    addFriendBtn.addEventListener('click', () => {
        friendEmailInput.value = '';
        addFriendModal.style.display = 'flex';
    });
    confirmAddFriendBtn.addEventListener('click', sendFriendRequest);
    cancelAddFriendBtn.addEventListener('click', () => {
        addFriendModal.style.display = 'none';
    });
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            addFriendModal.style.display = 'none';
            settingsModal.style.display = 'none';
        });
    });
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.view === 'settings') {
                openSettingsModal();
            }
            
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    cancelSettingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    // Mobile menu toggle
    if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'block';
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            mobileMenuBtn.style.display = 'none';
        } else {
            mobileMenuBtn.style.display = 'block';
        }
    });
}

// Sign in with Google
function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .then(result => {
            // Check if this is a new user
            if (result.additionalUserInfo.isNewUser) {
                return createUserDocument(result.user);
            }
        })
        .catch(error => {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error.message);
        });
}

// Create user document in Firestore
function createUserDocument(user) {
    return db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        username: user.displayName || 'user' + user.uid.substring(0, 4),
        photoURL: user.photoURL || '',
        status: 'online',
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        messagePrivacy: 'everyone',
        friends: [],
        friendRequests: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Set up user interface after login
function setupUser(user) {
    usernameDisplay.textContent = user.displayName || 'User';
    userAvatar.src = user.photoURL || 'https://via.placeholder.com/50';
    
    // Load user data from Firestore
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                usernameDisplay.textContent = userData.username || user.displayName || 'User';
                statusText.textContent = userData.status === 'online' ? 'Online' : 'Offline';
                statusIndicator.className = `status-indicator ${userData.status === 'online' ? 'online' : 'offline'}`;
            }
        });
}

// Set up real-time listeners
function setupRealTimeListeners() {
    // Listen for friends and friend requests
    unsubscribeFriends = db.collection('users').doc(currentUser.uid)
        .onSnapshot(doc => {
            if (doc.exists) {
                const userData = doc.data();
                friends = userData.friends || [];
                friendRequests = userData.friendRequests || [];
                
                // Update friends list
                updateFriendsList();
            }
        });
    
    // Listen for status updates of friends
    setupFriendsStatusListener();
}

// Set up listener for friends' status updates
function setupFriendsStatusListener() {
    // Clean up previous listener if exists
    if (unsubscribeStatus) unsubscribeStatus();
    
    // Get all friend IDs
    const friendIds = friends.map(friend => friend.userId);
    
    if (friendIds.length > 0) {
        unsubscribeStatus = db.collection('users')
            .where(firebase.firestore.FieldPath.documentId(), 'in', friendIds)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'modified') {
                        const friendData = change.doc.data();
                        const friendIndex = friends.findIndex(f => f.userId === friendData.uid);
                        
                        if (friendIndex !== -1) {
                            friends[friendIndex].status = friendData.status;
                            friends[friendIndex].lastSeen = friendData.lastSeen;
                            
                            // Update friend item in UI
                            updateFriendItem(friends[friendIndex]);
                            
                            // If this is the current chat friend, update their status
                            if (currentChatFriend && currentChatFriend.userId === friendData.uid) {
                                updateChatHeader(friendData);
                            }
                        }
                    }
                });
            });
    }
}

// Update friends list in UI
function updateFriendsList() {
    friendsContainer.innerHTML = '';
    
    if (friends.length === 0) {
        friendsContainer.innerHTML = '<p class="no-friends">No friends yet. Add some friends to start chatting!</p>';
        return;
    }
    
    friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.className = `friend-item ${currentChatFriend?.userId === friend.userId ? 'active' : ''}`;
        friendItem.innerHTML = `
            <img src="${friend.photoURL || 'https://via.placeholder.com/40'}" class="friend-avatar" alt="${friend.username}">
            <div class="friend-info">
                <div class="friend-name">${friend.username}</div>
                <div class="friend-status">
                    <span class="status-indicator ${friend.status === 'online' ? 'online' : 'offline'}"></span>
                    ${friend.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(friend.lastSeen)}`}
                </div>
            </div>
        `;
        
        friendItem.addEventListener('click', () => {
            openChat(friend);
        });
        
        friendsContainer.appendChild(friendItem);
    });
}

// Update individual friend item in UI
function updateFriendItem(friend) {
    const friendItems = document.querySelectorAll('.friend-item');
    friendItems.forEach(item => {
        const friendName = item.querySelector('.friend-name').textContent;
        if (friendName === friend.username) {
            const statusIndicator = item.querySelector('.status-indicator');
            const statusText = item.querySelector('.friend-status');
            
            statusIndicator.className = `status-indicator ${friend.status === 'online' ? 'online' : 'offline'}`;
            statusText.innerHTML = `
                <span class="status-indicator ${friend.status === 'online' ? 'online' : 'offline'}"></span>
                ${friend.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(friend.lastSeen)}`}
            `;
            
            // Update active state if this is the current chat friend
            if (currentChatFriend?.userId === friend.userId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

// Format last seen time
function formatLastSeen(timestamp) {
    if (!timestamp) return 'a long time ago';
    
    const now = new Date();
    const lastSeen = timestamp.toDate();
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

// Open chat with a friend
function openChat(friend) {
    currentChatFriend = friend;
    
    // Update chat header
    updateChatHeader(friend);
    
    // Enable message input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    
    // Mark all friend items as inactive
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Mark the selected friend as active
    const friendItems = document.querySelectorAll('.friend-item');
    friendItems.forEach(item => {
        const friendName = item.querySelector('.friend-name').textContent;
        if (friendName === friend.username) {
            item.classList.add('active');
        }
    });
    
    // Load messages
    loadMessages(friend.userId);
}

// Update chat header with friend info
function updateChatHeader(friend) {
    chatName.textContent = friend.username;
    chatAvatar.src = friend.photoURL || 'https://via.placeholder.com/45';
    chatStatus.innerHTML = `
        <span class="status-indicator ${friend.status === 'online' ? 'online' : 'offline'}"></span>
        ${friend.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(friend.lastSeen)}`}
    `;
}

// Load messages for a chat
function loadMessages(friendId) {
    // Clear current messages
    chatMessages.innerHTML = '';
    
    // Unsubscribe from previous listener if exists
    if (unsubscribeMessages) unsubscribeMessages();
    
    // Create a combined ID for the chat (sorted to ensure consistency)
    const chatId = [currentUser.uid, friendId].sort().join('_');
    
    // Listen for new messages
    unsubscribeMessages = db.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            chatMessages.innerHTML = '';
            
            snapshot.forEach(doc => {
                const message = doc.data();
                addMessageToChat(message, message.senderId === currentUser.uid);
            });
            
            // Scroll to bottom
            scrollToBottom();
        });
}

// Add a message to the chat UI
function addMessageToChat(message, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const messageTime = message.timestamp.toDate();
    const timeString = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">${message.text}</div>
        <div class="message-info">
            <span class="message-time">${timeString}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Scroll chat to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChatFriend) return;
    
    // Create a combined ID for the chat (sorted to ensure consistency)
    const chatId = [currentUser.uid, currentChatFriend.userId].sort().join('_');
    
    // Create the message
    const message = {
        text: text,
        senderId: currentUser.uid,
        receiverId: currentChatFriend.userId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
    };
    
    // Add message to Firestore
    db.collection('chats').doc(chatId)
        .collection('messages')
        .add(message)
        .then(() => {
            // Clear input
            messageInput.value = '';
            
            // Update last message timestamp for both users
            updateLastMessageTimestamp(currentUser.uid, currentChatFriend.userId);
            updateLastMessageTimestamp(currentChatFriend.userId, currentUser.uid);
        })
        .catch(error => {
            console.error('Error sending message:', error);
            alert('Failed to send message: ' + error.message);
        });
}

// Update last message timestamp between two users
function updateLastMessageTimestamp(userId1, userId2) {
    db.collection('users').doc(userId1)
        .update({
            [`lastMessages.${userId2}`]: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(error => {
            console.error('Error updating last message timestamp:', error);
        });
}

// Send friend request
function sendFriendRequest() {
    const friendEmail = friendEmailInput.value.trim();
    if (!friendEmail) {
        alert('Please enter your friend\'s email');
        return;
    }
    
    // Check if the email is the user's own email
    if (friendEmail === currentUser.email) {
        alert('You cannot add yourself as a friend');
        return;
    }
    
    // Find user by email
    db.collection('users')
        .where('email', '==', friendEmail)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                alert('No user found with that email');
                return;
            }
            
            const friendDoc = snapshot.docs[0];
            const friendData = friendDoc.data();
            const friendId = friendDoc.id;
            
            // Check if already friends
            if (friends.some(f => f.userId === friendId)) {
                alert('You are already friends with this user');
                return;
            }
            
            // Check if request already sent
            if (friendRequests.some(r => r.userId === friendId)) {
                alert('Friend request already sent to this user');
                return;
            }
            
            // Add friend request to recipient's document
            db.collection('users').doc(friendId)
                .update({
                    friendRequests: firebase.firestore.FieldValue.arrayUnion({
                        userId: currentUser.uid,
                        username: currentUser.displayName || 'User',
                        photoURL: currentUser.photoURL || '',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                })
                .then(() => {
                    alert('Friend request sent successfully');
                    addFriendModal.style.display = 'none';
                })
                .catch(error => {
                    console.error('Error sending friend request:', error);
                    alert('Failed to send friend request: ' + error.message);
                });
        })
        .catch(error => {
            console.error('Error finding user:', error);
            alert('Failed to find user: ' + error.message);
        });
}

// Open settings modal
function openSettingsModal() {
    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                settingsUsername.value = userData.username || currentUser.displayName || '';
                
                // Set privacy radio button
                document.querySelector(`input[name="message-privacy"][value="${userData.messagePrivacy || 'everyone'}"]`).checked = true;
                
                // Set status radio button
                document.querySelector(`input[name="user-status"][value="${userData.status || 'online'}"]`).checked = true;
                
                settingsModal.style.display = 'flex';
            }
        });
}

// Save settings
function saveSettings() {
    const newUsername = settingsUsername.value.trim();
    const messagePrivacy = document.querySelector('input[name="message-privacy"]:checked').value;
    const userStatus = document.querySelector('input[name="user-status"]:checked').value;
    
    if (!newUsername) {
        alert('Username cannot be empty');
        return;
    }
    
    const updates = {
        username: newUsername,
        messagePrivacy: messagePrivacy,
        status: userStatus,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('users').doc(currentUser.uid)
        .update(updates)
        .then(() => {
            usernameDisplay.textContent = newUsername;
            statusText.textContent = userStatus === 'online' ? 'Online' : 'Offline';
            statusIndicator.className = `status-indicator ${userStatus === 'online' ? 'online' : 'offline'}`;
            
            // Update in friends list if needed
            if (currentChatFriend) {
                chatName.textContent = newUsername;
            }
            
            settingsModal.style.display = 'none';
            alert('Settings saved successfully');
        })
        .catch(error => {
            console.error('Error saving settings:', error);
            alert('Failed to save settings: ' + error.message);
        });
}

// Set user status (online/offline)
function setUserStatus(status) {
    if (!currentUser) return;
    
    db.collection('users').doc(currentUser.uid)
        .update({
            status: status,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(error => {
            console.error('Error updating status:', error);
        });
}

// Handle window close or page refresh
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        setUserStatus('offline');
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
