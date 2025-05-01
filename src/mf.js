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
const storage = firebase.storage();

// DOM Elements
const authContainer = document.getElementById('auth-container');
const settingsBtn = document.getElementById('settings-btn');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const glowEffect = document.querySelector('.glow-effect');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.querySelectorAll('.tab-btn');
const gamesContainer = document.getElementById('gamesContainer');
const pinnedGamesContainer = document.getElementById('pinnedGamesContainer');
const pinnedGamesRow = document.querySelector('.pinned-games-row');
const clearPinsBtn = document.querySelector('.clear-pins');

// Game Data
const games = [
    {
        id: 'slither-io',
        title: 'Slither.io',
        image: 'https://crazygames.com/gamelogo/slither-io-1568181024495.png',
        url: 'https://slither.io',
        category: 'io',
        description: 'Play the popular multiplayer snake game'
    },
    {
        id: 'agar-io',
        title: 'Agar.io',
        image: 'https://crazygames.com/gamelogo/agar-io-1568181024495.png',
        url: 'https://agar.io',
        category: 'io',
        description: 'Absorb smaller cells to grow larger'
    },
    {
        id: 'happy-wheels',
        title: 'Happy Wheels',
        image: 'https://crazygames.com/gamelogo/happy-wheels-1568181024495.png',
        url: 'https://happywheels.com',
        category: 'action',
        description: 'Ragdoll physics racing game'
    },
    {
        id: '2048',
        title: '2048',
        image: 'https://crazygames.com/gamelogo/2048-1568181024495.png',
        url: 'https://2048game.com',
        category: 'puzzle',
        description: 'Slide tiles to combine them and reach 2048'
    },
    {
        id: 'basketball-stars',
        title: 'Basketball Stars',
        image: 'https://crazygames.com/gamelogo/basketball-stars-1568181024495.png',
        url: 'https://basketballstars.io',
        category: 'sports',
        description: '1v1 basketball multiplayer game'
    },
    {
        id: 'paper-io',
        title: 'Paper.io',
        image: 'https://crazygames.com/gamelogo/paper-io-1568181024495.png',
        url: 'https://paper-io.com',
        category: 'io',
        description: 'Claim territory and eliminate opponents'
    },
    {
        id: 'temple-run-2',
        title: 'Temple Run 2',
        image: 'https://crazygames.com/gamelogo/temple-run-2-1568181024495.png',
        url: 'https://templerun2.io',
        category: 'action',
        description: 'Endless runner game with obstacles'
    },
    {
        id: 'sudoku',
        title: 'Sudoku',
        image: 'https://crazygames.com/gamelogo/sudoku-1568181024495.png',
        url: 'https://sudoku.com',
        category: 'puzzle',
        description: 'Classic number puzzle game'
    }
];

// Global Variables
let currentUser = null;
let pinnedGames = [];
let activeCategory = 'all';
let panicKeyListener = null;
let particleCanvas, particleCtx, particles = [];
let activeTheme = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
    loadGames();
    initFromLocalStorage();
});

function initEventListeners() {
    // Navbar toggle
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', handleNavHover);
        link.addEventListener('mouseleave', resetGlow);
    });

    // Settings button
    settingsBtn.addEventListener('click', () => {
        window.location.href = 'settings.html';
    });

    // Search functionality
    searchInput.addEventListener('input', filterGames);

    // Category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.category;
            filterGames();
        });
    });

    // Clear pinned games
    clearPinsBtn.addEventListener('click', clearPinnedGames);
}

function handleAuthStateChange(user) {
    currentUser = user;
    if (user) {
        updateUIForUser(user);
        loadUserSettings(user.uid);
    } else {
        showAuthUI();
    }
}

function showAuthUI() {
    authContainer.innerHTML = `
        <div class="auth-box">
            <h3>Sign In</h3>
            <button id="google-signin" class="auth-btn google">
                <i class='bx bxl-google'></i> Continue with Google
            </button>
            <button id="guest-signin" class="auth-btn guest">
                <i class='bx bx-user'></i> Continue as Guest
            </button>
        </div>
    `;

    document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
    document.getElementById('guest-signin').addEventListener('click', signInAsGuest);
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error('Google sign-in error:', error);
    });
}

function signInAsGuest() {
    // Guest users will have limited functionality
    currentUser = { uid: 'guest', displayName: 'Guest' };
    updateUIForUser(currentUser);
    authContainer.style.display = 'none';
}

function updateUIForUser(user) {
    authContainer.style.display = 'none';
    
    // Load user-specific settings
    if (user.uid !== 'guest') {
        loadUserSettings(user.uid);
    }
    
    // Load pinned games
    if (user.uid !== 'guest') {
        loadPinnedGames(user.uid);
    }
}

function loadUserSettings(userId) {
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const settings = doc.data().settings || {};
                applySettings(settings);
            }
        })
        .catch(error => {
            console.error('Error loading settings:', error);
        });
}

function applySettings(settings) {
    // Apply theme
    if (settings.theme) {
        document.body.className = settings.theme;
        activeTheme = settings.theme;
    }
    
    // Apply background image
    if (settings.backgroundImage) {
        document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    } else if (activeTheme) {
        document.body.style.backgroundImage = 'none';
    }
    
    // Apply panic key
    if (settings.panicKey && settings.panicUrl) {
        if (panicKeyListener) {
            document.removeEventListener('keydown', panicKeyListener);
        }
        
        panicKeyListener = function(e) {
            if (e.key === settings.panicKey) {
                window.location.href = settings.panicUrl;
            }
        };
        
        document.addEventListener('keydown', panicKeyListener);
    }
    
    // Apply particle effects
    if (settings.particlesEnabled === true || settings.particlesEnabled === 'true') {
        initParticles(settings);
    } else {
        destroyParticles();
    }
}

function initParticles(settings) {
    particleCanvas = document.getElementById('particle-canvas');
    particleCtx = particleCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    createParticles(settings);
    animateParticles();
}

function resizeCanvas() {
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
}

function createParticles(settings) {
    const count = settings.particleCount || 50;
    const colors = [
        settings['particle-color-1'] || '#4361ee',
        settings['particle-color-2'] || '#f72585',
        settings['particle-color-3'] || '#4cc9f0'
    ];
    
    particles = [];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * (parseInt(settings.particleSpeed) || 3),
            speedY: (Math.random() - 0.5) * (parseInt(settings.particleSpeed) || 3),
            color: colors[Math.floor(Math.random() * colors.length)],
            type: settings.particleType || 'circle'
        });
    }
}

function animateParticles() {
    if (!particleCanvas) return;
    
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > particleCanvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.speedY *= -1;
        
        particleCtx.fillStyle = p.color;
        
        switch(p.type) {
            case 'star':
                drawStar(p.x, p.y, 5, p.size, p.size / 2);
                break;
            case 'triangle':
                drawTriangle(p.x, p.y, p.size);
                break;
            default:
                particleCtx.beginPath();
                particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                particleCtx.fill();
        }
    }
    
    requestAnimationFrame(animateParticles);
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    
    particleCtx.beginPath();
    particleCtx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        particleCtx.lineTo(x, y);
        rot += step;
        
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        particleCtx.lineTo(x, y);
        rot += step;
    }
    
    particleCtx.lineTo(cx, cy - outerRadius);
    particleCtx.closePath();
    particleCtx.fill();
}

function drawTriangle(x, y, size) {
    particleCtx.beginPath();
    particleCtx.moveTo(x, y - size);
    particleCtx.lineTo(x + size, y + size);
    particleCtx.lineTo(x - size, y + size);
    particleCtx.closePath();
    particleCtx.fill();
}

function destroyParticles() {
    if (particleCanvas) {
        particleCanvas.width = 0;
        particleCanvas.height = 0;
        window.removeEventListener('resize', resizeCanvas);
    }
}

function initFromLocalStorage() {
    // Load any locally stored settings that need to be applied immediately
    const theme = localStorage.getItem('theme');
    if (theme) {
        document.body.className = theme;
        activeTheme = theme;
    }
    
    const bgImage = localStorage.getItem('backgroundImage');
    if (bgImage) {
        document.body.style.backgroundImage = `url(${bgImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

// Game Functions
function loadGames() {
    gamesContainer.innerHTML = '';
    
    // Group games by category
    const gamesByCategory = {};
    games.forEach(game => {
        if (!gamesByCategory[game.category]) {
            gamesByCategory[game.category] = [];
        }
        gamesByCategory[game.category].push(game);
    });
    
    // Create rows for each category
    for (const category in gamesByCategory) {
        const row = document.createElement('div');
        row.className = 'game-row';
        
        const rowTitle = document.createElement('h3');
        rowTitle.className = 'row-title';
        
        // Set appropriate icon for each category
        let iconClass = 'bx bx-game';
        switch(category) {
            case 'action': iconClass = 'bx bx-run'; break;
            case 'puzzle': iconClass = 'bx bx-puzzle'; break;
            case 'sports': iconClass = 'bx bx-football'; break;
            case 'io': iconClass = 'bx bx-globe'; break;
        }
        
        rowTitle.innerHTML = `<i class='${iconClass}'></i> ${category.charAt(0).toUpperCase() + category.slice(1)} Games`;
        row.appendChild(rowTitle);
        
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'game-scroll-container';
        
        const grid = document.createElement('div');
        grid.className = 'horizontal-game-grid';
        
        gamesByCategory[category].forEach(game => {
            const gameCard = createGameCard(game);
            grid.appendChild(gameCard);
        });
        
        scrollContainer.appendChild(grid);
        row.appendChild(scrollContainer);
        gamesContainer.appendChild(row);
    }
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;
    card.dataset.category = game.category;
    
    const img = document.createElement('img');
    img.src = game.image;
    img.alt = game.title;
    
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    
    const title = document.createElement('h4');
    title.textContent = game.title;
    
    const desc = document.createElement('p');
    desc.textContent = game.description;
    
    const pinBtn = document.createElement('button');
    pinBtn.className = 'pin-btn';
    pinBtn.innerHTML = '<i class="bx bx-bookmark-alt"></i>';
    pinBtn.title = 'Pin this game';
    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePinnedGame(game);
    });
    
    overlay.appendChild(title);
    overlay.appendChild(desc);
    overlay.appendChild(pinBtn);
    
    card.appendChild(img);
    card.appendChild(overlay);
    
    card.addEventListener('click', () => {
        window.open(game.url, '_blank');
    });
    
    return card;
}

function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    
    document.querySelectorAll('.game-card').forEach(card => {
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const matchesSearch = card.querySelector('h4').textContent.toLowerCase().includes(searchTerm);
        
        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleNavHover(e) {
    const color = e.target.dataset.glowColor;
    const iconRect = e.target.querySelector('i').getBoundingClientRect();
    
    glowEffect.style.left = `${iconRect.left + iconRect.width / 2}px`;
    glowEffect.style.top = `${iconRect.top + iconRect.height / 2}px`;
    glowEffect.style.backgroundColor = color;
    glowEffect.style.opacity = '1';
    glowEffect.style.transform = 'scale(10)';
}

function resetGlow() {
    glowEffect.style.opacity = '0';
    glowEffect.style.transform = 'scale(1)';
}

function loadPinnedGames(userId) {
    if (userId === 'guest') return;
    
    db.collection('pinnedGames').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                pinnedGames = doc.data().games || [];
                updatePinnedGamesDisplay();
            }
        })
        .catch(error => {
            console.error('Error loading pinned games:', error);
        });
}

function togglePinnedGame(game) {
    if (!currentUser || currentUser.uid === 'guest') {
        alert('Please sign in to pin games');
        return;
    }
    
    const index = pinnedGames.findIndex(g => g.id === game.id);
    
    if (index === -1) {
        pinnedGames.push(game);
    } else {
        pinnedGames.splice(index, 1);
    }
    
    // Update Firebase
    db.collection('pinnedGames').doc(currentUser.uid).set({
        games: pinnedGames
    }).catch(error => {
        console.error('Error updating pinned games:', error);
    });
    
    updatePinnedGamesDisplay();
}

function updatePinnedGamesDisplay() {
    pinnedGamesContainer.innerHTML = '';
    
    if (pinnedGames.length > 0) {
        pinnedGamesRow.style.display = 'block';
        
        pinnedGames.forEach(game => {
            const gameCard = createGameCard(game);
            pinnedGamesContainer.appendChild(gameCard);
        });
    } else {
        pinnedGamesRow.style.display = 'none';
    }
}

function clearPinnedGames() {
    if (!currentUser || currentUser.uid === 'guest') return;
    
    if (confirm('Are you sure you want to clear all pinned games?')) {
        pinnedGames = [];
        db.collection('pinnedGames').doc(currentUser.uid).update({
            games: []
        }).catch(error => {
            console.error('Error clearing pinned games:', error);
        });
        
        updatePinnedGamesDisplay();
    }
}
