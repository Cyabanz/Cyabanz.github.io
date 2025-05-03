// Initialize Firebase (already initialized in script.js, but we'll reference it here)
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
const themeBtns = document.querySelectorAll('.theme-btn');
const bgImageUrlInput = document.getElementById('bg-image-url');
const bgImageUpload = document.getElementById('bg-image-upload');
const applyBgImageBtn = document.getElementById('apply-bg-image');
const resetBgBtn = document.getElementById('reset-bg');
const cloakSiteSelect = document.getElementById('cloak-site');
const customCloakContainer = document.getElementById('custom-cloak-container');
const customCloakUrl = document.getElementById('custom-cloak-url');
const applyCloakBtn = document.getElementById('apply-cloak');
const resetCloakBtn = document.getElementById('reset-cloak');
const panicKeyInput = document.getElementById('panic-key-input');
const panicUrlInput = document.getElementById('panic-url');
const setPanicKeyBtn = document.getElementById('set-panic-key');
const resetPanicKeyBtn = document.getElementById('reset-panic-key');
const particlesToggle = document.getElementById('particles-toggle');
const particleSettings = document.getElementById('particle-settings');
const particleTypeSelect = document.getElementById('particle-type');
const particleCountInput = document.getElementById('particle-count');
const particleCountValue = document.getElementById('particle-count-value');
const particleSpeedInput = document.getElementById('particle-speed');
const particleSpeedValue = document.getElementById('particle-speed-value');
const particleColor1 = document.getElementById('particle-color-1');
const particleColor2 = document.getElementById('particle-color-2');
const particleColor3 = document.getElementById('particle-color-3');
const signOutBtn = document.getElementById('sign-out-btn');
const resetAllSettingsBtn = document.getElementById('reset-all-settings');
const loginModal = document.getElementById('login-modal');
const goToLoginBtn = document.getElementById('go-to-login');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const sidebarUsername = document.getElementById('sidebar-username');
const sidebarProfilePic = document.getElementById('sidebar-profile-pic');

// Default settings
const defaultSettings = {
    theme: 'light',
    bgImage: '',
    cloakSite: '',
    customCloakUrl: '',
    panicKey: '',
    panicUrl: '',
    particlesEnabled: false,
    particleType: 'circle',
    particleCount: 50,
    particleSpeed: 3,
    particleColors: ['#4361ee', '#f72585', '#4cc9f0']
};

// Current settings
let userSettings = {...defaultSettings};
let currentUser = null;
let particleCanvas = null;
let particleCtx = null;
let particles = [];
let panicKeySet = false;

// Initialize the application
function initSettings() {
    setupEventListeners();
    checkAuthState();
    initializeParticleCanvas();
}

// Check authentication state
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            updateUserUI(user);
            loadUserSettings(user.uid);
            if (loginModal) loginModal.classList.remove('active');
        } else {
            currentUser = null;
            resetToDefaultSettings();
            if (loginModal) loginModal.classList.add('active');
        }
    });
}

// Load user settings from Firestore
function loadUserSettings(userId) {
    db.collection('users').doc(userId).collection('settings').doc('appSettings').get()
        .then(doc => {
            if (doc.exists) {
                userSettings = {...defaultSettings, ...doc.data()};
                applyAllSettings();
                updateSettingsUI();
            } else {
                // Create settings document if it doesn't exist
                saveSettingsToFirebase();
            }
        })
        .catch(error => {
            console.error('Error loading settings:', error);
        });
}

// Save settings to Firebase
function saveSettingsToFirebase() {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    db.collection('users').doc(currentUser.uid).collection('settings').doc('appSettings')
        .set(userSettings, { merge: true })
        .catch(error => {
            console.error('Error saving settings:', error);
        });
}

// Apply all settings to the page
function applyAllSettings() {
    applyTheme();
    applyBackgroundImage();
    applyParticleSettings();
    setupPanicKey();
}

// Update UI based on current settings
function updateSettingsUI() {
    // Theme buttons
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === userSettings.theme) {
            btn.classList.add('active');
        }
    });

    // Background image
    if (bgImageUrlInput) bgImageUrlInput.value = userSettings.bgImage || '';

    // Tab cloaker
    if (cloakSiteSelect) {
        cloakSiteSelect.value = userSettings.cloakSite || '';
        if (userSettings.cloakSite === 'custom') {
            customCloakContainer.style.display = 'block';
            if (customCloakUrl) customCloakUrl.value = userSettings.customCloakUrl || '';
        } else {
            customCloakContainer.style.display = 'none';
        }
    }

    // Panic key
    if (panicKeyInput) panicKeyInput.value = userSettings.panicKey || '';
    if (panicUrlInput) panicUrlInput.value = userSettings.panicUrl || '';

    // Particle effects
    if (particlesToggle) particlesToggle.checked = userSettings.particlesEnabled;
    if (particleSettings) {
        particleSettings.style.display = userSettings.particlesEnabled ? 'block' : 'none';
    }
    if (particleTypeSelect) particleTypeSelect.value = userSettings.particleType;
    if (particleCountInput) particleCountInput.value = userSettings.particleCount;
    if (particleCountValue) particleCountValue.textContent = userSettings.particleCount;
    if (particleSpeedInput) particleSpeedInput.value = userSettings.particleSpeed;
    if (particleSpeedValue) particleSpeedValue.textContent = userSettings.particleSpeed;
    if (particleColor1) particleColor1.value = userSettings.particleColors[0];
    if (particleColor2) particleColor2.value = userSettings.particleColors[1];
    if (particleColor3) particleColor3.value = userSettings.particleColors[2];
}

// Apply theme
function applyTheme() {
    document.body.className = userSettings.theme || 'light';
}

// Apply background image
function applyBackgroundImage() {
    if (!userSettings.bgImage) {
        document.body.style.backgroundImage = '';
        return;
    }

    // Check if it's a Firebase Storage URL
    if (userSettings.bgImage.startsWith('gs://')) {
        // Convert gs:// URL to download URL
        storage.refFromURL(userSettings.bgImage).getDownloadURL()
            .then(url => {
                document.body.style.backgroundImage = `url(${url})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundPosition = 'center';
            })
            .catch(error => {
                console.error('Error loading background image:', error);
                document.body.style.backgroundImage = '';
            });
    } else {
        // Regular URL
        document.body.style.backgroundImage = `url(${userSettings.bgImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
    }
}

// Apply particle settings
function applyParticleSettings() {
    if (userSettings.particlesEnabled) {
        startParticles();
    } else {
        stopParticles();
    }
}

// Setup panic key
function setupPanicKey() {
    if (!userSettings.panicKey || !userSettings.panicUrl) {
        panicKeySet = false;
        return;
    }

    panicKeySet = true;
    document.removeEventListener('keydown', handlePanicKey);
    document.addEventListener('keydown', handlePanicKey);
}

// Handle panic key press
function handlePanicKey(e) {
    if (e.key.toLowerCase() === userSettings.panicKey.toLowerCase()) {
        e.preventDefault();
        window.location.href = userSettings.panicUrl;
    }
}

// Show login modal
function showLoginModal() {
    if (loginModal) loginModal.classList.add('active');
}

// Hide login modal
function hideLoginModal() {
    if (loginModal) loginModal.classList.remove('active');
}

// Reset to default settings
function resetToDefaultSettings() {
    userSettings = {...defaultSettings};
    applyAllSettings();
    updateSettingsUI();
}

// Update user UI elements
function updateUserUI(user) {
    if (usernameDisplay) usernameDisplay.textContent = user.displayName || 'User';
    if (sidebarUsername) sidebarUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        if (profilePic) profilePic.src = user.photoURL;
        if (sidebarProfilePic) sidebarProfilePic.src = user.photoURL;
    } else {
        if (profilePic) profilePic.src = 'https://via.placeholder.com/40';
        if (sidebarProfilePic) sidebarProfilePic.src = 'https://via.placeholder.com/40';
    }
}

// Initialize particle canvas
function initializeParticleCanvas() {
    particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    document.body.appendChild(particleCanvas);
    particleCtx = particleCanvas.getContext('2d');
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);
}

// Resize particle canvas
function resizeParticleCanvas() {
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
}

// Start particle animation
function startParticles() {
    if (!particleCanvas || !userSettings.particlesEnabled) return;
    
    // Clear existing particles
    particles = [];
    
    // Create new particles
    for (let i = 0; i < userSettings.particleCount; i++) {
        particles.push(createParticle());
    }
    
    // Start animation
    if (!particleCanvas.dataset.animating) {
        particleCanvas.dataset.animating = 'true';
        animateParticles();
    }
}

// Stop particle animation
function stopParticles() {
    if (particleCanvas) {
        particleCanvas.dataset.animating = 'false';
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    }
}

// Create a single particle
function createParticle() {
    const type = userSettings.particleType;
    const colors = userSettings.particleColors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = userSettings.particleSpeed;
    
    return {
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        color: color,
        type: type
    };
}

// Animate particles
function animateParticles() {
    if (particleCanvas.dataset.animating !== 'true') return;
    
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
        
        switch (p.type) {
            case 'circle':
                particleCtx.beginPath();
                particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                particleCtx.fill();
                break;
                
            case 'star':
                drawStar(p.x, p.y, 5, p.size, p.size / 2);
                break;
                
            case 'triangle':
                drawTriangle(p.x, p.y, p.size * 2);
                break;
                
            default:
                particleCtx.beginPath();
                particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                particleCtx.fill();
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// Draw a star
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

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

// Draw a triangle
function drawTriangle(x, y, size) {
    const height = size * (Math.sqrt(3)/2);
    
    particleCtx.beginPath();
    particleCtx.moveTo(x, y - height/2);
    particleCtx.lineTo(x - size/2, y + height/2);
    particleCtx.lineTo(x + size/2, y + height/2);
    particleCtx.closePath();
    particleCtx.fill();
}

// Setup all event listeners
function setupEventListeners() {
    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
    
    if (sidebarToggleMobile) {
        sidebarToggleMobile.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    // Theme selection
    if (themeBtns) {
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!currentUser) {
                    showLoginModal();
                    return;
                }
                
                userSettings.theme = btn.dataset.theme;
                applyTheme();
                saveSettingsToFirebase();
                updateSettingsUI();
            });
        });
    }

    // Background image URL
    if (applyBgImageBtn) {
        applyBgImageBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.bgImage = bgImageUrlInput.value.trim();
            applyBackgroundImage();
            saveSettingsToFirebase();
        });
    }

    // Background image upload
    if (bgImageUpload) {
        bgImageUpload.addEventListener('change', (e) => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }
            
            const storageRef = storage.ref(`backgrounds/${currentUser.uid}/${file.name}`);
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress tracking could be added here
                },
                (error) => {
                    console.error('Upload failed:', error);
                    alert('Upload failed: ' + error.message);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        userSettings.bgImage = downloadURL;
                        bgImageUrlInput.value = downloadURL;
                        applyBackgroundImage();
                        saveSettingsToFirebase();
                    });
                }
            );
        });
    }

    // Reset background
    if (resetBgBtn) {
        resetBgBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.bgImage = '';
            bgImageUrlInput.value = '';
            bgImageUpload.value = '';
            applyBackgroundImage();
            saveSettingsToFirebase();
        });
    }

    // Tab cloaker selection
    if (cloakSiteSelect) {
        cloakSiteSelect.addEventListener('change', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.cloakSite = cloakSiteSelect.value;
            if (cloakSiteSelect.value === 'custom') {
                customCloakContainer.style.display = 'block';
            } else {
                customCloakContainer.style.display = 'none';
                userSettings.customCloakUrl = '';
            }
            saveSettingsToFirebase();
        });
    }

    // Apply cloak
    if (applyCloakBtn) {
        applyCloakBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            if (cloakSiteSelect.value === 'custom') {
                userSettings.customCloakUrl = customCloakUrl.value.trim();
                if (!userSettings.customCloakUrl) {
                    alert('Please enter a valid URL');
                    return;
                }
            }
            
            saveSettingsToFirebase();
            alert('Tab cloaker settings saved. Changes will take effect when you open a new tab.');
        });
    }

    // Reset cloak
    if (resetCloakBtn) {
        resetCloakBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.cloakSite = '';
            userSettings.customCloakUrl = '';
            cloakSiteSelect.value = '';
            customCloakContainer.style.display = 'none';
            customCloakUrl.value = '';
            saveSettingsToFirebase();
        });
    }

    // Set panic key
    if (setPanicKeyBtn) {
        setPanicKeyBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            const url = panicUrlInput.value.trim();
            if (!url) {
                alert('Please enter a URL for the panic key');
                return;
            }
            
            panicKeyInput.value = 'Press any key';
            document.addEventListener('keydown', capturePanicKey);
            
            function capturePanicKey(e) {
                e.preventDefault();
                userSettings.panicKey = e.key;
                userSettings.panicUrl = url;
                panicKeyInput.value = e.key;
                document.removeEventListener('keydown', capturePanicKey);
                setupPanicKey();
                saveSettingsToFirebase();
            }
        });
    }

    // Reset panic key
    if (resetPanicKeyBtn) {
        resetPanicKeyBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.panicKey = '';
            userSettings.panicUrl = '';
            panicKeyInput.value = '';
            panicUrlInput.value = '';
            setupPanicKey();
            saveSettingsToFirebase();
        });
    }

    // Particle effects toggle
    if (particlesToggle) {
        particlesToggle.addEventListener('change', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.particlesEnabled = particlesToggle.checked;
            if (particleSettings) {
                particleSettings.style.display = particlesToggle.checked ? 'block' : 'none';
            }
            applyParticleSettings();
            saveSettingsToFirebase();
        });
    }

    // Particle type
    if (particleTypeSelect) {
        particleTypeSelect.addEventListener('change', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.particleType = particleTypeSelect.value;
            applyParticleSettings();
            saveSettingsToFirebase();
        });
    }

    // Particle count
    if (particleCountInput) {
        particleCountInput.addEventListener('input', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.particleCount = particleCountInput.value;
            if (particleCountValue) particleCountValue.textContent = particleCountInput.value;
            
            if (userSettings.particlesEnabled) {
                applyParticleSettings();
            }
            
            saveSettingsToFirebase();
        });
    }

    // Particle speed
    if (particleSpeedInput) {
        particleSpeedInput.addEventListener('input', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            userSettings.particleSpeed = particleSpeedInput.value;
            if (particleSpeedValue) particleSpeedValue.textContent = particleSpeedInput.value;
            
            if (userSettings.particlesEnabled) {
                applyParticleSettings();
            }
            
            saveSettingsToFirebase();
        });
    }

    // Particle colors
    if (particleColor1 && particleColor2 && particleColor3) {
        [particleColor1, particleColor2, particleColor3].forEach((input, index) => {
            input.addEventListener('change', () => {
                if (!currentUser) {
                    showLoginModal();
                    return;
                }
                
                userSettings.particleColors[index] = input.value;
                
                if (userSettings.particlesEnabled) {
                    applyParticleSettings();
                }
                
                saveSettingsToFirebase();
            });
        });
    }

    // Sign out
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            auth.signOut().catch(error => {
                console.error('Sign out error:', error);
            });
        });
    }

    // Reset all settings
    if (resetAllSettingsBtn) {
        resetAllSettingsBtn.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            if (confirm('Are you sure you want to reset all settings to default?')) {
                resetToDefaultSettings();
                saveSettingsToFirebase();
            }
        });
    }

    // Go to login
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => {
            window.location.href = 'index.html'; // Or your login page
        });
    }
}

// Initialize the settings when DOM is loaded
document.addEventListener('DOMContentLoaded', initSettings);
