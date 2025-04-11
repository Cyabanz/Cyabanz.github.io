// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM elements
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

// Auth state listener
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log('User signed in:', user);
        updateUIForUser(user);
        loadUserData(user.uid);
    } else {
        // User is signed out
        console.log('User signed out');
        updateUIForGuest();
    }
});

// Sign in with Google
signInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            // Check if this is a new user
            if (result.additionalUserInfo.isNewUser) {
                // Create user document in Firestore
                createUserDocument(result.user);
            }
        })
        .catch((error) => {
            console.error('Sign in error:', error);
        });
});

// Sign out
signOutButton.addEventListener('click', () => {
    auth.signOut();
});

// Update username
updateUsernameBtn.addEventListener('click', () => {
    const newUsername = newUsernameInput.value.trim();
    if (newUsername) {
        auth.currentUser.getIdToken(true).then(() => {
            const userId = auth.currentUser.uid;
            db.collection('users').doc(userId).update({
                username: newUsername
            }).then(() => {
                alert('Username updated successfully!');
                usernameDisplay.textContent = newUsername;
                dashboardUsername.textContent = newUsername;
                newUsernameInput.value = '';
            }).catch(error => {
                console.error('Error updating username:', error);
            });
        });
    } else {
        alert('Please enter a valid username');
    }
});

// Update profile picture
updateProfilePicBtn.addEventListener('click', () => {
    const file = profilePicUpload.files[0];
    if (file) {
        const userId = auth.currentUser.uid;
        const storageRef = storage.ref(`profile_pictures/${userId}`);
        const uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progress monitoring can be added here
            }, 
            (error) => {
                console.error('Upload error:', error);
            }, 
            () => {
                // Upload completed successfully
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Update user document with new photo URL
                    db.collection('users').doc(userId).update({
                        photoURL: downloadURL
                    }).then(() => {
                        // Update profile picture display
                        profilePic.src = downloadURL;
                        alert('Profile picture updated successfully!');
                    }).catch(error => {
                        console.error('Error updating profile picture URL:', error);
                    });
                });
            }
        );
    } else {
        alert('Please select a file to upload');
    }
});

// Helper functions
function updateUIForUser(user) {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    signOutButton.style.display = 'block';
    
    // Set default display name and photo
    usernameDisplay.textContent = user.displayName || 'User';
    dashboardUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        profilePic.src = user.photoURL;
    }
}

function updateUIForGuest() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    signOutButton.style.display = 'none';
    usernameDisplay.textContent = 'Guest';
    profilePic.src = 'https://via.placeholder.com/40';
}

function createUserDocument(user) {
    const userRef = db.collection('users').doc(user.uid);
    
    const userData = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || `user${user.uid.substring(0, 4)}`,
        photoURL: user.photoURL || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    return userRef.set(userData)
        .then(() => {
            console.log('User document created');
        })
        .catch(error => {
            console.error('Error creating user document:', error);
        });
}

function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                // Update UI with stored username if available
                if (userData.username) {
                    usernameDisplay.textContent = userData.username;
                    dashboardUsername.textContent = userData.username;
                }
                // Use stored photo URL if available (overrides Google photo)
                if (userData.photoURL) {
                    profilePic.src = userData.photoURL;
                }
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
        });
}