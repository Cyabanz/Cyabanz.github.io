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

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
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

    // Auth state listener
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            updateUIForUser(user);
            loadUserData(user.uid);
        } else {
            // User is signed out
            updateUIForGuest();
        }
    });

    // Google Sign-In
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

    // Sign Out
    signOutButton.addEventListener('click', function() {
        auth.signOut()
            .catch(function(error) {
                console.error('Sign out error:', error);
            });
    });

    // Update Username
    updateUsernameBtn.addEventListener('click', function() {
        const newUsername = newUsernameInput.value.trim();
        if (newUsername.length < 3) {
            alert('Username must be at least 3 characters');
            return;
        }

        const userId = auth.currentUser.uid;
        db.collection('users').doc(userId).update({
            username: newUsername
        })
        .then(function() {
            usernameDisplay.textContent = newUsername;
            dashboardUsername.textContent = newUsername;
            newUsernameInput.value = '';
            alert('Username updated!');
        })
        .catch(function(error) {
            console.error('Error updating username:', error);
            alert('Update failed: ' + error.message);
        });
    });

    // Profile Picture Preview
    profilePicUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
            alert('Image must be smaller than 500KB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            profilePicPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Update Profile Picture
    updateProfilePicBtn.addEventListener('click', function() {
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
                photoBase64: base64Image
            })
            .then(function() {
                profilePic.src = base64Image;
                profilePicPreview.src = base64Image;
                profilePicUpload.value = '';
                alert('Profile picture updated!');
            })
            .catch(function(error) {
                console.error('Error saving image:', error);
                alert('Upload failed: ' + error.message);
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
        profilePicPreview.src = 'https://via.placeholder.com/150';
    }

    function createUserDocument(user) {
        return db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            username: user.displayName || 'user' + user.uid.substring(0, 4),
            photoBase64: user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(function(error) {
            console.error('Error creating user document:', error);
        });
    }

    function loadUserData(userId) {
        db.collection('users').doc(userId).get()
            .then(function(doc) {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    if (userData.username) {
                        usernameDisplay.textContent = userData.username;
                        dashboardUsername.textContent = userData.username;
                    }
                    
                    if (userData.photoBase64) {
                        profilePic.src = userData.photoBase64;
                        profilePicPreview.src = userData.photoBase64;
                    }
                }
            })
            .catch(function(error) {
                console.error('Error loading user data:', error);
            });
    }
});

// ======================
// Favorites System
// ======================

// Get user's favorites
async function getFavorites(userId) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().favorites?.games || [] : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
}

// Add to favorites
async function addFavorite(userId, gameId) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    "favorites.games": arrayUnion(gameId),
    "favorites.lastUpdated": serverTimestamp()
  });
}

// Remove from favorites
async function removeFavorite(userId, gameId) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    "favorites.games": arrayRemove(gameId),
    "favorites.lastUpdated": serverTimestamp()
  });
}

// Toggle favorite status
async function toggleFavorite(gameId) {
  if (!auth.currentUser) return showLoginPrompt();
  
  const userId = auth.currentUser.uid;
  const favorites = await getFavorites(userId);
  
  if (favorites.includes(gameId)) {
    await removeFavorite(userId, gameId);
  } else {
    await addFavorite(userId, gameId);
  }
}

// Setup real-time listener
function setupFavoritesListener(userId) {
  const userRef = doc(db, "users", userId);
  
  onSnapshot(userRef, (doc) => {
    const favorites = doc.data()?.favorites?.games || [];
    updateFavoritesUI(favorites);
  });
}
