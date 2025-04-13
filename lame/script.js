// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADCVIINCBgvTBvClWqWI5o3SlVS47IJnw",
    authDomain: "fusioncya-cc20a.firebaseapp.com",
    projectId: "fusioncya-cc20a",
    storageBucket: "fusioncya-cc20a.firebasestorage.app",
    messagingSenderId: "765164293111",
    appId: "1:765164293111:web:43e051c755c4690c0c3cf2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCountEl = document.getElementById('likeCount');
const dislikeCountEl = document.getElementById('dislikeCount');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameFrame = document.getElementById('gameFrame');
const signInButton = document.getElementById('signInButton');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const loginView = document.getElementById('login-view');

// Game rating data
let gameId = "game1"; // Unique identifier for your game
let likes = 0;
let dislikes = 0;
let userRating = null; // 'like' or 'dislike'

// Initialize the UI based on auth state
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        usernameDisplay.textContent = user.displayName || "User";
        profilePic.src = user.photoURL || "https://via.placeholder.com/40";
        loginView.classList.add('hidden');
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        
        // Load user's previous rating
        loadUserRating(user.uid);
    } else {
        // User is signed out
        usernameDisplay.textContent = "Guest";
        profilePic.src = "https://via.placeholder.com/40";
        loginView.classList.remove('hidden');
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
    }
    
    // Always load the game ratings
    loadGameRatings();
});

// Sign in handler
signInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error("Sign in error:", error);
    });
});

// Like/Dislike functionality
likeBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) return;
    
    if (userRating === 'like') {
        // Remove like
        removeRating(user.uid);
        userRating = null;
        likes--;
        likeBtn.classList.remove('active');
    } else {
        // Add like (and remove dislike if exists)
        if (userRating === 'dislike') {
            dislikes--;
            dislikeCountEl.textContent = dislikes;
            dislikeBtn.classList.remove('active');
        }
        setRating(user.uid, 'like');
        userRating = 'like';
        likes++;
        likeBtn.classList.add('active');
    }
    
    likeCountEl.textContent = likes;
});

dislikeBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) return;
    
    if (userRating === 'dislike') {
        // Remove dislike
        removeRating(user.uid);
        userRating = null;
        dislikes--;
        dislikeBtn.classList.remove('active');
    } else {
        // Add dislike (and remove like if exists)
        if (userRating === 'like') {
            likes--;
            likeCountEl.textContent = likes;
            likeBtn.classList.remove('active');
        }
        setRating(user.uid, 'dislike');
        userRating = 'dislike';
        dislikes++;
        dislikeBtn.classList.add('active');
    }
    
    dislikeCountEl.textContent = dislikes;
});

// Fullscreen functionality
fullscreenBtn.addEventListener('click', () => {
    if (gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
    } else if (gameFrame.webkitRequestFullscreen) {
        gameFrame.webkitRequestFullscreen();
    } else if (gameFrame.msRequestFullscreen) {
        gameFrame.msRequestFullscreen();
    }
});

// Firestore functions
function setRating(userId, rating) {
    db.collection('gameRatings').doc(gameId).collection('userRatings').doc(userId).set({
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Update the game's total ratings
    const updateData = {};
    updateData[rating] = firebase.firestore.FieldValue.increment(1);
    if (userRating && userRating !== rating) {
        updateData[userRating] = firebase.firestore.FieldValue.increment(-1);
    }
    
    db.collection('gameRatings').doc(gameId).set(updateData, { merge: true });
}

function removeRating(userId) {
    db.collection('gameRatings').doc(gameId).collection('userRatings').doc(userId).delete();
    
    // Update the game's total ratings
    const updateData = {};
    updateData[userRating] = firebase.firestore.FieldValue.increment(-1);
    
    db.collection('gameRatings').doc(gameId).set(updateData, { merge: true });
}

function loadUserRating(userId) {
    db.collection('gameRatings').doc(gameId).collection('userRatings').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                userRating = doc.data().rating;
                if (userRating === 'like') {
                    likeBtn.classList.add('active');
                } else if (userRating === 'dislike') {
                    dislikeBtn.classList.add('active');
                }
            }
        });
}

function loadGameRatings() {
    db.collection('gameRatings').doc(gameId).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                likes = data.like || 0;
                dislikes = data.dislike || 0;
                likeCountEl.textContent = likes;
                dislikeCountEl.textContent = dislikes;
            }
        });
}