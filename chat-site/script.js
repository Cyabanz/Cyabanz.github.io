// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNUmJcXRL_6pkqpCRwiZ5V9m0d_K28GQo",
    authDomain: "chatsite-f0fb9.firebaseapp.com",
    projectId: "chatsite-f0fb9",
    storageBucket: "chatsite-f0fb9.appspot.com",
    messagingSenderId: "834593399363",
    appId: "1:834593399363:web:d60c035f9fe86fd16e2af6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

let currentUser = null;
let currentChannel = 'general';
let lastMessageTime = 0;
let cooldownActive = false;
let bannedWords = ['badword1', 'badword2', 'badword3'];
let adminUsers = ['admin@example.com'];
let userConversations = {}; // { dmId: username }
let unsubscribeConversations = null;

function getDOM() {
    return {
        messagesContainer: document.getElementById('messages-container'),
        messageForm: document.getElementById('message-form'),
        messageInput: document.getElementById('message-input'),
        profileModal: document.getElementById('profile-modal'),
        closeModal: document.querySelector('.close-modal'),
        saveProfileBtn: document.getElementById('save-profile'),
        usernameInput: document.getElementById('username'),
        profilePicInput: document.getElementById('profile-pic'),
        clearChatBtn: document.getElementById('clear-chat'),
        banUserBtn: document.getElementById('ban-user'),
        activeUsersList: document.getElementById('active-users-list'),
        moderationPanel: document.getElementById('moderation-panel'),
        channels: document.querySelectorAll('.channel'),
        userInfo: document.getElementById('user-info'),
        dmUserInput: document.getElementById('dm-user-input'),
        startDmBtn: document.getElementById('start-dm-btn'),
        dmList: document.getElementById('dm-list')
    };
}

function init() {
    setupEventListeners();
    checkAuthState();
    loadChannels();
}

function setupEventListeners() {
    const {
        channels, profileModal, closeModal, saveProfileBtn,
        clearChatBtn, banUserBtn, messageForm, startDmBtn
    } = getDOM();

    channels.forEach(channel => {
        channel.addEventListener('click', () => {
            currentChannel = channel.dataset.channel;
            updateActiveChannel();
            loadMessages();
        });
    });

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            profileModal.style.display = 'none';
        });
    }
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    if (banUserBtn) {
        banUserBtn.addEventListener('click', banUser);
    }
    if (startDmBtn) {
        startDmBtn.addEventListener('click', startNewDM);
    }

    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });

    attachLoginListener();
}

function attachLoginListener() {
    setTimeout(() => {
        const loginBtn = document.getElementById('google-login');
        if (loginBtn) {
            loginBtn.onclick = signInWithGoogle;
        }
    }, 0);
}

function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (unsubscribeConversations) {
            unsubscribeConversations();
            unsubscribeConversations = null;
        }

        if (user) {
            currentUser = user;
            checkUserProfile(user.uid);
            updateUIForLoggedInUser();
            listenUserConversations(); // Listen cross-platform in realtime
            loadMessages();
            trackUserActivity();
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
            clearMessages();
            userConversations = {};
            renderSavedConversations();
            if (unsubscribeConversations) {
                unsubscribeConversations();
                unsubscribeConversations = null;
            }
        }
    });
}

// Listen to user's DM list in Firestore. This is cross-platform/cross-tab
function listenUserConversations() {
    if (!currentUser) return;

    unsubscribeConversations = db.collection('user_conversations')
        .doc(currentUser.uid)
        .onSnapshot(doc => {
            if (doc.exists) {
                userConversations = doc.data().conversations || {};
                renderSavedConversations();
            } else {
                userConversations = {};
                renderSavedConversations();
            }
        }, error => {
            console.error('Error listening to conversations:', error);
        });
}

// Render DM list in sidebar. Cross-platform, always from Firestore.
function renderSavedConversations() {
    const { dmList } = getDOM();
    if (!dmList) return;

    dmList.innerHTML = '';
    Object.keys(userConversations).forEach(dmId => {
        const username = userConversations[dmId];
        addDMToList(dmId, username, false);
    });
}

// Save DM to Firestore, triggers cross-device sync
function saveConversation(dmId, username) {
    if (!currentUser) return;

    // Update local state
    userConversations[dmId] = username;

    // Update Firestore
    db.collection('user_conversations')
        .doc(currentUser.uid)
        .set({
            conversations: userConversations
        }, { merge: true })
        .catch(error => {
            console.error('Error saving conversation:', error);
        });
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(error => {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        });
}

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

function showProfileModal() {
    const { profileModal, usernameInput, profilePicInput } = getDOM();
    if (!profileModal) return;
    usernameInput.value = currentUser.displayName || '';
    profilePicInput.value = currentUser.photoURL || '';
    profileModal.style.display = 'block';
}

function saveProfile() {
    const { profileModal, usernameInput, profilePicInput } = getDOM();
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
        loadMessages();
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        alert('Error saving profile: ' + error.message);
    });
}

function updateUIForLoggedInUser() {
    const { messageInput, messageForm, moderationPanel } = getDOM();
    const loginPrompt = document.querySelector('.login-prompt');
    if (loginPrompt) loginPrompt.style.display = 'none';

    if (messageInput) messageInput.disabled = false;
    if (messageForm) messageForm.querySelector('button').disabled = false;
    updateUserPanel();

    if (currentUser && adminUsers.includes(currentUser.email)) {
        if (moderationPanel) moderationPanel.style.display = 'block';
    } else if (moderationPanel) {
        moderationPanel.style.display = 'none';
    }
}

function updateUserPanel() {
    const { userInfo } = getDOM();
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
                    logoutBtn.onclick = () => auth.signOut();
                }
            }
        });
}

function updateUIForLoggedOutUser() {
    const { messageInput, messageForm, moderationPanel, userInfo } = getDOM();
    const loginPrompt = document.querySelector('.login-prompt');
    if (loginPrompt) loginPrompt.style.display = 'block';

    if (messageInput) messageInput.disabled = true;
    if (messageForm) messageForm.querySelector('button').disabled = true;
    if (moderationPanel) moderationPanel.style.display = 'none';

    if (userInfo) {
        userInfo.innerHTML = `
            <div class="login-prompt">
                <button id="google-login">Login with Google</button>
            </div>
        `;
        attachLoginListener();
    }
}

function updateActiveChannel() {
    const { channels, dmList } = getDOM();

    if (channels) {
        channels.forEach(channel => {
            channel.classList.remove('active');
        });
    }

    if (dmList) {
        dmList.querySelectorAll('.dm-channel').forEach(dm => {
            dm.classList.remove('active');
        });
    }

    if (currentChannel.startsWith('dm_')) {
        const dmId = currentChannel.replace('dm_', '');
        const activeDm = dmList.querySelector(`[data-dm-id="${dmId}"]`);
        if (activeDm) {
            activeDm.classList.add('active');
        }
    } else {
        const activeChannel = document.querySelector(`.channel[data-channel="${currentChannel}"]`);
        if (activeChannel) {
            activeChannel.classList.add('active');
        }
    }
}

let unsubscribeMessages = null;
function loadMessages() {
    const { messagesContainer } = getDOM();
    if (!currentUser) {
        clearMessages();
        return;
    }
    clearMessages();

    if (unsubscribeMessages) unsubscribeMessages();

    let query;
    if (currentChannel.startsWith('dm_')) {
        const dmId = currentChannel.replace('dm_', '');
        const [user1, user2] = dmId.split('_');
        const reverseDmId = `${user2}_${user1}`;

        query = db.collection('messages')
            .where('channel', 'in', [`dm_${dmId}`, `dm_${reverseDmId}`])
            .orderBy('timestamp', 'asc');
    } else {
        query = db.collection('messages')
            .where('channel', '==', currentChannel)
            .orderBy('timestamp', 'asc');
    }

    unsubscribeMessages = query.onSnapshot(async snapshot => {
        const docs = [];
        snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));

        const userIds = Array.from(new Set(docs.map(m => m.userId))).filter(Boolean);
        const userDocs = {};
        await Promise.all(userIds.map(uid =>
            db.collection('users').doc(uid).get().then(userDoc => {
                userDocs[uid] = userDoc.exists ? userDoc.data() : null;
            })
        ));

        let html = '';
        docs.forEach(message => {
            if (message.isBanned) return;
            const userData = userDocs[message.userId] || {};
            const isCurrentUser = currentUser && message.userId === currentUser.uid;
            html += `
            <div class="message ${isCurrentUser ? 'current-user' : ''}" 
                 data-user-id="${message.userId || ''}" 
                 data-user-email="${message.userEmail || ''}" 
                 data-message-id="${message.id}">
                <img src="${userData.profilePic || 'https://via.placeholder.com/40'}" 
                     class="message-avatar" alt="Avatar">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-username">${userData.username || 'Unknown'}</span>
                        ${userData.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
                        <span class="message-time">${formatTime(message.timestamp)}</span>
                    </div>
                    ${message.text ? `<div class="message-text">${message.text}</div>` : ''}
                    ${message.imageUrl ? `<img src="${message.imageUrl}" class="message-image" alt="Uploaded image">` : ''}
                </div>
            </div>
            `;
        });

        messagesContainer.innerHTML = html || `
            <div class="welcome-message">
                <h2>${currentChannel.startsWith('dm_') ? 'Start a private conversation' : `Welcome to #${currentChannel}!`}</h2>
                <p>${currentChannel.startsWith('dm_') ? 'Send a message to begin chatting' : 'Start chatting in this channel.'}</p>
            </div>
        `;
        scrollToBottom();
    }, error => {
        console.error('Error loading messages:', error);
    });
}

function formatTime(timestamp) {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function clearMessages() {
    const { messagesContainer } = getDOM();
    if (!messagesContainer) return;
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to #${currentChannel}!</h2>
            <p>Start chatting in this channel.</p>
        </div>
    `;
}

function sendMessage() {
    const { messageInput } = getDOM();
    if (!currentUser || cooldownActive || !messageInput) return;

    const messageText = messageInput.value.trim();
    const isImageChannel = currentChannel === 'images';

    if (!messageText && !isImageChannel) return;

    if (containsBannedWords(messageText)) {
        alert('Your message contains inappropriate language');
        return;
    }

    const now = Date.now();
    if (now - lastMessageTime < 2500) {
        showCooldownNotice();
        return;
    }

    lastMessageTime = now;
    startCooldown();

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

            // Save DM if this is a DM channel
            if (currentChannel.startsWith('dm_')) {
                const dmId = currentChannel.replace('dm_', '');
                const otherUserId = dmId.split('_').find(id => id !== currentUser.uid);
                if (otherUserId) {
                    db.collection('users').doc(otherUserId).get().then(userDoc => {
                        if (userDoc.exists) {
                            const username = userDoc.data().username;
                            if (!userConversations[dmId]) {
                                saveConversation(dmId, username);
                            }
                        }
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            alert('Error sending message: ' + error.message);
        });
}

function startNewDM() {
    const { dmUserInput } = getDOM();
    const username = dmUserInput.value.trim();

    if (!username) {
        alert('Please enter a username');
        return;
    }

    // Find user by username
    db.collection('users')
        .where('username', '==', username)
        .limit(1)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                alert('User not found');
                return;
            }

            const userDoc = snapshot.docs[0];
            const targetUserId = userDoc.id;

            if (targetUserId === currentUser.uid) {
                alert('You cannot message yourself');
                return;
            }

            // Create a unique DM channel ID (sorted to ensure consistency)
            const dmId = [currentUser.uid, targetUserId].sort().join('_');

            // Save this conversation (persisted to Firestore, triggers cross-device sync)
            saveConversation(dmId, username);

            // Switch to this DM channel
            currentChannel = `dm_${dmId}`;
            updateActiveChannel();
            loadMessages();
            addDMToList(dmId, username, true);

            dmUserInput.value = '';
        })
        .catch(error => {
            console.error('Error finding user:', error);
            alert('Error finding user: ' + error.message);
        });
}

// Add DM to the list (with option to make it active)
function addDMToList(dmId, username, makeActive) {
    const { dmList } = getDOM();
    if (!dmList) return;

    // Check if this DM already exists in the list
    const existingDm = dmList.querySelector(`[data-dm-id="${dmId}"]`);
    if (existingDm) {
        if (makeActive) {
            existingDm.classList.add('active');
        }
        return;
    }

    const dmItem = document.createElement('li');
    dmItem.className = 'dm-channel' + (makeActive ? ' active' : '');
    dmItem.dataset.dmId = dmId;
    dmItem.dataset.channel = `dm_${dmId}`;
    dmItem.textContent = `@${username}`;

    dmItem.addEventListener('click', () => {
        currentChannel = `dm_${dmId}`;
        updateActiveChannel();
        loadMessages();
    });

    dmList.appendChild(dmItem);
}

function containsBannedWords(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word.toLowerCase()));
}

function isValidImageUrl(url) {
    if (!url) return false;
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());
}

function showCooldownNotice() {
    const { messageForm } = getDOM();
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
            if (notice.parentNode) notice.parentNode.removeChild(notice);
        }, 300);
    }, 2000);
}

function startCooldown() {
    const { messageForm } = getDOM();
    cooldownActive = true;
    if (messageForm) messageForm.querySelector('button').disabled = true;
    setTimeout(() => {
        cooldownActive = false;
        if (currentUser && messageForm) {
            messageForm.querySelector('button').disabled = false;
        }
    }, 2500);
}

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

function banUser() {
    if (!currentUser || !adminUsers.includes(currentUser.email)) return;
    const { messagesContainer } = getDOM();

    const messages = Array.from(messagesContainer.querySelectorAll('.message:not(.current-user)'));
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

function trackUserActivity() {
    if (!currentUser) return;
    const userStatusDatabaseRef = rtdb.ref('/status/' + currentUser.uid);

    rtdb.ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() === false) {
            return;
        }
        userStatusDatabaseRef.onDisconnect().set({
            state: 'offline',
            lastChanged: firebase.database.ServerValue.TIMESTAMP,
        });
        userStatusDatabaseRef.set({
            state: 'online',
            lastChanged: firebase.database.ServerValue.TIMESTAMP,
        });
    });
    loadActiveUsers();
}

function loadActiveUsers() {
    const { activeUsersList } = getDOM();
    if (!activeUsersList) return;

    rtdb.ref('/status')
        .orderByChild('state').equalTo('online')
        .on('value', snapshot => {
            activeUsersList.innerHTML = '';
            snapshot.forEach(childSnap => {
                const userId = childSnap.key;
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

function loadChannels() {
    updateActiveChannel();
}

function scrollToBottom() {
    const { messagesContainer } = getDOM();
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
