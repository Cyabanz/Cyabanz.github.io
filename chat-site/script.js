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
const profileModal = document.getElementById('profile-modal');
const usernameInput = document.getElementById('username');
const profilePicInput = document.getElementById('profile-pic');
const saveProfileBtn = document.getElementById('save-profile');
const closeModal = document.querySelector('.close-modal');

// App State
let currentChannel = 'general';
let currentUser = null;
let lastMessageTime = 0;
const messageCooldown = 2500;
let messageListener = null;

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
      // User is signed in
      currentUser = user;
      await setupUserProfile();
      loadMessages();
    } else {
      // User is signed out
      currentUser = null;
      showLoginUI();
      clearMessages();
    }
  });
}

// Set up user profile
async function setupUserProfile() {
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    
    if (!userDoc.exists) {
      // New user - show profile setup
      showProfileModal();
    } else {
      // Existing user - update UI
      updateUserUI(userDoc.data());
    }
  } catch (error) {
    console.error("Error checking user profile:", error);
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
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    profileModal.style.display = 'none';
    updateUserUI({
      username: username,
      profilePic: profilePic || currentUser.photoURL
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Error saving profile: " + error.message);
  }
}

// Update user UI
function updateUserUI(userData) {
  userInfoDiv.innerHTML = `
    <div class="user-profile">
      <img src="${userData.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}" 
           alt="Profile" class="user-avatar">
      <span class="user-name">${userData.username || currentUser.email}</span>
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
  
  // Clean up message listener
  if (messageListener) {
    messageListener();
    messageListener = null;
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
        
        snapshot.forEach((doc) => {
          displayMessage(doc.data());
        });
        
        // Scroll to bottom
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
      },
      (error) => {
        console.error("Error loading messages:", error);
        messagesContainer.innerHTML = `
          <div class="error">
            ${error.code === 'permission-denied' 
              ? 'Please login to view messages' 
              : 'Failed to load messages. Please refresh.'}
          </div>
        `;
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
        <span class="message-time">${timeString}</span>
      </div>
      <div class="message-text">${message.text}</div>
    </div>
  `;

  messagesContainer.appendChild(messageElement);
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
    // Create message object
    const message = {
      text: messageText,
      channel: currentChannel,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      username: currentUser.displayName || currentUser.email,
      userProfilePic: currentUser.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Add to Firestore
    await db.collection('messages').add(message);

    // Clear input and update last message time
    messageInput.value = '';
    lastMessageTime = now;

    // Update last active time
    await db.collection('users').doc(currentUser.uid).update({
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });

  } catch (error) {
    console.error("Error sending message:", error);
    alert("Error sending message: " + error.message);
  }
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
    
    /* Loading and error states */
    .loading, .error, .welcome-message, .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: #72767d;
    }
    
    .error {
      color: #f04747;
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
    }
    
    #google-login:hover, #logout-btn:hover {
      background-color: #677bc4;
    }
    
    /* Modal styles */
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
    }
    
    .modal-content {
      background-color: #36393f;
      margin: 15% auto;
      padding: 20px;
      border-radius: 5px;
      width: 400px;
      max-width: 90%;
    }
    
    .close-modal {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    
    .close-modal:hover {
      color: #fff;
    }
    
    .profile-form {
      margin-top: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-size: 0.9rem;
      color: #b9bbbe;
    }
    
    .form-group input {
      width: 100%;
      padding: 8px 10px;
      border-radius: 3px;
      border: 1px solid #202225;
      background-color: #202225;
      color: #dcddde;
    }
    
    #save-profile {
      background-color: #7289da;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 3px;
      cursor: pointer;
      font-weight: 500;
      width: 100%;
    }
    
    #save-profile:hover {
      background-color: #677bc4;
    }
  `;
  document.head.appendChild(style);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
