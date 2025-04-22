// Game State
const gameState = {
    money: 10000,
    reputation: 0,
    health: 100,
    time: 0, // in minutes
    ingredients: {
        herb: 10,
        chemical: 5,
        powder: 8,
        liquid: 200
    },
    inventory: {},
    weapons: {},
    customers: {
        junkie: { name: "Junkie", frequency: 5, trust: 50, maxAmount: 5 },
        dealer: { name: "Dealer", frequency: 2, trust: 30, maxAmount: 20 },
        richKid: { name: "Rich Kid", frequency: 3, trust: 70, maxAmount: 10 }
    },
    gangs: {
        vipers: { name: "Vipers", status: "neutral", perk: "drugPrices", value: 0.2 },
        wolves: { name: "Wolves", status: "neutral", perk: "policeHeat", value: -0.3 },
        dragons: { name: "Dragons", status: "neutral", perk: "weaponDamage", value: 0.5 }
    },
    policeHeat: 0,
    inJail: false,
    jailDays: 0,
    dead: false,
    warStatus: "peace",
    currentDelivery: null,
    carPosition: 50,
    currentGang: null,
    avatar: {
        skinColor: "#FFDBAC",
        hairStyle: "short",
        hairColor: "black",
        clothing: "hoodie"
    },
    shootingStats: {
        hits: 0,
        misses: 0,
        accuracy: 0
    }
};

// Recipes
const recipes = {
    weed: { ingredients: { herb: 5 }, value: 20, difficulty: 1 },
    meth: { ingredients: { chemical: 2, powder: 1 }, value: 50, difficulty: 2 },
    coke: { ingredients: { powder: 3, liquid: 50 }, value: 80, difficulty: 3 },
    heroin: { ingredients: { herb: 2, liquid: 100, chemical: 1 }, value: 100, difficulty: 4 }
};

// Weapons
const weapons = {
    pistol: { price: 500, damage: 50 },
    shotgun: { price: 1200, damage: 80 },
    rifle: { price: 2500, damage: 120 },
    switch: { price: 5000, damage: 200 }
};

// Deliveries
const deliveries = {
    small: { risk: 0.1, reward: 500, policeChance: 0.2 },
    medium: { risk: 0.3, reward: 1500, policeChance: 0.4 },
    large: { risk: 0.6, reward: 3500, policeChance: 0.7 }
};

// Ingredient prices
const ingredientPrices = {
    herb: 10,
    chemical: 20,
    powder: 15,
    liquid: 5
};

// Game Variables
let currentScreen = 'home';
let craftingDrug = null;
let currentCustomer = null;
let currentDeal = null;
let raidTimer = null;
let policeTimer = null;
let raidItemsHidden = 0;
let stolenItems = [];
let gameInterval;
let mixInterval;
let tempInterval;
let deliveryInterval;
let trafficInterval;
let policeInterval;
let shootingInterval;
let targetInterval;
let deliveryProgress = 0;
let trafficCars = [];
let policeCars = [];
let keyState = {};
let activeTargets = [];
let shootingScore = 0;

// Initialize the game
function initGame() {
    updateUI();
    startGameClock();
    setupEventListeners();
    generateRandomEvents();
    setupKeyboardControls();
    renderAvatar();
}

// Update all UI elements
function updateUI() {
    // Update money display
    document.querySelectorAll('[id$="-money"]').forEach(el => {
        el.textContent = `$${gameState.money.toLocaleString()}`;
    });
    
    // Update time display
    updateTimeDisplay();
    
    // Update reputation
    document.getElementById('game-rep').textContent = `Rep: ${gameState.reputation}`;
    
    // Update health
    document.querySelectorAll('[id$="-health"]').forEach(el => {
        el.textContent = `Health: ${gameState.health}%`;
    });
    
    // Update inventory list
    updateInventoryDisplay();
    
    // Update weapons list
    updateWeaponsDisplay();
    
    // Update gang status
    updateGangStatus();
    
    // Update war status
    document.getElementById('war-status').textContent = gameState.warStatus.charAt(0).toUpperCase() + gameState.warStatus.slice(1);
}

function updateTimeDisplay() {
    const hours = Math.floor(gameState.time / 60) % 24;
    const minutes = gameState.time % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.querySelectorAll('[id$="-time"]').forEach(el => el.textContent = timeString);
}

// Update inventory display
function updateInventoryDisplay() {
    const drugListElement = document.querySelector('.drugs-list');
    drugListElement.innerHTML = '';
    for (const drug in gameState.inventory) {
        const div = document.createElement('div');
        div.className = 'drug-item';
        div.innerHTML = `<strong>${drug}</strong>: ${gameState.inventory[drug]}g ($${recipes[drug].value * gameState.inventory[drug]})`;
        drugListElement.appendChild(div);
    }
}

// Update weapons display
function updateWeaponsDisplay() {
    const weaponsListElement = document.querySelector('.owned-weapons-list');
    weaponsListElement.innerHTML = '';
    for (const weapon in gameState.weapons) {
        const div = document.createElement('div');
        div.className = 'owned-weapon';
        div.textContent = `${weapon.charAt(0).toUpperCase() + weapon.slice(1)} (${gameState.weapons[weapon]}x)`;
        weaponsListElement.appendChild(div);
    }
}

// Update gang status display
function updateGangStatus() {
    document.querySelectorAll('.gang').forEach(gangEl => {
        const gang = gangEl.dataset.gang;
        const statusEl = gangEl.querySelector('p:nth-of-type(1)');
        statusEl.textContent = `Status: ${gameState.gangs[gang].status.charAt(0).toUpperCase() + gameState.gangs[gang].status.slice(1)}`;
    });
}

// Start the game clock
function startGameClock() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (gameState.dead) return;
        
        gameState.time += 5; // Advance time by 5 minutes
        
        // Check for random events every hour
        if (gameState.time % 60 === 0) {
            checkForRandomEvents();
        }
        
        updateUI();
    }, 3000); // 3 seconds = 5 minutes game time
}

// Check for random events
function checkForRandomEvents() {
    // Random customer messages
    if (Math.random() < 0.3) {
        sendRandomCustomerMessage();
    }
    
    // Police heat increases with more drugs
    const totalDrugs = Object.values(gameState.inventory).reduce((a, b) => a + b, 0);
    let heatIncrease = totalDrugs * 0.5;
    
    // Apply gang perk if allied with Wolves
    if (gameState.gangs.wolves.status === "allied") {
        heatIncrease *= (1 + gameState.gangs.wolves.value);
    }
    
    gameState.policeHeat = Math.min(100, gameState.policeHeat + heatIncrease);
    updatePoliceScanner();
    
    // Chance of police raid based on heat level
    if (Math.random() < gameState.policeHeat / 200) {
        startPoliceRaid();
    }
    
    // Chance of gang retaliation if at war
    if (gameState.warStatus === "war" && Math.random() < 0.2) {
        gangRetaliation();
    }
}

// Generate random events over time
function generateRandomEvents() {
    setInterval(() => {
        if (currentScreen === 'phone' && Math.random() < 0.1) {
            sendRandomCustomerMessage();
        }
    }, 15000);
}

// Send random customer message
function sendRandomCustomerMessage() {
    if (currentScreen !== 'phone') return;
    
    const customers = Object.keys(gameState.customers);
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const customer = gameState.customers[randomCustomer];
    
    const drugs = Object.keys(gameState.inventory);
    if (drugs.length === 0) return;
    
    const randomDrug = drugs[Math.floor(Math.random() * drugs.length)];
    const maxAmount = Math.min(customer.maxAmount, gameState.inventory[randomDrug]);
    if (maxAmount <= 0) return;
    
    let priceMultiplier = 0.8 + Math.random() * 0.4;
    
    // Apply gang perk if allied with Vipers
    if (gameState.gangs.vipers.status === "allied") {
        priceMultiplier *= (1 + gameState.gangs.vipers.value);
    }
    
    const amount = Math.max(1, Math.floor(Math.random() * maxAmount));
    const price = amount * recipes[randomDrug].value * priceMultiplier;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message customer';
    messageDiv.dataset.customer = randomCustomer;
    messageDiv.dataset.drug = randomDrug;
    messageDiv.dataset.amount = amount;
    messageDiv.dataset.price = Math.floor(price);
    messageDiv.textContent = `Hey, got ${amount}g of ${randomDrug}? I can pay $${Math.floor(price)}.`;
    
    document.querySelector('.message-list').appendChild(messageDiv);
    document.getElementById('reply-box').classList.remove('hidden');
}

// Setup event listeners
function setupEventListeners() {
    // App icons
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const app = icon.dataset.app;
            showAppScreen(app);
        });
    });
    
    // Back buttons
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            showAppScreen('home');
        });
    });
    
    // Craft buttons
    document.querySelectorAll('.craft-button').forEach(button => {
        button.addEventListener('click', () => {
            const recipe = button.dataset.recipe;
            startCrafting(recipe);
        });
    });
    
    // Crafting mini-game
    document.getElementById('prepare-button').addEventListener('click', checkPrepareStep);
    document.getElementById('mix-button').addEventListener('click', startMixing);
    document.getElementById('heat-up').addEventListener('click', () => adjustTemperature(5));
    document.getElementById('cool-down').addEventListener('click', () => adjustTemperature(-5));
    document.getElementById('done-button').addEventListener('click', finishCrafting);
    
    // Phone tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            showPhoneTab(tab);
        });
    });
    
    // Call buttons
    document.querySelectorAll('.call-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const contact = e.target.closest('.contact').dataset.contact;
            callContact(contact);
        });
    });
    
    // Message buttons
    document.querySelectorAll('.message-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const contact = e.target.closest('.contact').dataset.contact;
            showMessageTab(contact);
        });
    });
    
    // Send message button
    document.getElementById('send-message').addEventListener('click', sendMessage);
    
    // Reply options
    document.querySelectorAll('.reply-option').forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.option;
            handleReply(action);
        });
    });
    
    // Deal mini-game
    document.getElementById('start-deal').addEventListener('click', startDealExchange);
    document.getElementById('steal-button').addEventListener('click', attemptSteal);
    document.getElementById('deal-done').addEventListener('click', () => showAppScreen('phone'));
    
    // Raid mini-game
    document.querySelectorAll('.raid-item').forEach(item => {
        item.addEventListener('click', () => selectRaidItem(item));
    });
    
    document.querySelectorAll('.hiding-spot').forEach(spot => {
        spot.addEventListener('click', () => hideRaidItem(spot));
    });
    
    document.getElementById('raid-continue').addEventListener('click', () => {
        if (gameState.inJail) {
            showAppScreen('jail');
        } else {
            showAppScreen('home');
        }
    });
    
    // Store robbery
    document.querySelectorAll('.rob-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const store = e.target.closest('.store-option').dataset.store;
            startStoreRobbery(store);
        });
    });
    
    // Gun store
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const gun = e.target.closest('.gun-option').dataset.gun;
            buyWeapon(gun);
        });
    });
    
    // Practice shooting button
    document.getElementById('practice-button').addEventListener('click', startShootingRange);
    
    // Shooting range controls
    document.getElementById('shoot-button').addEventListener('click', shootAtTarget);
    document.getElementById('range-done').addEventListener('click', () => showAppScreen('gun-store'));
    
    // Gang actions
    document.querySelectorAll('.gang-action').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const gang = e.target.closest('.gang').dataset.gang;
            handleGangAction(gang, action);
        });
    });
    
    // War actions
    document.querySelectorAll('.war-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            handleWarAction(action);
        });
    });
    
    document.getElementById('war-continue').addEventListener('click', () => {
        document.getElementById('war-outcome').classList.add('hidden');
    });
    
    // Delivery
    document.querySelectorAll('.start-delivery').forEach(button => {
        button.addEventListener('click', (e) => {
            const delivery = e.target.closest('.delivery-option').dataset.delivery;
            startDelivery(delivery);
        });
    });
    
    document.getElementById('delivery-continue').addEventListener('click', () => {
        showAppScreen('delivery');
    });
    
    // Robbery mini-game
    document.querySelectorAll('.store-item').forEach(item => {
        item.addEventListener('click', () => stealItem(item));
    });
    
    document.querySelectorAll('.police-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const action = e.target.dataset.option;
            handlePoliceEncounter(action);
        });
    });
    
    document.getElementById('robbery-done').addEventListener('click', () => {
        if (gameState.inJail) {
            showAppScreen('jail');
        } else {
            showAppScreen('store');
        }
    });
    
    // Jail options
    document.querySelectorAll('.jail-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const action = e.target.dataset.option;
            handleJailAction(action);
        });
    });
    
    document.getElementById('jail-continue').addEventListener('click', continueJailTime);
    
    // Avatar customization
    document.querySelectorAll('.skin-color').forEach(color => {
        color.addEventListener('click', (e) => {
            gameState.avatar.skinColor = e.target.dataset.color;
            renderAvatar();
        });
    });
    
    document.getElementById('hair-style').addEventListener('change', (e) => {
        gameState.avatar.hairStyle = e.target.value;
        renderAvatar();
    });
    
    document.getElementById('hair-color').addEventListener('change', (e) => {
        gameState.avatar.hairColor = e.target.value;
        renderAvatar();
    });
    
    document.getElementById('clothing').addEventListener('change', (e) => {
        gameState.avatar.clothing = e.target.value;
        renderAvatar();
    });
    
    document.getElementById('save-avatar').addEventListener('click', () => {
        showAppScreen('home');
    });
    
    // Buy ingredients
    document.querySelectorAll('.buy-ingredient').forEach(button => {
        button.addEventListener('click', (e) => {
            const ingredient = e.target.closest('.ingredient-option').dataset.ingredient;
            const quantity = parseInt(e.target.previousElementSibling.value);
            buyIngredient(ingredient, quantity);
        });
    });
}

// Setup keyboard controls for delivery game
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        keyState[e.key] = true;
        
        if (currentScreen === 'delivery' && document.getElementById('delivery-game').classList.contains('hidden') === false) {
            if (e.key === 'ArrowLeft') {
                moveCar(-10);
            } else if (e.key === 'ArrowRight') {
                moveCar(10);
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keyState[e.key] = false;
    });
    
    // Touch controls for mobile
    document.getElementById('move-left').addEventListener('touchstart', () => {
        keyState['ArrowLeft'] = true;
    });
    
    document.getElementById('move-left').addEventListener('touchend', () => {
        keyState['ArrowLeft'] = false;
    });
    
    document.getElementById('move-right').addEventListener('touchstart', () => {
        keyState['ArrowRight'] = true;
    });
    
    document.getElementById('move-right').addEventListener('touchend', () => {
        keyState['ArrowRight'] = false;
    });
}

// Show app screen
function showAppScreen(screen) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.add('hidden'));
    currentScreen = screen;
    
    const screenMap = {
        'home': 'home-screen',
        'lab': 'lab-screen',
        'phone': 'phone-screen',
        'scanner': 'scanner-screen',
        'store': 'store-screen',
        'gun-store': 'gun-store-screen',
        'gangs': 'gangs-screen',
        'delivery': 'delivery-screen',
        'jail': 'jail-screen',
        'crafting': 'crafting-screen',
        'deal': 'deal-screen',
        'robbery': 'robbery-screen',
        'raid': 'raid-screen',
        'shooting-range': 'shooting-range-screen',
        'avatar': 'avatar-screen',
        'ingredient-store': 'ingredient-store-screen'
    };
    
    const screenId = screenMap[screen];
    if (screenId) {
        document.getElementById(screenId).classList.remove('hidden');
    }
    
    // Special cases
    if (screen === 'phone') {
        showPhoneTab('messages');
    } else if (screen === 'jail' && !gameState.inJail) {
        showAppScreen('home');
    } else if (screen === 'gangs') {
        showGangTab('alliances');
    } else if (screen === 'scanner') {
        initializeScannerScreen();
    } else if (screen === 'shooting-range') {
        startShootingRange();
    }
}

// Show phone tab
function showPhoneTab(tab) {
    document.querySelectorAll('.phone-content .tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.phone-tabs .tab-button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.querySelector(`.phone-tabs .tab-button[data-tab="${tab}"]`).classList.add('active');
}

// Show message tab with contact pre-selected
function showMessageTab(contact) {
    showPhoneTab('new-message');
    document.getElementById('message-recipient').value = contact;
}

// Show gang tab
function showGangTab(tab) {
    document.querySelectorAll('.gang-content .tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.gang-tabs .tab-button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.querySelector(`.gang-tabs .tab-button[data-tab="${tab}"]`).classList.add('active');
}

// Start crafting a drug
function startCrafting(drug) {
    // Check ingredients
    const recipe = recipes[drug];
    for (const ing in recipe.ingredients) {
        if (gameState.ingredients[ing] < recipe.ingredients[ing]) {
            alert(`Not enough ${ing}!`);
            return;
        }
    }
    
    // Deduct ingredients
    for (const ing in recipe.ingredients) {
        gameState.ingredients[ing] -= recipe.ingredients[ing];
    }
    
    // Show crafting screen
    craftingDrug = drug;
    document.getElementById('crafting-drug-name').textContent = drug.charAt(0).toUpperCase() + drug.slice(1);
    document.getElementById('craft-drug').textContent = `Crafting: ${drug.charAt(0).toUpperCase() + drug.slice(1)}`;
    
    showAppScreen('crafting');
    
    // Reset crafting steps
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('crafting-result').classList.add('hidden');
    
    // Reset step results
    document.getElementById('step1-result').classList.add('hidden');
    document.getElementById('step2-result').classList.add('hidden');
    document.getElementById('step3-result').classList.add('hidden');
}

// Check prepare step
function checkPrepareStep() {
    const arrow = document.querySelector('.arrow');
    const greenZone = document.querySelector('.green-zone');
    const arrowRect = arrow.getBoundingClientRect();
    const zoneRect = greenZone.getBoundingClientRect();
    
    const resultElement = document.getElementById('step1-result');
    resultElement.classList.remove('hidden');
    
    if (arrowRect.left >= zoneRect.left && arrowRect.right <= zoneRect.right) {
        // Success
        resultElement.textContent = "Perfect preparation!";
        resultElement.className = 'step-result success';
        
        // Move to next step
        setTimeout(() => {
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('step2-result').classList.add('hidden');
            document.getElementById('mix-progress').value = 0;
        }, 1000);
    } else {
        // Failure
        resultElement.textContent = "Poor preparation! Quality will suffer.";
        resultElement.className = 'step-result failure';
    }
}

// Start mixing
let mixProgress = 0;

function startMixing() {
    const mixButton = document.getElementById('mix-button');
    mixButton.disabled = true;
    
    clearInterval(mixInterval);
    mixProgress = 0;
    
    mixInterval = setInterval(() => {
        mixProgress += 5 + Math.random() * 10;
        document.getElementById('mix-progress').value = mixProgress;
        
        if (mixProgress >= 100) {
            finishMixing();
        }
    }, 100);
}

function finishMixing() {
    clearInterval(mixInterval);
    document.getElementById('mix-button').disabled = false;
    
    const resultElement = document.getElementById('step2-result');
    resultElement.classList.remove('hidden');
    
    if (mixProgress >= 100) {
        resultElement.textContent = "Thoroughly mixed!";
        resultElement.className = 'step-result success';
        
        // Move to next step
        setTimeout(() => {
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('step3-result').classList.add('hidden');
            
            // Start temperature game
            startTemperatureGame();
        }, 1000);
    }
    
    mixProgress = 0;
}

// Temperature game
let temperature = 50;

function startTemperatureGame() {
    temperature = 50;
    updateTemperatureDisplay();
    
    clearInterval(tempInterval);
    
    // Random temperature fluctuations
    tempInterval = setInterval(() => {
        temperature += (Math.random() - 0.5) * 10;
        temperature = Math.max(0, Math.min(100, temperature));
        updateTemperatureDisplay();
    }, 500);
    
    // End after 10 seconds
    setTimeout(() => {
        clearInterval(tempInterval);
        checkTemperatureResult();
    }, 10000);
}

function adjustTemperature(amount) {
    temperature += amount;
    temperature = Math.max(0, Math.min(100, temperature));
    updateTemperatureDisplay();
}

function updateTemperatureDisplay() {
    const indicator = document.querySelector('.temp-indicator');
    indicator.style.bottom = `${temperature}px`;
}

function checkTemperatureResult() {
    const resultElement = document.getElementById('step3-result');
    resultElement.classList.remove('hidden');
    
    if (temperature >= 40 && temperature <= 60) {
        resultElement.textContent = "Perfect temperature control!";
        resultElement.className = 'step-result success';
    } else {
        resultElement.textContent = "Temperature was off! Quality affected.";
        resultElement.className = 'step-result failure';
    }
    
    // Show final result
    setTimeout(() => {
        document.getElementById('step3').classList.add('hidden');
        showCraftingResult();
    }, 1500);
}

function showCraftingResult() {
    const resultElement = document.getElementById('crafting-outcome');
    
    // Calculate quality based on steps
    let quality = 1;
    if (document.getElementById('step1-result').className.includes('success')) quality *= 1.2;
    if (document.getElementById('step2-result').className.includes('success')) quality *= 1.2;
    if (document.getElementById('step3-result').className.includes('success')) quality *= 1.2;
    
    // Random amount between 80-120% of expected
    const baseAmount = 5 + craftingDrug.length; // Simple formula for amount
    const amount = Math.floor(baseAmount * (0.8 + Math.random() * 0.4) * quality);
    
    // Add to inventory
    if (!gameState.inventory[craftingDrug]) {
        gameState.inventory[craftingDrug] = 0;
    }
    gameState.inventory[craftingDrug] += amount;
    
    resultElement.textContent = `You crafted ${amount}g of ${craftingDrug.charAt(0).toUpperCase() + craftingDrug.slice(1)}!`;
    document.getElementById('crafting-result').classList.remove('hidden');
    
    // Increase police heat
    gameState.policeHeat += amount * 0.5;
    updatePoliceScanner();
}

function finishCrafting() {
    showAppScreen('lab');
    updateUI();
}

// Phone functions
function callContact(contact) {
    const customer = gameState.customers[contact];
    const drugs = Object.keys(gameState.inventory);
    if (drugs.length === 0) {
        alert("You don't have any drugs to sell!");
        return;
    }
    
    const randomDrug = drugs[Math.floor(Math.random() * drugs.length)];
    const maxAmount = Math.min(customer.maxAmount, gameState.inventory[randomDrug]);
    if (maxAmount <= 0) {
        alert(`You don't have any ${randomDrug} left!`);
        return;
    }
    
    let priceMultiplier = 0.8 + Math.random() * 0.4;
    
    // Apply gang perk if allied with Vipers
    if (gameState.gangs.vipers.status === "allied") {
        priceMultiplier *= (1 + gameState.gangs.vipers.value);
    }
    
    const amount = Math.max(1, Math.floor(Math.random() * maxAmount));
    const price = amount * recipes[randomDrug].value * priceMultiplier;
    
    startDeal(contact, randomDrug, amount, Math.floor(price));
}

function sendMessage() {
    const recipient = document.getElementById('message-recipient').value;
    const content = document.getElementById('message-content').value.trim();
    
    if (!content) {
        alert("Please enter a message!");
        return;
    }
    
    // Add player message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message player';
    messageDiv.textContent = content;
    document.querySelector('.message-list').appendChild(messageDiv);
    
    // Clear message box
    document.getElementById('message-content').value = '';
    
    // Show reply box
    document.getElementById('reply-box').classList.remove('hidden');
    
    // Generate response after delay
    setTimeout(() => {
        const customer = gameState.customers[recipient];
        const response = generateCustomerResponse(recipient, content);
        
        const responseDiv = document.createElement('div');
        responseDiv.className = 'message customer';
        responseDiv.textContent = response;
        document.querySelector('.message-list').appendChild(responseDiv);
    }, 2000);
}

function generateCustomerResponse(customer, message) {
    const responses = {
        junkie: [
            "Yo, that sounds good!",
            "I need that ASAP!",
            "Can you hook me up now?",
            "I'm sick, I need it now!",
            "How much for a quick deal?"
        ],
        dealer: [
            "I might be interested in bulk.",
            "What's your best price?",
            "I can move that quantity.",
            "Let's talk business.",
            "I need consistent supply."
        ],
        richKid: [
            "Dude, that's awesome!",
            "I'll pay extra for quality.",
            "Let's party with this!",
            "Money's no problem.",
            "I'll take your whole stock!"
        ]
    };
    
    return responses[customer][Math.floor(Math.random() * responses[customer].length)];
}

function handleReply(action) {
    const message = document.getElementById('reply-box').previousElementSibling;
    if (!message || !message.dataset.customer) return;
    
    const customer = message.dataset.customer;
    const drug = message.dataset.drug;
    const amount = parseInt(message.dataset.amount);
    const price = parseInt(message.dataset.price);
    
    let response = "";
    let finalPrice = price;
    
    switch(action) {
        case 'accept':
            response = `OK, deal. Meet at the usual spot.`;
            break;
        case 'decline':
            response = `Sorry, not interested right now.`;
            break;
        case 'negotiate':
            finalPrice = Math.floor(price * (1.1 + Math.random() * 0.2));
            response = `How about $${finalPrice} instead?`;
            break;
        case 'sample':
            response = `I'll give you a free sample, come by later.`;
            // Give free sample (reduce inventory)
            if (gameState.inventory[drug] >= 1) {
                gameState.inventory[drug] -= 1;
                if (gameState.inventory[drug] <= 0) delete gameState.inventory[drug];
                // Increase reputation
                gameState.reputation += 5;
                updateUI();
            }
            break;
    }
    
    // Add player response
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message player';
    responseDiv.textContent = response;
    document.querySelector('.message-list').appendChild(responseDiv);
    
    // If accepted, start deal
    if (action === 'accept' || (action === 'negotiate' && Math.random() > 0.3)) {
        startDeal(customer, drug, amount, finalPrice);
    }
    
    // Hide reply box
    document.getElementById('reply-box').classList.add('hidden');
}

function startDeal(customer, drug, amount, price) {
    // Check if we still have the drugs
    if (!gameState.inventory[drug] || gameState.inventory[drug] < amount) {
        alert(`You don't have enough ${drug} for this deal!`);
        return;
    }
    
    currentCustomer = customer;
    currentDeal = { drug, amount, price };
    
    document.getElementById('deal-customer').textContent = `Customer: ${customer.charAt(0).toUpperCase() + customer.slice(1)}`;
    document.getElementById('deal-customer-name').textContent = customer.charAt(0).toUpperCase() + customer.slice(1);
    document.getElementById('deal-description').textContent = `Meeting with ${customer.charAt(0).toUpperCase() + customer.slice(1)} to sell ${amount}g of ${drug.charAt(0).toUpperCase() + drug.slice(1)} for $${price}`;
    
    showAppScreen('deal');
}

function startDealExchange() {
    document.getElementById('deal-step1').classList.add('hidden');
    document.getElementById('deal-step2').classList.remove('hidden');
    document.getElementById('deal-result').classList.add('hidden');
}

function attemptSteal() {
    const arrow = document.querySelector('.steal-arrow');
    const greenZone = document.querySelector('.steal-green-zone');
    const arrowRect = arrow.getBoundingClientRect();
    const zoneRect = greenZone.getBoundingClientRect();
    
    const resultElement = document.getElementById('deal-result');
    resultElement.classList.remove('hidden');
    
    if (arrowRect.left >= zoneRect.left && arrowRect.right <= zoneRect.right) {
        // Success - steal extra money
        const extra = Math.floor(currentDeal.price * 0.3);
        gameState.money += currentDeal.price + extra;
        gameState.inventory[currentDeal.drug] -= currentDeal.amount;
        if (gameState.inventory[currentDeal.drug] <= 0) delete gameState.inventory[currentDeal.drug];
        
        resultElement.textContent = `Success! You got $${currentDeal.price} and stole an extra $${extra}!`;
        resultElement.className = 'deal-result success';
        
        // Increase reputation but also police heat
        gameState.reputation += 10;
        gameState.policeHeat += 5;
    } else {
        // Failure - customer notices
        if (Math.random() < 0.5) {
            // Customer gets angry, pays less
            const reduced = Math.floor(currentDeal.price * 0.7);
            gameState.money += reduced;
            gameState.inventory[currentDeal.drug] -= currentDeal.amount;
            if (gameState.inventory[currentDeal.drug] <= 0) delete gameState.inventory[currentDeal.drug];
            
            resultElement.textContent = `Caught! ${currentCustomer.charAt(0).toUpperCase() + currentCustomer.slice(1)} got angry and only paid $${reduced}.`;
            resultElement.className = 'deal-result failure';
            
            // Decrease reputation
            gameState.reputation -= 5;
        } else {
            // Customer doesn't notice, normal deal
            gameState.money += currentDeal.price;
            gameState.inventory[currentDeal.drug] -= currentDeal.amount;
            if (gameState.inventory[currentDeal.drug] <= 0) delete gameState.inventory[currentDeal.drug];
            
            resultElement.textContent = `You got away with it and earned $${currentDeal.price}.`;
            resultElement.className = 'deal-result';
        }
    }
    
    document.getElementById('deal-step2').classList.add('hidden');
    document.getElementById('deal-step3').classList.remove('hidden');
    document.getElementById('deal-outcome').textContent = resultElement.textContent;
    
    updateUI();
    updatePoliceScanner();
}

// Police scanner functions
function initializeScannerScreen() {
    // Clear any existing scanner interval
    if (window.scannerInterval) {
        clearInterval(window.scannerInterval);
    }
    
    // Update initial scanner display
    updatePoliceScanner();
    
    // Set up the scanning animation
    window.scannerInterval = setInterval(updatePoliceScanner, 2000);
}

function updatePoliceScanner() {
    if (!document.getElementById('scanner-screen').classList.contains('hidden')) {
        // Update heat level
        document.getElementById('heat-level').textContent = `${Math.floor(gameState.policeHeat)}%`;
        
        // Update activity level
        let activity = "Low";
        if (gameState.policeHeat > 50) activity = "Medium";
        if (gameState.policeHeat > 80) activity = "High";
        document.getElementById('police-activity').textContent = activity;
        
        // Generate random scanner messages
        const messages = [
            "All units, report status...",
            "10-4, patrolling downtown...",
            "Dispatch to all units...",
            "Checking in, sector 4 clear...",
            `Looking in ${['north', 'south', 'east', 'west'][Math.floor(Math.random()*4)]} sector...`,
            "Checking license plates...",
            "Standby for updates..."
        ];
        
        if (gameState.policeHeat > 70) {
            messages.push("Undercover operation in progress...");
            messages.push("Monitoring known locations...");
            messages.push("Possible drug activity reported...");
        }
        
        document.querySelector('.scanner-message').textContent = messages[Math.floor(Math.random() * messages.length)];
        
        // Animate the activity bars
        const bars = document.querySelectorAll('.activity-bar');
        bars.forEach(bar => {
            bar.style.height = `${5 + Math.random() * 15}px`;
        });
    }
}

function startPoliceRaid() {
    if (currentScreen === 'raid' || gameState.inJail) return;
    
    // Check if player has any drugs
    const totalDrugs = Object.values(gameState.inventory).reduce((a, b) => a + b, 0);
    if (totalDrugs === 0 && gameState.money < 1000) return;
    
    showAppScreen('raid');
    
    // Reset raid game
    raidItemsHidden = 0;
    document.querySelectorAll('.raid-item').forEach(item => {
        item.classList.remove('hidden');
        item.dataset.hidden = 'false';
        item.dataset.selected = 'false';
    });
    document.querySelector('.raid-result').classList.add('hidden');
    
    // Start timer (30 seconds)
    let timeLeft = 30;
    document.getElementById('raid-timer').textContent = `Time: ${timeLeft}s`;
    
    clearInterval(raidTimer);
    raidTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('raid-timer').textContent = `Time: ${timeLeft}s`;
        document.getElementById('raid-progress').value = (timeLeft / 30) * 100;
        
        if (timeLeft <= 0) {
            finishRaid();
        }
    }, 1000);
}

function selectRaidItem(item) {
    if (item.dataset.hidden === 'true') return;
    
    // Clear previous selection
    document.querySelectorAll('.raid-item').forEach(i => {
        i.dataset.selected = 'false';
    });
    
    item.dataset.selected = 'true';
    document.querySelectorAll('.hiding-spot').forEach(spot => {
        spot.style.backgroundColor = '#555';
    });
}

function hideRaidItem(spot) {
    const selectedItem = document.querySelector('.raid-item[data-selected="true"]');
    if (!selectedItem) return;
    
    selectedItem.classList.add('hidden');
    selectedItem.dataset.hidden = 'true';
    selectedItem.dataset.selected = 'false';
    selectedItem.dataset.spot = spot.dataset.spot;
    raidItemsHidden++;
    
    // Reset spot colors
    document.querySelectorAll('.hiding-spot').forEach(s => {
        s.style.backgroundColor = '#333';
    });
}

function finishRaid() {
    clearInterval(raidTimer);
    document.querySelector('.raid-result').classList.remove('hidden');
    
    const totalItems = document.querySelectorAll('.raid-item').length;
    const hiddenPercent = (raidItemsHidden / totalItems) * 100;
    
    if (hiddenPercent >= 80) {
        // Success - hide most items
        document.getElementById('raid-outcome-title').textContent = "Raid Successful!";
        document.getElementById('raid-outcome-text').textContent = `You hid ${raidItemsHidden} of ${totalItems} items. Police found nothing and left empty-handed.`;
        
        // Only lose items you didn't hide
        for (const item of document.querySelectorAll('.raid-item')) {
            if (item.dataset.hidden === 'false') {
                const drug = item.dataset.item;
                if (drug === 'cash') {
                    gameState.money = Math.floor(gameState.money * 0.5); // Lose half cash
                } else if (gameState.inventory[drug]) {
                    delete gameState.inventory[drug]; // Lose all of this drug
                } else if (drug === 'gun' || drug === 'switch') {
                    // Lose weapons if found
                    for (const weapon in gameState.weapons) {
                        gameState.weapons[weapon]--;
                        if (gameState.weapons[weapon] <= 0) {
                            delete gameState.weapons[weapon];
                        }
                        break;
                    }
                }
            }
        }
    } else if (hiddenPercent >= 50) {
        // Partial success
        document.getElementById('raid-outcome-title').textContent = "Close Call!";
        document.getElementById('raid-outcome-text').textContent = `You hid ${raidItemsHidden} of ${totalItems} items. Police found some evidence but couldn't make an arrest.`;
        
        // Lose some of everything
        for (const item of document.querySelectorAll('.raid-item')) {
            const drug = item.dataset.item;
            if (drug === 'cash') {
                gameState.money = Math.floor(gameState.money * 0.7); // Lose 30% cash
            } else if (gameState.inventory[drug]) {
                gameState.inventory[drug] = Math.floor(gameState.inventory[drug] * 0.7); // Lose 30% of drug
                if (gameState.inventory[drug] <= 0) delete gameState.inventory[drug];
            } else if (drug === 'gun' || drug === 'switch') {
                // Lose weapons if found
                if (Math.random() < 0.5) {
                    for (const weapon in gameState.weapons) {
                        gameState.weapons[weapon]--;
                        if (gameState.weapons[weapon] <= 0) {
                            delete gameState.weapons[weapon];
                        }
                        break;
                    }
                }
            }
        }
        
        // Increase police heat
        gameState.policeHeat += 20;
    } else {
        // Failure - arrested
        document.getElementById('raid-outcome-title').textContent = "Busted!";
        document.getElementById('raid-outcome-text').textContent = `You only hid ${raidItemsHidden} of ${totalItems} items. Police found enough evidence to arrest you.`;
        
        // Go to jail
        gameState.inJail = true;
        
        // Check if they found a gun or switch
        const foundGun = Array.from(document.querySelectorAll('.raid-item[data-item="gun"]')).some(item => item.dataset.hidden === 'false');
        const foundSwitch = Array.from(document.querySelectorAll('.raid-item[data-item="switch"]')).some(item => item.dataset.hidden === 'false');
        
        if (foundSwitch) {
            gameState.jailDays = 60; // 60 days for switch
        } else if (foundGun) {
            gameState.jailDays = 30; // 30 days for gun
        } else {
            gameState.jailDays = 5 + Math.floor(Math.random() * 10); // 5-14 days for drugs
        }
        
        // Confiscate some items
        for (const item of document.querySelectorAll('.raid-item')) {
            const drug = item.dataset.item;
            if (drug === 'cash') {
                gameState.money = Math.floor(gameState.money * 0.3); // Lose 70% cash
            } else if (gameState.inventory[drug]) {
                gameState.inventory[drug] = Math.floor(gameState.inventory[drug] * 0.3); // Lose 70% of drug
                if (gameState.inventory[drug] <= 0) delete gameState.inventory[drug];
            } else if (drug === 'gun' || drug === 'switch') {
                // Lose weapons if found
                for (const weapon in gameState.weapons) {
                    gameState.weapons[weapon]--;
                    if (gameState.weapons[weapon] <= 0) {
                        delete gameState.weapons[weapon];
                    }
                    break;
                }
            }
        }
        
        // Reset police heat
        gameState.policeHeat = 0;
    }
    
    updateUI();
}

// Store robbery functions
function startStoreRobbery(store) {
    // Show the robbery screen
    showAppScreen('robbery');
    
    // Set store info
    document.getElementById('robbery-store').textContent = `Store: ${store.charAt(0).toUpperCase() + store.slice(1)}`;
    document.getElementById('robbery-store-name').textContent = store.charAt(0).toUpperCase() + store.slice(1) + " Store";
    
    // Reset robbery game state
    stolenItems = [];
    document.querySelector('.stolen-items-list').innerHTML = '';
    document.getElementById('robbery-step1').classList.remove('hidden');
    document.getElementById('robbery-step2').classList.add('hidden');
    document.getElementById('robbery-step3').classList.add('hidden');
    document.getElementById('police-progress').value = 0;
    
    // Reset store items
    document.querySelectorAll('.store-item').forEach(item => {
        item.style.opacity = '1';
        item.style.pointerEvents = 'auto';
    });
    
    // Start police timer (faster for higher risk stores)
    let policeTime = 15000; // 15 seconds for convenience store
    if (store === 'pharmacy') policeTime = 10000; // 10 seconds
    if (store === 'jewelry') policeTime = 7000; // 7 seconds
    
    // Clear any existing timer
    clearInterval(policeTimer);
    
    policeTimer = setInterval(() => {
        const currentValue = parseInt(document.getElementById('police-progress').value);
        if (currentValue >= 100) {
            policeArrived(store);
            return;
        }
        
        document.getElementById('police-progress').value = currentValue + 1;
    }, policeTime / 100);
}

function stealItem(item) {
    if (stolenItems.length >= 4) return; // Max 4 items
    
    const itemName = item.dataset.item;
    stolenItems.push(itemName);
    
    const stolenItem = document.createElement('div');
    stolenItem.className = 'stolen-item';
    stolenItem.textContent = itemName;
    document.querySelector('.stolen-items-list').appendChild(stolenItem);
    
    item.style.opacity = '0.5';
    item.style.pointerEvents = 'none';
}

function policeArrived(store) {
    clearInterval(policeTimer);
    document.getElementById('robbery-step1').classList.add('hidden');
    document.getElementById('robbery-step2').classList.remove('hidden');
}

function handlePoliceEncounter(action) {
    document.getElementById('robbery-step2').classList.add('hidden');
    document.getElementById('robbery-step3').classList.remove('hidden');
    
    let outcome = "";
    let success = false;
    let damageTaken = 0;
    
    switch(action) {
        case 'run':
            if (Math.random() < 0.6) {
                // Successfully escape
                outcome = "You managed to escape the police!";
                success = true;
                damageTaken = 10; // Minor damage from running
            } else {
                // Caught
                damageTaken = 30; // Beaten while caught
                outcome = "The police caught you while running!";
                gameState.inJail = true;
                gameState.jailDays = 3 + Math.floor(Math.random() * 5); // 3-7 days
            }
            break;
        case 'getaway':
            if (Math.random() < 0.8) {
                // Successfully escape with getaway car
                outcome = "Your getaway driver saved you!";
                success = true;
            } else {
                // Getaway failed
                damageTaken = 20;
                outcome = "The police chased down your getaway car!";
                gameState.inJail = true;
                gameState.jailDays = 5 + Math.floor(Math.random() * 5); // 5-9 days
            }
            break;
        case 'surrender':
            outcome = "You surrendered to the police.";
            gameState.inJail = true;
            gameState.jailDays = 2 + Math.floor(Math.random() * 3); // 2-4 days (less for cooperating)
            break;
        case 'shoot':
            // Check if player has weapons
            const hasWeapons = Object.keys(gameState.weapons).length > 0;
            let damageBonus = 0;
            
            // Apply gang perk if allied with Dragons
            if (gameState.gangs.dragons.status === "allied") {
                damageBonus = gameState.gangs.dragons.value;
            }
            
            if (hasWeapons && Math.random() < (0.3 + damageBonus)) {
                // Successfully escape after shooting
                outcome = "You shot at the police and escaped in the chaos!";
                success = true;
                gameState.policeHeat = 100; // Max heat for shooting at cops
                damageTaken = 20; // Some damage from the fight
                
                // Use up a weapon
                for (const weapon in gameState.weapons) {
                    gameState.weapons[weapon]--;
                    if (gameState.weapons[weapon] <= 0) {
                        delete gameState.weapons[weapon];
                    }
                    break;
                }
            } else {
                // Caught or killed
                if (Math.random() < 0.5) {
                    damageTaken = 50;
                    outcome = "The police shot you! You're badly injured and in jail.";
                    gameState.inJail = true;
                    gameState.jailDays = 10 + Math.floor(Math.random() * 10); // 10-19 days
                } else {
                    damageTaken = 100;
                    outcome = "You were overpowered by the police after shooting at them!";
                    gameState.inJail = true;
                    gameState.jailDays = 15 + Math.floor(Math.random() * 15); // 15-29 days
                }
            }
            break;
    }
    
    // Apply damage
    gameState.health = Math.max(0, gameState.health - damageTaken);
    if (gameState.health <= 0) {
        gameState.dead = true;
        outcome += " You were killed!";
    }
    
    if (success) {
        // Calculate stolen value
        let stolenValue = 0;
        const storeMultiplier = 
            document.getElementById('robbery-store-name').textContent.includes('Convenience') ? 50 :
            document.getElementById('robbery-store-name').textContent.includes('Pharmacy') ? 100 : 250;
        
        stolenValue = stolenItems.length * storeMultiplier * (0.8 + Math.random() * 0.4);
        gameState.money += Math.floor(stolenValue);
        
        outcome += ` You got away with $${Math.floor(stolenValue)}!`;
    } else {
        // Lose stolen items if caught
        stolenItems = [];
    }
    
    document.getElementById('robbery-outcome').textContent = outcome;
    updateUI();
}

// Gun store functions
function buyWeapon(weapon) {
    const weaponData = weapons[weapon];
    
    if (gameState.money < weaponData.price) {
        alert(`You don't have enough money to buy a ${weapon}!`);
        return;
    }
    
    gameState.money -= weaponData.price;
    
    if (!gameState.weapons[weapon]) {
        gameState.weapons[weapon] = 0;
    }
    gameState.weapons[weapon]++;
    
    updateUI();
    alert(`You bought a ${weapon} for $${weaponData.price}.`);
}

// Shooting range functions
function startShootingRange() {
    showAppScreen('shooting-range');
    
    // Reset stats
    gameState.shootingStats = {
        hits: 0,
        misses: 0,
        accuracy: 0
    };
    shootingScore = 0;
    updateShootingStats();
    
    // Clear any existing targets
    clearInterval(targetInterval);
    document.querySelectorAll('.target').forEach(target => {
        target.remove();
    });
    activeTargets = [];
    
    // Start target spawner
    targetInterval = setInterval(spawnTarget, 1500);
}

function spawnTarget() {
    if (activeTargets.length >= 3) return;
    
    const target = document.createElement('div');
    target.className = 'target';
    target.textContent = '🎯';
    target.style.left = `${10 + Math.random() * 80}%`;
    target.style.top = `${10 + Math.random() * 60}%`;
    document.querySelector('.range-targets').appendChild(target);
    
    activeTargets.push({
        element: target,
        id: Date.now()
    });
    
    // Remove target after 3 seconds if not hit
    setTimeout(() => {
        const index = activeTargets.findIndex(t => t.element === target);
        if (index !== -1) {
            target.remove();
            activeTargets.splice(index, 1);
            gameState.shootingStats.misses++;
            updateShootingStats();
        }
    }, 3000);
}

function shootAtTarget() {
    if (Object.keys(gameState.weapons).length === 0) {
        alert("You don't have any weapons to shoot with!");
        return;
    }
    
    // Use up ammo
    for (const weapon in gameState.weapons) {
        gameState.weapons[weapon]--;
        if (gameState.weapons[weapon] <= 0) {
            delete gameState.weapons[weapon];
        }
        break;
    }
    
    updateWeaponsDisplay();
    
    // Check for hits
    if (activeTargets.length > 0) {
        // For simplicity, we'll say you hit a random target
        const randomIndex = Math.floor(Math.random() * activeTargets.length);
        const target = activeTargets[randomIndex];
        
        // Remove target
        target.element.remove();
        activeTargets.splice(randomIndex, 1);
        
        // Increase score
        gameState.shootingStats.hits++;
        shootingScore += 100;
    } else {
        gameState.shootingStats.misses++;
    }
    
    updateShootingStats();
}

function updateShootingStats() {
    const totalShots = gameState.shootingStats.hits + gameState.shootingStats.misses;
    gameState.shootingStats.accuracy = totalShots > 0 ? 
        Math.round((gameState.shootingStats.hits / totalShots) * 100) : 0;
    
    document.getElementById('hits').textContent = gameState.shootingStats.hits;
    document.getElementById('misses').textContent = gameState.shootingStats.misses;
    document.getElementById('accuracy').textContent = `${gameState.shootingStats.accuracy}%`;
    document.getElementById('range-score').textContent = `Score: ${shootingScore}`;
}

// Gang functions
function handleGangAction(gang, action) {
    const gangData = gameState.gangs[gang];
    
    if (action === "ally") {
        // Check if already in a gang
        if (gameState.currentGang && gameState.currentGang !== gang) {
            alert(`The ${gangData.name} won't accept you because you're already with the ${gameState.gangs[gameState.currentGang].name}!`);
            return;
        }
        
        // Form alliance
        gangData.status = "allied";
        gameState.currentGang = gang;
        alert(`You formed an alliance with the ${gangData.name}! They offer: ${getGangPerkDescription(gang)}`);
        
        // Set other gangs to hostile
        for (const otherGang in gameState.gangs) {
            if (otherGang !== gang) {
                gameState.gangs[otherGang].status = "hostile";
            }
        }
    } else if (action === "betray") {
        // Backstab
        if (Math.random() < 0.7) {
            // Success
            const reward = 1000 + Math.floor(Math.random() * 2000);
            gameState.money += reward;
            gangData.status = "hostile";
            gameState.currentGang = null;
            alert(`You successfully backstabbed the ${gangData.name} and stole $${reward}! They're now hostile.`);
            
            // Chance to start war
            if (Math.random() < 0.5) {
                gameState.warStatus = "war";
                alert(`The ${gangData.name} have declared war on you!`);
            }
        } else {
            // Caught - killed
            gameState.dead = true;
            alert(`You were caught backstabbing the ${gangData.name} and were killed!`);
            
            // Respawn with penalty
            setTimeout(() => {
                if (confirm("You were killed! Pay $5,000 to respawn?")) {
                    if (gameState.money >= 5000) {
                        gameState.money -= 5000;
                        gameState.dead = false;
                        gangData.status = "hostile";
                        gameState.currentGang = null;
                        gameState.warStatus = "war";
                        alert(`You respawned! The ${gangData.name} are now hostile and at war with you.`);
                        updateUI();
                    } else {
                        alert("You don't have enough money to respawn! Game over.");
                        // Reset game or handle game over
                    }
                }
            }, 500);
        }
    }
    
    updateUI();
}

function getGangPerkDescription(gang) {
    switch(gameState.gangs[gang].perk) {
        case "drugPrices":
            return `+${Math.round(gameState.gangs[gang].value * 100)}% drug prices`;
        case "policeHeat":
            return `${Math.round(gameState.gangs[gang].value * 100)}% less police heat`;
        case "weaponDamage":
            return `+${Math.round(gameState.gangs[gang].value * 100)}% weapon damage`;
        default:
            return "Unknown perk";
    }
}

function handleWarAction(action) {
    const outcomeEl = document.getElementById('war-result-text');
    document.getElementById('war-outcome').classList.remove('hidden');
    
    let damageBonus = 0;
    
    // Apply gang perk if allied with Dragons
    if (gameState.gangs.dragons.status === "allied") {
        damageBonus = gameState.gangs.dragons.value;
    }
    
    switch(action) {
        case "raid":
            if (Math.random() < (0.4 + damageBonus)) {
                // Success
                const loot = 2000 + Math.floor(Math.random() * 3000);
                gameState.money += loot;
                outcomeEl.textContent = `Raid successful! You stole $${loot} from enemy gang territory.`;
            } else {
                // Failure
                const loss = Math.floor(gameState.money * 0.2);
                gameState.money -= loss;
                gameState.health = Math.max(0, gameState.health - 30);
                outcomeEl.textContent = `Raid failed! You lost $${loss} and took damage.`;
                
                if (gameState.health <= 0) {
                    gameState.dead = true;
                    outcomeEl.textContent += " You were killed!";
                }
            }
            break;
        case "defend":
            if (Math.random() < (0.6 + damageBonus)) {
                // Success
                outcomeEl.textContent = "Successfully defended your territory! Enemy gang lost influence.";
                gameState.warStatus = "peace";
            } else {
                // Failure
                const loss = Math.floor(gameState.money * 0.3);
                gameState.money -= loss;
                gameState.health = Math.max(0, gameState.health - 50);
                outcomeEl.textContent = `Defense failed! Enemy gang took $${loss} and you took damage.`;
                
                if (gameState.health <= 0) {
                    gameState.dead = true;
                    outcomeEl.textContent += " You were killed!";
                }
            }
            break;
        case "truce":
            if (Math.random() < 0.5) {
                // Success
                const cost = 1000 + Math.floor(Math.random() * 2000);
                gameState.money -= cost;
                gameState.warStatus = "peace";
                outcomeEl.textContent = `Truce negotiated for $${cost}. The war is over... for now.`;
            } else {
                // Failure
                outcomeEl.textContent = "Truce offer rejected! The war continues.";
            }
            break;
    }
    
    updateUI();
}

function gangRetaliation() {
    if (gameState.dead) return;
    
    const gangsAtWar = Object.values(gameState.gangs).filter(g => g.status === "hostile");
    if (gangsAtWar.length === 0) return;
    
    const attackingGang = gangsAtWar[Math.floor(Math.random() * gangsAtWar.length)];
    
    // Check if player has weapons for defense
    const hasWeapons = Object.keys(gameState.weapons).length > 0;
    let survivalChance = hasWeapons ? 0.7 : 0.3;
    
    // Apply gang perk if allied with Dragons
    if (gameState.gangs.dragons.status === "allied") {
        survivalChance += gameState.gangs.dragons.value;
    }
    
    if (Math.random() < survivalChance) {
        // Survived attack
        const damageTaken = 20 + Math.floor(Math.random() * 30);
        gameState.health = Math.max(0, gameState.health - damageTaken);
        alert(`The ${attackingGang.name} attacked but you defended yourself! You took ${damageTaken}% damage.`);
        
        if (gameState.health <= 0) {
            gameState.dead = true;
            alert("You were killed in the attack!");
        }
        
        // Use up a weapon if available
        if (hasWeapons) {
            for (const weapon in gameState.weapons) {
                gameState.weapons[weapon]--;
                if (gameState.weapons[weapon] <= 0) {
                    delete gameState.weapons[weapon];
                }
                break;
            }
        }
    } else {
        // Killed in attack
        gameState.dead = true;
        alert(`The ${attackingGang.name} attacked and killed you!`);
        
        // Respawn with penalty
        setTimeout(() => {
            if (confirm("You were killed in gang violence! Pay $5,000 to respawn?")) {
                if (gameState.money >= 5000) {
                    gameState.money -= 5000;
                    gameState.dead = false;
                    gameState.health = 50;
                    alert("You respawned with 50% health! Be more careful next time.");
                    updateUI();
                } else {
                    alert("You don't have enough money to respawn! Game over.");
                    // Reset game or handle game over
                }
            }
        }, 500);
    }
}

// Delivery functions
function startDelivery(delivery) {
    gameState.currentDelivery = delivery;
    document.getElementById('delivery-status').textContent = `Status: Delivering ${delivery}`;
    
    // Hide setup, show game
    document.querySelector('.delivery-setup').classList.add('hidden');
    document.getElementById('delivery-game').classList.remove('hidden');
    document.getElementById('delivery-result').classList.add('hidden');
    
    // Reset game state
    deliveryProgress = 0;
    gameState.carPosition = 50;
    trafficCars = [];
    policeCars = [];
    updateDeliveryProgress();
    updateCarPosition();
    
    // Start delivery timer
    clearInterval(deliveryInterval);
    deliveryInterval = setInterval(updateDelivery, 100);
    
    // Start traffic spawner
    clearInterval(trafficInterval);
    trafficInterval = setInterval(spawnTraffic, 2000);
}

function updateDelivery() {
    // Update progress
    deliveryProgress += 0.5;
    if (deliveryProgress >= 100) {
        finishDelivery(true);
        return;
    }
    updateDeliveryProgress();
    
    // Handle keyboard input
    if (keyState['ArrowLeft']) {
        moveCar(-5);
    }
    if (keyState['ArrowRight']) {
        moveCar(5);
    }
    
    // Update traffic cars
    updateTraffic();
    
    // Check for collisions
    checkCollisions();
}

function moveCar(amount) {
    gameState.carPosition = Math.max(10, Math.min(90, gameState.carPosition + amount));
    updateCarPosition();
}

function updateCarPosition() {
    document.querySelector('.player-car').style.left = `${gameState.carPosition}%`;
}

function spawnTraffic() {
    // Random chance to spawn traffic
    if (Math.random() < 0.7) {
        const trafficCar = document.createElement('div');
        trafficCar.className = 'traffic-car';
        trafficCar.style.left = `${10 + Math.random() * 80}%`;
        trafficCar.textContent = '🚙';
        document.querySelector('.road').appendChild(trafficCar);
        
        trafficCars.push({
            element: trafficCar,
            position: parseFloat(trafficCar.style.left),
            speed: 1 + Math.random() * 2
        });
    }
    
    // Random chance to spawn police (based on heat level)
    if (Math.random() < gameState.policeHeat / 150) {
        const policeCar = document.createElement('div');
        policeCar.className = 'police-car';
        policeCar.style.left = `${10 + Math.random() * 80}%`;
        policeCar.textContent = '🚓';
        document.querySelector('.road').appendChild(policeCar);
        
        policeCars.push({
            element: policeCar,
            position: parseFloat(policeCar.style.left),
            speed: 2 + Math.random() * 3
        });
    }
}

function updateTraffic() {
    // Move traffic cars
    for (let i = trafficCars.length - 1; i >= 0; i--) {
        const car = trafficCars[i];
        car.position += car.speed;
        
        if (car.position > 110) {
            // Remove car that's off screen
            car.element.remove();
            trafficCars.splice(i, 1);
        } else {
            car.element.style.left = `${car.position}%`;
        }
    }
    
    // Move police cars
    for (let i = policeCars.length - 1; i >= 0; i--) {
        const car = policeCars[i];
        car.position += car.speed;
        
        if (car.position > 110) {
            // Remove car that's off screen
            car.element.remove();
            policeCars.splice(i, 1);
        } else {
            car.element.style.left = `${car.position}%`;
        }
    }
}

function checkCollisions() {
    const playerRect = document.querySelector('.player-car').getBoundingClientRect();
    
    // Check traffic collisions
    for (const car of trafficCars) {
        const carRect = car.element.getBoundingClientRect();
        
        if (isColliding(playerRect, carRect)) {
            finishDelivery(false, "You crashed into traffic!");
            return;
        }
    }
    
    // Check police collisions
    for (const car of policeCars) {
        const carRect = car.element.getBoundingClientRect();
        
        if (isColliding(playerRect, carRect)) {
            finishDelivery(false, "You were caught by the police!");
            return;
        }
    }
}

function isColliding(rect1, rect2) {
    return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
    );
}

function updateDeliveryProgress() {
    document.getElementById('delivery-progress').value = deliveryProgress;
    document.getElementById('distance').textContent = Math.floor(deliveryProgress);
}

function finishDelivery(success, message) {
    clearInterval(deliveryInterval);
    clearInterval(trafficInterval);
    
    document.getElementById('delivery-game').classList.add('hidden');
    document.getElementById('delivery-result').classList.remove('hidden');
    
    if (success) {
        const reward = deliveries[gameState.currentDelivery].reward;
        gameState.money += reward;
        document.getElementById('delivery-outcome-title').textContent = "Delivery Complete!";
        document.getElementById('delivery-outcome-text').textContent = `You successfully delivered the package and earned $${reward}!`;
    } else {
        gameState.inJail = true;
        gameState.jailDays = 50; // 50 days for getting caught with drugs
        document.getElementById('delivery-outcome-title').textContent = "Delivery Failed!";
        document.getElementById('delivery-outcome-text').textContent = `${message} You got 50 days in jail!`;
    }
    
    updateUI();
}

// Jail functions
function handleJailAction(action) {
    const eventText = document.getElementById('jail-event-text');
    document.querySelector('.jail-options').classList.add('hidden');
    document.querySelector('.jail-events').classList.remove('hidden');
    
    switch(action) {
        case 'work':
            if (Math.random() < 0.8) {
                // Successful work day
                const earnings = 50 + Math.floor(Math.random() * 50);
                gameState.money += earnings;
                gameState.jailDays -= 1; // Reduce sentence for good behavior
                eventText.textContent = `You worked in the prison workshop and earned $${earnings}. Your sentence was reduced by 1 day for good behavior.`;
            } else {
                // Got in trouble
                gameState.jailDays += 1;
                eventText.textContent = "You got in trouble with the guards and lost your work privileges. Sentence increased by 1 day.";
            }
            break;
        case 'riot':
            if (Math.random() < 0.4) {
                // Riot succeeds - escape
                gameState.inJail = false;
                gameState.jailDays = 0;
                eventText.textContent = "The riot was successful! You escaped in the chaos.";
            } else {
                // Riot fails - more time
                gameState.jailDays += 5 + Math.floor(Math.random() * 5);
                eventText.textContent = "The riot was put down. You got 5-10 more days added to your sentence.";
            }
            break;
        case 'sit':
            // Just pass time
            gameState.jailDays -= 1;
            eventText.textContent = "You sat in your cell all day. One day closer to freedom.";
            break;
        case 'bail':
            if (gameState.money >= 5000) {
                // Pay bail
                gameState.money -= 5000;
                gameState.inJail = false;
                gameState.jailDays = 0;
                eventText.textContent = "You paid the $5,000 bail and were released.";
            } else {
                // Can't afford bail
                eventText.textContent = "You don't have enough money to pay the $5,000 bail.";
            }
            break;
    }
    
    updateUI();
}

function continueJailTime() {
    if (gameState.jailDays <= 0) {
        gameState.inJail = false;
        showAppScreen('home');
    } else {
        document.querySelector('.jail-options').classList.remove('hidden');
        document.querySelector('.jail-events').classList.add('hidden');
        document.getElementById('jail-days').textContent = `Days Left: ${gameState.jailDays}`;
    }
}

// Avatar functions
function renderAvatar() {
    const avatarImage = document.getElementById('avatar-image');
    avatarImage.innerHTML = '';
    
    // Create avatar elements based on current settings
    const body = document.createElement('div');
    body.className = 'avatar-body';
    body.style.backgroundColor = gameState.avatar.skinColor;
    
    const hair = document.createElement('div');
    hair.className = `avatar-hair ${gameState.avatar.hairStyle} ${gameState.avatar.hairColor}`;
    
    const clothing = document.createElement('div');
    clothing.className = `avatar-clothing ${gameState.avatar.clothing}`;
    
    avatarImage.appendChild(body);
    avatarImage.appendChild(hair);
    avatarImage.appendChild(clothing);
}

// Ingredient store functions
function buyIngredient(ingredient, quantity) {
    const totalCost = ingredientPrices[ingredient] * quantity;
    
    if (gameState.money < totalCost) {
        alert("You don't have enough money!");
        return;
    }
    
    gameState.money -= totalCost;
    gameState.ingredients[ingredient] = (gameState.ingredients[ingredient] || 0) + quantity;
    
    updateUI();
    alert(`You bought ${quantity} units of ${ingredient} for $${totalCost}.`);
}

// Start the game
initGame();

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('streetAlchemistGameState', JSON.stringify(gameState));
}

// Function to open trading interface
function openTrading() {
    window.open('trading.html', '_blank');
}

// In your game loop, call this to sync days
function updateFromTrading() {
    const tradingData = localStorage.getItem('undergroundTraderGame');
    if (tradingData) {
        const parsed = JSON.parse(tradingData);
        // Update your game state with relevant values from trading system
        // For example:
        player.money = parsed.player.money;
        player.inventory = parsed.player.inventory;
        player.health = parsed.player.health;
        player.jailTime = parsed.player.jailTime;
    }
}
