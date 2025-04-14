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

// DOM Elements
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const signInButton = document.getElementById('signInButton');
const promptSignInButton = document.getElementById('promptSignInButton');
const signOutButton = document.getElementById('signOutButton');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const loginPrompt = document.getElementById('loginPrompt');
const recentGamesList = document.getElementById('recentGamesList');
const noRecentGames = document.getElementById('noRecentGames');
const recentGamesGrid = document.getElementById('recent-games-grid');

// State
let currentUser = null;
let recentGames = [];

// Initialize the app
function init() {
    setupEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
}

// Set up event listeners
function setupEventListeners() {
    if (signInButton) {
        signInButton.addEventListener('click', signInWithGoogle);
    }
    
    if (promptSignInButton) {
        promptSignInButton.addEventListener('click', signInWithGoogle);
    }
    
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
}

// Handle authentication state changes
function handleAuthStateChange(user) {
    currentUser = user;
    
    if (user) {
        // User is signed in
        updateUIForUser(user);
        loadRecentGames(user.uid);
    } else {
        // User is signed out
        updateUIForGuest();
    }
}

// Update UI for signed in user
function updateUIForUser(user) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'flex';
    if (loginPrompt) loginPrompt.style.display = 'none';
    if (recentGamesList) recentGamesList.style.display = 'block';
    
    if (usernameDisplay) {
        usernameDisplay.textContent = user.displayName || 'User';
    }
    
    if (profilePic) {
        profilePic.src = user.photoURL || 'https://via.placeholder.com/40';
    }
}

// Update UI for guest
function updateUIForGuest() {
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    if (loginPrompt) loginPrompt.style.display = 'block';
    if (recentGamesList) recentGamesList.style.display = 'none';
    
    if (usernameDisplay) {
        usernameDisplay.textContent = 'Guest';
    }
    
    if (profilePic) {
        profilePic.src = 'https://via.placeholder.com/40';
    }
}

// Sign in with Google
function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
                return createUserDocument(result.user);
            }
        })
        .catch((error) => {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error.message);
        });
}

// Sign out
function signOut() {
    auth.signOut().catch((error) => {
        console.error('Sign out error:', error);
    });
}

// Create user document in Firestore
function createUserDocument(user) {
    return db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        recentGames: []
    });
}

// Load recent games for user
function loadRecentGames(userId) {
    db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                recentGames = userData.recentGames || [];
                renderRecentGames();
            }
        })
        .catch((error) => {
            console.error('Error loading recent games:', error);
        });
}

// Render recent games to the UI
function renderRecentGames() {
    if (!recentGamesGrid) return;
    
    recentGamesGrid.innerHTML = '';
    
    if (recentGames.length === 0) {
        noRecentGames.style.display = 'block';
        return;
    }
    
    noRecentGames.style.display = 'none';
    
    // Sort by timestamp (newest first)
    const sortedGames = [...recentGames].sort((a, b) => b.timestamp - a.timestamp);
    
    // Display only the last 5 games
    const gamesToDisplay = sortedGames.slice(0, 5);
    
    gamesToDisplay.forEach((gameData) => {
        const gameCard = createRecentGameCard(gameData);
        recentGamesGrid.appendChild(gameCard);
    });
}

// Create a card for a recent game
function createRecentGameCard(gameData) {
    const game = findGameById(gameData.gameId);
    if (!game) return null;
    
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;
    
    const timestamp = new Date(gameData.timestamp);
    const timeString = formatTimestamp(timestamp);
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container">
                ${game.banner ? createBannerElement(game.banner) : ''}
                <img src="${game.staticImg}" class="game-thumbnail" alt="${game.title}">
                <div class="recent-timestamp" title="Last played">${timeString}</div>
            </div>
            <div class="game-title">${game.title}</div>
        </a>
    `;
    
    return card;
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    
    return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Find game by ID (mock function - replace with your actual game data)
function findGameById(gameId) {
    // This is a simplified version - you should replace with your actual game data lookup
    const allGames = [];
    
    // Sample game data structure - replace with your actual games data
    const sampleGame = {
        id: gameId,
        title: `Game ${gameId}`,
        staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Game+" + gameId,
        url: `#game-${gameId}`,
        banner: gameId % 3 === 0 ? "hot" : (gameId % 3 === 1 ? "new" : "popular")
    };
    
    return sampleGame;
}

// Create banner element
function createBannerElement(bannerType) {
    return `
        <div class="ribbon ${bannerType} ${bannerType === 'hot' ? 'pulse' : ''}">
            <i class='${getBannerIcon(bannerType)}'></i>
            ${bannerType.toUpperCase()}
        </div>
    `;
}

// Helper function to get banner icon
function getBannerIcon(type) {
    const icons = {
        hot: 'bx bx-hot',
        new: 'bx bx-star',
        popular: 'bx bx-trending-up'
    };
    return icons[type] || 'bx bx-info-circle';
}

// Track game play (call this when a user plays a game)
function trackGamePlay(gameId) {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    const timestamp = Date.now();
    
    // Get current recent games
    db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                let recentGames = userData.recentGames || [];
                
                // Remove if game already exists in recent games
                recentGames = recentGames.filter(g => g.gameId !== gameId);
                
                // Add new game to beginning of array
                recentGames.unshift({
                    gameId: gameId,
                    timestamp: timestamp
                });
                
                // Keep only the last 5 games
                if (recentGames.length > 5) {
                    recentGames = recentGames.slice(0, 5);
                }
                
                // Update in Firestore
                return db.collection('users').doc(userId).update({
                    recentGames: recentGames
                });
            }
        })
        .catch((error) => {
            console.error('Error tracking game play:', error);
        });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);