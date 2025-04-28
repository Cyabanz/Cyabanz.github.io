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
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const usernameDisplay = document.getElementById('username-display');
const sidebarUsername = document.getElementById('sidebar-username');
const profilePic = document.getElementById('profile-pic');
const profilePicSmall = document.getElementById('profile-pic-small');
const aboutBlankBtn = document.getElementById('aboutBlankBtn');

// Theme Elements
const themeButtons = document.querySelectorAll('.theme-btn');
const resetThemeBtn = document.getElementById('resetThemeBtn');

// Background Image Elements
const bgImageUrl = document.getElementById('bgImageUrl');
const bgImageUpload = document.getElementById('bgImageUpload');
const bgImageInfo = document.getElementById('bgImageInfo');
const applyBgImageBtn = document.getElementById('applyBgImageBtn');
const removeBgImageBtn = document.getElementById('removeBgImageBtn');

// Particles Elements
const particlesToggle = document.getElementById('particlesToggle');
const particlesSettings = document.getElementById('particlesSettings');
const particleType = document.getElementById('particleType');
const particleCount = document.getElementById('particleCount');
const particleCountValue = document.getElementById('particleCountValue');
const particleSpeed = document.getElementById('particleSpeed');
const particleSpeedValue = document.getElementById('particleSpeedValue');
const particleColor1 = document.getElementById('particleColor1');
const particleColor2 = document.getElementById('particleColor2');
const particleColor3 = document.getElementById('particleColor3');
const applyParticlesBtn = document.getElementById('applyParticlesBtn');

// Tab Cloaker Elements
const cloakOption = document.getElementById('cloakOption');
const customCloakContainer = document.getElementById('customCloakContainer');
const customCloakUrl = document.getElementById('customCloakUrl');
const applyCloakBtn = document.getElementById('applyCloakBtn');
const resetCloakBtn = document.getElementById('resetCloakBtn');

// Panic Key Elements
const panicKey = document.getElementById('panicKey');
const panicUrl = document.getElementById('panicUrl');
const applyPanicKeyBtn = document.getElementById('applyPanicKeyBtn');
const testPanicKeyBtn = document.getElementById('testPanicKeyBtn');
const removePanicKeyBtn = document.getElementById('removePanicKeyBtn');
const panicKeyModal = document.getElementById('panicKeyModal');
const cancelTestBtn = document.getElementById('cancelTestBtn');

// Reset Elements
const resetAllBtn = document.getElementById('resetAllBtn');

// Particle System Variables
let particles = [];
let particleCanvas, particleCtx;
let testingPanicKey = false;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadUserSettings();
    auth.onAuthStateChanged(handleAuthStateChange);
});

function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // About:Blank button
    aboutBlankBtn.addEventListener('click', () => {
        window.open('about:blank', '_blank');
    });

    // Theme selection
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.dataset.theme;
            applyTheme(theme);
            saveSetting('theme', theme);
            
            // Disable background image when selecting a theme with background
            if (['diamond', 'crazy'].includes(theme)) {
                document.body.style.backgroundImage = 'none';
                saveSetting('backgroundImage', '');
                bgImageUrl.value = '';
                bgImageInfo.textContent = 'No image selected';
            }
        });
    });
    
    // Reset theme
    resetThemeBtn.addEventListener('click', () => {
        themeButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('.theme-btn[data-theme="light"]').classList.add('active');
        applyTheme('light');
        saveSetting('theme', 'light');
    });

    // Background image upload
    bgImageUpload.addEventListener('change', handleImageUpload);
    applyBgImageBtn.addEventListener('click', applyBackgroundImageFromUrl);
    removeBgImageBtn.addEventListener('click', removeBackgroundImage);

    // Particles toggle
    particlesToggle.addEventListener('change', toggleParticles);
    particleCount.addEventListener('input', () => {
        particleCountValue.textContent = particleCount.value;
    });
    particleSpeed.addEventListener('input', () => {
        particleSpeedValue.textContent = particleSpeed.value;
    });
    applyParticlesBtn.addEventListener('click', applyParticleSettings);

    // Tab cloaker
    cloakOption.addEventListener('change', () => {
        customCloakContainer.style.display = cloakOption.value === 'custom' ? 'block' : 'none';
    });
    applyCloakBtn.addEventListener('click', applyTabCloak);
    resetCloakBtn.addEventListener('click', resetTabCloak);

    // Panic key
    panicKey.addEventListener('keydown', (e) => {
        e.preventDefault();
        panicKey.value = e.key;
    });
    applyPanicKeyBtn.addEventListener('click', applyPanicKey);
    testPanicKeyBtn.addEventListener('click', testPanicKey);
    removePanicKeyBtn.addEventListener('click', removePanicKey);
    cancelTestBtn.addEventListener('click', () => {
        panicKeyModal.classList.remove('active');
        testingPanicKey = false;
    });

    // Reset all
    resetAllBtn.addEventListener('click', resetAllSettings);
}

function handleAuthStateChange(user) {
    if (user) {
        // User is signed in
        loadUserData(user.uid);
    } else {
        // User is signed out
        usernameDisplay.textContent = 'Guest';
        sidebarUsername.textContent = 'Guest';
        profilePic.src = 'https://via.placeholder.com/42';
        profilePicSmall.src = 'https://via.placeholder.com/36';
    }
}

function loadUserData(userId) {
    db.collection('users').doc(userId).get().then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            usernameDisplay.textContent = userData.username || 'User';
            sidebarUsername.textContent = userData.username || 'User';
            
            if (userData.photoBase64) {
                profilePic.src = userData.photoBase64;
                profilePicSmall.src = userData.photoBase64;
            }
        }
    });
}

function loadUserSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
    themeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`).classList.add('active');

    // Load background image
    const bgImage = localStorage.getItem('backgroundImage');
    if (bgImage) {
        document.body.style.backgroundImage = `url(${bgImage})`;
        bgImageUrl.value = bgImage;
        bgImageInfo.textContent = 'Custom background applied';
    }

    // Load particles
    const particlesEnabled = localStorage.getItem('particlesEnabled') === 'true';
    particlesToggle.checked = particlesEnabled;
    particlesSettings.style.display = particlesEnabled ? 'block' : 'none';
    
    if (particlesEnabled) {
        initParticles();
    }

    // Load particle settings
    particleType.value = localStorage.getItem('particleType') || 'circle';
    particleCount.value = localStorage.getItem('particleCount') || 50;
    particleCountValue.textContent = particleCount.value;
    particleSpeed.value = localStorage.getItem('particleSpeed') || 3;
    particleSpeedValue.textContent = particleSpeed.value;
    particleColor1.value = localStorage.getItem('particle-color-1') || '#4361ee';
    particleColor2.value = localStorage.getItem('particle-color-2') || '#f72585';
    particleColor3.value = localStorage.getItem('particle-color-3') || '#4cc9f0';

    // Load tab cloaker
    const cloakSetting = localStorage.getItem('cloakSetting');
    if (cloakSetting) {
        const { option, customUrl } = JSON.parse(cloakSetting);
        cloakOption.value = option;
        if (option === 'custom') {
            customCloakContainer.style.display = 'block';
            customCloakUrl.value = customUrl;
        }
    }

    // Load panic key
    const panicKeySetting = localStorage.getItem('panicKey');
    const panicUrlSetting = localStorage.getItem('panicUrl');
    if (panicKeySetting && panicUrlSetting) {
        panicKey.value = panicKeySetting;
        panicUrl.value = panicUrlSetting;
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarToggle.innerHTML = sidebar.classList.contains('active') ? 
        '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
}

function applyTheme(theme) {
    document.body.className = theme;
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Image must be smaller than 2MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        bgImageUrl.value = event.target.result;
        bgImageInfo.textContent = file.name;
    };
    reader.readAsDataURL(file);
}

function applyBackgroundImageFromUrl() {
    const url = bgImageUrl.value.trim();
    if (!url) return;

    // Remove any theme with background
    if (document.body.classList.contains('diamond') || document.body.classList.contains('crazy')) {
        document.body.className = 'light';
        themeButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('.theme-btn[data-theme="light"]').classList.add('active');
        saveSetting('theme', 'light');
    }

    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    saveSetting('backgroundImage', url);
    bgImageInfo.textContent = 'Custom background applied';
}

function removeBackgroundImage() {
    document.body.style.backgroundImage = 'none';
    saveSetting('backgroundImage', '');
    bgImageUrl.value = '';
    bgImageInfo.textContent = 'No image selected';
}

function toggleParticles() {
    const enabled = particlesToggle.checked;
    particlesSettings.style.display = enabled ? 'block' : 'none';
    saveSetting('particlesEnabled', enabled);

    if (enabled) {
        initParticles();
    } else {
        destroyParticles();
    }
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
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
}

function createParticles() {
    const count = parseInt(localStorage.getItem('particleCount')) || 50;
    const type = localStorage.getItem('particleType') || 'circle';
    const colors = [
        localStorage.getItem('particle-color-1') || '#4361ee',
        localStorage.getItem('particle-color-2') || '#f72585',
        localStorage.getItem('particle-color-3') || '#4cc9f0'
    ];
    const speed = parseInt(localStorage.getItem('particleSpeed')) || 3;
    
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

function destroyParticles() {
    if (particleCanvas) {
        particleCanvas.remove();
        particleCanvas = null;
        particleCtx = null;
        window.removeEventListener('resize', resizeCanvas);
    }
}

function applyParticleSettings() {
    saveSetting('particleType', particleType.value);
    saveSetting('particleCount', particleCount.value);
    saveSetting('particleSpeed', particleSpeed.value);
    saveSetting('particle-color-1', particleColor1.value);
    saveSetting('particle-color-2', particleColor2.value);
    saveSetting('particle-color-3', particleColor3.value);
    
    if (particlesToggle.checked) {
        destroyParticles();
        initParticles();
    }
    
    alert('Particle settings saved!');
}

function applyTabCloak() {
    const option = cloakOption.value;
    let customUrl = '';
    
    if (option === 'custom') {
        customUrl = customCloakUrl.value.trim();
        if (!customUrl) {
            alert('Please enter a custom URL');
            return;
        }
        
        if (!customUrl.startsWith('http')) {
            customUrl = 'https://' + customUrl;
        }
    }
    
    const cloakSetting = { option, customUrl };
    saveSetting('cloakSetting', JSON.stringify(cloakSetting));
    
    alert('Tab cloak settings saved!');
}

function resetTabCloak() {
    localStorage.removeItem('cloakSetting');
    cloakOption.value = 'google';
    customCloakContainer.style.display = 'none';
    customCloakUrl.value = '';
    alert('Tab cloak settings reset!');
}

function applyPanicKey() {
    const key = panicKey.value.trim();
    const url = panicUrl.value.trim();
    
    if (!key || !url) {
        alert('Please enter both a key and a URL');
        return;
    }
    
    if (!url.startsWith('http')) {
        panicUrl.value = 'https://' + url;
    }
    
    saveSetting('panicKey', key);
    saveSetting('panicUrl', panicUrl.value);
    
    // Setup event listener
    document.addEventListener('keydown', handlePanicKey);
    
    alert('Panic key saved! Press ' + key + ' to activate.');
}

function testPanicKey() {
    testingPanicKey = true;
    panicKeyModal.classList.add('active');
}

function removePanicKey() {
    localStorage.removeItem('panicKey');
    localStorage.removeItem('panicUrl');
    panicKey.value = '';
    panicUrl.value = '';
    document.removeEventListener('keydown', handlePanicKey);
    alert('Panic key removed!');
}

function handlePanicKey(e) {
    const savedKey = localStorage.getItem('panicKey');
    const savedUrl = localStorage.getItem('panicUrl');
    
    if (e.key === savedKey && savedUrl) {
        if (testingPanicKey) {
            panicKeyModal.classList.remove('active');
            testingPanicKey = false;
            alert('Panic key works! Press ' + savedKey + ' to go to ' + savedUrl);
        } else {
            window.location.href = savedUrl;
        }
    }
}

function resetAllSettings() {
    if (!confirm('Are you sure you want to reset ALL settings to default? This cannot be undone!')) {
        return;
    }
    
    // Clear all settings
    localStorage.clear();
    
    // Reset theme
    document.body.className = 'light';
    themeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('.theme-btn[data-theme="light"]').classList.add('active');
    
    // Reset background
    document.body.style.backgroundImage = 'none';
    bgImageUrl.value = '';
    bgImageInfo.textContent = 'No image selected';
    
    // Reset particles
    particlesToggle.checked = false;
    particlesSettings.style.display = 'none';
    destroyParticles();
    
    // Reset tab cloaker
    cloakOption.value = 'google';
    customCloakContainer.style.display = 'none';
    customCloakUrl.value = '';
    
    // Reset panic key
    panicKey.value = '';
    panicUrl.value = '';
    document.removeEventListener('keydown', handlePanicKey);
    
    alert('All settings have been reset to default!');
}

function saveSetting(key, value) {
    localStorage.setItem(key, value);
    
    // Sync with Firebase if user is logged in
    if (auth.currentUser) {
        db.collection('users').doc(auth.currentUser.uid).update({
            [`settings.${key}`]: value,
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(error => {
            console.error('Error saving setting:', error);
        });
    }
}
