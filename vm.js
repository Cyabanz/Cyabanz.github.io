// Configuration
const CONFIG = {
    // Note: In production, don't hardcode API keys. Use environment variables or user input.
    HB_API_KEY: 'sk_test_IfATh9MlCs7QtUVFbNlzgj4HPxOoGQQuwqb8-hpYwq0', // Replace with your key
    VM_SCREEN_ID: 'vm-screen',
    ROTATION_SPEED: 0.005
};

// Three.js variables
let scene, camera, renderer, computer, powerOn = false;
let rotateView = false;
let controls;

// Hyperbeam variables
let hb, hbEmbed;

// Initialize the application
async function init() {
    initThreeJS();
    initControls();
    createComputerModel();
    initEventListeners();
    animate();
}

// Initialize Three.js
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 2;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
}

// Initialize UI controls
function initControls() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize event listeners
function initEventListeners() {
    const powerBtn = document.getElementById('power-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    
    powerBtn.addEventListener('click', togglePower);
    rotateBtn.addEventListener('click', () => {
        rotateView = !rotateView;
        controls.enabled = !rotateView;
        rotateBtn.textContent = rotateView ? 'Stop Rotation' : 'Rotate View';
    });
}

// Create a simple computer model
function createComputerModel() {
    // Computer base
    const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.5;
    
    // Screen
    const screenGeometry = new THREE.BoxGeometry(2.8, 1.5, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111,
        emissive: 0x000000,
        emissiveIntensity: 0
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.75, -0.9);
    screen.rotation.x = -0.3;
    
    // Add to group
    computer = new THREE.Group();
    computer.add(base);
    computer.add(screen);
    scene.add(computer);
    
    // Store screen reference
    computer.userData.screen = screen;
}

// Toggle power on/off
async function togglePower() {
    const powerBtn = document.getElementById('power-btn');
    powerBtn.disabled = true;
    powerBtn.textContent = powerOn ? 'Shutting down...' : 'Booting up...';
    
    try {
        if (powerOn) {
            // Powering off
            computer.userData.screen.material.emissiveIntensity = 0;
            
            // Destroy Hyperbeam session
            if (hbEmbed) {
                await hbEmbed.destroy();
                hbEmbed = null;
            }
        } else {
            // Powering on
            computer.userData.screen.material.emissiveIntensity = 0.5;
            
            // Initialize Hyperbeam
            await initHyperbeam();
        }
        
        powerOn = !powerOn;
        powerBtn.textContent = powerOn ? 'Power Off' : 'Power On';
    } catch (error) {
        console.error('Error toggling power:', error);
        powerBtn.textContent = powerOn ? 'Power Off' : 'Power On';
    } finally {
        powerBtn.disabled = false;
    }
}

// Initialize Hyperbeam
async function initHyperbeam() {
    try {
        // Show loading state
        const vmScreen = document.getElementById(CONFIG.VM_SCREEN_ID);
        vmScreen.innerHTML = '<div class="loading">Connecting to VM...</div>';
        
        // Initialize Hyperbeam
        hb = await window.Hyperbeam(CONFIG.HB_API_KEY);
        
        // Create a new VM session
        const { embed_url } = await hb.createSession({
            stealth_mode: false,
            persistent: false
        });
        
        // Create the iframe
        vmScreen.innerHTML = ''; // Clear loading message
        hbEmbed = await hb.embed(vmScreen, embed_url, {
            fullscreen: false,
            styles: {
                width: '100%',
                height: '100%',
                border: 'none'
            }
        });
        
        console.log('Hyperbeam VM initialized');
    } catch (error) {
        console.error('Error initializing Hyperbeam:', error);
        const vmScreen = document.getElementById(CONFIG.VM_SCREEN_ID);
        vmScreen.innerHTML = '<div class="error">Failed to connect to VM. Please try again.</div>';
        throw error; // Re-throw for togglePower to handle
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (rotateView) {
        computer.rotation.y += CONFIG.ROTATION_SPEED;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Start the application
init();
