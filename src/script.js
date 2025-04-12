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

// Your existing game data remains exactly the same
const gamesData = [
    {
        id: "popular",
        title: "Popular Games",
        games: [
            {
                id: 1,
                title: "Bullet Force",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/333/fff?text=Bullet+Force",
                gifImg: "https://via.placeholder.com/300x200/555/fff?text=GIF+Preview",
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
const authContainer = document.createElement('div');
authContainer.id = 'auth-container';
document.body.prepend(authContainer);

// State Management
let currentCategory = 'all';
let currentSearchTerm = '';
let currentUser = null;

// Initialize Application
function init() {
    setupAuthUI();
    setupAuthListeners();
    loadPinnedGames();
    renderAllGameRows();
    setupEventListeners();
    setupNavbar();
}

// Auth UI Setup
function setupAuthUI() {
    authContainer.className = 'auth-container';
    authContainer.innerHTML = `
        <button id="signInBtn" class="auth-btn">
            <i class='bx bx-log-in'></i> Sign In
        </button>
        <div id="userProfile" class="user-profile" style="display:none">
            <img id="userAvatar" class="user-avatar">
            <span id="userName" class="user-name"></span>
            <button id="signOutBtn" class="auth-btn">
                <i class='bx bx-log-out'></i>
            </button>
        </div>
    `;
}

// Auth State Listener
function setupAuthListeners() {
    auth.onAuthStateChanged(user => {
        currentUser = user;
        const signInBtn = document.getElementById('signInBtn');
        const signOutBtn = document.getElementById('signOutBtn');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (user) {
            // User is signed in
            signInBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
            userName.textContent = user.displayName || 'User';
            
            // Create user document if it doesn't exist
            db.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            // Load favorites from Firebase
            loadPinnedGames();
        } else {
            // User is signed out
            signInBtn.style.display = 'block';
            userProfile.style.display = 'none';
            
            // Clear any displayed favorites
            pinnedGamesContainer.innerHTML = '';
            hidePinnedGamesRow();
        }
    });

    // Sign in button
    document.getElementById('signInBtn')?.addEventListener('click', () => {
        auth.signInWithPopup(provider).catch(error => {
            console.error("Sign in error:", error);
            alert("Sign in failed: " + error.message);
        });
    });

    // Sign out button
    document.getElementById('signOutBtn')?.addEventListener('click', () => {
        auth.signOut().catch(error => {
            console.error("Sign out error:", error);
        });
    });
}

// Load pinned/favorite games
function loadPinnedGames() {
    if (!currentUser) return;

    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const favorites = userData.favoriteGames || [];
                
                if (favorites.length > 0) {
                    showPinnedGamesRow();
                    renderPinnedGames(favorites);
                } else {
                    hidePinnedGamesRow();
                }
            }
        })
        .catch(error => {
            console.error("Error loading favorites:", error);
            hidePinnedGamesRow();
        });
}

// Show/hide pinned games row
function showPinnedGamesRow() {
    pinnedGamesRow.style.display = 'block';
    setTimeout(() => {
        pinnedGamesRow.style.opacity = '1';
        pinnedGamesRow.style.transform = 'translateY(0)';
    }, 10);
}

function hidePinnedGamesRow() {
    pinnedGamesRow.style.opacity = '0';
    pinnedGamesRow.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        pinnedGamesRow.style.display = 'none';
    }, 300);
}

// Render pinned games to the dedicated section
function renderPinnedGames(pinnedGames) {
    pinnedGamesContainer.innerHTML = '';
    
    pinnedGames.forEach(gameId => {
        const game = findGameById(gameId);
        if (game) {
            const gameCard = createGameCard(game, true);
            pinnedGamesContainer.appendChild(gameCard);
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

// Toggle pin status of a game
function togglePinGame(gameId, cardElement = null) {
    if (!currentUser) {
        showSignInPrompt();
        return;
    }

    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            let pinnedGames = doc.exists ? (doc.data().favoriteGames || []) : [];
            const isPinned = pinnedGames.includes(gameId);
            
            if (isPinned) {
                // Unpin the game
                pinnedGames = pinnedGames.filter(id => id !== gameId);
                
                // Remove from pinned container
                const pinnedCard = pinnedGamesContainer.querySelector(`.game-card[data-id="${gameId}"]`);
                if (pinnedCard) pinnedCard.remove();
                
                // Update the original card if provided
                if (cardElement) {
                    cardElement.classList.remove('pinned-highlight');
                    const btn = cardElement.querySelector('.pin-btn');
                    if (btn) {
                        btn.classList.remove('pinned');
                        btn.innerHTML = '<i class="bx bx-bookmark"></i>';
                    }
                }
            } else {
                // Pin the game
                pinnedGames.unshift(gameId);
                
                // Add to pinned container
                const game = findGameById(gameId);
                if (game) {
                    const gameCard = createGameCard(game, true);
                    pinnedGamesContainer.prepend(gameCard);
                    showPinnedGamesRow();
                }
                
                // Update the original card if provided
                if (cardElement) {
                    cardElement.classList.add('pinned-highlight');
                    const btn = cardElement.querySelector('.pin-btn');
                    if (btn) {
                        btn.classList.add('pinned');
                        btn.innerHTML = '<i class="bx bxs-bookmark"></i>';
                    }
                }
            }
            
            // Save to Firebase
            return db.collection('users').doc(currentUser.uid).set({
                favoriteGames: pinnedGames
            }, { merge: true });
        })
        .then(() => {
            // Hide pinned row if no more pinned games
            if (pinnedGamesContainer.children.length === 0) {
                hidePinnedGamesRow();
            }
        })
        .catch(error => {
            console.error("Error toggling favorite:", error);
            alert("Failed to update favorites. Please try again.");
        });
}

// Show sign in prompt
function showSignInPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'sign-in-prompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <h3>Sign In Required</h3>
            <p>You need to sign in to save favorite games across all your devices.</p>
            <div class="prompt-buttons">
                <button id="cancelPrompt" class="prompt-btn cancel">Maybe Later</button>
                <button id="signInPrompt" class="prompt-btn confirm">Sign In Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(prompt);
    
    document.getElementById('signInPrompt').addEventListener('click', () => {
        auth.signInWithPopup(provider);
        prompt.remove();
    });
    
    document.getElementById('cancelPrompt').addEventListener('click', () => {
        prompt.remove();
    });
}

// Clear all pinned games
function clearAllPinnedGames() {
    if (!currentUser) return;
    
    if (pinnedGamesContainer.children.length > 0 && confirm('Are you sure you want to clear all favorite games?')) {
        db.collection('users').doc(currentUser.uid).update({
            favoriteGames: []
        })
        .then(() => {
            pinnedGamesContainer.innerHTML = '';
            hidePinnedGamesRow();
            
            // Update all pin buttons
            document.querySelectorAll('.pin-btn').forEach(btn => {
                btn.classList.remove('pinned');
                btn.innerHTML = '<i class="bx bx-bookmark"></i>';
            });
            
            // Remove highlight from all game cards
            document.querySelectorAll('.game-card').forEach(card => {
                card.classList.remove('pinned-highlight');
            });
        })
        .catch(error => {
            console.error("Error clearing favorites:", error);
            alert("Failed to clear favorites. Please try again.");
        });
    }
}

// Render all game rows based on filter
function renderAllGameRows(filterCategory = 'all', searchTerm = '') {
    currentCategory = filterCategory;
    currentSearchTerm = searchTerm;
    
    gamesContainer.innerHTML = '';
    
    gamesData.forEach(row => {
        if (filterCategory !== 'all' && ['popular', 'new'].includes(row.id)) {
            return;
        }
        
        if (['action', 'puzzle', 'sports', 'io'].includes(row.id)) {
            if (filterCategory !== 'all' && row.id !== filterCategory) {
                return;
            }
        }

        const filteredGames = row.games.filter(game => {
            const matchesCategory = filterCategory === 'all' || game.category === filterCategory;
            const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        
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
    
    addGameCardEventListeners();
}

// Generate HTML for game cards
function generateGameCardsHTML(games) {
    // For non-signed-in users, show all games as unpinned
    if (!currentUser) {
        return games.map(game => `
            <div class="game-card" data-category="${game.category}" data-id="${game.id}">
                <button class="pin-btn" disabled>
                    <i class="bx bx-bookmark"></i>
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

    // For signed-in users, check their favorites
    return db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            const pinnedGames = doc.exists ? (doc.data().favoriteGames || []) : [];
            
            return games.map(game => `
                <div class="game-card ${pinnedGames.includes(game.id) ? 'pinned-highlight' : ''}" data-category="${game.category}" data-id="${game.id}">
                    <button class="pin-btn ${pinnedGames.includes(game.id) ? 'pinned' : ''}">
                        <i class="bx ${pinnedGames.includes(game.id) ? 'bxs-bookmark' : 'bx-bookmark'}"></i>
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
        })
        .catch(error => {
            console.error("Error checking favorites:", error);
            return games.map(game => `
                <div class="game-card" data-category="${game.category}" data-id="${game.id}">
                    <button class="pin-btn">
                        <i class="bx bx-bookmark"></i>
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
        });
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

// Helper function to get banner icon
function getBannerIcon(type) {
    const icons = {
        hot: 'bx bx-hot',
        new: 'bx bx-star',
        popular: 'bx bx-trending-up'
    };
    return icons[type] || 'bx bx-info-circle';
}

// Set up navbar functionality
function setupNavbar() {
    navLinks[0].classList.add('active');
    updateGlowEffect(navLinks[0]);

    hamburger.addEventListener('click', function() {
        navbar.classList.toggle('closed');
        const icon = this.querySelector('i');
        if (navbar.classList.contains('closed')) {
            icon.classList.replace('bx-menu', 'bx-menu-alt-right');
        } else {
            icon.classList.replace('bx-menu-alt-right', 'bx-menu');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            updateGlowEffect(this);
        });

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
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            renderAllGameRows(category, searchInput.value);
        });
    });
    
    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.tab-btn.active').dataset.category;
        renderAllGameRows(activeCategory, searchInput.value);
    });
    
    clearPinsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearAllPinnedGames();
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);