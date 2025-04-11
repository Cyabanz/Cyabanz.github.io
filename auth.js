// Firebase v9+ modular imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { 
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyADCVIINCBgvTBvClWqWI5o3SlVS47IJnw",
  authDomain: "fusioncya-cc20a.firebaseapp.com",
  databaseURL: "https://fusioncya-cc20a-default-rtdb.firebaseio.com",
  projectId: "fusioncya-cc20a",
  storageBucket: "fusioncya-cc20a.firebasestorage.app",
  messagingSenderId: "765164293111",
  appId: "1:765164293111:web:43e051c755c4690c0c3cf2",
  measurementId: "G-4DT52P7MPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

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
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUIForUser(user);
        loadUserData(user.uid);
    } else {
        updateUIForGuest();
    }
});

// Google Sign-In
signInButton.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        if (result._tokenResponse.isNewUser) {
            await createUserDocument(result.user);
        }
    } catch (error) {
        console.error('Sign in error:', error);
        alert('Sign in failed: ' + error.message);
    }
});

// Sign Out
signOutButton.addEventListener('click', () => {
    signOut(auth).catch(error => {
        console.error('Sign out error:', error);
    });
});

// Update Username
updateUsernameBtn.addEventListener('click', async () => {
    const newUsername = newUsernameInput.value.trim();
    if (newUsername.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }

    try {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            username: newUsername
        });
        
        usernameDisplay.textContent = newUsername;
        dashboardUsername.textContent = newUsername;
        newUsernameInput.value = '';
        alert('Username updated!');
    } catch (error) {
        console.error('Error updating username:', error);
        alert('Update failed: ' + error.message);
    }
});

// Profile Picture Upload
profilePicUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

updateProfilePicBtn.addEventListener('click', async () => {
    const file = profilePicUpload.files[0];
    if (!file) {
        alert('Please select an image first');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Image = event.target.result;
            const userId = auth.currentUser.uid;
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                photoBase64: base64Image
            });
            
            profilePic.src = base64Image;
            profilePicPreview.src = base64Image;
            profilePicUpload.value = '';
            alert('Profile picture updated!');
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error saving image:', error);
        alert('Upload failed: ' + error.message);
    }
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

async function createUserDocument(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            username: user.displayName || `user${user.uid.substring(0, 4)}`,
            photoBase64: user.photoURL || '',
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating user document:', error);
    }
}

async function loadUserData(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            
            if (userData.username) {
                usernameDisplay.textContent = userData.username;
                dashboardUsername.textContent = userData.username;
            }
            
            if (userData.photoBase64) {
                profilePic.src = userData.photoBase64;
                profilePicPreview.src = userData.photoBase64;
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}
