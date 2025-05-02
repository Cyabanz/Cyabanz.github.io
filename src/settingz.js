// theme-sync.js - Cross-platform theme and settings synchronization

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

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const body = document.body;
const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
favicon.rel = 'icon';
document.head.appendChild(favicon);

// Global Variables
let currentTheme = '';
let panicKeyListener = null;
let particles = [];
let particleCanvas, particleCtx;
let unsubscribeSettings = null;

// Initialize the theme sync
document.addEventListener('DOMContentLoaded', function() {
  initAuthStateListener();
});

// Initialize auth state listener
function initAuthStateListener() {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in - use Firestore for cross-device sync
      syncUserSettings(user.uid);
    } else {
      // User is not signed in - fall back to localStorage (single device only)
      initFromLocalStorage();
      
      // Clear any Firestore listener if it exists
      if (unsubscribeSettings) {
        unsubscribeSettings();
        unsubscribeSettings = null;
      }
    }
  });
}

// Sync user settings from Firestore with real-time updates
function syncUserSettings(userId) {
  // Unsubscribe from any existing listener
  if (unsubscribeSettings) {
    unsubscribeSettings();
  }

  // Subscribe to real-time updates
  unsubscribeSettings = db.collection('users').doc(userId)
    .onSnapshot(doc => {
      if (doc.exists) {
        const settings = doc.data().settings || {};
        applySettings(settings);
        
        // Also update localStorage for offline support
        cacheSettingsLocally(settings);
      }
    }, error => {
      console.error('Error listening to settings:', error);
      
      // Fall back to localStorage if Firestore fails
      initFromLocalStorage();
    });
}

// Apply settings from Firestore
function applySettings(settings) {
  // Theme
  if (settings.theme) {
    applyTheme(settings.theme);
  } else {
    resetTheme();
  }

  // Background Image
  if (settings.backgroundImage) {
    applyBackgroundImage(settings.backgroundImage);
  } else {
    resetBackground();
  }

  // Tab Cloak
  if (settings.cloakUrl) {
    applyTabCloak(settings.cloakUrl);
  } else {
    resetTabCloak();
  }

  // Particles
  if (settings.particlesEnabled === true || settings.particlesEnabled === 'true') {
    initParticles(settings);
  } else {
    destroyParticles();
  }

  // Panic Key
  if (settings.panicKey && settings.panicUrl) {
    setupPanicKey(settings.panicKey, settings.panicUrl);
  } else {
    resetPanicKey();
  }
}

// Cache settings in localStorage for offline support
function cacheSettingsLocally(settings) {
  if (settings.theme) {
    localStorage.setItem('theme', settings.theme);
  } else {
    localStorage.removeItem('theme');
  }

  if (settings.backgroundImage) {
    localStorage.setItem('backgroundImage', settings.backgroundImage);
  } else {
    localStorage.removeItem('backgroundImage');
  }

  if (settings.cloakUrl) {
    localStorage.setItem('cloakUrl', settings.cloakUrl);
  } else {
    localStorage.removeItem('cloakUrl');
  }

  if (settings.particlesEnabled) {
    localStorage.setItem('particlesEnabled', settings.particlesEnabled);
    localStorage.setItem('particleCount', settings.particleCount || '50');
    localStorage.setItem('particleSpeed', settings.particleSpeed || '3');
    localStorage.setItem('particleType', settings.particleType || 'circle');
    localStorage.setItem('particle-color-1', settings['particle-color-1'] || '#4361ee');
    localStorage.setItem('particle-color-2', settings['particle-color-2'] || '#f72585');
    localStorage.setItem('particle-color-3', settings['particle-color-3'] || '#4cc9f0');
  } else {
    localStorage.removeItem('particlesEnabled');
  }

  if (settings.panicKey && settings.panicUrl) {
    localStorage.setItem('panicKey', settings.panicKey);
    localStorage.setItem('panicUrl', settings.panicUrl);
  } else {
    localStorage.removeItem('panicKey');
    localStorage.removeItem('panicUrl');
  }
}

// Load settings from localStorage
function initFromLocalStorage() {
  // Theme
  const theme = localStorage.getItem('theme');
  if (theme) {
    applyTheme(theme);
  } else {
    resetTheme();
  }

  // Background Image
  const bgImage = localStorage.getItem('backgroundImage');
  if (bgImage) {
    applyBackgroundImage(bgImage);
  } else {
    resetBackground();
  }

  // Tab Cloak
  const cloakUrl = localStorage.getItem('cloakUrl');
  if (cloakUrl) {
    applyTabCloak(cloakUrl);
  } else {
    resetTabCloak();
  }

  // Particles
  const particlesEnabled = localStorage.getItem('particlesEnabled') === 'true';
  if (particlesEnabled) {
    initParticles({
      particleCount: localStorage.getItem('particleCount') || '50',
      particleSpeed: localStorage.getItem('particleSpeed') || '3',
      particleType: localStorage.getItem('particleType') || 'circle',
      'particle-color-1': localStorage.getItem('particle-color-1') || '#4361ee',
      'particle-color-2': localStorage.getItem('particle-color-2') || '#f72585',
      'particle-color-3': localStorage.getItem('particle-color-3') || '#4cc9f0'
    });
  } else {
    destroyParticles();
  }

  // Panic Key
  const panicKey = localStorage.getItem('panicKey');
  const panicUrl = localStorage.getItem('panicUrl');
  if (panicKey && panicUrl) {
    setupPanicKey(panicKey, panicUrl);
  } else {
    resetPanicKey();
  }
}

// Theme Management
function applyTheme(theme) {
  if (!theme || theme === currentTheme) return;
  
  // Remove all theme classes
  body.className = '';
  currentTheme = theme;
  
  // Add the selected theme class
  body.classList.add(theme);
}

function resetTheme() {
  body.className = '';
  currentTheme = '';
}

// Background Image Management
function applyBackgroundImage(url) {
  if (!url) return;
  
  body.style.backgroundImage = `url(${url})`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
  body.style.backgroundAttachment = 'fixed';
  
  // Remove any theme classes when background image is applied
  resetTheme();
}

function resetBackground() {
  body.style.backgroundImage = 'none';
}

// Tab Cloaker
function applyTabCloak(url) {
  if (!url) return;
  
  // Determine the site type from the URL
  let siteType = 'custom';
  if (url.includes('classroom.google.com')) siteType = 'google';
  else if (url.includes('clever.com')) siteType = 'clever';
  else if (url.includes('drive.google.com')) siteType = 'drive';
  else if (url.includes('docs.google.com')) siteType = 'docs';
  
  // Update title
  document.title = getCloakTitle(siteType);
  
  // Update favicon
  updateFavicon(siteType);
}

function getCloakTitle(site) {
  const titles = {
    'google': 'Google Classroom',
    'clever': 'Clever | Portal',
    'drive': 'My Drive - Google Drive',
    'docs': 'Google Docs'
  };
  return titles[site] || 'My School';
}

function updateFavicon(site) {
  const icons = {
    'google': 'https://www.google.com/favicon.ico',
    'clever': 'https://clever.com/favicon.ico',
    'drive': 'https://drive.google.com/favicon.ico',
    'docs': 'https://docs.google.com/favicon.ico'
  };
  
  favicon.href = icons[site] || '/favicon.ico';
}

function resetTabCloak() {
  document.title = 'GameHub - CrazyGames Clone';
  favicon.href = '/favicon.ico';
}

// Panic Key System
function setupPanicKey(key, url) {
  // Remove existing listener if any
  resetPanicKey();

  if (!key || !url) return;

  panicKeyListener = function(e) {
    if (e.key === key) {
      window.location.href = url;
    }
  };
  
  document.addEventListener('keydown', panicKeyListener);
}

function resetPanicKey() {
  if (panicKeyListener) {
    document.removeEventListener('keydown', panicKeyListener);
    panicKeyListener = null;
  }
}

// Particle Effects System
function initParticles(settings) {
  if (particleCanvas) return;
  
  // Create canvas for particles
  particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'particle-canvas';
  particleCanvas.style.position = 'fixed';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.width = '100%';
  particleCanvas.style.height = '100%';
  particleCanvas.style.pointerEvents = 'none';
  particleCanvas.style.zIndex = '-1';
  document.body.appendChild(particleCanvas);
  
  particleCtx = particleCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  createParticles(settings);
  animateParticles();
}

function resizeCanvas() {
  if (!particleCanvas) return;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function createParticles(settings) {
  const count = parseInt(settings.particleCount) || 50;
  const type = settings.particleType || 'circle';
  const speed = parseInt(settings.particleSpeed) || 3;
  
  // Get colors from settings or use defaults
  const color1 = settings['particle-color-1'] || '#4361ee';
  const color2 = settings['particle-color-2'] || '#f72585';
  const color3 = settings['particle-color-3'] || '#4cc9f0';
  const colors = [color1, color2, color3];
  
  particles = [];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: type
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
    particleCanvas.remove();
    particleCanvas = null;
    particleCtx = null;
    window.removeEventListener('resize', resizeCanvas);
  }
}
