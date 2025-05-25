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
const sidebarUsername = document.getElementById('sidebar-username');
const sidebarProfilePic = document.getElementById('sidebar-profile-pic');
const loginModal = document.getElementById('login-modal');
const goToLogin = document.getElementById('go-to-login');
const signOutBtn = document.getElementById('sign-out-btn');
const usernameDisplayNav = document.getElementById('username-display-nav');
const profilePicNav = document.getElementById('profile-pic-nav');

// Global Variables
let particles = [];
let particleCanvas;
let particleCtx;
let currentUser = null;
let panicKeyListener = null;
let currentSettings = {};
let settingsListener = null;
let activeTheme = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initEventListeners();
  auth.onAuthStateChanged(handleAuthStateChange);
});

function initEventListeners() {
  // Sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  if (sidebarToggleMobile) {
    sidebarToggleMobile.addEventListener('click', toggleSidebar);
  }
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        e.target !== sidebarToggleMobile) {
      toggleSidebar();
    }
  });

  // About blank button
  if (aboutBlankBtn) {
    aboutBlankBtn.addEventListener('click', () => {
      window.open('about:blank', '_blank');
    });
  }

  // Theme selection
  themeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleThemeSelection(button.dataset.theme);
    });
  });

  // Background image
  if (applyBgImage) applyBgImage.addEventListener('click', applyBackgroundImage);
  if (resetBg) resetBg.addEventListener('click', resetBackground);
  if (bgImageUpload) bgImageUpload.addEventListener('change', handleImageUpload);

  // Tab cloaker
  if (cloakSite) cloakSite.addEventListener('change', handleCloakSiteChange);
  if (applyCloak) applyCloak.addEventListener('click', applyTabCloak);
  if (resetCloak) resetCloak.addEventListener('click', resetTabCloak);

  // Panic key
  if (panicKeyInput) panicKeyInput.addEventListener('keydown', setPanicKeyInput);
  if (setPanicKey) setPanicKey.addEventListener('click', savePanicKey);
  if (resetPanicKey) resetPanicKey.addEventListener('click', resetPanicKeySettings);

  // Particle effects
  if (particlesToggle) particlesToggle.addEventListener('change', toggleParticleEffects);
  if (particleCount) particleCount.addEventListener('input', updateParticleCount);
  if (particleSpeed) particleSpeed.addEventListener('input', updateParticleSpeed);
  if (particleType) particleType.addEventListener('change', updateParticleType);
  if (particleColor1) particleColor1.addEventListener('input', updateParticleColors);
  if (particleColor2) particleColor2.addEventListener('input', updateParticleColors);
  if (particleColor3) particleColor3.addEventListener('input', updateParticleColors);

  // Reset all settings
  if (resetAllSettings) resetAllSettings.addEventListener('click', confirmResetAllSettings);

  // Auth related
  if (goToLogin) goToLogin.addEventListener('click', () => window.location.href = 'index.html');
  if (signOutBtn) signOutBtn.addEventListener('click', signOut);
}

function handleAuthStateChange(user) {
  currentUser = user;
  
  // Clean up previous listener if exists
  if (settingsListener) {
    settingsListener();
  }
  
  if (user) {
    updateUIForUser(user);
    setupSettingsListener(user.uid);
    if (loginModal) loginModal.classList.remove('active');
  } else {
    if (loginModal) showLoginModal();
    resetAllSettingsToDefault();
  }
}

function setupSettingsListener(userId) {
  settingsListener = db.collection('users').doc(userId)
    .onSnapshot((doc) => {
      if (doc.exists) {
        currentSettings = doc.data().settings || {};
        applySettings(currentSettings);
        setupPanicKeyListener();
      }
    }, (error) => {
      console.error('Error listening to settings:', error);
    });
}

function showLoginModal() {
  if (loginModal) loginModal.classList.add('active');
  disableAllFeatures();
}

function disableAllFeatures() {
  const interactiveElements = [
    themeButtons,
    applyBgImage,
    resetBg,
    bgImageUpload,
    applyCloak,
    resetCloak,
    setPanicKey,
    resetPanicKey,
    particlesToggle,
    resetAllSettings
  ];
  
  interactiveElements.forEach(element => {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el) el.disabled = true;
      });
    } else if (element) {
      element.disabled = true;
    }
  });
}

function toggleSidebar() {
  if (!sidebar) return;
  
  sidebar.classList.toggle('active');
  document.body.classList.toggle('sidebar-open');
  
  if (sidebarToggle) {
    const icon = sidebarToggle.querySelector('i');
    if (icon) {
      if (sidebar.classList.contains('active')) {
        icon.classList.replace('bx-menu', 'bx-x');
      } else {
        icon.classList.replace('bx-x', 'bx-menu');
      }
    }
  }
}

function updateUIForUser(user) {
  const username = user.displayName || 'User';
  const photoURL = user.photoURL || 'https://via.placeholder.com/40';
  
  // Update main navbar
  if (usernameDisplayNav) usernameDisplayNav.textContent = username;
  if (profilePicNav) profilePicNav.src = photoURL;
  
  // Update settings page elements
  if (usernameDisplay) usernameDisplay.textContent = username;
  if (sidebarUsername) sidebarUsername.textContent = username;
  
  if (profilePic) profilePic.src = photoURL;
  if (sidebarProfilePic) sidebarProfilePic.src = photoURL;
  
  // Re-enable all interactive elements
  const interactiveElements = [
    themeButtons,
    applyBgImage,
    resetBg,
    bgImageUpload,
    applyCloak,
    resetCloak,
    setPanicKey,
    resetPanicKey,
    particlesToggle,
    resetAllSettings
  ];
  
  interactiveElements.forEach(element => {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el) el.disabled = false;
      });
    } else if (element) {
      element.disabled = false;
    }
  });
}

// Theme Management
function handleThemeSelection(theme) {
  if (!currentUser) {
    showLoginModal();
    return;
  }
  
  activeTheme = theme;
  applyTheme(theme);
  saveSetting('theme', theme);
  
  // Reset background image when selecting a theme
  document.body.style.backgroundImage = 'none';
  saveSetting('backgroundImage', '');
  if (bgImageUrl) bgImageUrl.value = '';
  if (bgImageUpload) bgImageUpload.value = '';
  
  // Update active button
  themeButtons.forEach(btn => {
    if (btn) {
      btn.classList.remove('active');
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      }
    }
  });
}

function applyTheme(theme) {
  document.body.className = theme;
  document.documentElement.setAttribute('data-theme', theme);
}

// Background Image Management
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('Image must be smaller than 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    if (bgImageUrl) bgImageUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function applyBackgroundImage() {
  if (!currentUser) {
    showLoginModal();
    return;
  }

  let imageUrl = bgImageUrl ? bgImageUrl.value.trim() : '';
  const file = bgImageUpload ? bgImageUpload.files[0] : null;

  if (file) {
    // Upload to Firebase Storage
    const storageRef = storage.ref(`backgrounds/${currentUser.uid}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
      null, 
      (error) => {
        console.error('Upload error:', error);
        alert('Error uploading image: ' + error.message);
      }, 
      () => {
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
  
  document.body.className = '';
  document.documentElement.removeAttribute('data-theme');
  saveSetting('theme', '');
  themeButtons.forEach(btn => {
    if (btn) btn.classList.remove('active');
  });
  activeTheme = '';
  
  saveSetting('backgroundImage', url);
}

function resetBackground() {
  document.body.style.backgroundImage = 'none';
  saveSetting('backgroundImage', '');
  if (bgImageUrl) bgImageUrl.value = '';
  if (bgImageUpload) bgImageUpload.value = '';
}

// Tab Cloaker
function handleCloakSiteChange() {
  if (!customCloakContainer) return;
  customCloakContainer.style.display = this.value === 'custom' ? 'block' : 'none';
}

function applyTabCloak() {
  if (!currentUser) {
    showLoginModal();
    return;
  }

  let url = '';
  
  if (!cloakSite) return;
  
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
      url = customCloakUrl ? customCloakUrl.value.trim() : '';
      break;
    default:
      alert('Please select a site to cloak');
      return;
  }

  if (url) {
    saveSetting('cloakUrl', url);
    saveSetting('cloakSite', cloakSite.value);
    alert('Tab cloaker applied! Press F11 for full effect.');
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
  saveSetting('cloakSite', '');
  if (cloakSite) cloakSite.value = '';
  if (customCloakUrl) customCloakUrl.value = '';
  if (customCloakContainer) customCloakContainer.style.display = 'none';
  document.title = 'Settings | Fusion';
  
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = '/favicon.ico';
  }
}

// Panic Key System
function setPanicKeyInput(e) {
  e.preventDefault();
  if (panicKeyInput) panicKeyInput.value = e.key;
}

function savePanicKey() {
  if (!currentUser) {
    showLoginModal();
    return;
  }

  const key = panicKeyInput ? panicKeyInput.value : '';
  const url = panicUrl ? panicUrl.value.trim() : '';
  
  if (!key || !url) {
    alert('Please set both a panic key and a URL');
    return;
  }

  saveSetting('panicKey', key);
  saveSetting('panicUrl', url);
  
  setupPanicKeyListener();
  
  alert(`Panic key set to "${key}". Press this key to redirect to ${url}`);
}

function setupPanicKeyListener() {
  // Remove previous listener if exists
  if (panicKeyListener) {
    document.removeEventListener('keydown', panicKeyListener);
    panicKeyListener = null;
  }

  // Only setup listener if we have valid settings
  if (currentSettings.panicKey && currentSettings.panicUrl) {
    panicKeyListener = function(e) {
      if (e.key === currentSettings.panicKey) {
        window.location.href = currentSettings.panicUrl;
      }
    };
    
    document.addEventListener('keydown', panicKeyListener);
  }
}

function resetPanicKeySettings() {
  if (panicKeyListener) {
    document.removeEventListener('keydown', panicKeyListener);
    panicKeyListener = null;
  }
  
  saveSetting('panicKey', '');
  saveSetting('panicUrl', '');
  if (panicKeyInput) panicKeyInput.value = '';
  if (panicUrl) panicUrl.value = '';
}

// Particle Effects System
function toggleParticleEffects() {
  if (!particlesToggle || !particleSettings) return;
  
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
  if (!particleCount || !particleCountValue) return;
  
  const count = particleCount.value;
  particleCountValue.textContent = count;
  saveSetting('particleCount', count);
  updateParticles();
}

function updateParticleSpeed() {
  if (!particleSpeed || !particleSpeedValue) return;
  
  const speed = particleSpeed.value;
  particleSpeedValue.textContent = speed;
  saveSetting('particleSpeed', speed);
  updateParticles();
}

function updateParticleType() {
  if (!particleType) return;
  
  const type = particleType.value;
  saveSetting('particleType', type);
  updateParticles();
}

function updateParticleColors() {
  const color1 = particleColor1 ? particleColor1.value : '#4361ee';
  const color2 = particleColor2 ? particleColor2.value : '#f72585';
  const color3 = particleColor3 ? particleColor3.value : '#4cc9f0';
  
  saveSetting('particleColor1', color1);
  saveSetting('particleColor2', color2);
  saveSetting('particleColor3', color3);
  
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
  if (!particleCanvas) return;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function createParticles() {
  const count = parseInt(currentSettings.particleCount) || 50;
  const type = currentSettings.particleType || 'circle';
  const colors = [
    currentSettings.particleColor1 || '#4361ee',
    currentSettings.particleColor2 || '#f72585',
    currentSettings.particleColor3 || '#4cc9f0'
  ];
  
  const speed = parseInt(currentSettings.particleSpeed) || 3;
  
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
  if (!particleCanvas || !particleCtx) return;
  
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

function updateParticles() {
  destroyParticles();
  if (particlesToggle && particlesToggle.checked) {
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
  
  // Update local settings immediately
  currentSettings[key] = value;
  
  // Save to Firebase
  db.collection('users').doc(currentUser.uid).set({
    settings: currentSettings
  }, { merge: true })
  .catch(error => {
    console.error('Error saving setting:', error);
  });
}

function applySettings(settings) {
  // Apply theme
  if (settings.theme) {
    activeTheme = settings.theme;
    applyTheme(settings.theme);
    themeButtons.forEach(btn => {
      if (btn) {
        btn.classList.remove('active');
        if (btn.dataset.theme === settings.theme) {
          btn.classList.add('active');
        }
      }
    });
  }
  
  // Apply background image
  if (settings.backgroundImage) {
    document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    if (bgImageUrl) bgImageUrl.value = settings.backgroundImage;
  } else {
    document.body.style.backgroundImage = 'none';
    if (bgImageUrl) bgImageUrl.value = '';
  }
  
  // Apply panic key settings
  if (settings.panicKey && panicKeyInput) {
    panicKeyInput.value = settings.panicKey;
  } else if (panicKeyInput) {
    panicKeyInput.value = '';
  }
  
  if (settings.panicUrl && panicUrl) {
    panicUrl.value = settings.panicUrl;
  } else if (panicUrl) {
    panicUrl.value = '';
  }
  
  // Apply particle settings
  if (settings.particlesEnabled) {
    if (particlesToggle) particlesToggle.checked = true;
    if (particleSettings) particleSettings.style.display = 'block';
    
    if (settings.particleCount) {
      if (particleCount) particleCount.value = settings.particleCount;
      if (particleCountValue) particleCountValue.textContent = settings.particleCount;
    }
    
    if (settings.particleSpeed) {
      if (particleSpeed) particleSpeed.value = settings.particleSpeed;
      if (particleSpeedValue) particleSpeedValue.textContent = settings.particleSpeed;
    }
    
    if (settings.particleType && particleType) {
      particleType.value = settings.particleType;
    }
    
    if (settings.particleColor1 && particleColor1) {
      particleColor1.value = settings.particleColor1;
    }
    
    if (settings.particleColor2 && particleColor2) {
      particleColor2.value = settings.particleColor2;
    }
    
    if (settings.particleColor3 && particleColor3) {
      particleColor3.value = settings.particleColor3;
    }
    
    initParticles();
  } else {
    if (particlesToggle) particlesToggle.checked = false;
    if (particleSettings) particleSettings.style.display = 'none';
    destroyParticles();
  }
  
  // Apply cloaking settings
  if (settings.cloakSite) {
    if (cloakSite) cloakSite.value = settings.cloakSite;
    if (customCloakContainer) {
      customCloakContainer.style.display = settings.cloakSite === 'custom' ? 'block' : 'none';
    }
    
    if (settings.cloakUrl) {
      if (customCloakUrl) customCloakUrl.value = settings.cloakUrl;
      document.title = getCloakTitle(settings.cloakSite);
      updateFavicon(settings.cloakSite);
    }
  }
}

function confirmResetAllSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    resetAllSettingsToDefault();
  }
}

function resetAllSettingsToDefault() {
  if (!currentUser) return;
  
  currentSettings = {};
  
  db.collection('users').doc(currentUser.uid).update({
    settings: {}
  })
  .then(() => {
    applyDefaultSettings();
    alert('All settings have been reset to default.');
  })
  .catch(error => {
    console.error('Error resetting settings:', error);
  });
}

function applyDefaultSettings() {
  document.body.className = '';
  document.documentElement.removeAttribute('data-theme');
  document.body.style.backgroundImage = 'none';
  if (bgImageUrl) bgImageUrl.value = '';
  if (bgImageUpload) bgImageUpload.value = '';
  
  if (particlesToggle) particlesToggle.checked = false;
  if (particleSettings) particleSettings.style.display = 'none';
  destroyParticles();
  
  if (panicKeyInput) panicKeyInput.value = '';
  if (panicUrl) panicUrl.value = '';
  if (panicKeyListener) {
    document.removeEventListener('keydown', panicKeyListener);
    panicKeyListener = null;
  }
  
  if (cloakSite) cloakSite.value = '';
  if (customCloakUrl) customCloakUrl.value = '';
  if (customCloakContainer) customCloakContainer.style.display = 'none';
  
  themeButtons.forEach(btn => {
    if (btn) btn.classList.remove('active');
  });
  activeTheme = '';
  
  document.title = 'Settings | Fusion';
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = '/favicon.ico';
  }
}

function signOut() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  }).catch(error => {
    console.error('Sign out error:', error);
  });
}
