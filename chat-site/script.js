// Firebase configuration
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
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

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
const messageCooldown = 2500; // 2.5 seconds cooldown
let isModerator = false;
const bannedWords = ['badword1', 'badword2', 'offensive', 'hate']; // Add more as needed
let activeUsers = {};
let messageListener = null;
let usersListener = null;

// Initialize the app
function init() {
  setupEventListeners();
  setupAuthStateListener();
  addStyles();
}

// Set up event listeners
function setupEventListeners() {
  // Channel selection
  channels.forEach(channel => {
    channel.addEventListener('click', () => {
      channels.forEach(c => c.classList.remove('active'));
      channel.classList.add('active');
      currentChannel = channel.getAttribute('data-channel');
      loadMessages();
    });
  });

  // Message submission
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendMessage();
  });

  // Google login
  googleLoginBtn.addEventListener('click', () => {
    auth.signInWithPopup(provider).catch(error => {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    });
  });

  // Profile saving
  saveProfileBtn.addEventListener('click', saveProfile);

  // Close modal
  closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  // Clear chat (moderator only)
  clearChatBtn.addEventListener('click', clearChannelMessages);

  // Ban user (moderator only)
  banUserBtn.addEventListener('click', banUser);

  // Window click handler for modal
  window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });
}

// Handle authentication state changes
function setupAuthStateListener() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        currentUser = user;
        
        // Check if user is banned
        const banDoc = await db.collection('bannedUsers').doc(user.uid).get();
        if (banDoc.exists) {
          alert('Your account is banned from this chat');
          await auth.signOut();
          return;
        }
        
        // Check user profile
        await checkUserProfile();
        loadMessages();
        loadActiveUsers();
      } catch (error) {
        console.error("Auth state error:", error);
        showLoginUI();
      }
    } else {
      // User signed out
      currentUser = null;
      isModerator = false;
      showLoginUI();
      clearMessages();
    }
  });
}

// Check user profile and setup
async function checkUserProfile() {
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    
    if (!userDoc.exists) {
      // New user - show profile setup
      showProfileModal();
    } else {
      // Existing user
      const userData = userDoc.data();
      currentUser.username = userData.username;
      currentUser.profilePic = userData.profilePic;
      currentUser.isModerator = userData.isModerator || false;
      isModerator = currentUser.isModerator;
      
      updateUserUI();
      
      // Show moderation panel if moderator
      if (isModerator) {
        moderationPanel.style.display = 'block';
      }
      
      // Update last active time
      updateLastActive();
    }
  } catch (error) {
    console.error("Error checking profile:", error);
    showProfileModal();
  }
}

// Save user profile
async function saveProfile() {
  const username = usernameInput.value.trim();
  const profilePic = profilePicInput.value.trim();

  if (!username) {
    alert("Please enter a username");
    return;
  }

  try {
    await db.collection('users').doc(currentUser.uid).set({
      uid: currentUser.uid,
      email: currentUser.email,
      username: username,
      profilePic: profilePic || currentUser.photoURL,
      isModerator: false, // Default to false, can be changed in Firestore
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Update local user object
    currentUser.username = username;
    currentUser.profilePic = profilePic || currentUser.photoURL;
    
    profileModal.style.display = 'none';
    updateUserUI();
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Error saving profile: " + error.message);
  }
}

// Update user UI
function updateUserUI() {
  userInfoDiv.innerHTML = `
    <div class="user-profile">
      <img src="${currentUser.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" 
           alt="Profile" class="user-avatar">
      <span class="user-name">${currentUser.username || currentUser.email}</span>
      ${isModerator ? '<span class="admin-badge">Mod</span>' : ''}
    </div>
    <button id="logout-btn">Logout</button>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut();
  });

  // Enable message input
  messageInput.disabled = false;
  messageForm.querySelector('button').disabled = false;
}

// Show login UI
function showLoginUI() {
  userInfoDiv.innerHTML = `
    <div class="login-prompt">
      <button id="google-login">Login with Google</button>
    </div>
  `;
  document.getElementById('google-login').addEventListener('click', () => {
    auth.signInWithPopup(provider);
  });

  // Disable message input
  messageInput.disabled = true;
  messageForm.querySelector('button').disabled = true;
  
  // Hide moderation panel
  moderationPanel.style.display = 'none';
  
  // Clean up listeners
  if (messageListener) {
    messageListener();
    messageListener = null;
  }
  if (usersListener) {
    usersListener();
    usersListener = null;
  }
}

// Show profile modal
function showProfileModal() {
  usernameInput.value = currentUser.displayName || '';
  profilePicInput.value = currentUser.photoURL || '';
  profileModal.style.display = 'block';
}

// Load messages for current channel
function loadMessages() {
  // Clear previous listener
  if (messageListener) {
    messageListener();
  }

  // Clear messages container
  messagesContainer.innerHTML = '<div class="loading">Loading messages...</div>';

  // Set up new listener
  messageListener = db.collection('messages')
    .where('channel', '==', currentChannel)
    .orderBy('timestamp', 'asc')
    .onSnapshot(
      (snapshot) => {
        messagesContainer.innerHTML = ''; // Clear loading message
        
        if (snapshot.empty) {
          messagesContainer.innerHTML = `
            <div class="empty-state">
              No messages yet in #${currentChannel}.
              Be the first to send one!
            </div>
          `;
          return;
        }
        
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            displayMessage(change.doc.data());
          }
        });
        
        // Scroll to bottom
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
      },
      (error) => {
        console.error("Error loading messages:", error);
        showMessageError(error);
      }
    );
}

// Display a message
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  
  // Highlight current user's messages
  if (currentUser && message.userId === currentUser.uid) {
    messageElement.classList.add('current-user');
  }
  
  // Format timestamp
  const timestamp = message.timestamp?.toDate() || new Date();
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageElement.innerHTML = `
    <img src="${message.userProfilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" 
         alt="Avatar" class="message-avatar">
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
  if (isModerator || (currentUser && message.userId === currentUser.uid)) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-message';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = 'Delete message';
    deleteBtn.addEventListener('click', () => deleteMessage(message));
    messageElement.querySelector('.message-content').appendChild(deleteBtn);
  }

  messagesContainer.appendChild(messageElement);
}

// Delete a message
async function deleteMessage(message) {
  if (!confirm('Delete this message?')) return;
  
  try {
    // Note: In production, you should store message IDs to delete them properly
    // This is a simplified version that would require proper message ID tracking
    alert('In a full implementation, this would delete the message. For now, please delete manually in Firestore.');
  } catch (error) {
    console.error("Error deleting message:", error);
    alert("Error deleting message: " + error.message);
  }
}

// Clear all messages in current channel (moderator only)
async function clearChannelMessages() {
  if (!isModerator) {
    alert('You are not authorized to perform this action');
    return;
  }
  
  if (!confirm(`Are you sure you want to clear all messages in #${currentChannel}?`)) return;
  
  try {
    const querySnapshot = await db.collection('messages')
      .where('channel', '==', currentChannel)
      .get();
    
    const batch = db.batch();
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    messagesContainer.innerHTML = '<div class="info">Chat cleared successfully</div>';
  } catch (error) {
    console.error("Error clearing chat:", error);
    alert("Error clearing chat: " + error.message);
  }
}

// Ban a user (moderator only)
async function banUser() {
  if (!isModerator) {
    alert('You are not authorized to perform this action');
    return;
  }
  
  // Show list of active users
  let userList = "Active Users:\n";
  Object.keys(activeUsers).forEach(uid => {
    userList += `${uid}: ${activeUsers[uid].username || activeUsers[uid].email}\n`;
  });
  
  const selectedUid = prompt(`${userList}\nEnter the UID of the user to ban:`);
  if (!selectedUid) return;
  
  try {
    const userDoc = await db.collection('users').doc(selectedUid).get();
    if (!userDoc.exists) {
      alert('User not found');
      return;
    }
    
    const userData = userDoc.data();
    
    await db.collection('bannedUsers').doc(selectedUid).set({
      uid: selectedUid,
      username: userData.username,
      email: userData.email,
      bannedAt: firebase.firestore.FieldValue.serverTimestamp(),
      bannedBy: currentUser.uid,
      bannedByName: currentUser.username || currentUser.email
    });
    
    alert(`User ${userData.username || userData.email} banned successfully`);
  } catch (error) {
    console.error("Error banning user:", error);
    alert("Error banning user: " + error.message);
  }
}

// Load active users
function loadActiveUsers() {
  // Users active in the last 5 minutes
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
  
  // Clear previous listener
  if (usersListener) {
    usersListener();
  }
  
  activeUsersList.innerHTML = '<div class="loading">Loading users...</div>';
  activeUsers = {};
  
  usersListener = db.collection('users')
    .where('lastActive', '>', fiveMinutesAgo)
    .onSnapshot(
      (snapshot) => {
        activeUsersList.innerHTML = '';
        activeUsers = {};
        
        snapshot.forEach(doc => {
          const user = doc.data();
          activeUsers[user.uid] = user;
          
          const userItem = document.createElement('li');
          userItem.className = 'active-user';
          userItem.dataset.uid = user.uid;
          
          userItem.innerHTML = `
            <img src="${user.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" 
                 alt="Avatar" class="active-users-avatar">
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
      },
      (error) => {
        console.error("Error loading active users:", error);
        activeUsersList.innerHTML = '<div class="error">Error loading users</div>';
      }
    );
}

// Update last active time
async function updateLastActive() {
  try {
    await db.collection('users').doc(currentUser.uid).update({
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating last active:", error);
  }
}

// Send a new message
async function sendMessage() {
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  // Check cooldown
  const now = Date.now();
  if (now - lastMessageTime < messageCooldown) {
    alert(`Please wait ${(messageCooldown - (now - lastMessageTime)) / 1000} seconds before sending another message`);
    return;
  }

  try {
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
    
    // Clear input and update last message time
    messageInput.value = '';
    lastMessageTime = now;
    
    // Update last active time
    updateLastActive();
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Error sending message: " + error.message);
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

// Clear all messages
function clearMessages() {
  messagesContainer.innerHTML = `
    <div class="welcome-message">
      <h2>Welcome to the Chat App</h2>
      <p>Please login to view and send messages.</p>
    </div>
  `;
}

// Show message error
function showMessageError(error) {
  messagesContainer.innerHTML = `
    <div class="error">
      ${error.code === 'permission-denied' 
        ? 'You need to login to view messages' 
        : 'Failed to load messages. Please refresh.'}
      <button onclick="loadMessages()">Retry</button>
    </div>
  `;
}

// Add dynamic styles
function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Message styles */
    .message {
      display: flex;
      padding: 10px 15px;
      margin-bottom: 5px;
      border-radius: 5px;
      background-color: #36393f;
      position: relative;
    }
    
    .message.current-user {
      background-color: #2f3136;
    }
    
    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
      object-fit: cover;
    }
    
    .message-content {
      flex: 1;
    }
    
    .message-header {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .message-username {
      font-weight: 600;
      margin-right: 10px;
      color: #fff;
    }
    
    .message-time {
      font-size: 0.75rem;
      color: #72767d;
      margin-left: auto;
    }
    
    .message-text {
      color: #dcddde;
      line-height: 1.4;
    }
    
    .message-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 5px;
      margin-top: 5px;
    }
    
    .delete-message {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
      position: absolute;
      right: 15px;
      top: 15px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .message:hover .delete-message {
      opacity: 1;
    }
    
    .delete-message:hover {
      color: #f04747;
    }
    
    /* Loading and error states */
    .loading, .error, .welcome-message, .empty-state, .info {
      padding: 40px 20px;
      text-align: center;
      color: #72767d;
    }
    
    .error {
      color: #f04747;
    }
    
    .error button, .info {
      background: #7289da;
      color: white;
      border: none;
      padding: 8px 16px;
      margin-top: 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .error button:hover {
      background: #677bc4;
    }
    
    /* User profile */
    .user-profile {
      display: flex;
      align-items: center;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      object-fit: cover;
    }
    
    .user-name {
      font-weight: 500;
    }
    
    /* Admin badge */
    .admin-badge {
      display: inline-block;
      background-color: #f04747;
      color: white;
      font-size: 0.7rem;
      padding: 2px 5px;
      border-radius: 3px;
      margin-left: 5px;
      text-transform: uppercase;
    }
    
    /* Active users list */
    .active-user {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #3e4147;
    }
    
    .active-users-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
      object-fit: cover;
    }
    
    /* Login/logout buttons */
    #google-login, #logout-btn {
      background-color: #7289da;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 3px;
      cursor: pointer;
      font-weight: 500;
      margin-top: 10px;
      width: 100%;
    }
    
    #google-login:hover, #logout-btn:hover {
      background-color: #677bc4;
    }
    
    /* Moderation panel */
    .moderation-panel {
      padding: 15px;
      background: #2f3136;
      border-left: 1px solid #202225;
    }
    
    .moderation-panel h3 {
      margin-bottom: 15px;
      color: #fff;
    }
    
    .mod-tools button {
      display: block;
      width: 100%;
      padding: 8px;
      margin-bottom: 8px;
      background-color: #36393f;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .mod-tools button:hover {
      background-color: #3a3d42;
    }
    
    #ban-user {
      background-color: #f04747;
    }
    
    #ban-user:hover {
      background-color: #d84040;
    }
    
    .active-users h4 {
      margin: 15px 0 10px;
      color: #b9bbbe;
      font-size: 0.9rem;
    }
  `;
  document.head.appendChild(style);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
