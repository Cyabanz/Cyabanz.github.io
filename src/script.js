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

// Complete Game Data - All 60 Games
const gamesData = [
  {
    id: "popular",
    title: "Popular Games",
    games: [
      {
        id: 1,
        title: "Bullet Force",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Bullet+Force",
        gifImg: "https://via.placeholder.com/300x200/FF5252/fff?text=Bullet+Force+GIF",
        banner: "hot",
        url: "/games/bullet-force"
      },
      {
        id: 2,
        title: "Cut the Rope",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Cut+the+Rope",
        gifImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Cut+the+Rope+GIF",
        banner: "popular",
        url: "/games/cut-the-rope"
      },
      {
        id: 3,
        title: "Basketball Stars",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/2196F3/fff?text=Basketball+Stars",
        gifImg: "https://via.placeholder.com/300x200/03A9F4/fff?text=Basketball+Stars+GIF",
        banner: "new",
        url: "/games/basketball-stars"
      },
      {
        id: 4,
        title: "Agar.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Agar.io",
        gifImg: "https://via.placeholder.com/300x200/FFEB3B/fff?text=Agar.io+GIF",
        banner: "hot",
        url: "/games/agar-io"
      },
      {
        id: 5,
        title: "Slither.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Slither.io",
        gifImg: "https://via.placeholder.com/300x200/E91E63/fff?text=Slither.io+GIF",
        url: "/games/slither-io"
      },
      {
        id: 6,
        title: "Zombie Derby",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Zombie+Derby",
        gifImg: "https://via.placeholder.com/300x200/FF5252/fff?text=Zombie+Derby+GIF",
        banner: "new",
        url: "/games/zombie-derby"
      },
      {
        id: 7,
        title: "Sudoku",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Sudoku",
        gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=Sudoku+GIF",
        url: "/games/sudoku"
      },
      {
        id: 8,
        title: "Soccer Skills",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Skills",
        gifImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Soccer+Skills+GIF",
        banner: "popular",
        url: "/games/soccer-skills"
      },
      {
        id: 9,
        title: "Tank Wars",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Tank+Wars",
        gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=Tank+Wars+GIF",
        url: "/games/tank-wars"
      },
      {
        id: 10,
        title: "2048",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=2048",
        gifImg: "https://via.placeholder.com/300x200/80DEEA/fff?text=2048+GIF",
        banner: "hot",
        url: "/games/2048"
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
        gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=Epic+Adventure+GIF",
        banner: "new",
        url: "/games/epic-adventure"
      },
      {
        id: 12,
        title: "Brain Teaser",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Brain+Teaser",
        gifImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=Brain+Teaser+GIF",
        banner: "new",
        url: "/games/brain-teaser"
      },
      {
        id: 13,
        title: "Soccer Pro",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Pro",
        gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=Soccer+Pro+GIF",
        banner: "new",
        url: "/games/soccer-pro"
      },
      {
        id: 14,
        title: "WormZone.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=WormZone.io",
        gifImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=WormZone.io+GIF",
        banner: "new",
        url: "/games/wormzone-io"
      },
      {
        id: 15,
        title: "Zombie Shooter",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/E91E63/fff?text=Zombie+Shooter",
        gifImg: "https://via.placeholder.com/300x200/EC407A/fff?text=Zombie+Shooter+GIF",
        banner: "hot",
        url: "/games/zombie-shooter"
      },
      {
        id: 16,
        title: "Space Warriors",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Space+Warriors",
        gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=Space+Warriors+GIF",
        url: "/games/space-warriors"
      },
      {
        id: 17,
        title: "Ninja Combat",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Ninja+Combat",
        gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Ninja+Combat+GIF",
        banner: "popular",
        url: "/games/ninja-combat"
      },
      {
        id: 18,
        title: "Cyber Strike",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Cyber+Strike",
        gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=Cyber+Strike+GIF",
        url: "/games/cyber-strike"
      },
      {
        id: 19,
        title: "Jigsaw Master",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Jigsaw+Master",
        gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=Jigsaw+Master+GIF",
        url: "/games/jigsaw-master"
      },
      {
        id: 20,
        title: "Memory Challenge",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Memory+Challenge",
        gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=Memory+Challenge+GIF",
        banner: "new",
        url: "/games/memory-challenge"
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
        gifImg: "https://via.placeholder.com/300x200/A1887F/fff?text=Commando+Raid+GIF",
        banner: "new",
        url: "/games/commando-raid"
      },
      {
        id: 22,
        title: "Street Fighter",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/5D4037/fff?text=Street+Fighter",
        gifImg: "https://via.placeholder.com/300x200/6D4C41/fff?text=Street+Fighter+GIF",
        banner: "popular",
        url: "/games/street-fighter"
      },
      {
        id: 23,
        title: "Warzone Legends",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/455A64/fff?text=Warzone+Legends",
        gifImg: "https://via.placeholder.com/300x200/546E7A/fff?text=Warzone+Legends+GIF",
        url: "/games/warzone-legends"
      },
      {
        id: 24,
        title: "Shadow Strike",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/263238/fff?text=Shadow+Strike",
        gifImg: "https://via.placeholder.com/300x200/37474F/fff?text=Shadow+Strike+GIF",
        banner: "hot",
        url: "/games/shadow-strike"
      },
      {
        id: 25,
        title: "Dragon Slayer",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/D32F2F/fff?text=Dragon+Slayer",
        gifImg: "https://via.placeholder.com/300x200/E53935/fff?text=Dragon+Slayer+GIF",
        url: "/games/dragon-slayer"
      },
      {
        id: 26,
        title: "Space Invaders",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/7B1FA2/fff?text=Space+Invaders",
        gifImg: "https://via.placeholder.com/300x200/8E24AA/fff?text=Space+Invaders+GIF",
        banner: "new",
        url: "/games/space-invaders"
      },
      {
        id: 27,
        title: "Zombie Apocalypse",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/C2185B/fff?text=Zombie+Apocalypse",
        gifImg: "https://via.placeholder.com/300x200/D81B60/fff?text=Zombie+Apocalypse+GIF",
        url: "/games/zombie-apocalypse"
      },
      {
        id: 28,
        title: "Battle Royale",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/0288D1/fff?text=Battle+Royale",
        gifImg: "https://via.placeholder.com/300x200/039BE5/fff?text=Battle+Royale+GIF",
        banner: "popular",
        url: "/games/battle-royale"
      },
      {
        id: 29,
        title: "Stealth Ops",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/512DA8/fff?text=Stealth+Ops",
        gifImg: "https://via.placeholder.com/300x200/5E35B1/fff?text=Stealth+Ops+GIF",
        url: "/games/stealth-ops"
      },
      {
        id: 30,
        title: "Super Soldier",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/303F9F/fff?text=Super+Soldier",
        gifImg: "https://via.placeholder.com/300x200/3949AB/fff?text=Super+Soldier+GIF",
        banner: "hot",
        url: "/games/super-soldier"
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
        gifImg: "https://via.placeholder.com/300x200/26A69A/fff?text=Block+Puzzle+GIF",
        banner: "popular",
        url: "/games/block-puzzle"
      },
      {
        id: 32,
        title: "Sudoku Pro",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Sudoku+Pro",
        gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=Sudoku+Pro+GIF",
        url: "/games/sudoku-pro"
      },
      {
        id: 33,
        title: "Word Search",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/7E57C2/fff?text=Word+Search",
        gifImg: "https://via.placeholder.com/300x200/9575CD/fff?text=Word+Search+GIF",
        banner: "new",
        url: "/games/word-search"
      },
      {
        id: 34,
        title: "Crossword",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Crossword",
        gifImg: "https://via.placeholder.com/300x200/EF9A9A/fff?text=Crossword+GIF",
        url: "/games/crossword"
      },
      {
        id: 35,
        title: "Jewel Match",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/43A047/fff?text=Jewel+Match",
        gifImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Jewel+Match+GIF",
        banner: "hot",
        url: "/games/jewel-match"
      },
      {
        id: 36,
        title: "Pipe Dream",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=Pipe+Dream",
        gifImg: "https://via.placeholder.com/300x200/7986CB/fff?text=Pipe+Dream+GIF",
        url: "/games/pipe-dream"
      },
      {
        id: 37,
        title: "Mahjong Solitaire",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=Mahjong+Solitaire",
        gifImg: "https://via.placeholder.com/300x200/4DD0E1/fff?text=Mahjong+Solitaire+GIF",
        banner: "popular",
        url: "/games/mahjong-solitaire"
      },
      {
        id: 38,
        title: "Tetris Blitz",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/EC407A/fff?text=Tetris+Blitz",
        gifImg: "https://via.placeholder.com/300x200/F06292/fff?text=Tetris+Blitz+GIF",
        url: "/games/tetris-blitz"
      },
      {
        id: 39,
        title: "Candy Crush",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=Candy+Crush",
        gifImg: "https://via.placeholder.com/300x200/BA68C8/fff?text=Candy+Crush+GIF",
        banner: "hot",
        url: "/games/candy-crush"
      },
      {
        id: 40,
        title: "Bubble Shooter",
        category: "puzzle",
        staticImg: "https://via.placeholder.com/300x200/FFA000/fff?text=Bubble+Shooter",
        gifImg: "https://via.placeholder.com/300x200/FFB300/fff?text=Bubble+Shooter+GIF",
        url: "/games/bubble-shooter"
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
        gifImg: "https://via.placeholder.com/300x200/03A9F4/fff?text=Basketball+Pro+GIF",
        banner: "hot",
        url: "/games/basketball-pro"
      },
      {
        id: 42,
        title: "Football Legends",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Football+Legends",
        gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=Football+Legends+GIF",
        banner: "popular",
        url: "/games/football-legends"
      },
      {
        id: 43,
        title: "Tennis Championship",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Tennis+Championship",
        gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=Tennis+Championship+GIF",
        banner: "new",
        url: "/games/tennis-championship"
      },
      {
        id: 44,
        title: "Golf Masters",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/009688/fff?text=Golf+Masters",
        gifImg: "https://via.placeholder.com/300x200/26A69A/fff?text=Golf+Masters+GIF",
        url: "/games/golf-masters"
      },
      {
        id: 45,
        title: "Boxing Knockout",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Boxing+Knockout",
        gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Boxing+Knockout+GIF",
        banner: "hot",
        url: "/games/boxing-knockout"
      },
      {
        id: 46,
        title: "Hockey Shootout",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Hockey+Shootout",
        gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=Hockey+Shootout+GIF",
        url: "/games/hockey-shootout"
      },
      {
        id: 47,
        title: "Baseball Pro",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Baseball+Pro",
        gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=Baseball+Pro+GIF",
        banner: "new",
        url: "/games/baseball-pro"
      },
      {
        id: 48,
        title: "Soccer Manager",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Soccer+Manager",
        gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=Soccer+Manager+GIF",
        url: "/games/soccer-manager"
      },
      {
        id: 49,
        title: "Cricket Challenge",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Cricket+Challenge",
        gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=Cricket+Challenge+GIF",
        banner: "popular",
        url: "/games/cricket-challenge"
      },
      {
        id: 50,
        title: "Extreme Skate",
        category: "sports",
        staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Extreme+Skate",
        gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=Extreme+Skate+GIF",
        url: "/games/extreme-skate"
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
        gifImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=Diep.io+GIF",
        banner: "hot",
        url: "/games/diep-io"
      },
      {
        id: 52,
        title: "Moomoo.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=Moomoo.io",
        gifImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=Moomoo.io+GIF",
        url: "/games/moomoo-io"
      },
      {
        id: 53,
        title: "Krunker.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Krunker.io",
        gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=Krunker.io+GIF",
        banner: "popular",
        url: "/games/krunker-io"
      },
      {
        id: 54,
        title: "Surviv.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Surviv.io",
        gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=Surviv.io+GIF",
        banner: "new",
        url: "/games/surviv-io"
      },
      {
        id: 55,
        title: "ZombsRoyale.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=ZombsRoyale.io",
        gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=ZombsRoyale.io+GIF",
        url: "/games/zombsroyale-io"
      },
      {
        id: 56,
        title: "Bonk.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Bonk.io",
        gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Bonk.io+GIF",
        banner: "hot",
        url: "/games/bonk-io"
      },
      {
        id: 57,
        title: "Skribbl.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Skribbl.io",
        gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=Skribbl.io+GIF",
        url: "/games/skribbl-io"
      },
      {
        id: 58,
        title: "Paper.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Paper.io",
        gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=Paper.io+GIF",
        banner: "new",
        url: "/games/paper-io"
      },
      {
        id: 59,
        title: "Wings.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Wings.io",
        gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=Wings.io+GIF",
        url: "/games/wings-io"
      },
      {
        id: 60,
        title: "Spinz.io",
        category: "io",
        staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Spinz.io",
        gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=Spinz.io+GIF",
        banner: "popular",
        url: "/games/spinz-io"
      }
    ]
  }
];

// DOM Elements
const gamesContainer = document.getElementById('gamesContainer');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');
const favoritesContainer = document.getElementById('favoritesContainer');
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const recentGamesGrid = document.getElementById('recent-games-grid');
const loginPrompt = document.getElementById('loginPrompt');
const recentGamesList = document.getElementById('recentGamesList');
const noRecentGames = document.getElementById('noRecentGames');

// State Management
let currentCategory = 'all';
let currentSearchTerm = '';
let currentUser = null;
let userFavorites = [];
let recentGames = [];

// Initialize Application
function init() {
  setupEventListeners();
  renderAllGameRows();
  
  auth.onAuthStateChanged(handleAuthStateChange);
}

function handleAuthStateChange(user) {
  currentUser = user;
  
  if (user) {
    updateUIForUser(user);
    loadUserData(user.uid);
    loadUserFavorites(user.uid);
    if (window.location.pathname.includes('recent.html')) {
      loadRecentGames(user.uid);
    }
  } else {
    updateUIForGuest();
    userFavorites = [];
    recentGames = [];
  }
}

// Recent Games Functions
function loadRecentGames(userId) {
  db.collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        recentGames = doc.data().recentGames || [];
        renderRecentGames();
      }
    })
    .catch((error) => {
      console.error('Error loading recent games:', error);
    });
}

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
    const game = findGameById(gameData.gameId);
    if (game) {
      const gameCard = createRecentGameCard(game, gameData.timestamp);
      recentGamesGrid.appendChild(gameCard);
    }
  });
}

function createRecentGameCard(game, timestamp) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.dataset.id = game.id;
  
  const timeString = formatTimestamp(timestamp.toDate());
  
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

function formatTimestamp(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Game Tracking Functions
function trackGamePlay(gameId) {
  if (!currentUser) return;
  
  const userId = currentUser.uid;
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  
  db.runTransaction((transaction) => {
    const userRef = db.collection('users').doc(userId);
    return transaction.get(userRef).then((doc) => {
      if (!doc.exists) throw "Document does not exist!";
      
      let recentGames = doc.data().recentGames || [];
      recentGames = recentGames.filter(g => g.gameId !== gameId);
      recentGames.unshift({ gameId, timestamp });
      
      if (recentGames.length > 5) {
        recentGames = recentGames.slice(0, 5);
      }
      
      transaction.update(userRef, { recentGames });
    });
  }).catch((error) => {
    console.error('Transaction failed: ', error);
  });
}

// Game Display Functions
function renderAllGameRows(filterCategory = 'all', searchTerm = '') {
  currentCategory = filterCategory;
  currentSearchTerm = searchTerm.toLowerCase();
  
  gamesContainer.innerHTML = '';
  
  gamesData.forEach(row => {
    if (filterCategory !== 'all' && ['popular', 'new'].includes(row.id)) return;
    if (['action', 'puzzle', 'sports', 'io'].includes(row.id) && 
        filterCategory !== 'all' && row.id !== filterCategory) return;

    const filteredGames = row.games.filter(game => {
      const matchesCategory = filterCategory === 'all' || game.category === filterCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchTerm);
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

function generateGameCardsHTML(games) {
  return games.map(game => `
    <div class="game-card ${userFavorites.includes(game.id) ? 'pinned-highlight' : ''}" 
         data-category="${game.category}" data-id="${game.id}">
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
  
  const gameLink = card.querySelector('.game-link');
  gameLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentUser) trackGamePlay(game.id);
    handleGameNavigation(game.url);
  });
  
  return card;
}

function handleGameNavigation(url) {
  if (url.startsWith('http')) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
}

// Favorites System
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

function toggleFavorite(gameId) {
  if (!currentUser) {
    alert('Please sign in to save favorites');
    return Promise.resolve(false);
  }

  const userId = currentUser.uid;
  const favoriteRef = db.collection('users').doc(userId).collection('favorites').doc(String(gameId));

  if (userFavorites.includes(gameId)) {
    return favoriteRef.delete()
      .then(() => {
        userFavorites = userFavorites.filter(id => id !== gameId);
        updateFavoritesUI();
        return false;
      });
  } else {
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
  if (!favoritesContainer) return;
  
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

// Utility Functions
function findGameById(id) {
  for (const row of gamesData) {
    const game = row.games.find(g => g.id === id);
    if (game) return game;
  }
  return null;
}

function createPinButton(gameId, isPinned = false) {
  const pinBtn = document.createElement('button');
  pinBtn.className = `pin-btn ${isPinned ? 'pinned' : ''}`;
  pinBtn.innerHTML = `<i class="bx ${isPinned ? 'bxs-bookmark' : 'bx-bookmark'}"></i>`;
  pinBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    togglePinGame(gameId, pinBtn.closest('.game-card'));
  };
  return pinBtn;
}

function createBannerElement(bannerType) {
  return `
    <div class="ribbon ${bannerType} ${bannerType === 'hot' ? 'pulse' : ''}">
      <i class='${getBannerIcon(bannerType)}'></i>
      ${bannerType.toUpperCase()}
    </div>
  `;
}

function getBannerIcon(type) {
  const icons = {
    hot: 'bx bx-hot',
    new: 'bx bx-star',
    popular: 'bx bx-trending-up'
  };
  return icons[type] || 'bx bx-info-circle';
}

// Authentication Functions
function updateUIForUser(user) {
  if (loginView) loginView.style.display = 'none';
  if (dashboardView) dashboardView.style.display = 'block';
  if (usernameDisplay) usernameDisplay.textContent = user.displayName || 'User';
  
  if (user.photoURL) {
    if (profilePic) profilePic.src = user.photoURL;
  }
  
  if (loginPrompt) loginPrompt.style.display = 'none';
  if (recentGamesList) recentGamesList.style.display = 'block';
}

function updateUIForGuest() {
  if (loginView) loginView.style.display = 'block';
  if (dashboardView) dashboardView.style.display = 'none';
  if (usernameDisplay) usernameDisplay.textContent = 'Guest';
  if (profilePic) profilePic.src = 'https://via.placeholder.com/40';
  
  if (loginPrompt) loginPrompt.style.display = 'block';
  if (recentGamesList) recentGamesList.style.display = 'none';
}

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

function signOut() {
  auth.signOut().catch((error) => {
    console.error('Sign out error:', error);
  });
}

function createUserDocument(user) {
  return db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    username: user.displayName || 'user' + user.uid.substring(0, 4),
    photoURL: user.photoURL || '',
    recentGames: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .catch((error) => {
    console.error('Error creating user document:', error);
  });
}

function loadUserData(userId) {
  db.collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        
        if (userData.username && usernameDisplay) {
          usernameDisplay.textContent = userData.username;
        }
        
        if (userData.photoURL && profilePic) {
          profilePic.src = userData.photoURL;
        }
      }
    })
    .catch((error) => {
      console.error('Error loading user data:', error);
    });
}

// Event Listeners
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

  // Google Sign-In
  if (signInButton) {
    signInButton.addEventListener('click', signInWithGoogle);
  }

  // Sign Out
  if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
  }
}

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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
