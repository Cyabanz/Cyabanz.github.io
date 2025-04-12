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

// Complete Game Data - All 60 Games Included
const gamesData = [
    {
        id: "popular",
        title: "Popular Games",
        games: [
            {
                id: 1,
                title: "Bullet Force",
                category: "action",
                staticImg: "https://help.learningmath.infinityfreeapp.com/images/apps/chatgpt.png",
                gifImg: "https://help.learningmath.infinityfreeapp.com/images/apps/chatgpt.png",
                banner: "hot",
                url: "https://example.com"
            },
            {
                id: 2,
                title: "Cut the Rope",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Cut+the+Rope",
                gifImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#cut-the-rope"
            },
            {
                id: 3,
                title: "Basketball Stars",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/2196F3/fff?text=Basketball+Stars",
                gifImg: "https://via.placeholder.com/300x200/03A9F4/fff?text=GIF+Preview",
                banner: "new",
                url: "#basketball-stars"
            },
            {
                id: 4,
                title: "Agar.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Agar.io",
                gifImg: "https://via.placeholder.com/300x200/FFEB3B/fff?text=GIF+Preview",
                banner: "hot",
                url: "#agar-io"
            },
            {
                id: 5,
                title: "Slither.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Slither.io",
                gifImg: "https://via.placeholder.com/300x200/E91E63/fff?text=GIF+Preview",
                url: "#slither-io"
            },
            {
                id: 6,
                title: "Zombie Derby",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Zombie+Derby",
                gifImg: "https://via.placeholder.com/300x200/FF5252/fff?text=GIF+Preview",
                banner: "new",
                url: "#zombie-derby"
            },
            {
                id: 7,
                title: "Sudoku",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Sudoku",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                url: "#sudoku"
            },
            {
                id: 8,
                title: "Soccer Skills",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Skills",
                gifImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#soccer-skills"
            },
            {
                id: 9,
                title: "Tank Wars",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Tank+Wars",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                url: "#tank-wars"
            },
            {
                id: 10,
                title: "2048",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=2048",
                gifImg: "https://via.placeholder.com/300x200/80DEEA/fff?text=GIF+Preview",
                banner: "hot",
                url: "#2048"
            }
        ]
    },
    {
        id: "new",
        title: "New Releases",
        games: [
            {
                id: 11,
                title: "Epic Adventure",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Epic+Adventure",
                gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=GIF+Preview",
                banner: "new",
                url: "#epic-adventure"
            },
            {
                id: 12,
                title: "Brain Teaser",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Brain+Teaser",
                gifImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=GIF+Preview",
                banner: "new",
                url: "#brain-teaser"
            },
            {
                id: 13,
                title: "Soccer Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Pro",
                gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=GIF+Preview",
                banner: "new",
                url: "#soccer-pro"
            },
            {
                id: 14,
                title: "WormZone.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=WormZone.io",
                gifImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=GIF+Preview",
                banner: "new",
                url: "#wormzone-io"
            },
            {
                id: 15,
                title: "Zombie Shooter",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/E91E63/fff?text=Zombie+Shooter",
                gifImg: "https://via.placeholder.com/300x200/EC407A/fff?text=GIF+Preview",
                banner: "hot",
                url: "#zombie-shooter"
            },
            {
                id: 16,
                title: "Space Warriors",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Space+Warriors",
                gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=GIF+Preview",
                url: "#space-warriors"
            },
            {
                id: 17,
                title: "Ninja Combat",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Ninja+Combat",
                gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=GIF+Preview",
                banner: "popular",
                url: "#ninja-combat"
            },
            {
                id: 18,
                title: "Cyber Strike",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Cyber+Strike",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                url: "#cyber-strike"
            },
            {
                id: 19,
                title: "Jigsaw Master",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Jigsaw+Master",
                gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=GIF+Preview",
                url: "#jigsaw-master"
            },
            {
                id: 20,
                title: "Memory Challenge",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Memory+Challenge",
                gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=GIF+Preview",
                banner: "new",
                url: "#memory-challenge"
            }
        ]
    },
    {
        id: "action",
        title: "Action Games",
        games: [
            {
                id: 21,
                title: "Commando Raid",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=Commando+Raid",
                gifImg: "https://via.placeholder.com/300x200/A1887F/fff?text=GIF+Preview",
                banner: "new",
                url: "#commando-raid"
            },
            {
                id: 22,
                title: "Street Fighter",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/5D4037/fff?text=Street+Fighter",
                gifImg: "https://via.placeholder.com/300x200/6D4C41/fff?text=GIF+Preview",
                banner: "popular",
                url: "#street-fighter"
            },
            {
                id: 23,
                title: "Warzone Legends",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/455A64/fff?text=Warzone+Legends",
                gifImg: "https://via.placeholder.com/300x200/546E7A/fff?text=GIF+Preview",
                url: "#warzone-legends"
            },
            {
                id: 24,
                title: "Shadow Strike",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/263238/fff?text=Shadow+Strike",
                gifImg: "https://via.placeholder.com/300x200/37474F/fff?text=GIF+Preview",
                banner: "hot",
                url: "#shadow-strike"
            },
            {
                id: 25,
                title: "Dragon Slayer",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/D32F2F/fff?text=Dragon+Slayer",
                gifImg: "https://via.placeholder.com/300x200/E53935/fff?text=GIF+Preview",
                url: "#dragon-slayer"
            },
            {
                id: 26,
                title: "Space Invaders",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/7B1FA2/fff?text=Space+Invaders",
                gifImg: "https://via.placeholder.com/300x200/8E24AA/fff?text=GIF+Preview",
                banner: "new",
                url: "#space-invaders"
            },
            {
                id: 27,
                title: "Zombie Apocalypse",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/C2185B/fff?text=Zombie+Apocalypse",
                gifImg: "https://via.placeholder.com/300x200/D81B60/fff?text=GIF+Preview",
                url: "#zombie-apocalypse"
            },
            {
                id: 28,
                title: "Battle Royale",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/0288D1/fff?text=Battle+Royale",
                gifImg: "https://via.placeholder.com/300x200/039BE5/fff?text=GIF+Preview",
                banner: "popular",
                url: "#battle-royale"
            },
            {
                id: 29,
                title: "Stealth Ops",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/512DA8/fff?text=Stealth+Ops",
                gifImg: "https://via.placeholder.com/300x200/5E35B1/fff?text=GIF+Preview",
                url: "#stealth-ops"
            },
            {
                id: 30,
                title: "Super Soldier",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/303F9F/fff?text=Super+Soldier",
                gifImg: "https://via.placeholder.com/300x200/3949AB/fff?text=GIF+Preview",
                banner: "hot",
                url: "#super-soldier"
            }
        ]
    },
    {
        id: "puzzle",
        title: "Puzzle Games",
        games: [
            {
                id: 31,
                title: "Block Puzzle",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/009688/fff?text=Block+Puzzle",
                gifImg: "https://via.placeholder.com/300x200/26A69A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#block-puzzle"
            },
            {
                id: 32,
                title: "Sudoku Pro",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Sudoku+Pro",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                url: "#sudoku-pro"
            },
            {
                id: 33,
                title: "Word Search",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/7E57C2/fff?text=Word+Search",
                gifImg: "https://via.placeholder.com/300x200/9575CD/fff?text=GIF+Preview",
                banner: "new",
                url: "#word-search"
            },
            {
                id: 34,
                title: "Crossword",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Crossword",
                gifImg: "https://via.placeholder.com/300x200/EF9A9A/fff?text=GIF+Preview",
                url: "#crossword"
            },
            {
                id: 35,
                title: "Jewel Match",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/43A047/fff?text=Jewel+Match",
                gifImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=GIF+Preview",
                banner: "hot",
                url: "#jewel-match"
            },
            {
                id: 36,
                title: "Pipe Dream",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=Pipe+Dream",
                gifImg: "https://via.placeholder.com/300x200/7986CB/fff?text=GIF+Preview",
                url: "#pipe-dream"
            },
            {
                id: 37,
                title: "Mahjong Solitaire",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=Mahjong+Solitaire",
                gifImg: "https://via.placeholder.com/300x200/4DD0E1/fff?text=GIF+Preview",
                banner: "popular",
                url: "#mahjong-solitaire"
            },
            {
                id: 38,
                title: "Tetris Blitz",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/EC407A/fff?text=Tetris+Blitz",
                gifImg: "https://via.placeholder.com/300x200/F06292/fff?text=GIF+Preview",
                url: "#tetris-blitz"
            },
            {
                id: 39,
                title: "Candy Crush",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=Candy+Crush",
                gifImg: "https://via.placeholder.com/300x200/BA68C8/fff?text=GIF+Preview",
                banner: "hot",
                url: "#candy-crush"
            },
            {
                id: 40,
                title: "Bubble Shooter",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/FFA000/fff?text=Bubble+Shooter",
                gifImg: "https://via.placeholder.com/300x200/FFB300/fff?text=GIF+Preview",
                url: "#bubble-shooter"
            }
        ]
    },
    {
        id: "sports",
        title: "Sports Games",
        games: [
            {
                id: 41,
                title: "Basketball Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/2196F3/fff?text=Basketball+Pro",
                gifImg: "https://via.placeholder.com/300x200/03A9F4/fff?text=GIF+Preview",
                banner: "hot",
                url: "#basketball-pro"
            },
            {
                id: 42,
                title: "Football Legends",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Football+Legends",
                gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#football-legends"
            },
            {
                id: 43,
                title: "Tennis Championship",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Tennis+Championship",
                gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=GIF+Preview",
                banner: "new",
                url: "#tennis-championship"
            },
            {
                id: 44,
                title: "Golf Masters",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/009688/fff?text=Golf+Masters",
                gifImg: "https://via.placeholder.com/300x200/26A69A/fff?text=GIF+Preview",
                url: "#golf-masters"
            },
            {
                id: 45,
                title: "Boxing Knockout",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Boxing+Knockout",
                gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=GIF+Preview",
                banner: "hot",
                url: "#boxing-knockout"
            },
            {
                id: 46,
                title: "Hockey Shootout",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Hockey+Shootout",
                gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=GIF+Preview",
                url: "#hockey-shootout"
            },
            {
                id: 47,
                title: "Baseball Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Baseball+Pro",
                gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=GIF+Preview",
                banner: "new",
                url: "#baseball-pro"
            },
            {
                id: 48,
                title: "Soccer Manager",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Soccer+Manager",
                gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=GIF+Preview",
                url: "#soccer-manager"
            },
            {
                id: 49,
                title: "Cricket Challenge",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Cricket+Challenge",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                banner: "popular",
                url: "#cricket-challenge"
            },
            {
                id: 50,
                title: "Extreme Skate",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Extreme+Skate",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                url: "#extreme-skate"
            }
        ]
    },
    {
        id: "io",
        title: "IO Games",
        games: [
            {
                id: 51,
                title: "Diep.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Diep.io",
                gifImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=GIF+Preview",
                banner: "hot",
                url: "#diep-io"
            },
            {
                id: 52,
                title: "Moomoo.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=Moomoo.io",
                gifImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=GIF+Preview",
                url: "#moomoo-io"
            },
            {
                id: 53,
                title: "Krunker.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Krunker.io",
                gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=GIF+Preview",
                banner: "popular",
                url: "#krunker-io"
            },
            {
                id: 54,
                title: "Surviv.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Surviv.io",
                gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=GIF+Preview",
                banner: "new",
                url: "#surviv-io"
            },
            {
                id: 55,
                title: "ZombsRoyale.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=ZombsRoyale.io",
                gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=GIF+Preview",
                url: "#zombsroyale-io"
            },
            {
                id: 56,
                title: "Bonk.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Bonk.io",
                gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=GIF+Preview",
                banner: "hot",
                url: "#bonk-io"
            },
            {
                id: 57,
                title: "Skribbl.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Skribbl.io",
                gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=GIF+Preview",
                url: "#skribbl-io"
            },
            {
                id: 58,
                title: "Paper.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Paper.io",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                banner: "new",
                url: "#paper-io"
            },
            {
                id: 59,
                title: "Wings.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Wings.io",
                gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=GIF+Preview",
                url: "#wings-io"
            },
            {
                id: 60,
                title: "Spinz.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Spinz.io",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                banner: "popular",
                url: "#spinz-io"
            }
        ]
    }
];

// DOM Elements
const gamesContainer = document.getElementById('gamesContainer');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');
const pinnedGamesContainer = document.getElementById('pinnedGamesContainer');
const pinnedGamesRow = document.querySelector('.pinned-games-row');
const clearPinsBtn = document.querySelector('.clear-pins');
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const glowEffect = document.querySelector('.glow-effect');
const favoritesContainer = document.getElementById('favoritesContainer');
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

// State Management
let currentCategory = 'all';
let currentSearchTerm = '';
let currentUser = null;
let userFavorites = [];

// Initialize Application
function init() {
    setupEventListeners();
    setupNavbar();
    renderAllGameRows();
    
    // Set up auth state listener
    auth.onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            updateUIForUser(user);
            loadUserData(user.uid);
            loadUserFavorites(user.uid);
        } else {
            currentUser = null;
            userFavorites = [];
            updateUIForGuest();
        }
    });
}

// Load user favorites from Firestore
function loadUserFavorites(userId) {
    db.collection('users').doc(userId).collection('favorites').get()
        .then((querySnapshot) => {
            userFavorites = [];
            querySnapshot.forEach((doc) => {
                userFavorites.push(doc.data().gameId);
            });
            updateFavoritesUI();
            if (favoritesContainer) renderFavorites();
        })
        .catch((error) => {
            console.error('Error loading favorites:', error);
        });
}

// Toggle favorite status
function toggleFavorite(gameId) {
    if (!currentUser) {
        alert('Please sign in to save favorites');
        return Promise.resolve(false);
    }

    const userId = currentUser.uid;
    const favoriteRef = db.collection('users').doc(userId).collection('favorites').doc(String(gameId));

    if (userFavorites.includes(gameId)) {
        // Remove from favorites
        return favoriteRef.delete()
            .then(() => {
                userFavorites = userFavorites.filter(id => id !== gameId);
                updateFavoritesUI();
                return false;
            });
    } else {
        // Add to favorites
        return favoriteRef.set({
            gameId: gameId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            userFavorites.push(gameId);
            updateFavoritesUI();
            return true;
        });
    }
}

// Update UI based on favorites
function updateFavoritesUI() {
    document.querySelectorAll('.pin-btn').forEach(btn => {
        const gameCard = btn.closest('.game-card');
        const gameId = parseInt(gameCard.dataset.id);
        
        if (userFavorites.includes(gameId)) {
            btn.classList.add('pinned');
            btn.innerHTML = '<i class="bx bxs-bookmark"></i>';
            gameCard.classList.add('pinned-highlight');
        } else {
            btn.classList.remove('pinned');
            btn.innerHTML = '<i class="bx bx-bookmark"></i>';
            gameCard.classList.remove('pinned-highlight');
        }
    });
}

function renderFavorites() {
    if (!userFavorites.length) {
        favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
        return;
    }

    favoritesContainer.innerHTML = '';
    userFavorites.forEach(gameId => {
        const game = findGameById(gameId);
        if (game) {
            const gameCard = createFavoriteGameCard(game);
            favoritesContainer.appendChild(gameCard);
        }
    });
}

function createFavoriteGameCard(game) {
    const card = document.createElement('div');
    card.className = 'favorite-game-card';
    card.dataset.id = game.id;
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container">
                ${game.banner ? createBannerElement(game.banner) : ''}
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
        toggleFavorite(game.id).then(() => {
            card.remove();
            if (!favoritesContainer.children.length) {
                favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
            }
        });
    });
    
    return card;
}
    
    card.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(game.id).then(() => {
            card.remove();
            if (!favoritesContainer.children.length) {
                favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
            }
        });
    });
    
    return card;
}

// Toggle pin/favorite status of a game
function togglePinGame(gameId, cardElement = null) {
    toggleFavorite(gameId).then((isFavorite) => {
        if (isFavorite === false && !currentUser) return;
        
        if (cardElement) {
            if (isFavorite) {
                cardElement.classList.add('pinned-highlight');
                const btn = cardElement.querySelector('.pin-btn');
                if (btn) {
                    btn.classList.add('pinned');
                    btn.innerHTML = '<i class="bx bxs-bookmark"></i>';
                }
            } else {
                cardElement.classList.remove('pinned-highlight');
                const btn = cardElement.querySelector('.pin-btn');
                if (btn) {
                    btn.classList.remove('pinned');
                    btn.innerHTML = '<i class="bx bx-bookmark"></i>';
                }
            }
        }
    });
}

// Find game by ID across all categories
function findGameById(id) {
    for (const row of gamesData) {
        const game = row.games.find(g => g.id === id);
        if (game) return game;
    }
    return null;
}

// Create a game card element
function createGameCard(game, isPinned = false) {
    const card = document.createElement('div');
    card.className = `game-card ${isPinned ? 'pinned-highlight' : ''}`;
    card.dataset.category = game.category;
    card.dataset.id = game.id;
    
    const pinBtn = createPinButton(game.id, isPinned);
    card.appendChild(pinBtn);
    
    card.innerHTML += `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container">
                ${game.banner ? createBannerElement(game.banner) : ''}
                <img src="${game.staticImg}" class="game-thumbnail static" alt="${game.title}">
                <img src="${game.gifImg}" class="game-thumbnail gif" alt="${game.title} GIF">
            </div>
            <div class="game-title">${game.title}</div>
        </a>
    `;
    
    return card;
}

// Create pin button element
function createPinButton(gameId, isPinned = false) {
    const pinBtn = document.createElement('button');
    pinBtn.className = `pin-btn ${isPinned ? 'pinned' : ''}`;
    pinBtn.innerHTML = `<i class="bx ${isPinned ? 'bxs-bookmark' : 'bx-bookmark'}"></i>`;
    pinBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePinGame(gameId, pinBtn.closest('.game-card'));
    };
    return pinBtn;
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

// Render all game rows based on filter
function renderAllGameRows(filterCategory = 'all', searchTerm = '') {
    currentCategory = filterCategory;
    currentSearchTerm = searchTerm;
    
    gamesContainer.innerHTML = '';
    
    gamesData.forEach(row => {
        // Skip Popular/New rows when filtering by specific category
        if (filterCategory !== 'all' && ['popular', 'new'].includes(row.id)) {
            return;
        }
        
        // For category rows, only show if matching the filter or showing all
        if (['action', 'puzzle', 'sports', 'io'].includes(row.id)) {
            if (filterCategory !== 'all' && row.id !== filterCategory) {
                return;
            }
        }

        // Filter games for this row
        const filteredGames = row.games.filter(game => {
            const matchesCategory = filterCategory === 'all' || game.category === filterCategory;
            const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        
        // Only create row if there are games to show
        if (filteredGames.length > 0) {
            const rowHTML = `
                <div class="game-row">
                    <h3 class="row-title">${row.title}</h3>
                    <div class="game-scroll-container">
                        <div class="horizontal-game-grid" id="${row.id}">
                            ${generateGameCardsHTML(filteredGames)}
                        </div>
                    </div>
                </div>
            `;
            gamesContainer.insertAdjacentHTML('beforeend', rowHTML);
        }
    });
    
    // Add event listeners to newly created game cards
    addGameCardEventListeners();
}

// Generate HTML for game cards
function generateGameCardsHTML(games) {
    return games.map(game => `
        <div class="game-card ${userFavorites.includes(game.id) ? 'pinned-highlight' : ''}" data-category="${game.category}" data-id="${game.id}">
            <button class="pin-btn ${userFavorites.includes(game.id) ? 'pinned' : ''}">
                <i class="bx ${userFavorites.includes(game.id) ? 'bxs-bookmark' : 'bx-bookmark'}"></i>
            </button>
            <a href="${game.url}" class="game-link">
                <div class="thumbnail-container">
                    ${game.banner ? createBannerElement(game.banner) : ''}
                    <img src="${game.staticImg}" class="game-thumbnail static" alt="${game.title}">
                    <img src="${game.gifImg}" class="game-thumbnail gif" alt="${game.title} GIF">
                </div>
                <div class="game-title">${game.title}</div>
            </a>
        </div>
    `).join('');
}

// Add event listeners to game cards
function addGameCardEventListeners() {
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const gameCard = this.closest('.game-card');
            const gameId = parseInt(gameCard.dataset.id);
            togglePinGame(gameId, gameCard);
        });
    });
}

// Set up navbar functionality
function setupNavbar() {
    // Set initial active link
    navLinks[0].classList.add('active');
    updateGlowEffect(navLinks[0]);

    // Toggle navbar visibility
    hamburger.addEventListener('click', function() {
        navbar.classList.toggle('closed');
        
        // Change hamburger icon
        const icon = this.querySelector('i');
        if (navbar.classList.contains('closed')) {
            icon.classList.replace('bx-menu', 'bx-menu-alt-right');
        } else {
            icon.classList.replace('bx-menu-alt-right', 'bx-menu');
        }
    });

    // Set up nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update glow effect
            updateGlowEffect(this);
        });

        // Hover effect
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                updateGlowEffect(this, true);
            }
        });

        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                const activeLink = document.querySelector('.nav-link.active');
                updateGlowEffect(activeLink);
            }
        });
    });
}

// Update navbar glow effect
function updateGlowEffect(element, isHover = false) {
    if (!element) return;
    
    const linkRect = element.getBoundingClientRect();
    const containerRect = element.parentElement.getBoundingClientRect();
    
    const glowColor = element.getAttribute('data-glow-color') || '#4fc3f7';
    const y = linkRect.top - containerRect.top;
    
    glowEffect.style.top = `${y}px`;
    glowEffect.style.backgroundColor = glowColor;
    glowEffect.style.opacity = isHover ? '0.7' : '0.5';
}

// Set up all event listeners
function setupEventListeners() {
    // Category tabs
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                renderAllGameRows(category, searchInput.value);
            });
        });
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeCategory = document.querySelector('.tab-btn.active').dataset.category;
            renderAllGameRows(activeCategory, searchInput.value);
        });
    }
    
    // Clear pins button (now clears favorites)
    if (clearPinsBtn) {
        clearPinsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to clear all favorites?')) {
                clearAllFavorites();
            }
        });
    }

    // Google Sign-In
    if (signInButton) {
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
    }

    // Sign Out
    if (signOutButton) {
        signOutButton.addEventListener('click', function() {
            auth.signOut()
                .catch(function(error) {
                    console.error('Sign out error:', error);
                });
        });
    }

    // Update Username
    if (updateUsernameBtn) {
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
                if (usernameDisplay) usernameDisplay.textContent = newUsername;
                if (dashboardUsername) dashboardUsername.textContent = newUsername;
                if (newUsernameInput) newUsernameInput.value = '';
                alert('Username updated!');
            })
            .catch(function(error) {
                console.error('Error updating username:', error);
                alert('Update failed: ' + error.message);
            });
        });
    }

    // Profile Picture Preview
    if (profilePicUpload) {
        profilePicUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 500 * 1024) {
                alert('Image must be smaller than 500KB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                if (profilePicPreview) profilePicPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Update Profile Picture
    if (updateProfilePicBtn) {
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
                    if (profilePic) profilePic.src = base64Image;
                    if (profilePicPreview) profilePicPreview.src = base64Image;
                    if (profilePicUpload) profilePicUpload.value = '';
                    alert('Profile picture updated!');
                })
                .catch(function(error) {
                    console.error('Error saving image:', error);
                    alert('Upload failed: ' + error.message);
                });
            };
            reader.readAsDataURL(file);
        });
    }
}

// Clear all favorites
function clearAllFavorites() {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const batch = db.batch();
    
    db.collection('users').doc(userId).collection('favorites').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            userFavorites = [];
            updateFavoritesUI();
            if (favoritesContainer) renderFavorites();
        })
        .catch(error => {
            console.error('Error clearing favorites:', error);
        });
}

// Update UI for logged in user
function updateUIForUser(user) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (usernameDisplay) usernameDisplay.textContent = user.displayName || 'User';
    if (dashboardUsername) dashboardUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        if (profilePic) profilePic.src = user.photoURL;
        if (profilePicPreview) profilePicPreview.src = user.photoURL;
    }
}

// Update UI for guest
function updateUIForGuest() {
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    if (usernameDisplay) usernameDisplay.textContent = 'Guest';
    if (profilePic) profilePic.src = 'https://via.placeholder.com/40';
    if (profilePicPreview) profilePicPreview.src = 'https://via.placeholder.com/150';
}

// Create user document in Firestore
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

// Load user data from Firestore
function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then(function(doc) {
            if (doc.exists) {
                const userData = doc.data();
                
                if (userData.username) {
                    if (usernameDisplay) usernameDisplay.textContent = userData.username;
                    if (dashboardUsername) dashboardUsername.textContent = userData.username;
                }
                
                if (userData.photoBase64) {
                    if (profilePic) profilePic.src = userData.photoBase64;
                    if (profilePicPreview) profilePicPreview.src = userData.photoBase64;
                }
            }
        })
        .catch(function(error) {
            console.error('Error loading user data:', error);
        });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
