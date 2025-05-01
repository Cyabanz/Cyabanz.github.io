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

// DOM Elements
const authContainer = document.getElementById('auth-container');
const gamesContainer = document.getElementById('gamesContainer');
const pinnedGamesContainer = document.getElementById('pinnedGamesContainer');
const pinnedGamesRow = document.querySelector('.pinned-games-row');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.querySelectorAll('.tab-btn');
const clearPinsBtn = document.querySelector('.clear-pins');
const settingsBtn = document.getElementById('settings-btn');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const glowEffect = document.querySelector('.glow-effect');

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
    }
    // Add more games as needed
];

// Global Variables
let currentUser = null;
let pinnedGames = [];
let activeCategory = 'all';
let panicKeyListener = null;
let particles = [];
let particleCanvas, particleCtx;
let settingsUnsubscribe = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
    loadGames();
});

function initEventListeners() {
    // Navbar hover effects
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
        // User is signed in
        authContainer.style.display = 'none';
        setupSettingsListener(user.uid);
        loadPinnedGames(user.uid);
    } else {
        // No user signed in
        showAuthUI();
        if (settingsUnsubscribe) settingsUnsubscribe();
        applyDefaultSettings();
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
    currentUser = { uid: 'guest', displayName: 'Guest' };
    authContainer.style.display = 'none';
    applyDefaultSettings();
}

function setupSettingsListener(userId) {
    if (settingsUnsubscribe) settingsUnsubscribe();
    
    settingsUnsubscribe = db.collection('users').doc(userId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const settings = doc.data().settings || {};
                applySettings(settings);
                // Cache settings in localStorage
                saveSettingsToLocalStorage(settings);
            }
        }, (error) => {
            console.error("Settings listener error:", error);
            // Fallback to cached settings
            applySettingsFromLocalStorage();
        });
}

function applySettings(settings) {
    // Theme
    document.body.className = settings.theme || '';
    
    // Background Image
    if (settings.backgroundImage) {
        document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    } else {
        document.body.style.backgroundImage = 'none';
    }
    
    // Particles
    if (settings.particlesEnabled) {
        initParticles(settings);
    } else {
        destroyParticles();
    }
    
    // Panic Key
    setupPanicKey(settings.panicKey, settings.panicUrl);
}

function applyDefaultSettings() {
    document.body.className = '';
    document.body.style.backgroundImage = 'none';
    destroyParticles();
    if (panicKeyListener) {
        document.removeEventListener('keydown', panicKeyListener);
        panicKeyListener = null;
    }
}

function saveSettingsToLocalStorage(settings) {
    for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
            localStorage.setItem(key, settings[key]);
        }
    }
}

function applySettingsFromLocalStorage() {
    const settings = {
        theme: localStorage.getItem('theme'),
        backgroundImage: localStorage.getItem('backgroundImage'),
        particlesEnabled: localStorage.getItem('particlesEnabled'),
        panicKey: localStorage.getItem('panicKey'),
        panicUrl: localStorage.getItem('panicUrl')
        // Add other settings as needed
    };
    applySettings(settings);
}

function setupPanicKey(key, url) {
    if (panicKeyListener) {
        document.removeEventListener('keydown', panicKeyListener);
    }
    
    if (key && url) {
        panicKeyListener = function(e) {
            if (e.key === key) {
                window.location.href = url;
            }
        };
        document.addEventListener('keydown', panicKeyListener);
    }
}

/* Particle System */
function initParticles(settings) {
    if (particleCanvas) return;
    
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
    const count = parseInt(settings.particleCount) || 50;
    const speed = parseInt(settings.particleSpeed) || 3;
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
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            color: colors[Math.floor(Math.random() * colors.length)]
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
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        particleCtx.fill();
    }
    
    requestAnimationFrame(animateParticles);
}

function destroyParticles() {
    if (particleCanvas) {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        window.removeEventListener('resize', resizeCanvas);
    }
}

/* Game Functions */
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
