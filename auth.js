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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// Global auth state handler
function handleAuthStateChange(user) {
  const signInButton = document.getElementById('signInButton');
  const signOutButton = document.getElementById('signOutButton');
  const usernameDisplay = document.getElementById('username-display');
  const profilePic = document.getElementById('profile-pic');
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const dashboardUsername = document.getElementById('dashboard-username');

  if (user) {
    // User is signed in
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (usernameDisplay) usernameDisplay.textContent = user.displayName || 'User';
    if (dashboardUsername) dashboardUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL && profilePic) {
      profilePic.src = user.photoURL;
    }

    // Load additional user data
    loadUserData(user.uid);
  } else {
    // User is signed out
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    if (usernameDisplay) usernameDisplay.textContent = 'Guest';
    if (profilePic) profilePic.src = 'https://via.placeholder.com/40';
  }
}

// Load user data from Firestore
function loadUserData(userId) {
  const newUsernameInput = document.getElementById('new-username');
  const profilePicPreview = document.getElementById('profile-pic-preview');
  const userBioTextarea = document.getElementById('user-bio');
  const bioCharCount = document.getElementById('bio-char-count');

  db.collection('users').doc(userId).get()
    .then(function(doc) {
      if (doc.exists) {
        const userData = doc.data();
        
        // Update username displays
        const usernameDisplay = document.getElementById('username-display');
        const dashboardUsername = document.getElementById('dashboard-username');
        if (userData.username && usernameDisplay) {
          usernameDisplay.textContent = userData.username;
        }
        if (userData.username && dashboardUsername) {
          dashboardUsername.textContent = userData.username;
        }
        
        // Update profile picture
        if (userData.photoBase64) {
          const profilePic = document.getElementById('profile-pic');
          if (profilePic) profilePic.src = userData.photoBase64;
          if (profilePicPreview) profilePicPreview.src = userData.photoBase64;
        }
        
        // Update bio
        if (userData.bio && userBioTextarea) {
          userBioTextarea.value = userData.bio;
          if (bioCharCount) bioCharCount.textContent = userData.bio.length;
        }
      }
    })
    .catch(function(error) {
      console.error('Error loading user data:', error);
    });
}

// Create user document in Firestore
function createUserDocument(user) {
  return db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    username: user.displayName || 'user' + user.uid.substring(0, 4),
    photoBase64: user.photoURL || '',
    bio: '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  })
  .catch(function(error) {
    console.error('Error creating user document:', error);
  });
}

// Initialize authentication system
function initAuth() {
  // Set up auth state listener
  auth.onAuthStateChanged(handleAuthStateChange);

  // Google Sign-In
  const signInButton = document.getElementById('signInButton');
  if (signInButton) {
    signInButton.addEventListener('click', function() {
      auth.signInWithPopup(provider)
        .then(function(result) {
          if (result.additionalUserInfo.isNewUser) {
            return createUserDocument(result.user);
          }
        })
        .catch(function(error) {
          console.error('Sign in error:', error);
          alert('Sign in failed: ' + error.message);
        });
    });
  }

  // Sign Out
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', function() {
      auth.signOut()
        .catch(function(error) {
          console.error('Sign out error:', error);
        });
    });
  }

  // Update Username
  const updateUsernameBtn = document.getElementById('update-username-btn');
  if (updateUsernameBtn) {
    updateUsernameBtn.addEventListener('click', function() {
      const newUsernameInput = document.getElementById('new-username');
      const newUsername = newUsernameInput.value.trim();
      if (newUsername.length < 3) {
        alert('Username must be at least 3 characters');
        return;
      }

      const userId = auth.currentUser.uid;
      db.collection('users').doc(userId).update({
        username: newUsername,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function() {
        const usernameDisplay = document.getElementById('username-display');
        const dashboardUsername = document.getElementById('dashboard-username');
        if (usernameDisplay) usernameDisplay.textContent = newUsername;
        if (dashboardUsername) dashboardUsername.textContent = newUsername;
        if (newUsernameInput) newUsernameInput.value = '';
        alert('Username updated!');
      })
      .catch(function(error) {
        console.error('Error updating username:', error);
        alert('Update failed: ' + error.message);
      });
    });
  }

  // Profile Picture Upload
  const profilePicUpload = document.getElementById('profile-pic-upload');
  if (profilePicUpload) {
    profilePicUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 500 * 1024) {
        alert('Image must be smaller than 500KB');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
        const profilePicPreview = document.getElementById('profile-pic-preview');
        if (profilePicPreview) profilePicPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Update Profile Picture
  const updateProfilePicBtn = document.getElementById('update-profile-pic-btn');
  if (updateProfilePicBtn) {
    updateProfilePicBtn.addEventListener('click', function() {
      const profilePicUpload = document.getElementById('profile-pic-upload');
      const file = profilePicUpload.files[0];
      if (!file) {
        alert('Please select an image first');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Image = event.target.result;
        const userId = auth.currentUser.uid;
        
        db.collection('users').doc(userId).update({
          photoBase64: base64Image,
          lastActive: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function() {
          const profilePic = document.getElementById('profile-pic');
          const profilePicPreview = document.getElementById('profile-pic-preview');
          if (profilePic) profilePic.src = base64Image;
          if (profilePicPreview) profilePicPreview.src = base64Image;
          if (profilePicUpload) profilePicUpload.value = '';
          alert('Profile picture updated!');
        })
        .catch(function(error) {
          console.error('Error saving image:', error);
          alert('Upload failed: ' + error.message);
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Bio character counter
  const userBioTextarea = document.getElementById('user-bio');
  if (userBioTextarea) {
    userBioTextarea.addEventListener('input', function() {
      const bioCharCount = document.getElementById('bio-char-count');
      if (bioCharCount) bioCharCount.textContent = this.value.length;
    });
  }

  // Update Bio
  const updateBioBtn = document.getElementById('update-bio-btn');
  if (updateBioBtn) {
    updateBioBtn.addEventListener('click', function() {
      const userBioTextarea = document.getElementById('user-bio');
      const newBio = userBioTextarea.value.trim();
      
      if (newBio.length > 200) {
        alert('Bio must be 200 characters or less');
        return;
      }
      
      const userId = auth.currentUser.uid;
      db.collection('users').doc(userId).update({
        bio: newBio,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function() {
        alert('Bio updated successfully!');
      })
      .catch(function(error) {
        console.error('Error updating bio:', error);
        alert('Update failed: ' + error.message);
      });
    });
  }

  // Profile Sharing System
  setupProfileSharing();
}

// Profile Sharing Function
function setupProfileSharing() {
  const profileLink = document.getElementById('public-profile-link');
  const copyBtn = document.getElementById('copy-profile-link');
  
  if (!profileLink || !copyBtn) return;
  
  auth.onAuthStateChanged(user => {
    if (user) {
      profileLink.value = `${window.location.origin}/profile.html?id=${user.uid}`;
    }
  });
  
  copyBtn.addEventListener('click', () => {
    profileLink.select();
    document.execCommand('copy');
    alert('Profile link copied to clipboard!');
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
