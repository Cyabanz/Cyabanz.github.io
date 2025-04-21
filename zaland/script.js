// Game State
const gameState = {
    cash: 10000,
    health: 100,
    food: 100,
    reputation: 'Neutral',
    day: 1,
    time: 8, // 24-hour format
    inventory: [],
    ownedVehicles: [],
    contacts: [
        { name: 'Dealer Mike', type: 'drug', trust: 50 },
        { name: 'Johnny Poker', type: 'gambling', trust: 30 },
        { name: 'Lawyer Smith', type: 'legal', trust: 70 },
        { name: 'Pawn Shop Joe', type: 'pawn', trust: 60 },
        { name: 'Random Junkie', type: 'drug', trust: 20 }
    ],
    drugInventory: [],
    craftedStrains: [],
    currentLocation: null,
    inJail: false,
    jailDaysRemaining: 0,
    currentCase: null,
    notifications: [],
    gang: null,
    gangReputation: 0,
    guns: [],
    gangWars: 0,
    territory: 0,
    currentCustomer: null,
    currentHouse: null
};

// Game Items
const items = {
    drugs: {
        weed: { name: 'Weed', basePrice: 20, risk: 10 },
        cocaine: { name: 'Cocaine', basePrice: 80, risk: 40 },
        meth: { name: 'Meth', basePrice: 50, risk: 60 },
        heroin: { name: 'Heroin', basePrice: 120, risk: 80 },
        lsd: { name: 'LSD', basePrice: 30, risk: 20 },
        mdma: { name: 'MDMA', basePrice: 40, risk: 30 },
        fentanyl: { name: 'Fentanyl', basePrice: 150, risk: 90 }
    },
    recipes: {
        weedBrownie: { name: 'Weed Brownie', ingredients: [{name: 'Weed', amount: 2}, {name: 'Flour', amount: 1}, {name: 'Eggs', amount: 2}], sellPrice: 100 },
        crack: { name: 'Crack', ingredients: [{name: 'Cocaine', amount: 1}, {name: 'Baking Soda', amount: 1}], sellPrice: 150 },
        speedball: { name: 'Speedball', ingredients: [{name: 'Heroin', amount: 1}, {name: 'Cocaine', amount: 1}], sellPrice: 250 }
    },
    groceries: [
        { name: 'Bread', price: 3, health: 10 },
        { name: 'Milk', price: 2, health: 15 },
        { name: 'Eggs', price: 4, health: 20 },
        { name: 'Flour', price: 2, health: 5 },
        { name: 'Baking Soda', price: 1, health: 0 }
    ],
    vehicles: [
        { name: 'Sports Car', price: 50000, type: 'car' },
        { name: 'Luxury Sedan', price: 80000, type: 'car' },
        { name: 'Mansion', price: 1000000, type: 'property' },
        { name: 'Helicopter', price: 500000, type: 'air' }
    ],
    guns: [
        { name: 'Pistol', price: 500, damage: 20, concealable: true },
        { name: 'Shotgun', price: 1200, damage: 50, concealable: false },
        { name: 'SMG', price: 2500, damage: 35, concealable: false },
        { name: 'Assault Rifle', price: 4000, damage: 60, concealable: false },
        { name: 'Sniper Rifle', price: 6000, damage: 90, concealable: false }
    ],
    gangs: [
        { name: 'Street Kings', color: 'blue', initiation: 'Steal a car', bonus: 'Car theft pays 50% more' },
        { name: 'Blood Vipers', color: 'red', initiation: 'Sell $5000 worth of drugs', bonus: 'Drug sales pay 30% more' },
        { name: 'Shadow Syndicate', color: 'black', initiation: 'Win $10000 at casino', bonus: 'Casino wins pay 20% more' },
        { name: 'Golden Cartel', color: 'gold', initiation: 'Kill a rival gang member', bonus: 'Guns deal 25% more damage' }
    ],
    slotSymbols: ['🍒', '🍋', '🍊', '🍇', '🍉', '7️⃣', '💎'],
    rouletteNumbers: [
        { number: 0, color: 'green' },
        { number: '00', color: 'green' },
        { number: 1, color: 'red' },
        { number: 2, color: 'black' },
        { number: 3, color: 'red' },
        { number: 4, color: 'black' },
        { number: 5, color: 'red' },
        { number: 6, color: 'black' },
        { number: 7, color: 'red' },
        { number: 8, color: 'black' },
        { number: 9, color: 'red' },
        { number: 10, color: 'black' },
        { number: 11, color: 'black' },
        { number: 12, color: 'red' },
        { number: 13, color: 'black' },
        { number: 14, color: 'red' },
        { number: 15, color: 'black' },
        { number: 16, color: 'red' },
        { number: 17, color: 'black' },
        { number: 18, color: 'red' },
        { number: 19, color: 'red' },
        { number: 20, color: 'black' },
        { number: 21, color: 'red' },
        { number: 22, color: 'black' },
        { number: 23, color: 'red' },
        { number: 24, color: 'black' },
        { number: 25, color: 'red' },
        { number: 26, color: 'black' },
        { number: 27, color: 'red' },
        { number: 28, color: 'black' },
        { number: 29, color: 'black' },
        { number: 30, color: 'red' },
        { number: 31, color: 'black' },
        { number: 32, color: 'red' },
        { number: 33, color: 'black' },
        { number: 34, color: 'red' },
        { number: 35, color: 'black' },
        { number: 36, color: 'red' }
    ],
    customerTypes: [
        { type: 'junkie', name: 'Junkie', cash: 100, trust: 70, suspicion: 30 },
        { type: 'businessman', name: 'Businessman', cash: 500, trust: 40, suspicion: 60 },
        { type: 'student', name: 'Student', cash: 50, trust: 60, suspicion: 40 },
        { type: 'tourist', name: 'Tourist', cash: 200, trust: 50, suspicion: 50 }
    ]
};

// Casino Games State
const casinoGames = {
    roulette: {
        bets: [],
        spinning: false
    },
    blackjack: {
        deck: [],
        dealerHand: [],
        playerHand: [],
        currentBet: 0,
        gameState: 'betting'
    },
    poker: {
        deck: [],
        communityCards: [],
        playerHand: [],
        aiHands: [],
        currentBet: 0,
        playerBet: 0,
        pot: 0,
        gameStage: 'preflop',
        gameState: 'betting',
        aiPlayers: 3
    },
    slots: {
        spinning: false
    }
};

// DOM Elements
const elements = {
    cash: document.getElementById('cash'),
    healthFill: document.getElementById('health-fill'),
    foodFill: document.getElementById('food-fill'),
    reputation: document.getElementById('reputation'),
    gameTime: document.getElementById('game-time'),
    locationContent: document.getElementById('location-content'),
    notifications: document.getElementById('notifications')
};

// Initialize the game
function initGame() {
    updateUI();
    setupEventListeners();
    startGameClock();
    
    // Add some initial items
    gameState.inventory.push({ name: 'Gold Watch', value: 500 });
    gameState.inventory.push({ name: 'Laptop', value: 800 });
    gameState.drugInventory.push({ name: 'Weed', amount: 5 });
    gameState.drugInventory.push({ name: 'Cocaine', amount: 2 });
}

// Update all UI elements
function updateUI() {
    elements.cash.textContent = `$${gameState.cash.toLocaleString()}`;
    elements.healthFill.style.width = `${gameState.health}%`;
    elements.foodFill.style.width = `${gameState.food}%`;
    elements.reputation.textContent = gameState.reputation;
    
    const ampm = gameState.time >= 12 ? 'PM' : 'AM';
    const displayHour = gameState.time > 12 ? gameState.time - 12 : gameState.time;
    elements.gameTime.textContent = `Day ${gameState.day}, ${displayHour}:00 ${ampm}`;
    
    // Update notifications
    elements.notifications.innerHTML = '';
    gameState.notifications.forEach(notification => {
        const notifElement = document.createElement('div');
        notifElement.className = 'notification';
        notifElement.textContent = notification;
        elements.notifications.appendChild(notifElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Location buttons
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const location = btn.getAttribute('data-location');
            openLocation(location);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    
    // Initialize all game systems
    setupCasinoGames();
    setupDrugLab();
    setupPhone();
    setupPawnShop();
    setupCarDealer();
    setupGroceryStore();
    setupGunStore();
    setupGangs();
    setupJailAndCourt();
    setupStreetSelling();
    setupBurglary();
    setupCarjacking();
}

// Open a location
function openLocation(location) {
    gameState.currentLocation = location;
    
    switch(location) {
        case 'casino':
            elements.locationContent.innerHTML = `
                <h2>Casino</h2>
                <p>Try your luck at various games of chance.</p>
                <div class="casino-games">
                    <button id="play-roulette">Roulette</button>
                    <button id="play-blackjack">Blackjack</button>
                    <button id="play-poker">Poker</button>
                    <button id="play-slots">Slot Machines</button>
                </div>
            `;
            
            document.getElementById('play-roulette').addEventListener('click', () => {
                document.getElementById('roulette-modal').style.display = 'block';
                setupRoulette();
            });
            
            document.getElementById('play-blackjack').addEventListener('click', () => {
                document.getElementById('blackjack-modal').style.display = 'block';
                setupBlackjack();
            });
            
            document.getElementById('play-poker').addEventListener('click', () => {
                document.getElementById('poker-modal').style.display = 'block';
                setupPoker();
            });
            
            document.getElementById('play-slots').addEventListener('click', () => {
                document.getElementById('slots-modal').style.display = 'block';
                setupSlotMachine();
            });
            break;
            
        case 'drug-lab':
            elements.locationContent.innerHTML = `
                <h2>Drug Lab</h2>
                <p>Cook up some profitable substances.</p>
                <button id="open-drug-lab">Enter Lab</button>
            `;
            
            document.getElementById('open-drug-lab').addEventListener('click', () => {
                document.getElementById('drug-lab-modal').style.display = 'block';
                updateDrugLab();
            });
            break;
            
        case 'phone':
            elements.locationContent.innerHTML = `
                <h2>Phone</h2>
                <p>Contact your associates or find new customers.</p>
                <button id="open-phone">Use Phone</button>
            `;
            
            document.getElementById('open-phone').addEventListener('click', () => {
                document.getElementById('phone-modal').style.display = 'block';
                updatePhone();
            });
            break;
            
        case 'pawn-shop':
            elements.locationContent.innerHTML = `
                <h2>Pawn Shop</h2>
                <p>Sell your valuables for quick cash.</p>
                <button id="open-pawn-shop">Enter Pawn Shop</button>
            `;
            
            document.getElementById('open-pawn-shop').addEventListener('click', () => {
                document.getElementById('pawn-shop-modal').style.display = 'block';
                updatePawnShop();
            });
            break;
            
        case 'car-dealer':
            elements.locationContent.innerHTML = `
                <h2>Luxury Vehicle Dealer</h2>
                <p>Buy fancy cars and properties to show off your wealth.</p>
                <button id="open-car-dealer">Browse Vehicles</button>
            `;
            
            document.getElementById('open-car-dealer').addEventListener('click', () => {
                document.getElementById('car-dealer-modal').style.display = 'block';
                updateCarDealer();
            });
            break;
            
        case 'grocery':
            elements.locationContent.innerHTML = `
                <h2>Grocery Store</h2>
                <p>Buy food to keep your health up.</p>
                <button id="open-grocery">Enter Store</button>
            `;
            
            document.getElementById('open-grocery').addEventListener('click', () => {
                document.getElementById('grocery-modal').style.display = 'block';
                updateGroceryStore();
            });
            break;
            
        case 'gun-store':
            elements.locationContent.innerHTML = `
                <h2>Gun Store</h2>
                <p>Arm yourself for protection... or offense.</p>
                <button id="open-gun-store">Enter Gun Store</button>
            `;
            
            document.getElementById('open-gun-store').addEventListener('click', () => {
                document.getElementById('gun-store-modal').style.display = 'block';
                updateGunStore();
            });
            break;
            
        case 'gangs':
            elements.locationContent.innerHTML = `
                <h2>Gang Network</h2>
                <p>Join a gang for protection and opportunities.</p>
                <button id="open-gangs">View Gangs</button>
            `;
            
            document.getElementById('open-gangs').addEventListener('click', () => {
                document.getElementById('gang-modal').style.display = 'block';
                updateGangs();
            });
            break;
            
        case 'street-selling':
            elements.locationContent.innerHTML = `
                <h2>Street Selling</h2>
                <p>Sell drugs to customers on the street.</p>
                <button id="open-street-selling">Start Selling</button>
            `;
            
            document.getElementById('open-street-selling').addEventListener('click', () => {
                document.getElementById('street-selling-modal').style.display = 'block';
                generateCustomer();
            });
            break;
            
        case 'burglary':
            elements.locationContent.innerHTML = `
                <h2>Burglary</h2>
                <p>Rob houses for valuables and cash.</p>
                <button id="open-burglary">Select House</button>
            `;
            
            document.getElementById('open-burglary').addEventListener('click', () => {
                document.getElementById('burglary-modal').style.display = 'block';
            });
            break;
            
        case 'carjacking':
            elements.locationContent.innerHTML = `
                <h2>Carjacking</h2>
                <p>Steal cars for quick cash.</p>
                <button id="open-carjacking">Start Carjacking</button>
            `;
            
            document.getElementById('open-carjacking').addEventListener('click', () => {
                document.getElementById('carjacking-modal').style.display = 'block';
            });
            break;
            
        default:
            elements.locationContent.innerHTML = `
                <h1>StreetLife</h1>
                <p>Make your way to the top through gambling, crime, and business!</p>
                <p>Choose a location to begin.</p>
            `;
    }
}
   

// Burglary Functions
function setupBurglary() {
    const houseOptions = document.querySelectorAll('.house-option');
    const leaveHouseBtn = document.getElementById('leave-house');
    
    houseOptions.forEach(option => {
        option.addEventListener('click', () => {
            gameState.currentHouse = {
                value: parseInt(option.getAttribute('data-value')),
                difficulty: option.querySelector('p:nth-child(3)').textContent.includes('Slow') ? 'easy' : 
                           option.querySelector('p:nth-child(3)').textContent.includes('Medium') ? 'medium' : 'hard'
            };
            
            document.getElementById('house-selection').style.display = 'none';
            document.getElementById('burglary-game').style.display = 'block';
            startBurglaryGame();
        });
    });
    
    leaveHouseBtn.addEventListener('click', () => {
        endBurglaryGame(false);
    });
}

function startBurglaryGame() {
    const mazeContainer = document.getElementById('maze-container');
    mazeContainer.innerHTML = '';
    
    // Create maze (10x10 grid)
    const mazeSize = 10;
    const maze = [];
    
    // Initialize maze with empty cells
    for (let y = 0; y < mazeSize; y++) {
        maze[y] = [];
        for (let x = 0; x < mazeSize; x++) {
            maze[y][x] = { 
                isWall: Math.random() < 0.3, // 30% chance to be a wall
                hasItem: Math.random() < 0.2, // 20% chance to have an item
                isExit: false 
            };
        }
    }
    
    // Ensure start (0,0) and exit (9,9) are not walls
    maze[0][0].isWall = false;
    maze[mazeSize-1][mazeSize-1].isWall = false;
    maze[mazeSize-1][mazeSize-1].isExit = true;
    
    // Place player at start
    let playerPos = { x: 0, y: 0 };
    
    // Create maze in DOM
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            if (maze[y][x].isWall) cell.classList.add('wall');
            if (maze[y][x].hasItem) cell.classList.add('item');
            if (maze[y][x].isExit) cell.classList.add('exit');
            if (x === playerPos.x && y === playerPos.y) cell.classList.add('player');
            
            cell.addEventListener('click', () => movePlayer(x, y, maze, playerPos));
            mazeContainer.appendChild(cell);
        }
    }
    
    // Start timer based on house difficulty
    let timeLeft = gameState.currentHouse.difficulty === 'easy' ? 90 : 
                   gameState.currentHouse.difficulty === 'medium' ? 60 : 45;
    
    document.getElementById('burglary-time').textContent = timeLeft;
    document.getElementById('loot-collected').textContent = '0';
    document.getElementById('items-found').textContent = '0';
    
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('burglary-time').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endBurglaryGame(true);
        }
    }, 1000);
    
    // Store game state
    gameState.burglaryGame = {
        maze: maze,
        playerPos: playerPos,
        timer: timer,
        itemsFound: 0,
        lootCollected: 0,
        mazeContainer: mazeContainer
    };
}

function movePlayer(x, y, maze, playerPos) {
    // Check if move is valid (adjacent cell, not wall)
    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        if (!maze[y][x].isWall) {
            // Update player position
            const oldPlayerCell = document.querySelector('.maze-cell.player');
            oldPlayerCell.classList.remove('player');
            
            playerPos.x = x;
            playerPos.y = y;
            
            const newPlayerCell = document.querySelector(`.maze-cell:nth-child(${y * 10 + x + 1})`);
            newPlayerCell.classList.add('player');
            
            // Check for item
            if (maze[y][x].hasItem) {
                maze[y][x].hasItem = false;
                newPlayerCell.classList.remove('item');
                
                // Calculate loot value based on house value
                const itemValue = Math.floor(gameState.currentHouse.value * (0.05 + Math.random() * 0.1));
                gameState.burglaryGame.lootCollected += itemValue;
                gameState.burglaryGame.itemsFound++;
                
                document.getElementById('loot-collected').textContent = gameState.burglaryGame.lootCollected;
                document.getElementById('items-found').textContent = gameState.burglaryGame.itemsFound;
                
                addNotification(`Found item worth $${itemValue}!`);
            }
            
            // Check for exit
            if (maze[y][x].isExit) {
                endBurglaryGame(false);
            }
        }
    }
}

function endBurglaryGame(caught) {
    clearInterval(gameState.burglaryGame.timer);
    
    if (caught) {
        const fine = Math.floor(gameState.burglaryGame.lootCollected * 0.5);
        gameState.cash -= fine;
        addNotification(`Caught by police! Fined $${fine}.`);
        getArrested("Burglary");
    } else {
        let loot = gameState.burglaryGame.lootCollected;
        
        // Gang bonus
        if (gameState.gang && gameState.gang.name === 'Shadow Syndicate') {
            loot = Math.floor(loot * 1.25);
            addNotification(`Gang bonus: +25% to burglary earnings!`);
        }
        
        gameState.cash += loot;
        addNotification(`Successfully burgled house! Got away with $${loot}.`);
        
        // Chance to get caught later (10%)
        if (Math.random() < 0.1) {
            setTimeout(() => {
                getArrested("Burglary");
            }, 5000);
        }
    }
    
    document.getElementById('house-selection').style.display = 'block';
    document.getElementById('burglary-game').style.display = 'none';
    updateUI();
}

// Carjacking Functions
function setupCarjacking() {
    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    
    vehicleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const value = parseInt(option.getAttribute('data-value'));
            const risk = option.querySelector('p:nth-child(3)').textContent.includes('Medium') ? 30 : 
                        option.querySelector('p:nth-child(3)').textContent.includes('High') ? 50 : 70;
            
            attemptCarjacking(value, risk);
        });
    });
}

function attemptCarjacking(value, risk) {
    // Chance to succeed
    const successChance = 100 - risk;
    if (Math.random() * 100 > successChance) {
        // Failed carjacking
        getArrested("Attempted carjacking");
        return;
    }
    
    // Successful carjacking
    const carValue = Math.floor(value * (0.5 + Math.random() * 0.5));
    gameState.cash += carValue;
    
    // Gang bonus
    if (gameState.gang && gameState.gang.name === 'Street Kings') {
        const bonus = Math.floor(carValue * 0.5);
        gameState.cash += bonus;
        addNotification(`Gang bonus: +$${bonus}`);
    }
    
    addNotification(`Successfully carjacked a vehicle worth $${carValue}!`);
    updateUI();
}

// Casino Games Setup
function setupCasinoGames() {
    setupRoulette();
    setupBlackjack();
    setupPoker();
    setupSlotMachine();
}

function setupRoulette() {
    const wheel = document.getElementById('roulette-wheel');
    const numberGrid = document.getElementById('number-grid');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetBtn = document.getElementById('place-bet');
    const spinWheelBtn = document.getElementById('spin-wheel');
    const currentBetsDiv = document.getElementById('current-bets');
    
    // Clear previous bets
    casinoGames.roulette.bets = [];
    currentBetsDiv.innerHTML = '<h3>Current Bets</h3><p>No bets placed</p>';
    
    // Create number grid
    numberGrid.innerHTML = '';
    items.rouletteNumbers.forEach(num => {
        const numBtn = document.createElement('div');
        numBtn.className = 'number-btn';
        numBtn.textContent = num.number;
        numBtn.style.backgroundColor = num.color;
        numBtn.addEventListener('click', () => {
            if (casinoGames.roulette.spinning) return;
            
            const amount = parseInt(betAmountInput.value);
            if (amount > gameState.cash) {
                addNotification("You don't have enough cash for that bet!");
                return;
            }
            
            casinoGames.roulette.bets.push({
                type: 'number',
                number: num.number,
                amount: amount
            });
            
            updateRouletteBets();
        });
        numberGrid.appendChild(numBtn);
    });
    
    // Outside bets
    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (casinoGames.roulette.spinning) return;
            
            const betType = btn.getAttribute('data-bet');
            const amount = parseInt(betAmountInput.value);
            
            if (amount > gameState.cash) {
                addNotification("You don't have enough cash for that bet!");
                return;
            }
            
            casinoGames.roulette.bets.push({
                type: betType,
                amount: amount
            });
            
            updateRouletteBets();
        });
    });
    
    // Spin wheel
    spinWheelBtn.addEventListener('click', () => {
        if (casinoGames.roulette.spinning || casinoGames.roulette.bets.length === 0) {
            addNotification("Place some bets before spinning!");
            return;
        }
        
        casinoGames.roulette.spinning = true;
        spinWheelBtn.disabled = true;
        placeBetBtn.disabled = true;
        
        // Animate wheel
        const spinDuration = 3000; // 3 seconds
        const rotations = 5;
        const startTime = Date.now();
        
        function animateWheel() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            const angle = progress * 360 * rotations;
            
            wheel.style.transform = `rotate(${angle}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateWheel);
            } else {
                // Wheel stopped - determine result
                const winningNumber = items.rouletteNumbers[
                    Math.floor(Math.random() * items.rouletteNumbers.length)
                ];
                
                // Calculate winnings
                let totalWinnings = 0;
                casinoGames.roulette.bets.forEach(bet => {
                    let won = false;
                    let multiplier = 1;
                    
                    if (bet.type === 'number') {
                        won = bet.number === winningNumber.number;
                        multiplier = 35; // 35:1 payout for straight up
                    } else {
                        switch(bet.type) {
                            case 'red':
                                won = winningNumber.color === 'red';
                                break;
                            case 'black':
                                won = winningNumber.color === 'black' && winningNumber.number !== 0 && winningNumber.number !== '00';
                                break;
                            case 'odd':
                                won = typeof winningNumber.number === 'number' && 
                                      winningNumber.number !== 0 && 
                                      winningNumber.number % 2 === 1;
                                break;
                            case 'even':
                                won = typeof winningNumber.number === 'number' && 
                                      winningNumber.number !== 0 && 
                                      winningNumber.number % 2 === 0;
                                break;
                            case '1-18':
                                won = typeof winningNumber.number === 'number' && 
                                      winningNumber.number >= 1 && 
                                      winningNumber.number <= 18;
                                break;
                            case '19-36':
                                won = typeof winningNumber.number === 'number' && 
                                      winningNumber.number >= 19 && 
                                      winningNumber.number <= 36;
                                break;
                        }
                        multiplier = 1; // Even money bets
                    }
                    
                    if (won) {
                        const winnings = bet.amount * multiplier;
                        totalWinnings += winnings;
                        addNotification(`Won $${winnings} on ${bet.type} ${bet.number || ''}!`);
                    } else {
                        addNotification(`Lost $${bet.amount} on ${bet.type} ${bet.number || ''}`);
                    }
                });
                
                // Update cash
                gameState.cash += totalWinnings - casinoGames.roulette.bets.reduce((sum, bet) => sum + bet.amount, 0);
                
                // Gang bonus
                if (gameState.gang && gameState.gang.name === 'Shadow Syndicate' && totalWinnings > 0) {
                    const bonus = Math.floor(totalWinnings * 0.2);
                    gameState.cash += bonus;
                    addNotification(`Gang bonus: +$${bonus.toLocaleString()}`);
                }
                
                updateUI();
                
                // Show result
                setTimeout(() => {
                    alert(`The ball landed on ${winningNumber.number} ${winningNumber.color}`);
                    casinoGames.roulette.spinning = false;
                    spinWheelBtn.disabled = false;
                    placeBetBtn.disabled = false;
                    casinoGames.roulette.bets = [];
                    updateRouletteBets();
                }, 500);
            }
        }
        
        animateWheel();
    });
    
    function updateRouletteBets() {
        if (casinoGames.roulette.bets.length === 0) {
            currentBetsDiv.innerHTML = '<h3>Current Bets</h3><p>No bets placed</p>';
            return;
        }
        
        let html = '<h3>Current Bets</h3><ul>';
        let totalBet = 0;
        
        casinoGames.roulette.bets.forEach(bet => {
            html += `<li>$${bet.amount} on ${bet.type} ${bet.number || ''}</li>`;
            totalBet += bet.amount;
        });
        
        html += `</ul><p>Total bet: $${totalBet}</p>`;
        currentBetsDiv.innerHTML = html;
    }
}

function setupBlackjack() {
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const doubleBtn = document.getElementById('double-btn');
    const placeBetBtn = document.getElementById('place-bj-bet');
    const newGameBtn = document.getElementById('new-bj-game');
    const betInput = document.getElementById('bj-bet-amount');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerTotalDiv = document.getElementById('dealer-total');
    const playerTotalDiv = document.getElementById('player-total');
    const statusDiv = document.getElementById('blackjack-status');
    
    let deck = [];
    let dealerHand = [];
    let playerHand = [];
    let currentBet = 0;
    let gameStatus = 'betting'; // betting, player-turn, dealer-turn, ended
    
    // Create a fresh deck
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        deck = [];
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ suit, value });
            }
        }
        
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    // Calculate hand value
    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        
        for (const card of hand) {
            if (card.value === 'A') {
                aces++;
                value += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }
    
    // Deal initial cards
    function dealInitialCards() {
        dealerHand = [drawCard(), drawCard()];
        playerHand = [drawCard(), drawCard()];
        updateDisplay();
        
        // Check for blackjack
        if (calculateHandValue(playerHand) === 21) {
            gameStatus = 'ended';
            dealerTurn();
        }
    }
    
    // Draw a card
    function drawCard() {
        return deck.pop();
    }
    
    // Update card display
    function updateDisplay() {
        dealerCardsDiv.innerHTML = '';
        playerCardsDiv.innerHTML = '';
        
        // Show dealer cards (hide first card if player's turn)
        dealerHand.forEach((card, index) => {
            if (index === 0 && gameStatus === 'player-turn') {
                dealerCardsDiv.appendChild(createCardElement('?', 'back'));
            } else {
                dealerCardsDiv.appendChild(createCardElement(card.value, card.suit));
            }
        });
        
        // Show player cards
        playerHand.forEach(card => {
            playerCardsDiv.appendChild(createCardElement(card.value, card.suit));
        });
        
        // Update totals
        if (gameStatus === 'player-turn') {
            playerTotalDiv.textContent = `Total: ${calculateHandValue(playerHand)}`;
            dealerTotalDiv.textContent = '';
        } else if (gameStatus === 'ended') {
            playerTotalDiv.textContent = `Total: ${calculateHandValue(playerHand)}`;
            dealerTotalDiv.textContent = `Total: ${calculateHandValue(dealerHand)}`;
        } else {
            playerTotalDiv.textContent = '';
            dealerTotalDiv.textContent = '';
        }
        
        // Update status
        if (gameStatus === 'player-turn') {
            statusDiv.textContent = `Your total: ${calculateHandValue(playerHand)}`;
        } else if (gameStatus === 'ended') {
            const playerValue = calculateHandValue(playerHand);
            const dealerValue = calculateHandValue(dealerHand);
            
            if (playerValue > 21) {
                statusDiv.textContent = 'You busted! Dealer wins.';
            } else if (dealerValue > 21) {
                statusDiv.textContent = `Dealer busted! You win $${currentBet * 2}.`;
                gameState.cash += currentBet * 2;
                
                // Gang bonus
                if (gameState.gang && gameState.gang.name === 'Shadow Syndicate') {
                    const bonus = Math.floor(currentBet * 0.2);
                    gameState.cash += bonus;
                    addNotification(`Gang bonus: +$${bonus.toLocaleString()}`);
                }
            } else if (playerValue > dealerValue) {
                statusDiv.textContent = `You win! $${currentBet * 2}.`;
                gameState.cash += currentBet * 2;
                
                // Gang bonus
                if (gameState.gang && gameState.gang.name === 'Shadow Syndicate') {
                    const bonus = Math.floor(currentBet * 0.2);
                    gameState.cash += bonus;
                    addNotification(`Gang bonus: +$${bonus.toLocaleString()}`);
                }
            } else if (playerValue < dealerValue) {
                statusDiv.textContent = 'Dealer wins.';
            } else {
                statusDiv.textContent = `Push. You get your $${currentBet} back.`;
                gameState.cash += currentBet;
            }
            
            updateUI();
        }
    }
    
    // Create card element
    function createCardElement(value, suit) {
        const card = document.createElement('div');
        card.className = 'card';
        
        if (suit === 'back') {
            card.innerHTML = '🂠';
            return card;
        }
        
        let symbol;
        switch(suit) {
            case 'hearts': symbol = '♥'; break;
            case 'diamonds': symbol = '♦'; break;
            case 'clubs': symbol = '♣'; break;
            case 'spades': symbol = '♠'; break;
        }
        
        card.innerHTML = `
            <div class="top-suit">${symbol}</div>
            <div class="value">${value}</div>
            <div class="bottom-suit">${symbol}</div>
        `;
        
        if (suit === 'hearts' || suit === 'diamonds') {
            card.classList.add('red');
        }
        
        return card;
    }
    
    // Dealer's turn
    function dealerTurn() {
        gameStatus = 'dealer-turn';
        updateDisplay();
        
        // Dealer draws until 17 or higher
        const dealerValue = calculateHandValue(dealerHand);
        if (dealerValue < 17) {
            setTimeout(() => {
                dealerHand.push(drawCard());
                dealerTurn();
            }, 1000);
        } else {
            gameStatus = 'ended';
            updateDisplay();
        }
    }
    
    // Place bet
    placeBetBtn.addEventListener('click', () => {
        if (gameStatus !== 'betting') return;
        
        const bet = parseInt(betInput.value);
        if (bet > gameState.cash) {
            addNotification("Not enough cash for that bet!");
            return;
        }
        
        currentBet = bet;
        gameState.cash -= bet;
        gameStatus = 'player-turn';
        createDeck();
        dealInitialCards();
        updateUI();
        
        // Enable/disable buttons
        hitBtn.disabled = false;
        standBtn.disabled = false;
        doubleBtn.disabled = false;
        placeBetBtn.disabled = true;
    });
    
    // Hit
    hitBtn.addEventListener('click', () => {
        if (gameStatus !== 'player-turn') return;
        
        playerHand.push(drawCard());
        updateDisplay();
        
        // Check for bust
        if (calculateHandValue(playerHand) > 21) {
            gameStatus = 'ended';
            updateDisplay();
            
            // Disable buttons
            hitBtn.disabled = true;
            standBtn.disabled = true;
            doubleBtn.disabled = true;
        }
    });
    
    // Stand
    standBtn.addEventListener('click', () => {
        if (gameStatus !== 'player-turn') return;
        
        // Disable buttons
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleBtn.disabled = true;
        
        dealerTurn();
    });
    
    // Double down
    doubleBtn.addEventListener('click', () => {
        if (gameStatus !== 'player-turn' || playerHand.length !== 2) return;
        
        if (currentBet > gameState.cash) {
            addNotification("Not enough cash to double down!");
            return;
        }
        
        gameState.cash -= currentBet;
        currentBet *= 2;
        playerHand.push(drawCard());
        
        // Disable buttons
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleBtn.disabled = true;
        
        updateUI();
        dealerTurn();
    });
    
    // New game
    newGameBtn.addEventListener('click', () => {
        gameStatus = 'betting';
        dealerHand = [];
        playerHand = [];
        currentBet = 0;
        betInput.value = 100;
        
        // Enable/disable buttons
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleBtn.disabled = true;
        placeBetBtn.disabled = false;
        
        updateDisplay();
        statusDiv.textContent = 'Place your bet to start a new game';
    });
}

function setupPoker() {
    const callBtn = document.getElementById('call-btn');
    const raiseBtn = document.getElementById('raise-btn');
    const foldBtn = document.getElementById('fold-btn');
    const checkBtn = document.getElementById('check-btn');
    const placeBetBtn = document.getElementById('place-poker-bet');
    const betInput = document.getElementById('poker-bet-amount');
    const communityCardsDiv = document.getElementById('community-cards');
    const playerHandDiv = document.getElementById('player-hand');
    const statusDiv = document.getElementById('poker-status');
    const aiPlayersDiv = document.getElementById('poker-ai-players');
    
    let deck = [];
    let communityCards = [];
    let playerHand = [];
    let aiHands = [];
    let currentBet = 0;
    let playerBet = 0;
    let pot = 0;
    let gameStage = 'preflop'; // preflop, flop, turn, river, showdown
    let gameStatus = 'betting'; // betting, player-turn, ai-turn, ended
    let aiPlayers = 3;
    
    // Create a fresh deck
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        deck = [];
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ suit, value });
            }
        }
        
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    // Deal initial cards
    function dealInitialCards() {
        playerHand = [drawCard(), drawCard()];
        aiHands = [];
        for (let i = 0; i < aiPlayers; i++) {
            aiHands.push([drawCard(), drawCard()]);
        }
        communityCards = [];
        
        updateDisplay();
    }
    
    // Draw a card
    function drawCard() {
        return deck.pop();
    }
    
    // Update display
    function updateDisplay() {
        communityCardsDiv.innerHTML = '';
        playerHandDiv.innerHTML = '';
        aiPlayersDiv.innerHTML = '';
        
        // Show community cards
        communityCards.forEach(card => {
            communityCardsDiv.appendChild(createCardElement(card.value, card.suit));
        });
        
        // Show player cards
        playerHand.forEach(card => {
            playerHandDiv.appendChild(createCardElement(card.value, card.suit));
        });
        
        // Show AI players
        for (let i = 0; i < aiPlayers; i++) {
            const aiPlayer = document.createElement('div');
            aiPlayer.className = 'ai-player';
            aiPlayer.innerHTML = `
                <div class="ai-cards">
                    <div class="card">🂠</div>
                    <div class="card">🂠</div>
                </div>
                <p>Player ${i + 1}</p>
            `;
            aiPlayersDiv.appendChild(aiPlayer);
        }
        
        // Update status
        statusDiv.innerHTML = `
            <p>Pot: $${pot}</p>
            <p>Current bet: $${currentBet}</p>
            <p>Your bet: $${playerBet}</p>
            <p>Stage: ${gameStage}</p>
            <p>Players remaining: ${aiPlayers + 1}</p>
        `;
    }
    
    // Create card element (same as blackjack)
    function createCardElement(value, suit) {
        const card = document.createElement('div');
        card.className = 'card';
        
        let symbol;
        switch(suit) {
            case 'hearts': symbol = '♥'; break;
            case 'diamonds': symbol = '♦'; break;
            case 'clubs': symbol = '♣'; break;
            case 'spades': symbol = '♠'; break;
        }
        
        card.innerHTML = `
            <div class="top-suit">${symbol}</div>
            <div class="value">${value}</div>
            <div class="bottom-suit">${symbol}</div>
        `;
        
        if (suit === 'hearts' || suit === 'diamonds') {
            card.classList.add('red');
        }
        
        return card;
    }
    
    // AI actions (simplified)
    function aiActions() {
        if (gameStatus !== 'ai-turn') return;
        
        setTimeout(() => {
            const actions = ['fold', 'call', 'raise'];
            const weights = [0.2, 0.6, 0.2]; // 20% fold, 60% call, 20% raise
            
            let action;
            const random = Math.random();
            if (random < weights[0]) action = actions[0];
            else if (random < weights[0] + weights[1]) action = actions[1];
            else action = actions[2];
            
            switch(action) {
                case 'fold':
                    aiPlayers--;
                    addNotification(`AI player folded. ${aiPlayers} remaining.`);
                    break;
                case 'call':
                    pot += currentBet;
                    addNotification(`AI player called $${currentBet}.`);
                    break;
                case 'raise':
                    const raiseAmount = currentBet + Math.floor(Math.random() * 200) + 100;
                    currentBet = raiseAmount;
                    pot += raiseAmount;
                    addNotification(`AI player raised to $${raiseAmount}.`);
                    break;
            }
            
            // Check if all AI have acted
            if (aiPlayers > 0) {
                gameStatus = 'player-turn';
            } else {
                // All AI folded - player wins
                gameState.cash += pot;
                addNotification(`All AI folded! You win $${pot}.`);
                
                // Gang bonus
                if (gameState.gang && gameState.gang.name === 'Shadow Syndicate') {
                    const bonus = Math.floor(pot * 0.2);
                    gameState.cash += bonus;
                    addNotification(`Gang bonus: +$${bonus.toLocaleString()}`);
                }
                
                gameStatus = 'ended';
                updateUI();
            }
            
            updateDisplay();
        }, 1000);
    }
    
    // Deal community cards
    function dealCommunityCards() {
        if (gameStage === 'preflop') {
            // Burn a card
            drawCard();
            // Deal flop (3 cards)
            communityCards = [drawCard(), drawCard(), drawCard()];
            gameStage = 'flop';
        } else if (gameStage === 'flop') {
            // Burn a card
            drawCard();
            // Deal turn (1 card)
            communityCards.push(drawCard());
            gameStage = 'turn';
        } else if (gameStage === 'turn') {
            // Burn a card
            drawCard();
            // Deal river (1 card)
            communityCards.push(drawCard());
            gameStage = 'river';
        } else if (gameStage === 'river') {
            // Showdown (not implemented)
            determineWinner();
            return;
        }
        
        // Reset betting for new round
        currentBet = 0;
        playerBet = 0;
        gameStatus = 'ai-turn';
        updateDisplay();
        aiActions();
    }
    
    // Determine winner (simplified)
    function determineWinner() {
        // In a real game, you'd evaluate hands here
        // For this demo, we'll just randomly decide
        const outcomes = [
            { text: "You win the pot of $${pot}!", win: true },
            { text: "AI player wins the pot.", win: false },
            { text: "Split pot between you and AI players.", win: true }
        ];
        
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        addNotification(outcome.text);
        
        if (outcome.win) {
            gameState.cash += pot;
            
            // Gang bonus
            if (gameState.gang && gameState.gang.name === 'Shadow Syndicate') {
                const bonus = Math.floor(pot * 0.2);
                gameState.cash += bonus;
                addNotification(`Gang bonus: +$${bonus.toLocaleString()}`);
            }
        }
        
        gameStatus = 'ended';
        updateUI();
    }
    
    // Place initial bet
    placeBetBtn.addEventListener('click', () => {
        if (gameStatus !== 'betting') return;
        
        const bet = parseInt(betInput.value);
        if (bet > gameState.cash) {
            addNotification("Not enough cash for that bet!");
            return;
        }
        
        currentBet = bet;
        playerBet = bet;
        pot = bet * (aiPlayers + 1); // All players match the bet
        gameState.cash -= bet;
        gameStatus = 'ai-turn';
        createDeck();
        dealInitialCards();
        updateUI();
        aiActions();
        
        // Enable/disable buttons
        placeBetBtn.disabled = true;
        callBtn.disabled = false;
        raiseBtn.disabled = false;
        foldBtn.disabled = false;
        checkBtn.disabled = false;
    });
}

function setupSlotMachine() {
    const spinBtn = document.getElementById('spin-slots');
    const betInput = document.getElementById('slot-bet');
    const reels = document.querySelectorAll('.slot-reels .reel');
    const paytableDiv = document.getElementById('slot-paytable');
    
    // Set up paytable
    paytableDiv.innerHTML = `
        <h3>Paytable</h3>
        <p>3x 💎 = 100x bet</p>
        <p>3x 7️⃣ = 50x bet</p>
        <p>3x any fruit = 10x bet</p>
        <p>2x 💎 = 5x bet</p>
    `;
    
    spinBtn.addEventListener('click', () => {
        if (casinoGames.slots.spinning) return;
        
        const bet = parseInt(betInput.value);
        if (bet > gameState.cash) {
            addNotification("You don't have enough cash for that bet!");
            return;
        }
        
        gameState.cash -= bet;
        casinoGames.slots.spinning = true;
        spinBtn.disabled = true;
        updateUI();
        
        // Spin each reel with different durations
        const spinDurations = [1000, 1200, 1400];
        const results = [];
        
        reels.forEach((reel, index) => {
            const duration = spinDurations[index];
            const startTime = Date.now();
            
            function spinReel() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Show random symbol during spin
                if (progress < 1) {
                    const randomSymbol = items.slotSymbols[Math.floor(Math.random() * items.slotSymbols.length)];
                    reel.textContent = randomSymbol;
                    requestAnimationFrame(spinReel);
                } else {
                    // Final symbol
                    const finalSymbol = items.slotSymbols[Math.floor(Math.random() * items.slotSymbols.length)];
                    reel.textContent = finalSymbol;
                    results.push(finalSymbol);
                    
                    // When all reels stopped
                    if (results.length === 3) {
                        evaluateSlotResult(results, bet);
                        casinoGames.slots.spinning = false;
                        spinBtn.disabled = false;
                    }
                }
            }
            
            spinReel();
        });
    });
    
    function evaluateSlotResult(symbols, bet) {
        let winnings = 0;
        
        // Check for wins
        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            // Three of a kind
            if (symbols[0] === '💎') {
                winnings = bet * 100;
            } else if (symbols[0] === '7️⃣') {
                winnings = bet * 50;
            } else {
                winnings = bet * 10;
            }
        } else if (symbols[0] === symbols[1] && symbols[0] === '💎') {
            // Two diamonds
            winnings = bet * 5;
        } else if (symbols[1] === symbols[2] && symbols[1] === '💎') {
            // Two diamonds
            winnings = bet * 5;
        }
        
        if (winnings > 0) {
            gameState.cash += winnings;
            
            // Gang bonus
            if (gameState.gang && gameState.gang.name === 'Shadow Syndicate') {
                const bonus = Math.floor(winnings * 0.2);
                gameState.cash += bonus;
                addNotification(`Gang bonus: +$${bonus.toLocaleString()}`);
            }
            
            addNotification(`You won $${winnings}!`);
        } else {
            addNotification("No win this time. Try again!");
        }
        
        updateUI();
    }
}

function setupDrugLab() {
    const createStrainBtn = document.getElementById('create-strain');
    
    createStrainBtn.addEventListener('click', () => {
        const base = document.getElementById('strain-base').value;
        const name = document.getElementById('strain-name').value.trim();
        const potency = document.getElementById('strain-potency').value;
        
        if (!name) {
            addNotification("Please enter a strain name");
            return;
        }
        
        // Create new strain
        const newStrain = {
            name: name,
            base: base,
            potency: potency,
            price: items.drugs[base].basePrice * (potency === 'low' ? 0.8 : potency === 'medium' ? 1.2 : 1.5),
            risk: items.drugs[base].risk * (potency === 'low' ? 0.8 : potency === 'medium' ? 1 : 1.3)
        };
        
        gameState.craftedStrains.push(newStrain);
        addNotification(`Created new strain: ${name} (${potency} potency ${base})`);
        
        // Update display
        updateDrugLab();
    });
}

function updateDrugLab() {
    const inventoryDiv = document.getElementById('drug-inventory');
    const recipesDiv = document.getElementById('crafting-recipes');
    
    // Update inventory
    inventoryDiv.innerHTML = '<h4>Your Drugs</h4>';
    if (gameState.drugInventory.length === 0) {
        inventoryDiv.innerHTML += '<p>No drugs in inventory</p>';
    } else {
        gameState.drugInventory.forEach(drug => {
            const drugItem = document.createElement('div');
            drugItem.className = 'drug-item';
            drugItem.textContent = `${drug.name} x${drug.amount}`;
            inventoryDiv.appendChild(drugItem);
        });
    }
    
    // Update crafted strains
    if (gameState.craftedStrains.length > 0) {
        inventoryDiv.innerHTML += '<h4>Your Strains</h4>';
        gameState.craftedStrains.forEach(strain => {
            const strainItem = document.createElement('div');
            strainItem.className = 'drug-item';
            strainItem.textContent = `${strain.name} ($${strain.price})`;
            inventoryDiv.appendChild(strainItem);
        });
    }
    
    // Update recipes
    recipesDiv.innerHTML = '';
    for (const [key, recipe] of Object.entries(items.recipes)) {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        
        let ingredientsText = recipe.ingredients.map(ing => `${ing.name} x${ing.amount}`).join(', ');
        recipeItem.innerHTML = `
            <h4>${recipe.name}</h4>
            <p>Ingredients: ${ingredientsText}</p>
            <p>Sell Price: $${recipe.sellPrice}</p>
            <button class="craft-btn" data-recipe="${key}">Craft</button>
        `;
        
        recipesDiv.appendChild(recipeItem);
    }
    
    // Add craft button event listeners
    document.querySelectorAll('.craft-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recipeKey = btn.getAttribute('data-recipe');
            craftDrug(recipeKey);
        });
    });
}

function craftDrug(recipeKey) {
    const recipe = items.recipes[recipeKey];
    let canCraft = true;
    
    // Check if we have all ingredients
    recipe.ingredients.forEach(ingredient => {
        const drugItem = gameState.drugInventory.find(item => item.name === ingredient.name);
        if (!drugItem || drugItem.amount < ingredient.amount) {
            canCraft = false;
        }
    });
    
    if (!canCraft) {
        addNotification("You don't have enough ingredients to craft this!");
        return;
    }
    
    // Deduct ingredients
    recipe.ingredients.forEach(ingredient => {
        const drugItem = gameState.drugInventory.find(item => item.name === ingredient.name);
        drugItem.amount -= ingredient.amount;
        if (drugItem.amount <= 0) {
            gameState.drugInventory = gameState.drugInventory.filter(item => item.name !== ingredient.name);
        }
    });
    
    // Add crafted item to inventory
    const existingItem = gameState.inventory.find(item => item.name === recipe.name);
    if (existingItem) {
        existingItem.amount = (existingItem.amount || 1) + 1;
    } else {
        gameState.inventory.push({
            name: recipe.name,
            amount: 1,
            value: recipe.sellPrice
        });
    }
    
    addNotification(`Crafted ${recipe.name}!`);
    updateDrugLab();
}

// Phone Functions
function setupPhone() {
    const callBtn = document.getElementById('call-contact');
    const textBtn = document.getElementById('text-contact');
    const sellDrugsBtn = document.getElementById('sell-drugs');
    const contactsList = document.getElementById('contacts-list');
    
    // Update contacts list
    function updateContacts() {
        contactsList.innerHTML = '';
        gameState.contacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.className = 'contact';
            contactElement.textContent = `${contact.name} (${contact.type})`;
            contactElement.addEventListener('click', () => {
                // Highlight selected contact
                document.querySelectorAll('.contact').forEach(c => c.classList.remove('selected'));
                contactElement.classList.add('selected');
            });
            contactsList.appendChild(contactElement);
        });
    }
    
    // Call contact
    callBtn.addEventListener('click', () => {
        const selected = document.querySelector('.contact.selected');
        if (!selected) {
            addNotification("Select a contact first!");
            return;
        }
        
        const contactName = selected.textContent.split(' ')[0];
        const contact = gameState.contacts.find(c => c.name.startsWith(contactName));
        
        // Different actions based on contact type
        switch(contact.type) {
            case 'drug':
                addNotification(`${contact.name}: "What you need? I got the good stuff."`);
                break;
            case 'gambling':
                addNotification(`${contact.name}: "Let's hit the tables, I know a hot streak when I see one!"`);
                break;
            case 'legal':
                addNotification(`${contact.name}: "If you're in trouble, my rates are reasonable."`);
                break;
            case 'pawn':
                addNotification(`${contact.name}: "Bring me something shiny and I'll give you cash."`);
                break;
        }
    });
    
    // Text contact
    textBtn.addEventListener('click', () => {
        const selected = document.querySelector('.contact.selected');
        if (!selected) {
            addNotification("Select a contact first!");
            return;
        }
        
        const contactName = selected.textContent.split(' ')[0];
        const messagesDiv = document.getElementById('phone-messages');
        
        messagesDiv.innerHTML += `
            <div class="message">
                <strong>You to ${contactName}:</strong> 
                <p>Hey, let's meet up soon.</p>
            </div>
        `;
        
        // Simulate reply after delay
        setTimeout(() => {
            let reply = "";
            const contact = gameState.contacts.find(c => c.name.startsWith(contactName));
            
            switch(contact.type) {
                case 'drug':
                    reply = "I'm around. Got that fire if you need it.";
                    break;
                case 'gambling':
                    reply = "Casino tonight? High stakes table is hot.";
                    break;
                case 'legal':
                    reply = "I'm in court all day. Email my assistant.";
                    break;
                case 'pawn':
                    reply = "Shop's open 9-5. Bring your valuables.";
                    break;
            }
            
            messagesDiv.innerHTML += `
                <div class="message">
                    <strong>${contactName} to You:</strong> 
                    <p>${reply}</p>
                </div>
            `;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 1000);
    });
    
    // Sell drugs
    sellDrugsBtn.addEventListener('click', () => {
        if (gameState.drugInventory.length === 0 && gameState.craftedStrains.length === 0) {
            addNotification("You don't have any drugs to sell!");
            return;
        }
        
        const selected = document.querySelector('.contact.selected');
        if (!selected) {
            addNotification("Select a contact first!");
            return;
        }
        
        const contactName = selected.textContent.split(' ')[0];
        const contact = gameState.contacts.find(c => c.name.startsWith(contactName));
        
        if (contact.type !== 'drug') {
            addNotification("This contact isn't interested in drugs!");
            return;
        }
        
        // Random chance of getting caught
        const caughtChance = Math.random() * 100;
        if (caughtChance < 10) { // 10% chance
            getArrested("Drug dealing");
            return;
        }
        
        // Sell random drug
        let drugsAvailable = [...gameState.drugInventory];
        gameState.craftedStrains.forEach(strain => {
            drugsAvailable.push({ name: strain.name, amount: 1, value: strain.price });
        });
        
        if (drugsAvailable.length === 0) {
            addNotification("No drugs to sell!");
            return;
        }
        
        const randomDrug = drugsAvailable[Math.floor(Math.random() * drugsAvailable.length)];
        const amountSold = Math.min(randomDrug.amount, Math.floor(Math.random() * 5) + 1);
        let saleValue = amountSold * (randomDrug.value || items.drugs[randomDrug.name.toLowerCase()].basePrice);
        
        // Gang bonus
        if (gameState.gang && gameState.gang.name === 'Blood Vipers') {
            saleValue = Math.floor(saleValue * 1.3);
        }
        
        // Update inventory
        if (randomDrug.amount) {
            // From drugInventory
            const drugItem = gameState.drugInventory.find(item => item.name === randomDrug.name);
            drugItem.amount -= amountSold;
            if (drugItem.amount <= 0) {
                gameState.drugInventory = gameState.drugInventory.filter(item => item.name !== randomDrug.name);
            }
        } else {
            // Crafted strain - just sell once
            gameState.craftedStrains = gameState.craftedStrains.filter(item => item.name !== randomDrug.name);
        }
        
        // Update cash
        gameState.cash += saleValue;
        
        // Increase trust
        contact.trust = Math.min(100, contact.trust + 5);
        
        addNotification(`Sold ${amountSold} ${randomDrug.name} to ${contactName} for $${saleValue}!`);
        updateUI();
        updateDrugLab();
    });
    
    updatePhone = function() {
        updateContacts();
        document.getElementById('phone-messages').innerHTML = '';
    };
}

// Pawn Shop Functions
function setupPawnShop() {
    updatePawnShop = function() {
        const playerItemsDiv = document.getElementById('player-items');
        
        playerItemsDiv.innerHTML = '';
        if (gameState.inventory.length === 0) {
            playerItemsDiv.innerHTML = '<p>No items to pawn</p>';
            return;
        }
        
        gameState.inventory.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.textContent = `${item.name} ($${item.value})`;
            itemElement.addEventListener('click', () => {
                // Generate offer (random between 50-80% of value)
                const offer = Math.floor(item.value * (0.5 + Math.random() * 0.3));
                document.getElementById('pawn-offer-amount').textContent = `$${offer}`;
                
                // Set up accept button
                document.getElementById('accept-pawn').onclick = () => {
                    gameState.cash += offer;
                    gameState.inventory.splice(index, 1);
                    addNotification(`Pawned ${item.name} for $${offer}`);
                    updateUI();
                    updatePawnShop();
                };
            });
            playerItemsDiv.appendChild(itemElement);
        });
    };
    
    // Rob pawn shop
    document.getElementById('rob-pawn-shop').addEventListener('click', () => {
        if (gameState.inJail) {
            addNotification("You can't rob while in jail!");
            return;
        }
        
        // Chance to succeed based on reputation
        const successChance = gameState.reputation === 'Neutral' ? 50 : 
                             gameState.reputation === 'Criminal' ? 70 : 40;
        
        if (Math.random() * 100 > successChance) {
            // Failed robbery
            getArrested("Attempted robbery");
            return;
        }
        
        // Successful robbery
        const stolenAmount = 2000 + Math.floor(Math.random() * 5000);
        gameState.cash += stolenAmount;
        gameState.reputation = 'Criminal';
        
        addNotification(`Successfully robbed the pawn shop! Got $${stolenAmount}.`);
        updateUI();
    });
}

// Car Dealer Functions
function setupCarDealer() {
    updateCarDealer = function() {
        const showroomDiv = document.getElementById('vehicle-showroom');
        const garageDiv = document.getElementById('owned-vehicles');
        
        // Show available vehicles
        showroomDiv.innerHTML = '';
        items.vehicles.forEach(vehicle => {
            if (!gameState.ownedVehicles.some(v => v.name === vehicle.name)) {
                const vehicleElement = document.createElement('div');
                vehicleElement.className = 'vehicle';
                vehicleElement.innerHTML = `
                    <h4>${vehicle.name}</h4>
                    <p>Price: $${vehicle.price.toLocaleString()}</p>
                    <button class="buy-vehicle" data-name="${vehicle.name}" data-price="${vehicle.price}">Buy</button>
                `;
                showroomDiv.appendChild(vehicleElement);
            }
        });
        
        // Add buy event listeners
        document.querySelectorAll('.buy-vehicle').forEach(btn => {
            btn.addEventListener('click', () => {
                const vehicleName = btn.getAttribute('data-name');
                const vehiclePrice = parseInt(btn.getAttribute('data-price'));
                
                if (gameState.cash < vehiclePrice) {
                    addNotification("You can't afford this vehicle!");
                    return;
                }
                
                gameState.cash -= vehiclePrice;
                gameState.ownedVehicles.push({ name: vehicleName });
                addNotification(`Purchased ${vehicleName} for $${vehiclePrice.toLocaleString()}!`);
                updateUI();
                updateCarDealer();
            });
        });
        
        // Show owned vehicles
        garageDiv.innerHTML = '';
        if (gameState.ownedVehicles.length === 0) {
            garageDiv.innerHTML = '<p>No vehicles owned</p>';
        } else {
            gameState.ownedVehicles.forEach(vehicle => {
                const vehicleElement = document.createElement('div');
                vehicleElement.className = 'vehicle';
                vehicleElement.innerHTML = `
                    <h4>${vehicle.name}</h4>
                    <button class="sell-vehicle" data-name="${vehicle.name}">Sell</button>
                `;
                garageDiv.appendChild(vehicleElement);
            });
        }
        
        // Add sell event listeners
        document.querySelectorAll('.sell-vehicle').forEach(btn => {
            btn.addEventListener('click', () => {
                const vehicleName = btn.getAttribute('data-name');
                const vehicle = items.vehicles.find(v => v.name === vehicleName);
                const sellPrice = Math.floor(vehicle.price * 0.7); // 70% of original price
                
                gameState.cash += sellPrice;
                gameState.ownedVehicles = gameState.ownedVehicles.filter(v => v.name !== vehicleName);
                addNotification(`Sold ${vehicleName} for $${sellPrice.toLocaleString()}`);
                updateUI();
                updateCarDealer();
            });
        });
    };
}

// Grocery Store Functions
function setupGroceryStore() {
    updateGroceryStore = function() {
        const groceryItemsDiv = document.getElementById('grocery-items');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total-amount');
        
        let cart = [];
        let total = 0;
        
        // Display grocery items
        groceryItemsDiv.innerHTML = '';
        items.groceries.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'grocery-item';
            itemElement.innerHTML = `
                <h4>${item.name}</h4>
                <p>$${item.price} (+${item.health} health)</p>
                <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}" data-health="${item.health}">Add to Cart</button>
            `;
            groceryItemsDiv.appendChild(itemElement);
        });
        
        // Add to cart event listeners
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = {
                    name: btn.getAttribute('data-name'),
                    price: parseInt(btn.getAttribute('data-price')),
                    health: parseInt(btn.getAttribute('data-health'))
                };
                
                cart.push(item);
                total += item.price;
                
                updateCart();
            });
        });
        
        // Checkout button
        document.getElementById('checkout').addEventListener('click', () => {
            if (cart.length === 0) {
                addNotification("Your cart is empty!");
                return;
            }
            
            if (gameState.cash < total) {
                addNotification("You don't have enough money!");
                return;
            }
            
            gameState.cash -= total;
            
            // Apply health from food
            const healthGain = cart.reduce((sum, item) => sum + item.health, 0);
            gameState.food = Math.min(100, gameState.food + healthGain);
            
            addNotification(`Purchased groceries for $${total}! Gained ${healthGain} health.`);
            
            // Reset cart
            cart = [];
            total = 0;
            updateCart();
            updateUI();
        });
        
        function updateCart() {
            cartItemsDiv.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsDiv.innerHTML = '<p>Cart is empty</p>';
            } else {
                // Group items by name
                const itemCounts = {};
                cart.forEach(item => {
                    itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
                });
                
                // Display grouped items
                for (const [name, count] of Object.entries(itemCounts)) {
                    const item = items.groceries.find(g => g.name === name);
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <span>${name} x${count}</span>
                        <span>$${item.price * count}</span>
                    `;
                    cartItemsDiv.appendChild(cartItem);
                }
            }
            
            cartTotalSpan.textContent = `$${total}`;
        }
    };
}

// Gun Store Functions
function setupGunStore() {
    updateGunStore = function() {
        const storeInventory = document.getElementById('gun-store-inventory');
        const ownedGunsDiv = document.getElementById('owned-guns');
        
        // Display available guns
        storeInventory.innerHTML = '';
        items.guns.forEach(gun => {
            if (!gameState.guns.some(g => g.name === gun.name)) {
                const gunElement = document.createElement('div');
                gunElement.className = 'gun-item';
                gunElement.innerHTML = `
                    <h4>${gun.name}</h4>
                    <p>Damage: ${gun.damage}</p>
                    <p>Price: $${gun.price.toLocaleString()}</p>
                    <button class="buy-gun" data-name="${gun.name}" data-price="${gun.price}">Buy</button>
                `;
                storeInventory.appendChild(gunElement);
            }
        });
        
        // Add buy event listeners
        document.querySelectorAll('.buy-gun').forEach(btn => {
            btn.addEventListener('click', () => {
                const gunName = btn.getAttribute('data-name');
                const gunPrice = parseInt(btn.getAttribute('data-price'));
                
                if (gameState.cash < gunPrice) {
                    addNotification("You can't afford this weapon!");
                    return;
                }
                
                gameState.cash -= gunPrice;
                gameState.guns.push(items.guns.find(g => g.name === gunName));
                addNotification(`Purchased ${gunName} for $${gunPrice.toLocaleString()}!`);
                updateUI();
                updateGunStore();
            });
        });
        
        // Display owned guns
        ownedGunsDiv.innerHTML = '';
        if (gameState.guns.length === 0) {
            ownedGunsDiv.innerHTML = '<p>No guns owned</p>';
        } else {
            gameState.guns.forEach((gun, index) => {
                const gunElement = document.createElement('div');
                gunElement.className = 'gun-item';
                gunElement.innerHTML = `
                    <h4>${gun.name}</h4>
                    <p>Damage: ${gun.damage}</p>
                    <button class="sell-gun" data-index="${index}">Sell</button>
                    <button class="use-gun" data-index="${index}">Use</button>
                `;
                ownedGunsDiv.appendChild(gunElement);
            });
        }
        
        // Add sell/use event listeners
        document.querySelectorAll('.sell-gun').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const gun = gameState.guns[index];
                const sellPrice = Math.floor(gun.price * 0.6); // 60% of original price
                
                gameState.cash += sellPrice;
                gameState.guns.splice(index, 1);
                addNotification(`Sold ${gun.name} for $${sellPrice.toLocaleString()}`);
                updateUI();
                updateGunStore();
            });
        });
        
        document.querySelectorAll('.use-gun').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const gun = gameState.guns[index];
                
                if (!gameState.gang) {
                    addNotification("You need to be in a gang to use weapons!");
                    return;
                }
                
                // Random crime outcome
                const outcomes = [
                    `Used ${gun.name} in a drive-by. Earned $${Math.floor(gun.damage * 10)}.`,
                    `Robbed a store with ${gun.name}. Got $${Math.floor(gun.damage * 15)}.`,
                    `Shot a rival gang member. Gained reputation.`,
                    `Got into a shootout with police. Barely escaped!`,
                    `Failed crime attempt with ${gun.name}. No profit.`
                ];
                
                const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                addNotification(outcome);
                
                // Gang bonus for damage
                let damage = gun.damage;
                if (gameState.gang && gameState.gang.name === 'Golden Cartel') {
                    damage = Math.floor(damage * 1.25);
                }
                
                // Chance to increase gang reputation
                if (Math.random() > 0.3) {
                    gameState.gangReputation += Math.floor(damage / 10);
                    addNotification(`Gang reputation increased to ${gameState.gangReputation}`);
                }
                
                // Chance to get arrested
                if (Math.random() < 0.2) {
                    getArrested("Illegal firearm use");
                }
                
                updateUI();
            });
        });
    };
}

// Gang Functions
function setupGangs() {
    updateGangs = function() {
        const gangList = document.getElementById('gang-list');
        const gangInfo = document.getElementById('gang-info');
        const gangActions = document.getElementById('gang-actions');
        
        // Display gangs
        gangList.innerHTML = '';
        items.gangs.forEach(gang => {
            const gangElement = document.createElement('div');
            gangElement.className = 'gang-option';
            gangElement.style.borderLeft = `5px solid ${gang.color}`;
            gangElement.innerHTML = `
                <h3>${gang.name}</h3>
                <p>${gang.initiation}</p>
            `;
            
            gangElement.addEventListener('click', () => {
                if (gameState.gang && gameState.gang.name === gang.name) {
                    addNotification(`You're already in ${gang.name}!`);
                    return;
                }
                
                // Check if player meets initiation requirements
                let canJoin = false;
                switch(gang.initiation) {
                    case 'Steal a car':
                        canJoin = gameState.inventory.some(item => item.name.includes('Car'));
                        break;
                    case 'Sell $5000 worth of drugs':
                        canJoin = gameState.cash >= 5000; // Simplified for demo
                        break;
                    case 'Win $10000 at casino':
                        canJoin = gameState.cash >= 10000; // Simplified for demo
                        break;
                    case 'Kill a rival gang member':
                        canJoin = gameState.guns.length > 0;
                        break;
                }
                
                if (canJoin || !gameState.gang) {
                    gameState.gang = gang;
                    gameState.gangReputation = 10;
                    addNotification(`You joined ${gang.name}! Bonus: ${gang.bonus}`);
                    updateGangs();
                } else {
                    addNotification(`You need to complete the initiation: ${gang.initiation}`);
                }
            });
            
            gangList.appendChild(gangElement);
        });
        
        // Display current gang info
        if (gameState.gang) {
            gangInfo.innerHTML = `
                <h3>${gameState.gang.name}</h3>
                <p>Reputation: ${gameState.gangReputation}</p>
                <p>${gameState.gang.bonus}</p>
            `;
            
            gangActions.innerHTML = `
                <button id="gang-war">Start Gang War</button>
                <button id="rob-gang-member" class="danger">Rob Gang Member</button>
                <button id="leave-gang">Leave Gang</button>
            `;
            
            document.getElementById('gang-war').addEventListener('click', () => {
                if (gameState.guns.length === 0) {
                    addNotification("You need weapons to start a gang war!");
                    return;
                }
                
                const outcome = Math.random();
                if (outcome < 0.4) { // 40% chance to win
                    const winnings = 2000 + Math.floor(Math.random() * 5000);
                    gameState.cash += winnings;
                    gameState.gangReputation += 15;
                    gameState.territory += 1;
                    addNotification(`Won gang war! Gained $${winnings} and +1 territory.`);
                } else if (outcome < 0.8) { // 40% chance to lose
                    gameState.health -= Math.floor(Math.random() * 40) + 10;
                    gameState.gangReputation -= 5;
                    addNotification("Lost gang war! Took damage and lost reputation.");
                } else { // 20% chance to get arrested
                    getArrested("Gang-related violence");
                }
                
                updateUI();
            });
            
            document.getElementById('rob-gang-member').addEventListener('click', robGangMember);
            
            document.getElementById('leave-gang').addEventListener('click', () => {
                gameState.gang = null;
                gameState.gangReputation = 0;
                addNotification("You left the gang.");
                updateGangs();
            });
        } else {
            gangInfo.innerHTML = '<p>Not in a gang</p>';
            gangActions.innerHTML = '';
        }
    };
}

function robGangMember() {
    if (!gameState.gang) return;
    
    // Chance based on reputation
    const successChance = 30 + (gameState.gangReputation / 2);
    if (Math.random() * 100 > successChance) {
        // Failed robbery
        const lostRep = Math.floor(Math.random() * 15) + 5;
        gameState.gangReputation = Math.max(0, gameState.gangReputation - lostRep);
        gameState.health -= Math.floor(Math.random() * 30) + 10;
        
        addNotification(`Failed to rob gang member! Lost ${lostRep} reputation and took damage.`);
        
        if (gameState.health <= 0) {
            gameState.health = 1;
            addNotification("You were nearly killed! Hospitalized for a day.");
            gameState.time += 24;
        }
    } else {
        // Successful robbery
        const stolenAmount = 500 + Math.floor(Math.random() * 2000);
        gameState.cash += stolenAmount;
        gameState.gangReputation -= 5;
        
        addNotification(`Successfully robbed a gang member for $${stolenAmount}! Lost 5 reputation.`);
    }
    
    updateUI();
    updateGangs();
}

// Jail and Court Functions
function setupJailAndCourt() {
    // Arrest function
    window.getArrested = function(charge) {
        gameState.inJail = true;
        gameState.jailDaysRemaining = Math.floor(Math.random() * 30) + 10; // 10-40 days
        gameState.currentCase = {
            charge: charge,
            severity: Math.floor(Math.random() * 3) + 1 // 1-3
        };
        
        // Show jail modal
        document.getElementById('jail-time').textContent = gameState.jailDaysRemaining;
        document.getElementById('jail-modal').style.display = 'block';
        
        // Disable other locations
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        addNotification(`Arrested for ${charge}! You're in jail for ${gameState.jailDaysRemaining} days.`);
    };
    
    // Jail options
    document.getElementById('request-lawyer').addEventListener('click', () => {
        document.getElementById('jail-modal').style.display = 'none';
        document.getElementById('court-modal').style.display = 'block';
        updateCourt();
    });
    
    document.getElementById('bail-out').addEventListener('click', () => {
        if (gameState.cash >= 50000) {
            gameState.cash -= 50000;
            gameState.inJail = false;
            document.getElementById('jail-modal').style.display = 'none';
            document.querySelectorAll('.location-btn').forEach(btn => {
                btn.disabled = false;
            });
            addNotification("Posted bail for $50,000! You're free for now.");
            updateUI();
        } else {
            addNotification("You don't have $50,000 for bail!");
        }
    });
    
    document.getElementById('jail-work').addEventListener('click', () => {
        gameState.jailDaysRemaining--;
        gameState.cash += 100;
        
        if (gameState.jailDaysRemaining <= 0) {
            gameState.inJail = false;
            document.getElementById('jail-modal').style.display = 'none';
            document.querySelectorAll('.location-btn').forEach(btn => {
                btn.disabled = false;
            });
            addNotification("You've served your time and are released from jail.");
        } else {
            document.getElementById('jail-time').textContent = gameState.jailDaysRemaining;
            addNotification("Worked in jail for $100. One day closer to freedom.");
        }
        
        updateUI();
    });
    
    document.getElementById('jail-fight').addEventListener('click', () => {
        const outcome = Math.random();
        
        if (outcome < 0.3) { // 30% chance of injury
            gameState.health -= Math.floor(Math.random() * 30) + 10;
            addNotification("You got into a fight and were badly injured!");
            
            if (gameState.health <= 0) {
                gameState.health = 1;
                addNotification("You were nearly killed but the guards intervened!");
            }
        } else if (outcome < 0.6) { // 30% chance of winning
            addNotification("You won the fight! Gained some respect in jail.");
        } else { // 40% chance of solitary
            gameState.jailDaysRemaining += 3;
            document.getElementById('jail-time').textContent = gameState.jailDaysRemaining;
            addNotification("Guards caught you fighting! 3 days added to your sentence.");
        }
        
        updateUI();
    });
    
    // Court functions
    function updateCourt() {
        const caseDetails = document.getElementById('case-details');
        caseDetails.innerHTML = `
            <h3>Case Details</h3>
            <p><strong>Charge:</strong> ${gameState.currentCase.charge}</p>
            <p><strong>Severity:</strong> ${'⭐'.repeat(gameState.currentCase.severity)}</p>
            <p><strong>Current Sentence:</strong> ${gameState.jailDaysRemaining} days</p>
        `;
        
        document.getElementById('court-result').innerHTML = '';
    }
    
    // Lawyer options
    document.querySelectorAll('.lawyer-option').forEach(option => {
        option.addEventListener('click', () => {
            const skill = parseInt(option.getAttribute('data-skill'));
            let cost = 0;
            
            switch(skill) {
                case 1: cost = 0; break;
                case 2: cost = 5000; break;
                case 3: cost = 15000; break;
                case 4: cost = 30000; break;
            }
            
            if (gameState.cash < cost) {
                addNotification("You can't afford this lawyer!");
                return;
            }
            
            gameState.cash -= cost;
            if (cost > 0) {
                addNotification(`Hired a lawyer for $${cost.toLocaleString()}`);
            } else {
                addNotification("Using a public defender");
            }
            
            // Calculate chance of winning
            const baseChance = skill * 25; // 25, 50, 75, 100
            const severityPenalty = (gameState.currentCase.severity - 1) * 15;
            const winChance = Math.max(10, baseChance - severityPenalty);
            
            // Present case button
            document.getElementById('present-case').onclick = () => {
                const argument = document.getElementById('defense-argument').value.trim();
                let argumentBonus = 0;
                
                if (argument.length > 20) {
                    argumentBonus = 5 + Math.min(15, Math.floor(argument.length / 10));
                }
                
                const totalChance = Math.min(95, winChance + argumentBonus);
                const roll = Math.random() * 100;
                
                const courtResult = document.getElementById('court-result');
                
                if (roll <= totalChance) {
                    // Won case
                    gameState.inJail = false;
                    gameState.jailDaysRemaining = 0;
                    
                    courtResult.innerHTML = `
                        <h3>Case Dismissed!</h3>
                        <p>The judge ruled in your favor. You're free to go!</p>
                    `;
                    
                    setTimeout(() => {
                        document.getElementById('court-modal').style.display = 'none';
                        document.querySelectorAll('.location-btn').forEach(btn => {
                            btn.disabled = false;
                        });
                    }, 3000);
                } else {
                    // Lost case
                    const sentenceReduction = Math.floor(Math.random() * 10) + 5;
                    gameState.jailDaysRemaining = Math.max(1, gameState.jailDaysRemaining - sentenceReduction);
                    
                    courtResult.innerHTML = `
                        <h3>Guilty Verdict</h3>
                        <p>The judge wasn't convinced. However, your sentence was reduced by ${sentenceReduction} days.</p>
                        <p>New sentence: ${gameState.jailDaysRemaining} days</p>
                    `;
                    
                    document.getElementById('jail-time').textContent = gameState.jailDaysRemaining;
                }
            };
        });
    });
}

// Game Clock
function startGameClock() {
    setInterval(() => {
        // Advance time
        gameState.time++;
        if (gameState.time >= 24) {
            gameState.time = 0;
            gameState.day++;
            
            // Decrease food
            gameState.food = Math.max(0, gameState.food - 30);
            if (gameState.food <= 0) {
                gameState.health = Math.max(1, gameState.health - 10);
                addNotification("You're starving! Your health is deteriorating.");
            }
            
            // If in jail, decrease sentence
            if (gameState.inJail) {
                gameState.jailDaysRemaining--;
                if (gameState.jailDaysRemaining <= 0) {
                    gameState.inJail = false;
                    document.getElementById('jail-modal').style.display = 'none';
                    document.querySelectorAll('.location-btn').forEach(btn => {
                        btn.disabled = false;
                    });
                    addNotification("You've served your time and are released from jail.");
                }
            }
        }
        
        updateUI();
    }, 30000); // 30 seconds = 1 hour in game time
}

// Helper Functions
function addNotification(message) {
    gameState.notifications.push(message);
    if (gameState.notifications.length > 5) {
        gameState.notifications.shift();
    }
    updateUI();
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        const index = gameState.notifications.indexOf(message);
        if (index > -1) {
            gameState.notifications.splice(index, 1);
            updateUI();
        }
    }, 5000);
}

// Initialize the game when the page loads
window.onload = initGame;
