// trading.js
// Game state from main game
let gameState = {};

// Trading state
const tradingState = {
    currentTrader: null,
    currentOffer: null,
    currentRobbery: null,
    counterOffer: {
        theirItems: [],
        yourItems: []
    },
    traders: [],
    marketTraders: [],
    lastTraderSearch: 0,
    lastMarketSearch: 0
};

// Trader types
const TRADER_TYPES = {
    STREET: {
        name: "Street Vendor",
        risk: 0.1,
        reward: 0.8,
        undercoverChance: 0.05
    },
    MARKET: {
        name: "Black Market Dealer",
        risk: 0.3,
        reward: 1.2,
        undercoverChance: 0.2
    },
    UNDERCOVER: {
        name: "Street Vendor", // Hidden as undercover
        risk: 1.0,
        reward: 0.5,
        isUndercover: true
    },
    SHADY: {
        name: "Shady Dealer",
        risk: 0.5,
        reward: 1.0,
        undercoverChance: 0.1,
        scamChance: 0.4
    }
};

// Initialize the trading game
function initTradingGame() {
    // Try to load game state from localStorage
    const savedState = localStorage.getItem('streetAlchemistGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
    } else {
        // Fallback to empty state if not found
        gameState = {
            money: 10000,
            reputation: 0,
            health: 100,
            inventory: {},
            weapons: {},
            ingredients: {},
            inJail: false,
            jailDays: 0
        };
    }
    
    updateTradingUI();
    setupEventListeners();
    renderInventory();
}

// Update all UI elements
function updateTradingUI() {
    // Update money display
    document.querySelectorAll('[id$="-money"]').forEach(el => {
        el.textContent = `$${gameState.money.toLocaleString()}`;
    });
    
    // Update time display
    updateTimeDisplay();
    
    // Update reputation
    document.getElementById('trade-rep').textContent = `Rep: ${gameState.reputation}`;
    
    // Update health
    document.getElementById('trade-health').textContent = `Health: ${gameState.health}%`;
}

function updateTimeDisplay() {
    const hours = Math.floor(gameState.time / 60) % 24;
    const minutes = gameState.time % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.querySelectorAll('[id$="-time"]').forEach(el => el.textContent = timeString);
}

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.trading-tabs .tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            showTradingTab(tab);
        });
    });
    
    // Back button
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            if (document.getElementById('negotiation-screen').classList.contains('hidden') === false) {
                showTradingTab('street');
            } else {
                window.location.href = 'index.html';
            }
        });
    });
    
    // Find traders buttons
    document.getElementById('find-traders').addEventListener('click', findStreetTraders);
    document.getElementById('find-market-traders').addEventListener('click', findMarketTraders);
    
    // Negotiation buttons
    document.querySelectorAll('.negotiation-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            handleNegotiation(action);
        });
    });
    
    // Counter offer controls
    document.getElementById('counter-item-type').addEventListener('change', updateCounterItems);
    document.getElementById('add-counter-item').addEventListener('click', addCounterItem);
    document.getElementById('submit-counter').addEventListener('click', submitCounterOffer);
    
    // Robbery buttons
    document.querySelectorAll('.robbery-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            attemptRobbery(action);
        });
    });
    
    // Outcome continue button
    document.getElementById('outcome-continue').addEventListener('click', () => {
        showTradingTab('street');
    });
    
    // Robbery continue button
    document.getElementById('robbery-continue').addEventListener('click', () => {
        if (gameState.inJail) {
            window.location.href = 'index.html';
        } else {
            showTradingTab('street');
        }
    });
}

// Show trading tab
function showTradingTab(tab) {
    document.querySelectorAll('.trading-content .tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.trading-tabs .tab-button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.querySelector(`.trading-tabs .tab-button[data-tab="${tab}"]`).classList.add('active');
    
    // Hide all app screens except trading screen
    document.querySelectorAll('.app-screen').forEach(el => el.classList.add('hidden'));
    document.getElementById('trading-screen').classList.remove('hidden');
}

// Find street traders
function findStreetTraders() {
    const now = Date.now();
    const cooldown = 30000; // 30 seconds cooldown
    
    if (now - tradingState.lastTraderSearch < cooldown) {
        alert("You need to wait before finding new traders!");
        return;
    }
    
    tradingState.lastTraderSearch = now;
    tradingState.traders = [];
    
    const traderList = document.getElementById('street-traders');
    traderList.innerHTML = '';
    
    // Random chance to find no traders
    if (Math.random() < 0.2) {
        traderList.innerHTML = '<p class="no-traders">No traders available right now. Try again later.</p>';
        return;
    }
    
    // Generate 1-3 traders
    const numTraders = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numTraders; i++) {
        // Determine trader type (5% chance of undercover)
        let traderType;
        const rand = Math.random();
        
        if (rand < 0.05) {
            traderType = TRADER_TYPES.UNDERCOVER;
        } else if (rand < 0.2) {
            traderType = TRADER_TYPES.SHADY;
        } else {
            traderType = TRADER_TYPES.STREET;
        }
        
        const trader = generateTrader(traderType);
        tradingState.traders.push(trader);
        
        const traderEl = createTraderElement(trader);
        traderList.appendChild(traderEl);
    }
}

// Find black market traders
function findMarketTraders() {
    const now = Date.now();
    const cooldown = 60000; // 60 seconds cooldown
    
    if (now - tradingState.lastMarketSearch < cooldown) {
        alert("The black market needs time to get new offers!");
        return;
    }
    
    tradingState.lastMarketSearch = now;
    tradingState.marketTraders = [];
    
    const traderList = document.getElementById('market-traders');
    traderList.innerHTML = '';
    
    // Generate 1-2 traders (higher chance of undercover)
    const numTraders = 1 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numTraders; i++) {
        // Determine trader type (20% chance of undercover)
        const traderType = Math.random() < 0.2 ? TRADER_TYPES.UNDERCOVER : TRADER_TYPES.MARKET;
        const trader = generateTrader(traderType);
        tradingState.marketTraders.push(trader);
        
        const traderEl = createTraderElement(trader);
        traderList.appendChild(traderEl);
    }
}

// Generate a random trader
function generateTrader(type) {
    const names = [
        "Tony", "Maria", "Carlos", "Jamal", "Viktor", "Lena", "Dmitri", "Aisha",
        "Raul", "Jasmine", "Tyrone", "Mei", "Hector", "Nadia", "Ivan", "Leila"
    ];
    
    const nicknames = [
        "Fast Hands", "Slick", "The Snake", "Ghost", "Smiley", "Tiny", "Big Mike",
        "The Professor", "Doc", "Lucky", "Fingers", "The Owl", "Whisper", "The Fox"
    ];
    
    const name = `${names[Math.floor(Math.random() * names.length)]} "${nicknames[Math.floor(Math.random() * nicknames.length)]}"`;
    
    // Generate offer based on type
    const offer = generateOffer(type);
    
    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
        type,
        trust: 30 + Math.floor(Math.random() * 50), // 30-80% trust
        offer,
        isUndercover: type.isUndercover || false
    };
}

// Generate a random offer
function generateOffer(traderType) {
    const offer = {
        theirItems: [],
        yourItems: []
    };
    
    // What they're offering
    const possibleDrugs = ["weed", "meth", "coke", "heroin"];
    const possibleWeapons = ["pistol", "shotgun", "rifle", "switch"];
    
    // 70% chance to offer drugs, 20% weapons, 10% money
    const offerType = Math.random();
    
    if (offerType < 0.7) {
        // Offer drugs
        const drug = possibleDrugs[Math.floor(Math.random() * possibleDrugs.length)];
        const amount = 1 + Math.floor(Math.random() * 10 * traderType.reward);
        offer.theirItems.push({ type: "drug", item: drug, amount });
    } else if (offerType < 0.9) {
        // Offer weapons
        const weapon = possibleWeapons[Math.floor(Math.random() * possibleWeapons.length)];
        offer.theirItems.push({ type: "weapon", item: weapon, amount: 1 });
    } else {
        // Offer money
        const amount = 100 + Math.floor(Math.random() * 1000 * traderType.reward);
        offer.theirItems.push({ type: "money", item: "cash", amount });
    }
    
    // What they want
    // 60% chance to want drugs, 30% weapons, 10% money
    const wantType = Math.random();
    
    if (wantType < 0.6) {
        // Want drugs
        const drug = possibleDrugs[Math.floor(Math.random() * possibleDrugs.length)];
        const amount = 1 + Math.floor(Math.random() * 10 / traderType.reward);
        offer.yourItems.push({ type: "drug", item: drug, amount });
    } else if (wantType < 0.9) {
        // Want weapons
        const weapon = possibleWeapons[Math.floor(Math.random() * possibleWeapons.length)];
        offer.yourItems.push({ type: "weapon", item: weapon, amount: 1 });
    } else {
        // Want money
        const amount = 50 + Math.floor(Math.random() * 500 / traderType.reward);
        offer.yourItems.push({ type: "money", item: "cash", amount });
    }
    
    return offer;
}

// Create trader HTML element
function createTraderElement(trader) {
    const traderEl = document.createElement('div');
    traderEl.className = 'trader';
    traderEl.dataset.id = trader.id;
    
    const typeClass = trader.isUndercover ? 'trader-type-undercover' : 
                     trader.type === TRADER_TYPES.MARKET ? 'trader-type-market' :
                     trader.type === TRADER_TYPES.SHADY ? 'trader-type-shady' : 'trader-type-street';
    
    traderEl.innerHTML = `
        <h4>${trader.name}</h4>
        <p class="${typeClass}">${trader.type.name}</p>
        <p>Trust: ${trader.trust}%</p>
        <div class="trader-offer">
            <div class="their-items">
                ${trader.offer.theirItems.map(item => 
                    `<span class="trader-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</span>`
                ).join('')}
            </div>
            <span>for</span>
            <div class="your-items">
                ${trader.offer.yourItems.map(item => 
                    `<span class="trader-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</span>`
                ).join('')}
            </div>
        </div>
    `;
    
    traderEl.addEventListener('click', () => startNegotiation(trader));
    
    return traderEl;
}

// Start negotiation with a trader
function startNegotiation(trader) {
    tradingState.currentTrader = trader;
    tradingState.currentOffer = trader.offer;
    
    // Reset counter offer
    tradingState.counterOffer = {
        theirItems: [...trader.offer.theirItems],
        yourItems: [...trader.offer.yourItems]
    };
    
    // Update UI
    document.getElementById('trader-name').textContent = trader.name;
    document.getElementById('trader-type').textContent = trader.type.name;
    document.getElementById('trader-trust').textContent = `Trust: ${trader.trust}%`;
    
    // Set avatar based on trader type
    const avatar = document.querySelector('.trader-avatar');
    avatar.textContent = trader.name.charAt(0);
    avatar.style.backgroundColor = trader.isUndercover ? '#f44336' : 
                                 trader.type === TRADER_TYPES.MARKET ? '#9C27B0' :
                                 trader.type === TRADER_TYPES.SHADY ? '#FF9800' : '#4CAF50';
    
    // Show their offer
    const theirOfferEl = document.getElementById('their-offer');
    theirOfferEl.innerHTML = tradingState.currentOffer.theirItems.map(item => 
        `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
    ).join('');
    
    // Show your offer
    const yourOfferEl = document.getElementById('your-offer');
    yourOfferEl.innerHTML = tradingState.currentOffer.yourItems.map(item => 
        `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
    ).join('');
    
    // Hide counter offer section
    document.getElementById('counter-offer').classList.add('hidden');
    
    // Show negotiation screen
    document.getElementById('trading-screen').classList.add('hidden');
    document.getElementById('negotiation-screen').classList.remove('hidden');
}

// Handle negotiation actions
function handleNegotiation(action) {
    switch(action) {
        case 'accept':
            completeTrade(false);
            break;
        case 'counter':
            showCounterOffer();
            break;
        case 'rob':
            startRobbery();
            break;
        case 'decline':
            showTradingTab('street');
            break;
    }
}

// Show counter offer UI
function showCounterOffer() {
    const counterEl = document.getElementById('counter-offer');
    counterEl.classList.remove('hidden');
    
    // Show their original items
    const theirCounterEl = document.getElementById('counter-their');
    theirCounterEl.innerHTML = tradingState.counterOffer.theirItems.map(item => 
        `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
    ).join('');
    
    // Show your counter items (starts with original offer)
    const yourCounterEl = document.getElementById('counter-yours');
    yourCounterEl.innerHTML = tradingState.counterOffer.yourItems.map(item => 
        `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
    ).join('');
    
    // Update counter item dropdown
    updateCounterItems();
}

// Update counter item dropdown based on selected type
function updateCounterItems() {
    const type = document.getElementById('counter-item-type').value;
    const itemSelect = document.getElementById('counter-item');
    
    itemSelect.innerHTML = '';
    
    if (type === 'drug') {
        const drugs = Object.keys(gameState.inventory);
        if (drugs.length === 0) {
            itemSelect.innerHTML = '<option value="">No drugs available</option>';
            return;
        }
        
        drugs.forEach(drug => {
            const option = document.createElement('option');
            option.value = drug;
            option.textContent = `${drug} (${gameState.inventory[drug]}g)`;
            itemSelect.appendChild(option);
        });
    } else if (type === 'weapon') {
        const weapons = Object.keys(gameState.weapons);
        if (weapons.length === 0) {
            itemSelect.innerHTML = '<option value="">No weapons available</option>';
            return;
        }
        
        weapons.forEach(weapon => {
            const option = document.createElement('option');
            option.value = weapon;
            option.textContent = `${weapon} (${gameState.weapons[weapon]}x)`;
            itemSelect.appendChild(option);
        });
    } else if (type === 'money') {
        itemSelect.innerHTML = '<option value="cash">Cash</option>';
    }
}

// Add item to counter offer
function addCounterItem() {
    const type = document.getElementById('counter-item-type').value;
    const item = document.getElementById('counter-item').value;
    const amount = parseInt(document.getElementById('counter-amount').value);
    
    if (!item || item === "No drugs available" || item === "No weapons available") {
        alert("No item selected or you don't have any of that type!");
        return;
    }
    
    if (isNaN(amount) {
        alert("Please enter a valid amount");
        return;
    }
    
    // Check if player has enough
    if (type === 'drug') {
        if (!gameState.inventory[item] || gameState.inventory[item] < amount) {
            alert(`You don't have enough ${item}!`);
            return;
        }
    } else if (type === 'weapon') {
        if (!gameState.weapons[item] || gameState.weapons[item] < amount) {
            alert(`You don't have enough ${item}s!`);
            return;
        }
    } else if (type === 'money') {
        if (gameState.money < amount) {
            alert("You don't have enough money!");
            return;
        }
    }
    
    // Add to counter offer
    tradingState.counterOffer.yourItems.push({ type, item, amount });
    
    // Update display
    const yourCounterEl = document.getElementById('counter-yours');
    yourCounterEl.innerHTML = tradingState.counterOffer.yourItems.map(item => 
        `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
    ).join('');
}

// Submit counter offer
function submitCounterOffer() {
    // Calculate chance of acceptance based on trader trust and offer fairness
    const trustFactor = tradingState.currentTrader.trust / 100;
    const originalValue = calculateOfferValue(tradingState.currentOffer.yourItems);
    const counterValue = calculateOfferValue(tradingState.counterOffer.yourItems);
    
    const valueRatio = counterValue / originalValue;
    const acceptanceChance = trustFactor * (1 - Math.abs(1 - valueRatio));
    
    if (Math.random() < acceptanceChance) {
        // Trader accepts counter offer
        tradingState.currentOffer = {
            theirItems: tradingState.counterOffer.theirItems,
            yourItems: tradingState.counterOffer.yourItems
        };
        
        // Update displayed offer
        const theirOfferEl = document.getElementById('their-offer');
        theirOfferEl.innerHTML = tradingState.currentOffer.theirItems.map(item => 
            `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
        ).join('');
        
        const yourOfferEl = document.getElementById('your-offer');
        yourOfferEl.innerHTML = tradingState.currentOffer.yourItems.map(item => 
            `<div class="offer-item">${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
        ).join('');
        
        alert(`${tradingState.currentTrader.name} accepts your counter offer!`);
    } else {
        // Trader rejects counter offer
        const responses = [
            "No way, that's not enough!",
            "You must be joking with that offer.",
            "I can't accept that, it's not fair.",
            "Do you think I'm stupid? That's a bad deal.",
            "I'll pass on that offer."
        ];
        
        alert(`${tradingState.currentTrader.name}: "${responses[Math.floor(Math.random() * responses.length)]}"`);
    }
    
    // Hide counter offer
    document.getElementById('counter-offer').classList.add('hidden');
}

// Calculate the value of an offer
function calculateOfferValue(items) {
    let value = 0;
    
    for (const item of items) {
        if (item.type === 'drug') {
            const drugValue = recipes[item.item]?.value || 0;
            value += drugValue * item.amount;
        } else if (item.type === 'weapon') {
            const weaponValue = weapons[item.item]?.price || 0;
            value += weaponValue * item.amount;
        } else if (item.type === 'money') {
            value += item.amount;
        }
    }
    
    return value;
}

// Start robbery attempt
function startRobbery() {
    tradingState.currentRobbery = {
        trader: tradingState.currentTrader,
        successChance: 0.5, // Base chance
        damageRisk: 0.3 // Base risk
    };
    
    document.getElementById('robbery-description').textContent = 
        `You're attempting to rob ${tradingState.currentTrader.name}. Choose your approach:`;
    
    document.getElementById('negotiation-screen').classList.add('hidden');
    document.getElementById('robbery-screen').classList.remove('hidden');
    document.getElementById('robbery-step1').classList.remove('hidden');
    document.getElementById('robbery-step2').classList.add('hidden');
}

// Attempt robbery with chosen method
function attemptRobbery(action) {
    const robbery = tradingState.currentRobbery;
    let successChance = robbery.successChance;
    let damageRisk = robbery.damageRisk;
    let outcomeText = "";
    
    // Modify chances based on action
    switch(action) {
        case 'stealth':
            successChance *= 0.8; // Harder to succeed
            damageRisk *= 0.5; // Less chance of damage
            outcomeText = "You try to pickpocket the trader...\n";
            break;
        case 'threaten':
            // Check if player has weapons
            const hasWeapons = Object.keys(gameState.weapons).length > 0;
            if (hasWeapons) {
                successChance *= 1.2; // Better chance with weapon
                damageRisk *= 1.2; // More chance of fight
                outcomeText = "You pull out a weapon and threaten the trader...\n";
                
                // Use up a weapon
                for (const weapon in gameState.weapons) {
                    gameState.weapons[weapon]--;
                    if (gameState.weapons[weapon] <= 0) {
                        delete gameState.weapons[weapon];
                    }
                    break;
                }
            } else {
                successChance *= 0.5; // Much harder without weapon
                damageRisk *= 1.5; // More chance of damage
                outcomeText = "You try to threaten the trader without a weapon...\n";
            }
            break;
        case 'ambush':
            successChance *= 1.5; // Best chance of success
            damageRisk *= 2.0; // Highest chance of damage
            outcomeText = "You launch a full ambush on the trader...\n";
            break;
    }
    
    // Modify based on trader type
    if (robbery.trader.type === TRADER_TYPES.MARKET) {
        successChance *= 0.8; // Market traders are more alert
        damageRisk *= 1.5;
    } else if (robbery.trader.isUndercover) {
        successChance *= 0.3; // Very hard to rob undercover cops
        damageRisk *= 3.0;
    }
    
    // Determine outcome
    const success = Math.random() < successChance;
    const damaged = Math.random() < damageRisk;
    
    if (success) {
        // Successful robbery
        outcomeText += "SUCCESS! You managed to rob the trader.\n";
        
        // Get all their items plus some extra
        const stolenValue = calculateOfferValue(robbery.trader.offer.theirItems) * 1.5;
        gameState.money += Math.floor(stolenValue);
        outcomeText += `You got $${Math.floor(stolenValue)}!`;
        
        // Increase reputation but also police heat
        gameState.reputation += 10;
        gameState.policeHeat += 20;
    } else {
        // Failed robbery
        outcomeText += "FAILED! The robbery didn't go as planned.\n";
        
        if (damaged) {
            const damageAmount = 10 + Math.floor(Math.random() * 40);
            gameState.health = Math.max(0, gameState.health - damageAmount);
            outcomeText += `You got hurt in the attempt (${damageAmount}% damage).\n`;
            
            if (gameState.health <= 0) {
                gameState.dead = true;
                outcomeText += "You were killed in the robbery attempt!";
            }
        }
        
        if (robbery.trader.isUndercover) {
            // Undercover cop arrests you
            gameState.inJail = true;
            gameState.jailDays = 30;
            outcomeText += "The trader was an undercover cop! You're going to jail for 30 days.";
        } else {
            // Regular trader might retaliate
            if (Math.random() < 0.5) {
                const stolenAmount = Math.floor(gameState.money * 0.2);
                gameState.money -= stolenAmount;
                outcomeText += `The trader retaliated and stole $${stolenAmount} from you!`;
            } else {
                outcomeText += "The trader managed to escape with their goods.";
            }
            
            // Decrease reputation
            gameState.reputation -= 5;
        }
    }
    
    // Show outcome
    document.getElementById('robbery-outcome').textContent = outcomeText;
    document.getElementById('robbery-step1').classList.add('hidden');
    document.getElementById('robbery-step2').classList.remove('hidden');
    
    updateTradingUI();
    saveGameState();
}

// Complete the trade
function completeTrade(isCounterOffer) {
    const trader = tradingState.currentTrader;
    const offer = tradingState.currentOffer;
    
    // Check if player has all required items
    for (const item of offer.yourItems) {
        if (item.type === 'drug') {
            if (!gameState.inventory[item.item] || gameState.inventory[item.item] < item.amount) {
                alert(`You don't have enough ${item.item} to complete this trade!`);
                return;
            }
        } else if (item.type === 'weapon') {
            if (!gameState.weapons[item.item] || gameState.weapons[item.item] < item.amount) {
                alert(`You don't have enough ${item.item}s to complete this trade!`);
                return;
            }
        } else if (item.type === 'money') {
            if (gameState.money < item.amount) {
                alert("You don't have enough money to complete this trade!");
                return;
            }
        }
    }
    
    // Undercover cop check (10% chance even if not marked as undercover)
    const isActuallyUndercover = trader.isUndercover || 
                               (trader.type.undercoverChance && Math.random() < trader.type.undercoverChance);
    
    if (isActuallyUndercover) {
        // Undercover cop busts you
        gameState.inJail = true;
        gameState.jailDays = trader.type === TRADER_TYPES.MARKET ? 50 : 30;
        
        showTradeOutcome(
            `TRAP! ${trader.name} was an undercover cop!\n` +
            `You've been arrested and sentenced to ${gameState.jailDays} days in jail.`,
            [], // No items gained
            offer.yourItems // Items lost
        );
        
        // Reset police heat (you're in jail)
        gameState.policeHeat = 0;
        
        updateTradingUI();
        saveGameState();
        return;
    }
    
    // Shady dealer scam check
    if (trader.type === TRADER_TYPES.SHADY && Math.random() < trader.type.scamChance) {
        // Scam - you get nothing or less than promised
        const scamType = Math.random();
        
        if (scamType < 0.7) {
            // Partial scam - get some items
            const actualItems = offer.theirItems.map(item => {
                return {
                    ...item,
                    amount: Math.max(1, Math.floor(item.amount * (0.2 + Math.random() * 0.5)))
                };
            });
            
            showTradeOutcome(
                `SCAM! ${trader.name} gave you less than promised.\n` +
                "You got some of what you were supposed to get.",
                actualItems,
                offer.yourItems
            );
            
            // Process the partial trade
            processTrade(actualItems, offer.yourItems);
        } else {
            // Complete scam - get nothing
            showTradeOutcome(
                `SCAM! ${trader.name} took your items and ran.\n` +
                "You got nothing in return!",
                [], // No items gained
                offer.yourItems // Items lost
            );
            
            // Process the loss
            processTrade([], offer.yourItems);
        }
        
        // Decrease reputation
        gameState.reputation -= 5;
        
        updateTradingUI();
        saveGameState();
        return;
    }
    
    // Regular trade
    processTrade(offer.theirItems, offer.yourItems);
    
    // Show outcome
    showTradeOutcome(
        `Trade with ${trader.name} completed successfully!`,
        offer.theirItems,
        offer.yourItems
    );
    
    // Increase reputation
    gameState.reputation += 5;
    
    // Increase police heat based on trade value
    const tradeValue = calculateOfferValue(offer.theirItems);
    gameState.policeHeat = Math.min(100, gameState.policeHeat + tradeValue / 50);
    
    updateTradingUI();
    saveGameState();
}

// Process the actual trade (add/remove items)
function processTrade(gainedItems, lostItems) {
    // Add gained items
    for (const item of gainedItems) {
        if (item.type === 'drug') {
            if (!gameState.inventory[item.item]) {
                gameState.inventory[item.item] = 0;
            }
            gameState.inventory[item.item] += item.amount;
        } else if (item.type === 'weapon') {
            if (!gameState.weapons[item.item]) {
                gameState.weapons[item.item] = 0;
            }
            gameState.weapons[item.item] += item.amount;
        } else if (item.type === 'money') {
            gameState.money += item.amount;
        }
    }
    
    // Remove lost items
    for (const item of lostItems) {
        if (item.type === 'drug') {
            gameState.inventory[item.item] -= item.amount;
            if (gameState.inventory[item.item] <= 0) {
                delete gameState.inventory[item.item];
            }
        } else if (item.type === 'weapon') {
            gameState.weapons[item.item] -= item.amount;
            if (gameState.weapons[item.item] <= 0) {
                delete gameState.weapons[item.item];
            }
        } else if (item.type === 'money') {
            gameState.money -= item.amount;
        }
    }
}

// Show trade outcome screen
function showTradeOutcome(message, gainedItems, lostItems) {
    document.getElementById('outcome-text').textContent = message;
    
    // Show gained items
    const gainedEl = document.getElementById('gained-items');
    gainedEl.innerHTML = gainedItems.length > 0 ? 
        gainedItems.map(item => 
            `<div class="outcome-item gained-item">+${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
        ).join('') :
        '<div class="outcome-item">Nothing gained</div>';
    
    // Show lost items
    const lostEl = document.getElementById('lost-items');
    lostEl.innerHTML = lostItems.length > 0 ? 
        lostItems.map(item => 
            `<div class="outcome-item lost-item">-${item.amount} ${item.type === 'money' ? '$' : ''}${item.item}</div>`
        ).join('') :
        '<div class="outcome-item">Nothing lost</div>';
    
    // Show outcome screen
    document.getElementById('negotiation-screen').classList.add('hidden');
    document.getElementById('outcome-screen').classList.remove('hidden');
}

// Render inventory
function renderInventory() {
    // Drugs
    const drugInventory = document.getElementById('drug-inventory');
    drugInventory.innerHTML = '';
    
    for (const drug in gameState.inventory) {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.textContent = `${drug}: ${gameState.inventory[drug]}g`;
        drugInventory.appendChild(item);
    }
    
    if (Object.keys(gameState.inventory).length === 0) {
        drugInventory.innerHTML = '<div class="inventory-item">No drugs</div>';
    }
    
    // Weapons
    const weaponInventory = document.getElementById('weapon-inventory');
    weaponInventory.innerHTML = '';
    
    for (const weapon in gameState.weapons) {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.textContent = `${weapon}: ${gameState.weapons[weapon]}x`;
        weaponInventory.appendChild(item);
    }
    
    if (Object.keys(gameState.weapons).length === 0) {
        weaponInventory.innerHTML = '<div class="inventory-item">No weapons</div>';
    }
    
    // Ingredients
    const ingredientInventory = document.getElementById('ingredient-inventory');
    ingredientInventory.innerHTML = '';
    
    for (const ingredient in gameState.ingredients) {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.textContent = `${ingredient}: ${gameState.ingredients[ingredient]}`;
        ingredientInventory.appendChild(item);
    }
    
    if (Object.keys(gameState.ingredients).length === 0) {
        ingredientInventory.innerHTML = '<div class="inventory-item">No ingredients</div>';
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('streetAlchemistGameState', JSON.stringify(gameState));
}

// Initialize the game when loaded
document.addEventListener('DOMContentLoaded', initTradingGame);

// Recipes and weapons data from main game
const recipes = {
    weed: { ingredients: { herb: 5 }, value: 20, difficulty: 1 },
    meth: { ingredients: { chemical: 2, powder: 1 }, value: 50, difficulty: 2 },
    coke: { ingredients: { powder: 3, liquid: 50 }, value: 80, difficulty: 3 },
    heroin: { ingredients: { herb: 2, liquid: 100, chemical: 1 }, value: 100, difficulty: 4 }
};

const weapons = {
    pistol: { price: 500, damage: 50 },
    shotgun: { price: 1200, damage: 80 },
    rifle: { price: 2500, damage: 120 },
    switch: { price: 5000, damage: 200 }
};