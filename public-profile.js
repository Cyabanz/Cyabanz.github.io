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
const db = firebase.firestore();

// Complete Games Data (60 games across 6 categories)
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
                url: "https://example.com",
                banner: "hot"
            },
            {
                id: 2,
                title: "Cut the Rope",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Cut+the+Rope",
                url: "#cut-the-rope",
                banner: "popular"
            },
            {
                id: 3,
                title: "Basketball Stars",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/2196F3/fff?text=Basketball+Stars",
                url: "#basketball-stars",
                banner: "new"
            },
            {
                id: 4,
                title: "Agar.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Agar.io",
                url: "#agar-io",
                banner: "hot"
            },
            {
                id: 5,
                title: "Slither.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Slither.io",
                url: "#slither-io"
            },
            {
                id: 6,
                title: "Zombie Derby",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Zombie+Derby",
                url: "#zombie-derby",
                banner: "new"
            },
            {
                id: 7,
                title: "Sudoku",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Sudoku",
                url: "#sudoku"
            },
            {
                id: 8,
                title: "Soccer Skills",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Skills",
                url: "#soccer-skills",
                banner: "popular"
            },
            {
                id: 9,
                title: "Tank Wars",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Tank+Wars",
                url: "#tank-wars"
            },
            {
                id: 10,
                title: "2048",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=2048",
                url: "#2048",
                banner: "hot"
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
                url: "#epic-adventure",
                banner: "new"
            },
            {
                id: 12,
                title: "Brain Teaser",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Brain+Teaser",
                url: "#brain-teaser",
                banner: "new"
            },
            {
                id: 13,
                title: "Soccer Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Pro",
                url: "#soccer-pro",
                banner: "new"
            },
            {
                id: 14,
                title: "WormZone.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=WormZone.io",
                url: "#wormzone-io",
                banner: "new"
            },
            {
                id: 15,
                title: "Zombie Shooter",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/E91E63/fff?text=Zombie+Shooter",
                url: "#zombie-shooter",
                banner: "hot"
            },
            {
                id: 16,
                title: "Space Warriors",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Space+Warriors",
                url: "#space-warriors"
            },
            {
                id: 17,
                title: "Ninja Combat",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Ninja+Combat",
                url: "#ninja-combat",
                banner: "popular"
            },
            {
                id: 18,
                title: "Cyber Strike",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Cyber+Strike",
                url: "#cyber-strike"
            },
            {
                id: 19,
                title: "Jigsaw Master",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Jigsaw+Master",
                url: "#jigsaw-master"
            },
            {
                id: 20,
                title: "Memory Challenge",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Memory+Challenge",
                url: "#memory-challenge",
                banner: "new"
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
                url: "#commando-raid",
                banner: "new"
            },
            {
                id: 22,
                title: "Street Fighter",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/5D4037/fff?text=Street+Fighter",
                url: "#street-fighter",
                banner: "popular"
            },
            {
                id: 23,
                title: "Warzone Legends",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/455A64/fff?text=Warzone+Legends",
                url: "#warzone-legends"
            },
            {
                id: 24,
                title: "Shadow Strike",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/263238/fff?text=Shadow+Strike",
                url: "#shadow-strike",
                banner: "hot"
            },
            {
                id: 25,
                title: "Dragon Slayer",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/D32F2F/fff?text=Dragon+Slayer",
                url: "#dragon-slayer"
            },
            {
                id: 26,
                title: "Space Invaders",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/7B1FA2/fff?text=Space+Invaders",
                url: "#space-invaders",
                banner: "new"
            },
            {
                id: 27,
                title: "Zombie Apocalypse",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/C2185B/fff?text=Zombie+Apocalypse",
                url: "#zombie-apocalypse"
            },
            {
                id: 28,
                title: "Battle Royale",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/0288D1/fff?text=Battle+Royale",
                url: "#battle-royale",
                banner: "popular"
            },
            {
                id: 29,
                title: "Stealth Ops",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/512DA8/fff?text=Stealth+Ops",
                url: "#stealth-ops"
            },
            {
                id: 30,
                title: "Super Soldier",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/303F9F/fff?text=Super+Soldier",
                url: "#super-soldier",
                banner: "hot"
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
                url: "#block-puzzle",
                banner: "popular"
            },
            {
                id: 32,
                title: "Sudoku Pro",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Sudoku+Pro",
                url: "#sudoku-pro"
            },
            {
                id: 33,
                title: "Word Search",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/7E57C2/fff?text=Word+Search",
                url: "#word-search",
                banner: "new"
            },
            {
                id: 34,
                title: "Crossword",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Crossword",
                url: "#crossword"
            },
            {
                id: 35,
                title: "Jewel Match",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/43A047/fff?text=Jewel+Match",
                url: "#jewel-match",
                banner: "hot"
            },
            {
                id: 36,
                title: "Pipe Dream",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=Pipe+Dream",
                url: "#pipe-dream"
            },
            {
                id: 37,
                title: "Mahjong Solitaire",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=Mahjong+Solitaire",
                url: "#mahjong-solitaire",
                banner: "popular"
            },
            {
                id: 38,
                title: "Tetris Blitz",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/EC407A/fff?text=Tetris+Blitz",
                url: "#tetris-blitz"
            },
            {
                id: 39,
                title: "Candy Crush",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=Candy+Crush",
                url: "#candy-crush",
                banner: "hot"
            },
            {
                id: 40,
                title: "Bubble Shooter",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/FFA000/fff?text=Bubble+Shooter",
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
                url: "#basketball-pro",
                banner: "hot"
            },
            {
                id: 42,
                title: "Football Legends",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Football+Legends",
                url: "#football-legends",
                banner: "popular"
            },
            {
                id: 43,
                title: "Tennis Championship",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Tennis+Championship",
                url: "#tennis-championship",
                banner: "new"
            },
            {
                id: 44,
                title: "Golf Masters",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/009688/fff?text=Golf+Masters",
                url: "#golf-masters"
            },
            {
                id: 45,
                title: "Boxing Knockout",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Boxing+Knockout",
                url: "#boxing-knockout",
                banner: "hot"
            },
            {
                id: 46,
                title: "Hockey Shootout",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Hockey+Shootout",
                url: "#hockey-shootout"
            },
            {
                id: 47,
                title: "Baseball Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Baseball+Pro",
                url: "#baseball-pro",
                banner: "new"
            },
            {
                id: 48,
                title: "Soccer Manager",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Soccer+Manager",
                url: "#soccer-manager"
            },
            {
                id: 49,
                title: "Cricket Challenge",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Cricket+Challenge",
                url: "#cricket-challenge",
                banner: "popular"
            },
            {
                id: 50,
                title: "Extreme Skate",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Extreme+Skate",
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
                url: "#diep-io",
                banner: "hot"
            },
            {
                id: 52,
                title: "Moomoo.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=Moomoo.io",
                url: "#moomoo-io"
            },
            {
                id: 53,
                title: "Krunker.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Krunker.io",
                url: "#krunker-io",
                banner: "popular"
            },
            {
                id: 54,
                title: "Surviv.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Surviv.io",
                url: "#surviv-io",
                banner: "new"
            },
            {
                id: 55,
                title: "ZombsRoyale.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=ZombsRoyale.io",
                url: "#zombsroyale-io"
            },
            {
                id: 56,
                title: "Bonk.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Bonk.io",
                url: "#bonk-io",
                banner: "hot"
            },
            {
                id: 57,
                title: "Skribbl.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Skribbl.io",
                url: "#skribbl-io"
            },
            {
                id: 58,
                title: "Paper.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Paper.io",
                url: "#paper-io",
                banner: "new"
            },
            {
                id: 59,
                title: "Wings.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Wings.io",
                url: "#wings-io"
            },
            {
                id: 60,
                title: "Spinz.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Spinz.io",
                url: "#spinz-io",
                banner: "popular"
            }
        ]
    }
];

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
                <img src="${game.staticImg}" class="game-thumbnail" alt="${game.title}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
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
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

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
