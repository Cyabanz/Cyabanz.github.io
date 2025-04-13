// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
const gameId = "game1"; // Unique identifier for your game
let likes = 0;
let dislikes = 0;
let userRating = null;

// Initialize the UI based on auth state
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        usernameDisplay.textContent = user.displayName || "User";
        profilePic.src = user.photoURL || "https://via.placeholder.com/40";
        loginView.classList.add('hidden');
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        
        // Load user's previous rating and game ratings
        loadUserRating(user.uid);
    } else {
        // User is signed out
        usernameDisplay.textContent = "Guest";
        profilePic.src = "https://via.placeholder.com/40";
        loginView.classList.remove('hidden');
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
    }
    
    // Always load the game ratings (visible to everyone)
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
likeBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        if (userRating === 'like') {
            // Remove like
            await removeRating(user.uid);
            likes--;
            userRating = null;
            likeBtn.classList.remove('active');
        } else {
            // Add like (and remove dislike if exists)
            if (userRating === 'dislike') {
                dislikes--;
                dislikeCountEl.textContent = dislikes;
                dislikeBtn.classList.remove('active');
            }
            await setRating(user.uid, 'like');
            likes++;
            userRating = 'like';
            likeBtn.classList.add('active');
        }
        
        likeCountEl.textContent = likes;
        await updateGameRatings();
    } catch (error) {
        console.error("Error updating like:", error);
    }
});

dislikeBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        if (userRating === 'dislike') {
            // Remove dislike
            await removeRating(user.uid);
            dislikes--;
            userRating = null;
            dislikeBtn.classList.remove('active');
        } else {
            // Add dislike (and remove like if exists)
            if (userRating === 'like') {
                likes--;
                likeCountEl.textContent = likes;
                likeBtn.classList.remove('active');
            }
            await setRating(user.uid, 'dislike');
            dislikes++;
            userRating = 'dislike';
            dislikeBtn.classList.add('active');
        }
        
        dislikeCountEl.textContent = dislikes;
        await updateGameRatings();
    } catch (error) {
        console.error("Error updating dislike:", error);
    }
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
async function setRating(userId, rating) {
    const batch = db.batch();
    
    // Set user's rating
    const userRatingRef = db.collection('gameRatings').doc(gameId)
                          .collection('userRatings').doc(userId);
    batch.set(userRatingRef, {
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    await batch.commit();
}

async function removeRating(userId) {
    await db.collection('gameRatings').doc(gameId)
           .collection('userRatings').doc(userId).delete();
}

async function updateGameRatings() {
    // Count all likes/dislikes
    const likesSnapshot = await db.collection('gameRatings').doc(gameId)
                                .collection('userRatings')
                                .where('rating', '==', 'like').get();
    
    const dislikesSnapshot = await db.collection('gameRatings').doc(gameId)
                                   .collection('userRatings')
                                   .where('rating', '==', 'dislike').get();
    
    // Update main document with counts
    await db.collection('gameRatings').doc(gameId).set({
        like: likesSnapshot.size,
        dislike: dislikesSnapshot.size,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
}

async function loadUserRating(userId) {
    const doc = await db.collection('gameRatings').doc(gameId)
                      .collection('userRatings').doc(userId).get();
    
    if (doc.exists) {
        userRating = doc.data().rating;
        if (userRating === 'like') {
            likeBtn.classList.add('active');
        } else if (userRating === 'dislike') {
            dislikeBtn.classList.add('active');
        }
    }
}

async function loadGameRatings() {
    const doc = await db.collection('gameRatings').doc(gameId).get();
    
    if (doc.exists) {
        likes = doc.data().like || 0;
        dislikes = doc.data().dislike || 0;
        likeCountEl.textContent = likes;
        dislikeCountEl.textContent = dislikes;
    } else {
        // Initialize if doesn't exist
        await db.collection('gameRatings').doc(gameId).set({
            like: 0,
            dislike: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}
