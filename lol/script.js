// Recent Games Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase (config should be in auth.js)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // DOM Elements
    const recentGamesContainer = document.getElementById('recentGamesContainer');
    const clearRecentBtn = document.getElementById('clearRecentBtn');
    const signInButton = document.getElementById('signInButton');
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const profilePic = document.getElementById('profile-pic');
    const usernameDisplay = document.getElementById('username-display');
    const currentYear = document.getElementById('current-year');
    
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Initialize the page
    function initRecentPage() {
        setupEventListeners();
        
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                currentUser = user;
                updateUIForUser(user);
                loadRecentGames(user.uid);
            } else {
                // User is signed out
                currentUser = null;
                updateUIForGuest();
                showNoRecentGames(true);
            }
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Clear recent games
        clearRecentBtn.addEventListener('click', clearRecentGamesHandler);
        
        // Sign in button
        if (signInButton) {
            signInButton.addEventListener('click', signInWithGoogle);
        }
    }
    
    // Handle clear recent games
    async function clearRecentGamesHandler() {
        if (!currentUser) {
            alert('Please sign in to manage your recent games');
            return;
        }
        
        if (confirm('Are you sure you want to clear all your recent games?')) {
            try {
                await clearAllRecentGames(currentUser.uid);
                showNoRecentGames(false);
                showToast('Recent games cleared successfully');
            } catch (error) {
                console.error('Error clearing recent games:', error);
                showToast('Failed to clear recent games', true);
            }
        }
    }
    
    // Clear all recent games from Firestore
    async function clearAllRecentGames(userId) {
        const batch = db.batch();
        const snapshot = await db.collection('users').doc(userId)
            .collection('recentGames')
            .get();
        
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
    }
    
    // Sign in with Google
    function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        auth.signInWithPopup(provider)
            .catch(error => {
                console.error('Sign in error:', error);
                showToast('Sign in failed: ' + error.message, true);
            });
    }
    
    // Update UI for signed in user
    function updateUIForUser(user) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'flex';
        usernameDisplay.textContent = user.displayName || 'User';
        profilePic.src = user.photoURL || 'https://via.placeholder.com/40';
        
        // Load user profile data if available
        loadUserProfile(user.uid);
    }
    
    // Update UI for guest
    function updateUIForGuest() {
        loginView.style.display = 'block';
        dashboardView.style.display = 'none';
        usernameDisplay.textContent = 'Guest';
        profilePic.src = 'https://via.placeholder.com/40';
    }
    
    // Load user profile data from Firestore
    function loadUserProfile(userId) {
        db.collection('users').doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.username) {
                        usernameDisplay.textContent = userData.username;
                    }
                    if (userData.photoBase64) {
                        profilePic.src = userData.photoBase64;
                    }
                }
            })
            .catch(error => {
                console.error('Error loading user profile:', error);
            });
    }
    
    // Load recent games from Firestore
    async function loadRecentGames(userId) {
        try {
            const snapshot = await db.collection('users').doc(userId)
                .collection('recentGames')
                .orderBy('timestamp', 'desc')
                .limit(20)
                .get();
            
            if (snapshot.empty) {
                showNoRecentGames(false);
                return;
            }
            
            const recentGames = [];
            snapshot.forEach(doc => {
                recentGames.push({
                    id: doc.data().gameId,
                    timestamp: doc.data().timestamp.toDate()
                });
            });
            
            renderRecentGames(recentGames);
        } catch (error) {
            console.error('Error loading recent games:', error);
            showNoRecentGames(false);
        }
    }
    
    // Render recent games to the page
    function renderRecentGames(recentGames) {
        recentGamesContainer.innerHTML = '';
        
        const gamesGrid = document.createElement('div');
        gamesGrid.className = 'recent-games-grid';
        
        // Get unique games (latest play only)
        const uniqueGames = [];
        const seenIds = new Set();
        
        recentGames.forEach(game => {
            if (!seenIds.has(game.id)) {
                seenIds.add(game.id);
                uniqueGames.push(game);
            }
        });
        
        // Render each game
        uniqueGames.forEach(game => {
            const gameData = findGameById(game.id);
            if (gameData) {
                const gameCard = createRecentGameCard(gameData, game.timestamp);
                gamesGrid.appendChild(gameCard);
            }
        });
        
        if (gamesGrid.children.length === 0) {
            showNoRecentGames(false);
        } else {
            recentGamesContainer.appendChild(gamesGrid);
        }
    }
    
    // Create a recent game card element
    function createRecentGameCard(game, timestamp) {
        const card = document.createElement('div');
        card.className = 'recent-game-card';
        
        const timeAgo = formatTimeAgo(timestamp);
        
        card.innerHTML = `
            <a href="${game.url}" class="game-link">
                <div class="recent-badge">Recent</div>
                <img src="${game.staticImg}" alt="${game.title}" class="recent-game-thumbnail">
                <div class="recent-game-info">
                    <h3 class="recent-game-title">${game.title}</h3>
                    <div class="recent-game-time">
                        <i class='bx bx-time'></i> ${timeAgo}
                    </div>
                </div>
            </a>
        `;
        
        return card;
    }
    
    // Format timestamp as "X time ago"
    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval + " " + unit + (interval === 1 ? "" : "s") + " ago";
            }
        }
        
        return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s") + " ago";
    }
    
    // Show "no recent games" message
    function showNoRecentGames(showSignInMessage) {
        recentGamesContainer.innerHTML = `
            <div class="no-recent-games">
                <i class='bx bx-time'></i>
                <p>No recently played games found</p>
                ${showSignInMessage ? '<p class="sign-in-message">Sign in to track your recently played games</p>' : ''}
            </div>
        `;
    }
    
    // Show toast notification
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : 'success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Initialize the page
    initRecentPage();
});

// This should be implemented in your games data file
function findGameById(id) {
    // This should reference your actual games data array
    // For example: return gamesData.find(game => game.id === id);
    console.warn('Implement findGameById() with your actual games data');
    return {
        id: id,
        title: "Game " + id,
        staticImg: "https://via.placeholder.com/300x200?text=Game+" + id,
        url: "#game-" + id
    };
}