// Initialize Firebase (same config as your other files)
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

// DOM Elements
const publicProfileView = document.getElementById('public-profile-view');
const editProfileView = document.getElementById('edit-profile-view');
const backToDashboard = document.getElementById('back-to-dashboard');
const publicProfilePic = document.getElementById('public-profile-pic');
const publicUsername = document.getElementById('public-username');
const gamesPlayedStat = document.getElementById('games-played-stat');
const memberSinceStat = document.getElementById('member-since-stat');
const playStreakStat = document.getElementById('play-streak-stat');
const publicFavoritesContainer = document.getElementById('public-favorites-container');
const publicActivityContainer = document.getElementById('public-activity-container');
const copyProfileLinkBtn = document.getElementById('copy-profile-link');
const profileUsernameInput = document.getElementById('profile-username');
const profilePicPreview = document.getElementById('profile-pic-preview');
const profilePicUpload = document.getElementById('profile-pic-upload');
const uploadProfilePicBtn = document.getElementById('upload-profile-pic');
const profileVisibilitySelect = document.getElementById('profile-visibility');
const saveProfileBtn = document.getElementById('save-profile');
const cancelEditBtn = document.getElementById('cancel-edit');

// Global variables
let currentUser = null;
let profileUserId = null;
let isViewingOwnProfile = false;
let profileData = null;

// Initialize the page
function init() {
    // Get user ID from URL if viewing someone else's profile
    const urlParams = new URLSearchParams(window.location.search);
    profileUserId = urlParams.get('id');
    
    auth.onAuthStateChanged(user => {
        currentUser = user;
        
        if (profileUserId) {
            // Viewing someone else's profile
            isViewingOwnProfile = user && user.uid === profileUserId;
            loadPublicProfile(profileUserId);
        } else if (user) {
            // Viewing own profile
            isViewingOwnProfile = true;
            profileUserId = user.uid;
            loadPublicProfile(user.uid);
            showEditOptions();
        } else {
            // Not logged in and no profile specified - redirect to login
            window.location.href = 'index.html';
        }
    });
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Copy profile link
    copyProfileLinkBtn.addEventListener('click', copyProfileLink);
    
    // Edit profile buttons
    uploadProfilePicBtn.addEventListener('click', uploadProfilePicture);
    saveProfileBtn.addEventListener('click', saveProfile);
    cancelEditBtn.addEventListener('click', cancelEdit);
}

function loadPublicProfile(userId) {
    // Load user data
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                profileData = doc.data();
                displayProfileData();
                
                // Load favorites
                loadUserFavorites(userId);
                
                // Load activity
                loadUserActivity(userId);
                
                // Load stats
                loadUserStats(userId);
            } else {
                alert('Profile not found');
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            alert('Error loading profile');
        });
}

function displayProfileData() {
    // Set profile picture
    if (profileData.photoBase64) {
        publicProfilePic.src = profileData.photoBase64;
        if (isViewingOwnProfile) {
            profilePicPreview.src = profileData.photoBase64;
        }
    }
    
    // Set username
    publicUsername.textContent = profileData.username || 'User';
    if (isViewingOwnProfile) {
        profileUsernameInput.value = profileData.username || '';
    }
    
    // Set profile visibility
    if (isViewingOwnProfile) {
        profileVisibilitySelect.value = profileData.profileVisibility || 'public';
    }
}

function loadUserFavorites(userId) {
    db.collection('users').doc(userId).collection('favorites')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                publicFavoritesContainer.innerHTML = '<p class="no-favorites">No favorite games yet</p>';
                return;
            }
            
            publicFavoritesContainer.innerHTML = '';
            querySnapshot.forEach(doc => {
                const gameId = doc.data().gameId;
                const game = findGameById(gameId);
                if (game) {
                    const gameCard = createFavoriteGameCard(game);
                    publicFavoritesContainer.appendChild(gameCard);
                }
            });
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
            publicFavoritesContainer.innerHTML = '<p class="no-favorites">Error loading favorites</p>';
        });
}

function loadUserActivity(userId) {
    db.collection('users').doc(userId).collection('history')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                publicActivityContainer.innerHTML = '<p class="no-activity">No recent activity</p>';
                return;
            }
            
            publicActivityContainer.innerHTML = '';
            querySnapshot.forEach(doc => {
                const activity = doc.data();
                const game = findGameById(activity.gameId);
                if (game) {
                    const activityItem = createActivityItem(game, activity.timestamp);
                    publicActivityContainer.appendChild(activityItem);
                }
            });
        })
        .catch(error => {
            console.error('Error loading activity:', error);
            publicActivityContainer.innerHTML = '<p class="no-activity">Error loading activity</p>';
        });
}

function loadUserStats(userId) {
    // Get total games played
    db.collection('users').doc(userId).collection('stats')
        .get()
        .then(querySnapshot => {
            let totalGamesPlayed = 0;
            querySnapshot.forEach(doc => {
                totalGamesPlayed += doc.data().playCount || 0;
            });
            gamesPlayedStat.textContent = totalGamesPlayed;
        });
    
    // Get member since date
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const createdAt = doc.data().createdAt?.toDate() || new Date();
                const daysSince = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24));
                memberSinceStat.textContent = `${daysSince} days`;
            }
        });
    
    // Get play streak (this would need to be implemented in your tracking system)
    playStreakStat.textContent = '0'; // Placeholder - implement your streak logic
}

function createFavoriteGameCard(game) {
    const card = document.createElement('div');
    card.className = 'favorite-game-card';
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <img src="${game.staticImg}" alt="${game.title}">
            <h3>${game.title}</h3>
        </a>
    `;
    
    return card;
}

function createActivityItem(game, timestamp) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const date = timestamp.toDate();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    item.innerHTML = `
        <div class="activity-icon">
            <i class='bx bx-play'></i>
        </div>
        <div class="activity-details">
            <div class="activity-game">Played ${game.title}</div>
            <div class="activity-time">${timeStr}</div>
        </div>
    `;
    
    return item;
}

function copyProfileLink() {
    const profileUrl = `${window.location.origin}/profile.html?id=${profileUserId}`;
    navigator.clipboard.writeText(profileUrl)
        .then(() => {
            alert('Profile link copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy link');
        });
}

function showEditOptions() {
    publicProfileView.style.display = 'none';
    editProfileView.style.display = 'block';
    backToDashboard.style.display = 'block';
}

function uploadProfilePicture() {
    const file = profilePicUpload.files[0];
    if (!file) {
        alert('Please select an image first');
        return;
    }
    
    if (file.size > 500 * 1024) {
        alert('Image must be smaller than 500KB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        profilePicPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function saveProfile() {
    const newUsername = profileUsernameInput.value.trim();
    if (newUsername.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }
    
    const updates = {
        username: newUsername,
        profileVisibility: profileVisibilitySelect.value
    };
    
    // If a new picture was uploaded
    if (profilePicUpload.files[0]) {
        updates.photoBase64 = profilePicPreview.src;
    }
    
    db.collection('users').doc(profileUserId).update(updates)
        .then(() => {
            alert('Profile updated successfully!');
            location.reload(); // Refresh to show changes
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        });
}

function cancelEdit() {
    publicProfileView.style.display = 'block';
    editProfileView.style.display = 'none';
    backToDashboard.style.display = 'none';
}

// Helper function to find game by ID (from your existing games data)
function findGameById(id) {
    // This should match your existing games data structure
    for (const category of gamesData) {
        const game = category.games.find(g => g.id === id);
        if (game) return game;
    }
    return null;
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', init);
