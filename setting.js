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
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
const aboutBlankBtn = document.getElementById('aboutBlankBtn');
const themeButtons = document.querySelectorAll('.theme-btn');
const bgImageUrl = document.getElementById('bg-image-url');
const bgImageUpload = document.getElementById('bg-image-upload');
const applyBgImage = document.getElementById('apply-bg-image');
const resetBg = document.getElementById('reset-bg');
const cloakSite = document.getElementById('cloak-site');
const customCloakContainer = document.getElementById('custom-cloak-container');
const customCloakUrl = document.getElementById('custom-cloak-url');
const applyCloak = document.getElementById('apply-cloak');
const resetCloak = document.getElementById('reset-cloak');
const panicKeyInput = document.getElementById('panic-key-input');
const panicUrl = document.getElementById('panic-url');
const setPanicKey = document.getElementById('set-panic-key');
const resetPanicKey = document.getElementById('reset-panic-key');
const particlesToggle = document.getElementById('particles-toggle');
const particleSettings = document.getElementById('particle-settings');
const particleType = document.getElementById('particle-type');
const particleCount = document.getElementById('particle-count');
const particleCountValue = document.getElementById('particle-count-value');
const particleSpeed = document.getElementById('particle-speed');
const particleSpeedValue = document.getElementById('particle-speed-value');
const particleColor1 = document.getElementById('particle-color-1');
const particleColor2 = document.getElementById('particle-color-2');
const particleColor3 = document.getElementById('particle-color-3');
const resetAllSettings = document.getElementById('reset-all-settings');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');

// Global Variables
let particles = [];
let particleCanvas;
let particleCtx;
let currentUser = null;
let activeTheme = '';
let panicKeyListener = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initEventListeners();
  auth.onAuthStateChanged(handleAuthStateChange);
});

function initEventListeners() {
  // Sidebar toggle
  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarToggleMobile.addEventListener('click', toggleSidebar);
  
  // About blank button
  aboutBlankBtn.addEventListener('click', () => {
    window.open('about:blank', '_blank');
  });

  // Theme selection
  themeButtons.forEach(button => {
    button.addEventListener('click', () => handleThemeSelection(button.dataset.theme));
  });

  // Background image
  applyBgImage.addEventListener('click', applyBackgroundImage);
  resetBg.addEventListener('click', resetBackground);
  bgImageUpload.addEventListener('change', handleImageUpload);

  // Tab cloaker
  cloakSite.addEventListener('change', handleCloakSiteChange);
  applyCloak.addEventListener('click', applyTabCloak);
  resetCloak.addEventListener('click', resetTabCloak);

  // Panic key
  panicKeyInput.addEventListener('keydown', setPanicKeyInput);
  setPanicKey.addEventListener('click', savePanicKey);
  resetPanicKey.addEventListener('click', resetPanicKeySettings);

  // Particle effects
  particlesToggle.addEventListener('change', toggleParticleEffects);
  particleCount.addEventListener('input', updateParticleCount);
  particleSpeed.addEventListener('input', updateParticleSpeed);
  particleType.addEventListener('change', updateParticleType);
  particleColor1.addEventListener('change', updateParticleColors);
  particleColor2.addEventListener('change', updateParticleColors);
  particleColor3.addEventListener('change', updateParticleColors);

  // Reset all settings
  resetAllSettings.addEventListener('click', confirmResetAllSettings);
}

function handleAuthStateChange(user) {
  currentUser = user;
  if (user) {
    updateUIForUser(user);
    loadUserSettings(user.uid);
  } else {
    updateUIForGuest();
    redirectToLogin();
  }
}

function toggleSidebar() {
  sidebar.classList.toggle('active');
  document.body.classList.toggle('sidebar-open');
}

function updateUIForUser(user) {
  usernameDisplay.textContent = user.displayName || 'User';
  if (user.photoURL) {
    profilePic.src = user.photoURL;
  }
}

function updateUIForGuest() {
  usernameDisplay.textContent = 'Guest';
  profilePic.src = 'https://via.placeholder.com/40';
}

function redirectToLogin() {
  window.location.href = 'index.html';
}

// Theme Management
function handleThemeSelection(theme) {
  activeTheme = theme;
  applyTheme(theme);
  saveSetting('theme', theme);
  
  // Reset background image when selecting a theme
  document.body.style.backgroundImage = 'none';
  saveSetting('backgroundImage', '');
  bgImageUrl.value = '';
  bgImageUpload.value = '';
  
  // Update active button
  themeButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    }
  });
}

function applyTheme(theme) {
  document.body.className = theme;
  
  // Add theme-specific styles
  const styleId = 'theme-styles';
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  // Add any theme-specific overrides here if needed
  styleElement.textContent = '';
}

// Background Image Management
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) { // 2MB limit
    alert('Image must be smaller than 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    bgImageUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function applyBackgroundImage() {
  let imageUrl = bgImageUrl.value.trim();
  const file = bgImageUpload.files[0];

  if (file) {
    // Upload to Firebase Storage if it's a new file
    const storageRef = storage.ref(`backgrounds/${currentUser.uid}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
      null, 
      (error) => {
        console.error('Upload error:', error);
        alert('Error uploading image: ' + error.message);
      }, 
      () => {
        // Get download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          imageUrl = downloadURL;
          setBackgroundImage(imageUrl);
        });
      }
    );
  } else if (imageUrl) {
    setBackgroundImage(imageUrl);
  } else {
    alert('Please select an image or enter a URL');
  }
}

function setBackgroundImage(url) {
  document.body.style.backgroundImage = `url(${url})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
  
  // Reset theme when setting background
  document.body.className = '';
  saveSetting('theme', '');
  themeButtons.forEach(btn => btn.classList.remove('active'));
  activeTheme = '';
  
  saveSetting('backgroundImage', url);
}

function resetBackground() {
  document.body.style.backgroundImage = 'none';
  saveSetting('backgroundImage', '');
  bgImageUrl.value = '';
  bgImageUpload.value = '';
}

// Tab Cloaker
function handleCloakSiteChange() {
  customCloakContainer.style.display = this.value === 'custom' ? 'block' : 'none';
}

function applyTabCloak() {
  let url = '';
  
  switch(cloakSite.value) {
    case 'google':
      url = 'https://classroom.google.com';
      break;
    case 'clever':
      url = 'https://clever.com';
      break;
    case 'drive':
      url = 'https://drive.google.com';
      break;
    case 'docs':
      url = 'https://docs.google.com';
      break;
    case 'custom':
      url = customCloakUrl.value.trim();
      break;
    default:
      alert('Please select a site to cloak');
      return;
  }

  if (url) {
    saveSetting('cloakUrl', url);
    alert('Tab cloaker applied! Press F11 for full effect.');
    
    // Update the tab title and icon
    document.title = getCloakTitle(cloakSite.value);
    updateFavicon(cloakSite.value);
  }
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
  const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
  favicon.rel = 'icon';
  
  const icons = {
    'google': 'https://www.google.com/favicon.ico',
    'clever': 'https://clever.com/favicon.ico',
    'drive': 'https://drive.google.com/favicon.ico',
    'docs': 'https://docs.google.com/favicon.ico'
  };
  
  favicon.href = icons[site] || '/favicon.ico';
  document.head.appendChild(favicon);
}

function resetTabCloak() {
  saveSetting('cloakUrl', '');
  cloakSite.value = '';
  customCloakUrl.value = '';
  customCloakContainer.style.display = 'none';
  document.title = 'Settings';
  
  // Reset favicon
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = '/favicon.ico';
  }
}

// Panic Key System
function setPanicKeyInput(e) {
  e.preventDefault();
  panicKeyInput.value = e.key;
}

function savePanicKey() {
  const key = panicKeyInput.value;
  const url = panicUrl.value.trim();
  
  if (!key || !url) {
    alert('Please set both a panic key and a URL');
    return;
  }

  // Remove previous listener if it exists
  if (panicKeyListener) {
    document.removeEventListener('keydown', panicKeyListener);
  }

  // Add new listener
  panicKeyListener = function(e) {
    if (e.key === key) {
      window.location.href = url;
    }
  };
  
  document.addEventListener('keydown', panicKeyListener);
  
  saveSetting('panicKey', key);
  saveSetting('panicUrl', url);
  
  alert(`Panic key set to "${key}". Press this key to redirect to ${url}`);
}

function resetPanicKeySettings() {
  if (panicKeyListener) {
    document.removeEventListener('keydown', panicKeyListener);
    panicKeyListener = null;
  }
  
  saveSetting('panicKey', '');
  saveSetting('panicUrl', '');
  panicKeyInput.value = '';
  panicUrl.value = '';
}

// Particle Effects System
function toggleParticleEffects() {
  const enabled = particlesToggle.checked;
  particleSettings.style.display = enabled ? 'block' : 'none';
  saveSetting('particlesEnabled', enabled);
  
  if (enabled) {
    initParticles();
  } else {
    destroyParticles();
  }
}

function updateParticleCount() {
  const count = particleCount.value;
  particleCountValue.textContent = count;
  saveSetting('particleCount', count);
  updateParticles();
}

function updateParticleSpeed() {
  const speed = particleSpeed.value;
  particleSpeedValue.textContent = speed;
  saveSetting('particleSpeed', speed);
  updateParticles();
}

function updateParticleType() {
  const type = particleType.value;
  saveSetting('particleType', type);
  updateParticles();
}

function updateParticleColors() {
  const color1 = particleColor1.value;
  const color2 = particleColor2.value;
  const color3 = particleColor3.value;
  
  saveSetting('particle-color-1', color1);
  saveSetting('particle-color-2', color2);
  saveSetting('particle-color-3', color3);
  
  updateParticles();
}

function initParticles() {
  if (particleCanvas) return;
  
  particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'particle-canvas';
  document.body.appendChild(particleCanvas);
  
  particleCtx = particleCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  createParticles();
  animateParticles();
}

function resizeCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function createParticles() {
  const count = parseInt(particleCount.value) || 50;
  const type = particleType.value;
  const colors = [
    particleColor1.value,
    particleColor2.value,
    particleColor3.value
  ];
  
  particles = [];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * (parseInt(particleSpeed.value) || 3),
      speedY: (Math.random() - 0.5) * (parseInt(particleSpeed.value) || 3),
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
    
    // Update position
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounce off edges
    if (p.x < 0 || p.x > particleCanvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > particleCanvas.height) p.speedY *= -1;
    
    // Draw particle
    particleCtx.fillStyle = p.color;
    
    switch(p.type) {
      case 'star':
        drawStar(p.x, p.y, 5, p.size, p.size / 2);
        break;
      case 'triangle':
        drawTriangle(p.x, p.y, p.size);
        break;
      default: // circle
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

function updateParticles() {
  destroyParticles();
  if (particlesToggle.checked) {
    initParticles();
  }
}

function destroyParticles() {
  if (particleCanvas) {
    particleCanvas.remove();
    particleCanvas = null;
    particleCtx = null;
    window.removeEventListener('resize', resizeCanvas);
  }
}

// Settings Management
function saveSetting(key, value) {
  if (!currentUser) return;
  
  // Save to Firebase
  db.collection('users').doc(currentUser.uid).update({
    [`settings.${key}`]: value,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(error => {
    console.error('Error saving setting:', error);
  });
  
  // Save to localStorage for immediate access
  localStorage.setItem(key, value);
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
    activeTheme = settings.theme;
    applyTheme(settings.theme);
    document.querySelector(`.theme-btn[data-theme="${settings.theme}"]`)?.classList.add('active');
  }
  
  // Apply background image
  if (settings.backgroundImage) {
    document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
    bgImageUrl.value = settings.backgroundImage;
  }
  
  // Apply tab cloaker
  if (settings.cloakUrl) {
    // Just load the setting, don't automatically apply
  }
  
  // Apply panic key
  if (settings.panicKey) {
    panicKeyInput.value = settings.panicKey;
  }
  if (settings.panicUrl) {
    panicUrl.value = settings.panicUrl;
  }
  
  // Apply particle settings
  if (settings.particlesEnabled) {
    particlesToggle.checked = true;
    particleSettings.style.display = 'block';
    initParticles();
  }
  
  if (settings.particleCount) {
    particleCount.value = settings.particleCount;
    particleCountValue.textContent = settings.particleCount;
  }
  
  if (settings.particleSpeed) {
    particleSpeed.value = settings.particleSpeed;
    particleSpeedValue.textContent = settings.particleSpeed;
  }
  
  if (settings.particleType) {
    particleType.value = settings.particleType;
  }
  
  // Apply colors
  if (settings['particle-color-1']) {
    particleColor1.value = settings['particle-color-1'];
  }
  if (settings['particle-color-2']) {
    particleColor2.value = settings['particle-color-2'];
  }
  if (settings['particle-color-3']) {
    particleColor3.value = settings['particle-color-3'];
  }
}

function confirmResetAllSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    resetAllSettingsToDefault();
  }
}

function resetAllSettingsToDefault() {
  if (!currentUser) return;
  
  // Reset in Firebase
  db.collection('users').doc(currentUser.uid).update({
    settings: {},
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    // Reset UI
    document.body.className = '';
    document.body.style.backgroundImage = 'none';
    bgImageUrl.value = '';
    bgImageUpload.value = '';
    
    particlesToggle.checked = false;
    particleSettings.style.display = 'none';
    destroyParticles();
    
    panicKeyInput.value = '';
    panicUrl.value = '';
    if (panicKeyListener) {
      document.removeEventListener('keydown', panicKeyListener);
      panicKeyListener = null;
    }
    
    cloakSite.value = '';
    customCloakUrl.value = '';
    customCloakContainer.style.display = 'none';
    
    themeButtons.forEach(btn => btn.classList.remove('active'));
    activeTheme = '';
    
    // Reset local storage
    localStorage.clear();
    
    alert('All settings have been reset to default.');
  }).catch(error => {
    console.error('Error resetting settings:', error);
    alert('Failed to reset settings: ' + error.message);
  });
}

// Initialize any settings from localStorage on page load
function initFromLocalStorage() {
  if (localStorage.getItem('particlesEnabled') === 'true') {
    particlesToggle.checked = true;
    particleSettings.style.display = 'block';
    initParticles();
  }
  
  if (localStorage.getItem('panicKey') && localStorage.getItem('panicUrl')) {
    panicKeyInput.value = localStorage.getItem('panicKey');
    panicUrl.value = localStorage.getItem('panicUrl');
    
    panicKeyListener = function(e) {
      if (e.key === localStorage.getItem('panicKey')) {
        window.location.href = localStorage.getItem('panicUrl');
      }
    };
    
    document.addEventListener('keydown', panicKeyListener);
  }
}

// Initialize from localStorage when DOM is loaded
initFromLocalStorage();
