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
        description: "Modern multiplayer FPS with customizable weapons",
        staticImg: "https://img.gamedistribution.com/3dd9d03e0aec4e2bb0e00d711a45e2d1-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3dd9d03e0aec4e2bb0e00d711a45e2d1-512x512.jpeg",
        banner: "hot",
        url: "bullet-force.html"
      },
      {
        id: 2,
        title: "Cut the Rope",
        category: "puzzle",
        description: "Feed candy to Om Nom by cutting ropes strategically",
        staticImg: "https://img.gamedistribution.com/1a9e3708a2a44b2d843adb633d919e3a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1a9e3708a2a44b2d843adb633d919e3a-512x512.jpeg",
        banner: "popular",
        url: "cut-the-rope.html"
      },
      {
        id: 3,
        title: "Basketball Stars",
        category: "sports",
        description: "1-on-1 basketball with realistic physics",
        staticImg: "https://img.gamedistribution.com/4a3a8f5b3f7c4e3b8e3e3e3e3e3e3e3e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4a3a8f5b3f7c4e3b8e3e3e3e3e3e3e3e-512x512.jpeg",
        banner: "new",
        url: "basketball-stars.html"
      },
      {
        id: 4,
        title: "Agar.io",
        category: "io",
        description: "Grow your cell by eating smaller players",
        staticImg: "https://img.gamedistribution.com/8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b-512x512.jpeg",
        banner: "hot",
        url: "agario.html"
      },
      {
        id: 5,
        title: "Slither.io",
        category: "io",
        description: "Snake game with multiplayer competition",
        staticImg: "https://img.gamedistribution.com/9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b-512x512.jpeg",
        url: "slitherio.html"
      },
      {
        id: 6,
        title: "Zombie Derby",
        category: "action",
        description: "Zombie survival with vehicle combat",
        staticImg: "https://img.gamedistribution.com/2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a-512x512.jpeg",
        banner: "new",
        url: "zombie-derby.html"
      },
      {
        id: 7,
        title: "Sudoku",
        category: "puzzle",
        description: "Classic number puzzle game",
        staticImg: "https://img.gamedistribution.com/3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b-512x512.jpeg",
        url: "sudoku.html"
      },
      {
        id: 8,
        title: "Soccer Skills",
        category: "sports",
        description: "Test your soccer ball control abilities",
        staticImg: "https://img.gamedistribution.com/4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c-512x512.jpeg",
        banner: "popular",
        url: "soccer-skills.html"
      },
      {
        id: 9,
        title: "Tank Wars",
        category: "action",
        description: "Strategic tank battles with destructible terrain",
        staticImg: "https://img.gamedistribution.com/5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d-512x512.jpeg",
        url: "tank-wars.html"
      },
      {
        id: 10,
        title: "2048",
        category: "puzzle",
        description: "Combine tiles to reach the 2048 tile",
        staticImg: "https://img.gamedistribution.com/6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e-512x512.jpeg",
        banner: "hot",
        url: "2048.html"
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
        description: "Action-packed RPG with quests and loot",
        staticImg: "https://img.gamedistribution.com/7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f-512x512.jpeg",
        banner: "new",
        url: "epic-adventure.html"
      },
      {
        id: 12,
        title: "Brain Teaser",
        category: "puzzle",
        description: "Challenging puzzles to test your logic",
        staticImg: "https://img.gamedistribution.com/8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a-512x512.jpeg",
        banner: "new",
        url: "brain-teaser.html"
      },
      {
        id: 13,
        title: "Soccer Pro",
        category: "sports",
        description: "Realistic soccer simulation",
        staticImg: "https://img.gamedistribution.com/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-512x512.jpeg",
        banner: "new",
        url: "soccer-pro.html"
      },
      {
        id: 14,
        title: "WormZone.io",
        category: "io",
        description: "Grow your worm and dominate the arena",
        staticImg: "https://img.gamedistribution.com/1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d-512x512.jpeg",
        banner: "new",
        url: "wormzone.html"
      },
      {
        id: 15,
        title: "Zombie Shooter",
        category: "action",
        description: "First-person zombie survival game",
        staticImg: "https://img.gamedistribution.com/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-512x512.jpeg",
        banner: "hot",
        url: "zombie-shooter.html"
      },
      {
        id: 16,
        title: "Space Warriors",
        category: "action",
        description: "Intergalactic battles with spaceships",
        staticImg: "https://img.gamedistribution.com/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f-512x512.jpeg",
        url: "space-warriors.html"
      },
      {
        id: 17,
        title: "Ninja Combat",
        category: "action",
        description: "Stealth-based ninja fighting game",
        staticImg: "https://img.gamedistribution.com/4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a-512x512.jpeg",
        banner: "popular",
        url: "ninja-combat.html"
      },
      {
        id: 18,
        title: "Cyber Strike",
        category: "action",
        description: "Futuristic cyberpunk shooter",
        staticImg: "https://img.gamedistribution.com/5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b-512x512.jpeg",
        url: "cyber-strike.html"
      },
      {
        id: 19,
        title: "Jigsaw Master",
        category: "puzzle",
        description: "Beautiful jigsaw puzzles with custom pieces",
        staticImg: "https://img.gamedistribution.com/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-512x512.jpeg",
        url: "jigsaw-master.html"
      },
      {
        id: 20,
        title: "Memory Challenge",
        category: "puzzle",
        description: "Test and improve your memory skills",
        staticImg: "https://img.gamedistribution.com/7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d-512x512.jpeg",
        banner: "new",
        url: "memory-challenge.html"
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
        description: "Special forces tactical shooter",
        staticImg: "https://img.gamedistribution.com/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-512x512.jpeg",
        banner: "new",
        url: "commando-raid.html"
      },
      {
        id: 22,
        title: "Street Fighter",
        category: "action",
        description: "Classic arcade fighting game",
        staticImg: "https://img.gamedistribution.com/9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f-512x512.jpeg",
        banner: "popular",
        url: "street-fighter.html"
      },
      {
        id: 23,
        title: "Warzone Legends",
        category: "action",
        description: "Large-scale multiplayer battles",
        staticImg: "https://img.gamedistribution.com/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a-512x512.jpeg",
        url: "warzone-legends.html"
      },
      {
        id: 24,
        title: "Shadow Strike",
        category: "action",
        description: "Stealth assassination missions",
        staticImg: "https://img.gamedistribution.com/2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b-512x512.jpeg",
        banner: "hot",
        url: "shadow-strike.html"
      },
      {
        id: 25,
        title: "Dragon Slayer",
        category: "action",
        description: "Epic fantasy action RPG",
        staticImg: "https://img.gamedistribution.com/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c-512x512.jpeg",
        url: "dragon-slayer.html"
      },
      {
        id: 26,
        title: "Space Invaders",
        category: "action",
        description: "Classic arcade alien shooter",
        staticImg: "https://img.gamedistribution.com/4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d-512x512.jpeg",
        banner: "new",
        url: "space-invaders.html"
      },
      {
        id: 27,
        title: "Zombie Apocalypse",
        category: "action",
        description: "Survive against hordes of zombies",
        staticImg: "https://img.gamedistribution.com/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e-512x512.jpeg",
        url: "zombie-apocalypse.html"
      },
      {
        id: 28,
        title: "Battle Royale",
        category: "action",
        description: "Last-player-standing shooter",
        staticImg: "https://img.gamedistribution.com/6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f-512x512.jpeg",
        banner: "popular",
        url: "battle-royale.html"
      },
      {
        id: 29,
        title: "Stealth Ops",
        category: "action",
        description: "Infiltrate enemy bases undetected",
        staticImg: "https://img.gamedistribution.com/7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a-512x512.jpeg",
        url: "stealth-ops.html"
      },
      {
        id: 30,
        title: "Super Soldier",
        category: "action",
        description: "Enhanced soldier combat simulator",
        staticImg: "https://img.gamedistribution.com/8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b-512x512.jpeg",
        banner: "hot",
        url: "super-soldier.html"
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
        description: "Fit blocks together to clear lines",
        staticImg: "https://img.gamedistribution.com/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-512x512.jpeg",
        banner: "popular",
        url: "block-puzzle.html"
      },
      {
        id: 32,
        title: "Sudoku Pro",
        category: "puzzle",
        description: "Advanced Sudoku with multiple difficulty levels",
        staticImg: "https://img.gamedistribution.com/1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d-512x512.jpeg",
        url: "sudoku-pro.html"
      },
      {
        id: 33,
        title: "Word Search",
        category: "puzzle",
        description: "Find hidden words in letter grids",
        staticImg: "https://img.gamedistribution.com/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-512x512.jpeg",
        banner: "new",
        url: "word-search.html"
      },
      {
        id: 34,
        title: "Crossword",
        category: "puzzle",
        description: "Classic crossword puzzle game",
        staticImg: "https://img.gamedistribution.com/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f-512x512.jpeg",
        url: "crossword.html"
      },
      {
        id: 35,
        title: "Jewel Match",
        category: "puzzle",
        description: "Match colorful jewels to score points",
        staticImg: "https://img.gamedistribution.com/4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a-512x512.jpeg",
        banner: "hot",
        url: "jewel-match.html"
      },
      {
        id: 36,
        title: "Pipe Dream",
        category: "puzzle",
        description: "Connect pipes to create a continuous flow",
        staticImg: "https://img.gamedistribution.com/5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b-512x512.jpeg",
        url: "pipe-dream.html"
      },
      {
        id: 37,
        title: "Mahjong Solitaire",
        category: "puzzle",
        description: "Classic tile matching game",
        staticImg: "https://img.gamedistribution.com/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-512x512.jpeg",
        banner: "popular",
        url: "mahjong-solitaire.html"
      },
      {
        id: 38,
        title: "Tetris Blitz",
        category: "puzzle",
        description: "Fast-paced Tetris with power-ups",
        staticImg: "https://img.gamedistribution.com/7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d-512x512.jpeg",
        url: "tetris-blitz.html"
      },
      {
        id: 39,
        title: "Candy Crush",
        category: "puzzle",
        description: "Popular match-3 candy game",
        staticImg: "https://img.gamedistribution.com/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-512x512.jpeg",
        banner: "hot",
        url: "candy-crush.html"
      },
      {
        id: 40,
        title: "Bubble Shooter",
        category: "puzzle",
        description: "Shoot bubbles to make matches",
        staticImg: "https://img.gamedistribution.com/9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f-512x512.jpeg",
        url: "bubble-shooter.html"
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
        description: "Realistic basketball simulation",
        staticImg: "https://img.gamedistribution.com/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a-512x512.jpeg",
        banner: "hot",
        url: "basketball-pro.html"
      },
      {
        id: 42,
        title: "Football Legends",
        category: "sports",
        description: "Play as football superstars",
        staticImg: "https://img.gamedistribution.com/2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b-512x512.jpeg",
        banner: "popular",
        url: "football-legends.html"
      },
      {
        id: 43,
        title: "Tennis Championship",
        category: "sports",
        description: "Compete in grand slam tournaments",
        staticImg: "https://img.gamedistribution.com/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c-512x512.jpeg",
        banner: "new",
        url: "tennis-championship.html"
      },
      {
        id: 44,
        title: "Golf Masters",
        category: "sports",
        description: "Realistic golf simulation",
        staticImg: "https://img.gamedistribution.com/4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d-512x512.jpeg",
        url: "golf-masters.html"
      },
      {
        id: 45,
        title: "Boxing Knockout",
        category: "sports",
        description: "Intense boxing matches",
        staticImg: "https://img.gamedistribution.com/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e-512x512.jpeg",
        banner: "hot",
        url: "boxing-knockout.html"
      },
      {
        id: 46,
        title: "Hockey Shootout",
        category: "sports",
        description: "Fast-paced hockey action",
        staticImg: "https://img.gamedistribution.com/6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f-512x512.jpeg",
        url: "hockey-shootout.html"
      },
      {
        id: 47,
        title: "Baseball Pro",
        category: "sports",
        description: "Realistic baseball simulation",
        staticImg: "https://img.gamedistribution.com/7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a-512x512.jpeg",
        banner: "new",
        url: "baseball-pro.html"
      },
      {
        id: 48,
        title: "Soccer Manager",
        category: "sports",
        description: "Build and manage your soccer team",
        staticImg: "https://img.gamedistribution.com/8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b-512x512.jpeg",
        url: "soccer-manager.html"
      },
      {
        id: 49,
        title: "Cricket Challenge",
        category: "sports",
        description: "Realistic cricket simulation",
        staticImg: "https://img.gamedistribution.com/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-512x512.jpeg",
        banner: "popular",
        url: "cricket-challenge.html"
      },
      {
        id: 50,
        title: "Extreme Skate",
        category: "sports",
        description: "Perform skateboard tricks",
        staticImg: "https://img.gamedistribution.com/1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d-512x512.jpeg",
        url: "extreme-skate.html"
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
        description: "Upgrade your tank and dominate",
        staticImg: "https://img.gamedistribution.com/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-512x512.jpeg",
        banner: "hot",
        url: "diepio.html"
      },
      {
        id: 52,
        title: "Moomoo.io",
        category: "io",
        description: "Build, gather resources, and survive",
        staticImg: "https://img.gamedistribution.com/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f-512x512.jpeg",
        url: "moomooio.html"
      },
      {
        id: 53,
        title: "Krunker.io",
        category: "io",
        description: "Fast-paced FPS in browser",
        staticImg: "https://img.gamedistribution.com/4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a-512x512.jpeg",
        banner: "popular",
        url: "krunkerio.html"
      },
      {
        id: 54,
        title: "Surviv.io",
        category: "io",
        description: "Battle royale in 2D",
        staticImg: "https://img.gamedistribution.com/5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b-512x512.jpeg",
        banner: "new",
        url: "survivio.html"
      },
      {
        id: 55,
        title: "ZombsRoyale.io",
        category: "io",
        description: "Battle royale with building mechanics",
        staticImg: "https://img.gamedistribution.com/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-512x512.jpeg",
        url: "zombsroyaleio.html"
      },
      {
        id: 56,
        title: "Bonk.io",
        category: "io",
        description: "Physics-based multiplayer battles",
        staticImg: "https://img.gamedistribution.com/7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d-512x512.jpeg",
        banner: "hot",
        url: "bonkio.html"
      },
      {
        id: 57,
        title: "Skribbl.io",
        category: "io",
        description: "Multiplayer drawing and guessing",
        staticImg: "https://img.gamedistribution.com/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-512x512.jpeg",
        url: "skribblio.html"
      },
      {
        id: 58,
        title: "Paper.io",
        category: "io",
        description: "Claim territory and conquer others",
        staticImg: "https://img.gamedistribution.com/9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f-512x512.jpeg",
        banner: "new",
        url: "paperio.html"
      },
      {
        id: 59,
        title: "Wings.io",
        category: "io",
        description: "Aerial combat with planes",
        staticImg: "https://img.gamedistribution.com/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a-512x512.jpeg",
        url: "wingsio.html"
      },
      {
        id: 60,
        title: "Spinz.io",
        category: "io",
        description: "Spin and knock out other players",
        staticImg: "https://img.gamedistribution.com/2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b-512x512.jpeg",
        gifImg: "https://img.gamedistribution.com/2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b-512x512.jpeg",
        banner: "popular",
        url: "spinzio.html"
      }
    ]
  }
];

// Make games data available globally for pack.html
window.gamesData = gamesData;

// Flatten all games into one object for easy lookup
const allGames = {};
gamesData.forEach(category => {
    category.games.forEach(game => {
        allGames[game.id] = game;
    });
});

// DOM Elements
const gamesContainer = document.getElementById('gamesContainer') || null;
const tabBtns = document.querySelectorAll('.tab-btn') || [];
const searchInput = document.getElementById('searchInput') || null;
const pinnedGamesContainer = document.getElementById('pinnedGamesContainer') || null;
const pinnedGamesRow = document.querySelector('.pinned-games-row') || null;
const clearPinsBtn = document.querySelector('.clear-pins') || null;
const hamburger = document.querySelector('.hamburger') || null;
const navbar = document.querySelector('.navbar') || null;
const navLinks = document.querySelectorAll('.nav-link') || [];
const glowEffect = document.querySelector('.glow-effect') || null;
const favoritesContainer = document.getElementById('favoritesContainer') || null;
const signInButton = document.getElementById('signInButton') || null;
const signOutButton = document.getElementById('signOutButton') || null;
const usernameDisplay = document.getElementById('username-display') || null;
const profilePic = document.getElementById('profile-pic') || null;
const loginView = document.getElementById('login-view') || null;
const dashboardView = document.getElementById('dashboard-view') || null;
const dashboardUsername = document.getElementById('dashboard-username') || null;
const updateUsernameBtn = document.getElementById('update-username-btn') || null;
const newUsernameInput = document.getElementById('new-username') || null;
const profilePicUpload = document.getElementById('profile-pic-upload') || null;
const updateProfilePicBtn = document.getElementById('update-profile-pic-btn') || null;
const profilePicPreview = document.getElementById('profile-pic-preview') || null;

// State Management
let currentCategory = 'all';
let currentSearchTerm = '';
let currentUser = null;
let userFavorites = [];

// Initialize Application
function init() {
    setupEventListeners();
    if (navbar) setupNavbar();
    if (gamesContainer) renderAllGameRows();
    
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

// Render favorites page
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
    if (!gamesContainer) return;
    
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
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
        updateGlowEffect(navLinks[0]);
    }

    // Toggle navbar visibility
    if (hamburger) {
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
    }

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
    if (!element || !glowEffect) return;
    
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
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            renderAllGameRows(category, searchInput ? searchInput.value : '');
        });
    });
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeCategory = document.querySelector('.tab-btn.active').dataset.category;
            renderAllGameRows(activeCategory, searchInput.value);
        });
    }

    // Clear pins button
    if (clearPinsBtn) {
        clearPinsBtn.addEventListener('click', clearAllPins);
    }

    // Sign in/out buttons
    if (signInButton) {
        signInButton.addEventListener('click', signInWithGoogle);
    }
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }

    // Profile update buttons
    if (updateUsernameBtn) {
        updateUsernameBtn.addEventListener('click', updateUsername);
    }
    if (updateProfilePicBtn) {
        updateProfilePicBtn.addEventListener('click', updateProfilePic);
    }
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

// Create a favorite game card for favorites page
function createFavoriteGameCard(game) {
    const card = document.createElement('div');
    card.className = 'favorite-game-card';
    card.dataset.id = game.id;
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container">
                ${game.banner ? createBannerElement(game.banner) : ''}
                <div class="game-category-badge category-${game.category}">${game.category}</div>
                <img src="${game.staticImg}" class="game-thumbnail" alt="${game.title}">
                <div class="game-overlay">
                    <button class="remove-favorite-btn">
                        <i class='bx bx-trash'></i> Remove
                    </button>
                </div>
            </div>
            <div class="game-info">
                <div class="game-title">${game.title}</div>
            </div>
        </a>
    `;
    
    card.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(game.id).then(() => {
            card.remove();
            if (!favoritesContainer.querySelector('.favorite-game-card')) {
                favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
            }
        });
    });
    
    return card;
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
    auth.signOut()
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            console.error('Sign out error:', error);
        });
}

// Update UI for authenticated user
function updateUIForUser(user) {
    if (usernameDisplay) usernameDisplay.textContent = user.displayName || 'User';
    if (profilePic && user.photoURL) profilePic.src = user.photoURL;
    if (dashboardUsername) dashboardUsername.textContent = user.displayName || 'User';
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
}

// Update UI for guest
function updateUIForGuest() {
    if (usernameDisplay) usernameDisplay.textContent = 'Guest';
    if (profilePic) profilePic.src = 'https://via.placeholder.com/40';
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
}

// Create user document in Firestore
function createUserDocument(user) {
    return db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        username: user.displayName || 'user' + user.uid.substring(0, 4),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Load user data
function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (newUsernameInput) newUsernameInput.placeholder = userData.username || 'User';
            }
        })
        .catch((error) => {
            console.error('Error loading user data:', error);
        });
}

// Update username
function updateUsername() {
    const newUsername = newUsernameInput.value.trim();
    if (!newUsername || !currentUser) return;

    db.collection('users').doc(currentUser.uid).update({
        username: newUsername
    })
    .then(() => {
        alert('Username updated successfully!');
        if (usernameDisplay) usernameDisplay.textContent = newUsername;
        if (dashboardUsername) dashboardUsername.textContent = newUsername;
        newUsernameInput.value = '';
    })
    .catch((error) => {
        console.error('Error updating username:', error);
        alert('Failed to update username. Please try again.');
    });
}

// Update profile picture
function updateProfilePic() {
    if (!profilePicUpload.files[0] || !currentUser) return;

    const file = profilePicUpload.files[0];
    const storageRef = firebase.storage().ref(`profile_pics/${currentUser.uid}`);
    
    storageRef.put(file)
        .then((snapshot) => {
            return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
            return currentUser.updateProfile({
                photoURL: downloadURL
            });
        })
        .then(() => {
            if (profilePic) profilePic.src = currentUser.photoURL;
            if (profilePicPreview) profilePicPreview.src = currentUser.photoURL;
            alert('Profile picture updated successfully!');
        })
        .catch((error) => {
            console.error('Error updating profile picture:', error);
            alert('Failed to update profile picture. Please try again.');
        });
}

// Clear all pinned games
function clearAllPins() {
    if (!currentUser || !confirm('Are you sure you want to clear all pinned games?')) return;

    const batch = db.batch();
    const pinsRef = db.collection('users').doc(currentUser.uid).collection('favorites');

    pinsRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            userFavorites = [];
            updateFavoritesUI();
            if (pinnedGamesRow) pinnedGamesRow.innerHTML = '<p class="no-pins">No pinned games yet.</p>';
        })
        .catch((error) => {
            console.error('Error clearing pins:', error);
            alert('Failed to clear pinned games. Please try again.');
        });
}

// Initialize the app
if (gamesContainer || favoritesContainer) {
    init();
}
