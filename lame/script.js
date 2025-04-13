// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADCVIINCBgvTBvClWqWI5o3SlVS47IJnw",
    authDomain: "fusioncya-cc20a.firebaseapp.com",
    projectId: "fusioncya-cc20a",
    storageBucket: "fusioncya-cc20a.appspot.com",
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
const gameId = "game1"; // Unique identifier for your game
let likes = 0;
let dislikes = 0;
let userRating = null;
let isProcessing = false;

// Initialize the UI based on auth state
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        usernameDisplay.textContent = user.displayName || "User";
        profilePic.src = user.photoURL || "https://via.placeholder.com/40";
        loginView.classList.add('hidden');
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        
        // Load user's previous rating and game ratings
        await Promise.all([
            loadUserRating(user.uid),
            loadGameRatings()
        ]);
    } else {
        // User is signed out
        usernameDisplay.textContent = "Guest";
        profilePic.src = "https://via.placeholder.com/40";
        loginView.classList.remove('hidden');
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
        await loadGameRatings(); // Still load counts for display
    }
    updateButtonStyles();
});

// Sign in handler
signInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error("Sign in error:", error);
    });
});

// Like functionality
likeBtn.addEventListener('click', async () => {
    if (isProcessing || !auth.currentUser) return;
    isProcessing = true;
    
    try {
        const batch = db.batch();
        const userRatingRef = db.collection('gameRatings').doc(gameId)
                              .collection('userRatings').doc(auth.currentUser.uid);
        const gameRef = db.collection('gameRatings').doc(gameId);
        
        if (userRating === 'like') {
            // Remove like
            batch.delete(userRatingRef);
            batch.update(gameRef, {
                like: firebase.firestore.FieldValue.increment(-1),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            userRating = null;
            likes--;
        } else {
            // Add like (and remove dislike if exists)
            if (userRating === 'dislike') {
                batch.update(gameRef, {
                    dislike: firebase.firestore.FieldValue.increment(-1)
                });
                dislikes--;
            }
            
            batch.set(userRatingRef, {
                rating: 'like',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            batch.update(gameRef, {
                like: firebase.firestore.FieldValue.increment(1),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            userRating = 'like';
            likes++;
        }
        
        await batch.commit();
        updateUI();
    } catch (error) {
        console.error("Error updating like:", error);
        if (error.code === 'permission-denied') {
            alert("Please sign in to rate this game");
        }
    } finally {
        isProcessing = false;
    }
});

// Dislike functionality
dislikeBtn.addEventListener('click', async () => {
    if (isProcessing || !auth.currentUser) return;
    isProcessing = true;
    
    try {
        const batch = db.batch();
        const userRatingRef = db.collection('gameRatings').doc(gameId)
                              .collection('userRatings').doc(auth.currentUser.uid);
        const gameRef = db.collection('gameRatings').doc(gameId);
        
        if (userRating === 'dislike') {
            // Remove dislike
            batch.delete(userRatingRef);
            batch.update(gameRef, {
                dislike: firebase.firestore.FieldValue.increment(-1),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            userRating = null;
            dislikes--;
        } else {
            // Add dislike (and remove like if exists)
            if (userRating === 'like') {
                batch.update(gameRef, {
                    like: firebase.firestore.FieldValue.increment(-1)
                });
                likes--;
            }
            
            batch.set(userRatingRef, {
                rating: 'dislike',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            batch.update(gameRef, {
                dislike: firebase.firestore.FieldValue.increment(1),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            userRating = 'dislike';
            dislikes++;
        }
        
        await batch.commit();
        updateUI();
    } catch (error) {
        console.error("Error updating dislike:", error);
        if (error.code === 'permission-denied') {
            alert("Please sign in to rate this game");
        }
    } finally {
        isProcessing = false;
    }
});

// Helper functions
async function loadUserRating(userId) {
    try {
        const doc = await db.collection('gameRatings').doc(gameId)
                          .collection('userRatings').doc(userId).get();
        
        if (doc.exists) {
            userRating = doc.data().rating;
        }
    } catch (error) {
        console.error("Error loading user rating:", error);
    }
}

async function loadGameRatings() {
    try {
        const doc = await db.collection('gameRatings').doc(gameId).get();
        
        if (doc.exists) {
            likes = doc.data().like || 0;
            dislikes = doc.data().dislike || 0;
        } else {
            // Initialize if doesn't exist
            await db.collection('gameRatings').doc(gameId).set({
                like: 0,
                dislike: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        updateUI();
    } catch (error) {
        console.error("Error loading game ratings:", error);
    }
}

function updateUI() {
    // Ensure counts never go negative
    likes = Math.max(0, likes);
    dislikes = Math.max(0, dislikes);
    
    // Update display
    likeCountEl.textContent = likes;
    dislikeCountEl.textContent = dislikes;
    
    // Update button states
    updateButtonStyles();
}

function updateButtonStyles() {
    // Clear all active states first
    likeBtn.classList.remove('active', 'glow');
    dislikeBtn.classList.remove('active', 'glow');
    
    // Set active state for current rating
    if (userRating === 'like') {
        likeBtn.classList.add('active', 'glow');
    } else if (userRating === 'dislike') {
        dislikeBtn.classList.add('active', 'glow');
    }
}

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
