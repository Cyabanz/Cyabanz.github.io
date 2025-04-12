// Initialize Firebase
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
const favoritesContainer = document.getElementById('favoritesContainer');
const signInPrompt = document.querySelector('.sign-in-prompt');
const signInButton = document.getElementById('signInButton');
const clearPinsBtn = document.querySelector('.clear-pins');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');

// Helper function to get banner icon
function getBannerIcon(type) {
    const icons = {
        hot: 'bx bx-hot',
        new: 'bx bx-star',
        popular: 'bx bx-trending-up'
    };
    return icons[type] || 'bx bx-info-circle';
}

// Find game by ID across all categories
function findGameById(id) {
    id = parseInt(id); // Ensure we're comparing numbers
    for (const row of gamesData) {
        const game = row.games.find(g => g.id === id);
        if (game) return game;
    }
    return null;
}

// Create favorite game card
function createFavoriteGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container">
                ${game.banner ? `<div class="ribbon ${game.banner} ${game.banner === 'hot' ? 'pulse' : ''}">
                    <i class='bx ${getBannerIcon(game.banner)}'></i>
                    ${game.banner.toUpperCase()}
                </div>` : ''}
                <img src="${game.staticImg}" class="game-thumbnail" alt="${game.title}">
            </div>
            <div class="game-title">${game.title}</div>
        </a>
        <button class="remove-favorite-btn">
            <i class="bx bx-trash"></i>
        </button>
    `;
    
    card.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
        e.preventDefault();
        removeFavorite(game.id);
    });
    
    return card;
}

// Remove favorite
function removeFavorite(gameId) {
    const userId = auth.currentUser.uid;
    db.collection('users').doc(userId).collection('favorites').doc(String(gameId)).delete()
        .then(() => {
            loadUserFavorites(userId);
        })
        .catch((error) => {
            console.error('Error removing favorite:', error);
        });
}

// Clear all favorites
function clearAllFavorites() {
    const userId = auth.currentUser.uid;
    const batch = db.batch();
    
    db.collection('users').doc(userId).collection('favorites').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
        })
        .catch(error => {
            console.error('Error clearing favorites:', error);
        });
}

// Load user favorites
function loadUserFavorites(userId) {
    db.collection('users').doc(userId).collection('favorites').get()
        .then((querySnapshot) => {
            favoritesContainer.innerHTML = '';
            
            if (querySnapshot.empty) {
                favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const gameId = doc.data().gameId;
                const game = findGameById(gameId);
                if (game) {
                    const gameCard = createFavoriteGameCard(game);
                    favoritesContainer.appendChild(gameCard);
                }
            });
        })
        .catch((error) => {
            console.error('Error loading favorites:', error);
        });
}

// Update UI for logged in user
function updateUIForUser(user) {
    signInPrompt.style.display = 'none';
    usernameDisplay.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        profilePic.src = user.photoURL;
    }
    
    // Load favorites for this user
    loadUserFavorites(user.uid);
}

// Update UI for guest
function updateUIForGuest() {
    signInPrompt.style.display = 'block';
    usernameDisplay.textContent = 'Guest';
    profilePic.src = 'https://via.placeholder.com/40';
    favoritesContainer.innerHTML = '';
}

// Sign in handler
function handleSignIn() {
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
}

// Create user document
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

// Initialize when auth is ready
auth.onAuthStateChanged(function(user) {
    if (user) {
        updateUIForUser(user);
        
        // Add event listener to clear favorites button
        clearPinsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Are you sure you want to clear all favorites?')) {
                clearAllFavorites();
            }
        });
    } else {
        updateUIForGuest();
    }
});

// Add sign in button event listener
signInButton?.addEventListener('click', handleSignIn);
