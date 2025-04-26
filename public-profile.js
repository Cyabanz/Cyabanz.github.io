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

// DOM Elements
const profilePicture = document.getElementById('profilePicture');
const profileName = document.getElementById('profileName');
const profileBio = document.getElementById('profileBio');
const joinDate = document.getElementById('joinDate');
const memberDuration = document.getElementById('memberDuration');
const totalGamesPlayed = document.getElementById('totalGamesPlayed');
const favoriteGamesCount = document.getElementById('favoriteGamesCount');
const lastActive = document.getElementById('lastActive');
const favoritesContainer = document.getElementById('favoritesContainer');
const recentlyPlayedContainer = document.getElementById('recentlyPlayedContainer');

// Game data (same as in your script.js)
const gamesData = [
    // ... (copy the entire gamesData array from your script.js file here)
    // This should include all 60 games with their categories, images, etc.
];

// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Format date
function formatDate(date) {
    if (!date) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toDate().toLocaleDateString(undefined, options);
}

// Calculate time since
function timeSince(date) {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const then = date.toDate();
    const seconds = Math.floor((now - then) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s");
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s");
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s");
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s");
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s");
    
    return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s");
}

// Format last active
function formatLastActive(date) {
    if (!date) return 'Unknown';
    return timeSince(date) + ' ago';
}

// Find game by ID
function findGameById(id) {
    for (const category of gamesData) {
        const game = category.games.find(g => g.id === id);
        if (game) return game;
    }
    return null;
}

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container" style="position: relative;">
                ${game.banner ? `<div class="ribbon ${game.banner}">${game.banner.toUpperCase()}</div>` : ''}
                <img src="${game.staticImg}" class="game-thumbnail" alt="${game.title}">
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-meta">
                    <span>${game.category.charAt(0).toUpperCase() + game.category.slice(1)}</span>
                </div>
            </div>
        </a>
    `;
    
    return card;
}

// Load user profile data
function loadProfileData(userId) {
    // Load user document
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error('User not found');
            }
            
            const userData = doc.data();
            
            // Set profile info
            profileName.textContent = userData.username || 'Anonymous';
            profileBio.textContent = userData.bio || 'This user hasn\'t added a bio yet.';
            
            if (userData.photoBase64) {
                profilePicture.src = userData.photoBase64;
            }
            
            // Set join date and member duration
            if (userData.createdAt) {
                joinDate.textContent = formatDate(userData.createdAt);
                memberDuration.textContent = timeSince(userData.createdAt);
            }
            
            // Set last active
            if (userData.lastActive) {
                lastActive.textContent = formatLastActive(userData.lastActive);
            }
            
            // Load favorites
            loadFavorites(userId);
            
            // Load recently played
            loadRecentlyPlayed(userId);
            
            // Load game stats
            loadGameStats(userId);
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            profileName.textContent = 'User not found';
            profileBio.textContent = 'The profile you\'re looking for doesn\'t exist or may have been removed.';
            
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-error-circle'></i>
                    <p>Could not load profile data</p>
                </div>
            `;
            
            recentlyPlayedContainer.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-error-circle'></i>
                    <p>Could not load profile data</p>
                </div>
            `;
        });
}

// Load favorite games
function loadFavorites(userId) {
    db.collection('users').doc(userId).collection('favorites').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                favoritesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class='bx bx-bookmark-alt'></i>
                        <p>No favorite games yet</p>
                    </div>
                `;
                favoriteGamesCount.textContent = '0';
                return;
            }
            
            const favorites = [];
            querySnapshot.forEach(doc => {
                favorites.push(doc.data().gameId);
            });
            
            favoriteGamesCount.textContent = favorites.length;
            
            // Clear loading state
            favoritesContainer.innerHTML = '';
            
            // Add favorite games
            favorites.forEach(gameId => {
                const game = findGameById(gameId);
                if (game) {
                    const card = createGameCard(game);
                    favoritesContainer.appendChild(card);
                }
            });
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-error-circle'></i>
                    <p>Error loading favorite games</p>
                </div>
            `;
        });
}

// Load recently played games
function loadRecentlyPlayed(userId) {
    db.collection('users').doc(userId).collection('history')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                recentlyPlayedContainer.innerHTML = `
                    <div class="empty-state">
                        <i class='bx bx-time'></i>
                        <p>No recently played games</p>
                    </div>
                `;
                return;
            }
            
            // Clear loading state
            recentlyPlayedContainer.innerHTML = '';
            
            // Add recently played games
            querySnapshot.forEach(doc => {
                const gameId = doc.data().gameId;
                const game = findGameById(gameId);
                if (game) {
                    const card = createGameCard(game);
                    recentlyPlayedContainer.appendChild(card);
                }
            });
            
            // Update total games played
            totalGamesPlayed.textContent = querySnapshot.size;
        })
        .catch(error => {
            console.error('Error loading recently played:', error);
            recentlyPlayedContainer.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-error-circle'></i>
                    <p>Error loading recently played games</p>
                </div>
            `;
        });
}

// Load game stats
function loadGameStats(userId) {
    db.collection('users').doc(userId).collection('stats').get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                let totalPlays = 0;
                querySnapshot.forEach(doc => {
                    totalPlays += doc.data().playCount || 0;
                });
                totalGamesPlayed.textContent = totalPlays;
            }
        })
        .catch(error => {
            console.error('Error loading game stats:', error);
        });
}

// Initialize the page
if (userId) {
    loadProfileData(userId);
} else {
    profileName.textContent = 'Invalid Profile Link';
    profileBio.textContent = 'This profile link is missing the required user ID.';
    
    favoritesContainer.innerHTML = `
        <div class="empty-state">
            <i class='bx bx-link-alt'></i>
            <p>Invalid profile link</p>
        </div>
    `;
    
    recentlyPlayedContainer.innerHTML = `
        <div class="empty-state">
            <i class='bx bx-link-alt'></i>
            <p>Invalid profile link</p>
        </div>
    `;
}
