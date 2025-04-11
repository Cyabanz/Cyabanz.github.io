// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "", // Leave empty - we're not using Storage
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const dashboardUsername = document.getElementById('dashboard-username');
const updateUsernameBtn = document.getElementById('update-username-btn');
const newUsernameInput = document.getElementById('new-username');
const profilePicUpload = document.getElementById('profile-pic-upload');
const updateProfilePicBtn = document.getElementById('update-profile-pic-btn');
const profilePicPreview = document.getElementById('profile-pic-preview');

// Auth State Listener
auth.onAuthStateChanged(user => {
    if (user) {
        // User signed in
        updateUIForUser(user);
        loadUserData(user.uid);
    } else {
        // User signed out
        updateUIForGuest();
    }
});

// Google Sign-In
signInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
                createUserDocument(result.user);
            }
        })
        .catch((error) => {
            console.error('Sign in error:', error);
            alert('Sign in failed. Please try again.');
        });
});

// Sign Out
signOutButton.addEventListener('click', () => {
    auth.signOut();
});

// Update Username
updateUsernameBtn.addEventListener('click', () => {
    const newUsername = newUsernameInput.value.trim();
    if (newUsername.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }

    const userId = auth.currentUser.uid;
    db.collection('users').doc(userId).update({
        username: newUsername
    }).then(() => {
        usernameDisplay.textContent = newUsername;
        dashboardUsername.textContent = newUsername;
        newUsernameInput.value = '';
        alert('Username updated!');
    }).catch(error => {
        console.error('Error updating username:', error);
    });
});

// Profile Picture Upload
profilePicUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (500KB max)
    if (file.size > 500 * 1024) {
        alert('Image must be smaller than 500KB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        profilePicPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

updateProfilePicBtn.addEventListener('click', () => {
    const file = profilePicUpload.files[0];
    if (!file) {
        alert('Please select an image first');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Image = event.target.result;
        const userId = auth.currentUser.uid;

        db.collection('users').doc(userId).update({
            photoBase64: base64Image
        }).then(() => {
            profilePic.src = base64Image;
            profilePicPreview.src = base64Image;
            profilePicUpload.value = '';
            alert('Profile picture updated!');
        }).catch(error => {
            console.error('Error saving image:', error);
        });
    };
    reader.readAsDataURL(file);
});

// Helper Functions
function updateUIForUser(user) {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    usernameDisplay.textContent = user.displayName || 'User';
    dashboardUsername.textContent = user.displayName || 'User';
    
    // Use Google photo by default
    if (user.photoURL) {
        profilePic.src = user.photoURL;
        profilePicPreview.src = user.photoURL;
    }
}

function updateUIForGuest() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    usernameDisplay.textContent = 'Guest';
    profilePic.src = 'https://via.placeholder.com/40';
}

function createUserDocument(user) {
    const userData = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || `user${user.uid.substring(0, 4)}`,
        photoBase64: user.photoURL || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    return db.collection('users').doc(user.uid).set(userData);
}

function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                
                // Update username
                if (userData.username) {
                    usernameDisplay.textContent = userData.username;
                    dashboardUsername.textContent = userData.username;
                }
                
                // Update profile picture (prioritize Base64 over Google photo)
                if (userData.photoBase64) {
                    profilePic.src = userData.photoBase64;
                    profilePicPreview.src = userData.photoBase64;
                }
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
        });
}