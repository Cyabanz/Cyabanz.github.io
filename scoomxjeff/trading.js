// Game State
const gameState = {
    player: {
        inventory: [],
        capacity: 10,
        money: 1000,
        health: 100,
        daysFree: 0,
        jailTime: 0,
        wantedLevel: 0
    },
    currentTrader: null,
    tradeItems: [],
    selectedPlayerItems: [],
    selectedTraderItems: [],
    isTrading: false,
    blackMarket: false
};

// Item Database
const items = {
    drugs: [
        { id: 'weed', name: 'Weed', value: 50, type: 'drug', danger: 5 },
        { id: 'cocaine', name: 'Cocaine', value: 150, type: 'drug', danger: 15 },
        { id: 'heroin', name: 'Heroin', value: 200, type: 'drug', danger: 25 },
        { id: 'meth', name: 'Meth', value: 120, type: 'drug', danger: 20 },
        { id: 'lsd', name: 'LSD', value: 80, type: 'drug', danger: 10 }
    ],
    weapons: [
        { id: 'knife', name: 'Knife', value: 30, type: 'weapon', damage: 15 },
        { id: 'pistol', name: 'Pistol', value: 200, type: 'weapon', damage: 30 },
        { id: 'shotgun', name: 'Shotgun', value: 350, type: 'weapon', damage: 50 },
        { id: 'ak47', name: 'AK-47', value: 800, type: 'weapon', damage: 70 },
        { id: 'sniper', name: 'Sniper Rifle', value: 1200, type: 'weapon', damage: 90 }
    ],
    money: [
        { id: 'cash', name: 'Cash', value: 1, type: 'money' }
    ],
    other: [
        { id: 'fake_id', name: 'Fake ID', value: 300, type: 'other' },
        { id: 'police_badge', name: 'Police Badge', value: 500, type: 'other' },
        { id: 'body_armor', name: 'Body Armor', value: 400, type: 'other', protection: 30 }
    ]
};

// Trader Types
const traderTypes = {
    shadyDealer: {
        name: 'Shady Dealer',
        trustRange: [30, 60],
        inventory: ['drugs', 'weapons'],
        danger: 20,
        undercoverChance: 0
    },
    streetVendor: {
        name: 'Street Vendor',
        trustRange: [40, 70],
        inventory: ['drugs', 'other'],
        danger: 10,
        undercoverChance: 5
    },
    blackMarket: {
        name: 'Black Market Dealer',
        trustRange: [20, 50],
        inventory: ['drugs', 'weapons', 'other'],
        danger: 40,
        undercoverChance: 15
    },
    undercover: {
        name: 'Mysterious Buyer',
        trustRange: [60, 80],
        inventory: ['money'],
        danger: 80,
        undercoverChance: 100
    },
    random: {
        name: 'Stranger',
        trustRange: [10, 90],
        inventory: ['drugs', 'weapons', 'money', 'other'],
        danger: 30,
        undercoverChance: 10
    }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Load saved game state if available
    loadGameState();
    
    // Set up event listeners
    document.getElementById('find-trader').addEventListener('click', findTrader);
    document.getElementById('visit-market').addEventListener('click', visitBlackMarket);
    document.getElementById('rob-trader').addEventListener('click', attemptRobbery);
    document.getElementById('negotiate').addEventListener('click', negotiateTrade);
    document.getElementById('accept-trade').addEventListener('click', acceptTrade);
    document.getElementById('decline-trade').addEventListener('click', declineTrade);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('shoot-option').addEventListener('click', () => resolveConflict('shoot'));
    document.getElementById('chase-option').addEventListener('click', () => resolveConflict('chase'));
    document.getElementById('let-go-option').addEventListener('click', () => resolveConflict('let go'));
    
    // Initialize player inventory with some items
    if (gameState.player.inventory.length === 0) {
        addToInventory(createItem('weed', 3));
        addToInventory(createItem('knife', 1));
        addToInventory(createItem('cash', 500));
    }
    
    // Update UI
    updateUI();
});

// Find a trader
function findTrader() {
    // Random chance of no traders available
    if (Math.random() < 0.2) {
        addLogEntry("No traders available right now. Try again later.");
        return;
    }
    
    gameState.blackMarket = false;
    
    // Determine trader type
    const traderOptions = ['shadyDealer', 'streetVendor', 'random'];
    const traderType = traderOptions[Math.floor(Math.random() * traderOptions.length)];
    
    // Small chance of undercover cop
    const undercoverRoll = Math.random() * 100;
    if (undercoverRoll < traderTypes[traderType].undercoverChance) {
        gameState.currentTrader = createTrader('undercover');
    } else {
        gameState.currentTrader = createTrader(traderType);
    }
    
    setupTrade();
    addLogEntry(`Found a trader: ${gameState.currentTrader.name}`);
}

// Visit black market
function visitBlackMarket() {
    gameState.blackMarket = true;
    
    // Chance of getting caught trying to enter black market
    if (Math.random() < 0.1) {
        gameState.player.jailTime += 50;
        showModal("Busted!", "You were caught trying to enter the black market! You're sentenced to 50 days in jail.");
        gameState.currentTrader = null;
        updateUI();
        saveGameState();
        return;
    }
    
    gameState.currentTrader = createTrader('blackMarket');
    setupTrade();
    addLogEntry("Entered the black market. High risk, high reward...");
}

// Create a trader
function createTrader(type) {
    const trader = JSON.parse(JSON.stringify(traderTypes[type]));
    trader.trust = Math.floor(Math.random() * (trader.trustRange[1] - trader.trustRange[0] + 1)) + trader.trustRange[0];
    trader.inventoryItems = generateTraderInventory(trader);
    return trader;
}

// Generate trader inventory
function generateTraderInventory(trader) {
    const inventory = [];
    const itemCount = Math.floor(Math.random() * 5) + 3; // 3-7 items
    
    for (let i = 0; i < itemCount; i++) {
        const category = trader.inventory[Math.floor(Math.random() * trader.inventory.length)];
        const categoryItems = items[category];
        const item = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        
        // Check if item already exists in inventory
        const existingItem = inventory.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += Math.floor(Math.random() * 3) + 1;
        } else {
            const newItem = JSON.parse(JSON.stringify(item));
            newItem.quantity = Math.floor(Math.random() * 3) + 1;
            inventory.push(newItem);
        }
    }
    
    // Add money to inventory
    const moneyItem = JSON.parse(JSON.stringify(items.money[0]));
    moneyItem.quantity = Math.floor(Math.random() * 500) + 100;
    inventory.push(moneyItem);
    
    return inventory;
}

// Set up trade interface
function setupTrade() {
    gameState.isTrading = true;
    gameState.selectedPlayerItems = [];
    gameState.selectedTraderItems = [];
    
    updateTraderInfo();
    renderPlayerInventory();
    renderTraderInventory();
    updateTradeButtons();
}

// Update trader info display
function updateTraderInfo() {
    if (!gameState.currentTrader) {
        document.getElementById('trader-name').textContent = 'No Active Trader';
        document.getElementById('trader-type').textContent = '';
        document.querySelector('.trust-fill').style.width = '0%';
        document.getElementById('trader-trust').textContent = 'Trust: 0%';
        return;
    }
    
    document.getElementById('trader-name').textContent = gameState.currentTrader.name;
    document.getElementById('trader-type').textContent = gameState.blackMarket ? 'Black Market Dealer' : 'Local Trader';
    document.querySelector('.trust-fill').style.width = `${gameState.currentTrader.trust}%`;
    document.getElementById('trader-trust').textContent = `Trust: ${gameState.currentTrader.trust}%`;
}

// Render player inventory
function renderPlayerInventory() {
    const inventoryEl = document.getElementById('player-inventory');
    inventoryEl.innerHTML = '';
    
    gameState.player.inventory.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        if (gameState.selectedPlayerItems.some(i => i.id === item.id)) {
            itemEl.classList.add('selected');
        }
        itemEl.innerHTML = `
            <div>${item.name}</div>
            <div class="item-value">$${item.value * item.quantity}</div>
            <div class="item-quantity">x${item.quantity}</div>
        `;
        itemEl.addEventListener('click', () => togglePlayerItem(item));
        inventoryEl.appendChild(itemEl);
    });
    
    document.getElementById('inventory-capacity').textContent = 
        `${gameState.player.inventory.reduce((sum, item) => sum + item.quantity, 0)}/${gameState.player.capacity}`;
}

// Render trader inventory
function renderTraderInventory() {
    const inventoryEl = document.getElementById('trader-inventory');
    inventoryEl.innerHTML = '';
    
    if (!gameState.currentTrader) return;
    
    gameState.currentTrader.inventoryItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        if (gameState.selectedTraderItems.some(i => i.id === item.id)) {
            itemEl.classList.add('selected');
        }
        itemEl.innerHTML = `
            <div>${item.name}</div>
            <div class="item-value">$${item.value * item.quantity}</div>
            <div class="item-quantity">x${item.quantity}</div>
        `;
        itemEl.addEventListener('click', () => toggleTraderItem(item));
        inventoryEl.appendChild(itemEl);
    });
    
    updateTradeValues();
}

// Toggle player item selection
function togglePlayerItem(item) {
    const index = gameState.selectedPlayerItems.findIndex(i => i.id === item.id);
    if (index === -1) {
        gameState.selectedPlayerItems.push(JSON.parse(JSON.stringify(item)));
    } else {
        gameState.selectedPlayerItems.splice(index, 1);
    }
    renderPlayerInventory();
    updateTradeValues();
}

// Toggle trader item selection
function toggleTraderItem(item) {
    const index = gameState.selectedTraderItems.findIndex(i => i.id === item.id);
    if (index === -1) {
        gameState.selectedTraderItems.push(JSON.parse(JSON.stringify(item)));
    } else {
        gameState.selectedTraderItems.splice(index, 1);
    }
    renderTraderInventory();
    updateTradeValues();
}

// Update trade value displays
function updateTradeValues() {
    const playerValue = gameState.selectedPlayerItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    const traderValue = gameState.selectedTraderItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    
    document.getElementById('player-value').textContent = playerValue;
    document.getElementById('offer-value').textContent = traderValue;
    
    updateTradeButtons();
}

// Update trade buttons based on current state
function updateTradeButtons() {
    const acceptBtn = document.getElementById('accept-trade');
    const robBtn = document.getElementById('rob-trader');
    const negotiateBtn = document.getElementById('negotiate');
    
    acceptBtn.disabled = !gameState.isTrading || 
        (gameState.selectedPlayerItems.length === 0 && gameState.selectedTraderItems.length === 0);
    
    robBtn.disabled = !gameState.isTrading || !gameState.currentTrader;
    negotiateBtn.disabled = !gameState.isTrading || !gameState.currentTrader;
}

// Accept trade
function acceptTrade() {
    if (!gameState.currentTrader) return;
    
    const playerValue = gameState.selectedPlayerItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    const traderValue = gameState.selectedTraderItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    
    // Check if trader is undercover cop
    if (gameState.currentTrader.name === 'Mysterious Buyer') {
        gameState.player.jailTime += 30;
        showModal("Busted!", "The trader was an undercover cop! You've been arrested and sentenced to 30 days in jail.");
        endTrade();
        saveGameState();
        return;
    }
    
    // Calculate value difference for trust adjustment
    const valueDiff = Math.abs(playerValue - traderValue);
    const maxValue = Math.max(playerValue, traderValue);
    const unfairness = maxValue > 0 ? valueDiff / maxValue : 0;
    
    // Adjust trader trust based on fairness
    if (unfairness > 0.3) {
        if (playerValue > traderValue) {
            // Player is getting a better deal
            gameState.currentTrader.trust -= Math.floor(unfairness * 20);
            addLogEntry(`Trader feels cheated. Trust decreased.`);
        } else {
            // Trader is getting a better deal
            gameState.currentTrader.trust += Math.floor(unfairness * 10);
            addLogEntry(`Trader is pleased with the deal. Trust increased.`);
        }
        
        gameState.currentTrader.trust = Math.max(0, Math.min(100, gameState.currentTrader.trust));
    }
    
    // Chance of trade going bad based on trader danger and trust
    const dangerChance = gameState.currentTrader.danger * (1 - gameState.currentTrader.trust / 100);
    if (Math.random() * 100 < dangerChance) {
        tradeGoneWrong();
        return;
    }
    
    // Process the trade
    // Remove player items
    gameState.selectedPlayerItems.forEach(item => {
        removeFromInventory(item.id, item.quantity);
    });
    
    // Add trader items to player inventory
    gameState.selectedTraderItems.forEach(item => {
        addToInventory(item);
    });
    
    // Remove trader items from trader inventory
    gameState.selectedTraderItems.forEach(item => {
        const traderItem = gameState.currentTrader.inventoryItems.find(i => i.id === item.id);
        if (traderItem) {
            traderItem.quantity -= item.quantity;
            if (traderItem.quantity <= 0) {
                const index = gameState.currentTrader.inventoryItems.findIndex(i => i.id === item.id);
                gameState.currentTrader.inventoryItems.splice(index, 1);
            }
        }
    });
    
    // Add player items to trader inventory
    gameState.selectedPlayerItems.forEach(item => {
        const existingItem = gameState.currentTrader.inventoryItems.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            gameState.currentTrader.inventoryItems.push(JSON.parse(JSON.stringify(item)));
        }
    });
    
    addLogEntry(`Trade completed successfully.`);
    
    // Check if trader wants to continue
    if (Math.random() < 0.7) {
        // Continue trading
        gameState.selectedPlayerItems = [];
        gameState.selectedTraderItems = [];
        renderPlayerInventory();
        renderTraderInventory();
        updateTradeValues();
        updateTraderInfo();
    } else {
        addLogEntry(`Trader is done trading for now.`);
        endTrade();
    }
    
    saveGameState();
}

// Trade gone wrong scenario
function tradeGoneWrong() {
    const scenarios = [
        {
            title: "Ambush!",
            message: "The trader signals their accomplices who ambush you during the trade!",
            damage: 20 + Math.floor(Math.random() * 30),
            moneyLoss: 0.3
        },
        {
            title: "Scam!",
            message: "You realize too late that the items you received are counterfeit!",
            damage: 0,
            moneyLoss: 0,
            loseItems: true
        },
        {
            title: "Setup!",
            message: "The deal was a setup! You barely escape with your life.",
            damage: 40 + Math.floor(Math.random() * 40),
            moneyLoss: 0.5
        }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Apply damage
    if (scenario.damage > 0) {
        gameState.player.health -= scenario.damage;
        if (gameState.player.health <= 0) {
            gameState.player.health = 1; // Don't let player die, just barely survive
        }
        scenario.message += ` You take ${scenario.damage} damage.`;
    }
    
    // Lose money
    if (scenario.moneyLoss > 0) {
        const moneyLost = Math.floor(gameState.player.money * scenario.moneyLoss);
        gameState.player.money -= moneyLost;
        scenario.message += ` You lost $${moneyLost}.`;
    }
    
    // Lose items
    if (scenario.loseItems) {
        const itemsLost = Math.min(2, gameState.player.inventory.length);
        for (let i = 0; i < itemsLost; i++) {
            const randomIndex = Math.floor(Math.random() * gameState.player.inventory.length);
            const lostItem = gameState.player.inventory[randomIndex];
            gameState.player.inventory.splice(randomIndex, 1);
            scenario.message += ` You lost your ${lostItem.name}.`;
        }
    }
    
    showModal(scenario.title, scenario.message);
    addLogEntry(`Trade went wrong: ${scenario.message}`);
    
    endTrade();
    saveGameState();
}

// Decline trade
function declineTrade() {
    if (gameState.currentTrader) {
        // Chance trader gets offended
        if (Math.random() < 0.3) {
            gameState.currentTrader.trust -= 10;
            addLogEntry(`Trader is offended by your rejection. Trust decreased.`);
            updateTraderInfo();
            
            // Small chance trader becomes hostile
            if (Math.random() < 0.1) {
                tradeGoneWrong();
                return;
            }
        }
    }
    
    endTrade();
}

// End current trade
function endTrade() {
    gameState.isTrading = false;
    gameState.currentTrader = null;
    gameState.selectedPlayerItems = [];
    gameState.selectedTraderItems = [];
    
    updateUI();
}

// Attempt to rob the trader
function attemptRobbery() {
    if (!gameState.currentTrader) return;
    
    // Higher chance of success in black market but also higher consequences
    const successChance = gameState.blackMarket ? 0.4 : 0.6;
    
    if (Math.random() < successChance) {
        // Robbery successful
        const stolenValue = Math.floor(
            gameState.currentTrader.inventoryItems.reduce((sum, item) => sum + (item.value * item.quantity), 0) * 0.7
        );
        
        // Take random items (about 70% of value)
        let remainingValue = stolenValue;
        const stolenItems = [];
        
        // Shuffle inventory
        const shuffledInventory = [...gameState.currentTrader.inventoryItems].sort(() => 0.5 - Math.random());
        
        for (const item of shuffledInventory) {
            if (remainingValue <= 0) break;
            
            const itemTotalValue = item.value * item.quantity;
            if (itemTotalValue <= remainingValue) {
                // Take all of this item
                stolenItems.push(JSON.parse(JSON.stringify(item)));
                remainingValue -= itemTotalValue;
                
                // Remove from trader
                const index = gameState.currentTrader.inventoryItems.findIndex(i => i.id === item.id);
                gameState.currentTrader.inventoryItems.splice(index, 1);
            } else {
                // Take part of this item
                const quantityToTake = Math.min(item.quantity, Math.floor(remainingValue / item.value));
                if (quantityToTake > 0) {
                    const partialItem = JSON.parse(JSON.stringify(item));
                    partialItem.quantity = quantityToTake;
                    stolenItems.push(partialItem);
                    
                    // Update trader's item
                    item.quantity -= quantityToTake;
                    remainingValue -= quantityToTake * item.value;
                }
            }
        }
        
        // Add stolen items to player inventory
        stolenItems.forEach(item => {
            addToInventory(item);
        });
        
        // Increase wanted level
        gameState.player.wantedLevel += gameState.blackMarket ? 20 : 10;
        
        showModal("Robbery Successful", `You managed to steal items worth $${stolenValue}!`);
        addLogEntry(`You successfully robbed the trader and got away with $${stolenValue} worth of goods.`);
        
        endTrade();
    } else {
        // Robbery failed
        const damage = gameState.blackMarket ? 
            40 + Math.floor(Math.random() * 40) : 
            20 + Math.floor(Math.random() * 30);
        
        gameState.player.health -= damage;
        if (gameState.player.health <= 0) {
            gameState.player.health = 1;
        }
        
        // In black market, chance of jail time
        if (gameState.blackMarket && Math.random() < 0.7) {
            const jailTime = 50 + Math.floor(Math.random() * 30);
            gameState.player.jailTime += jailTime;
            
            showModal("Robbery Failed", `The dealer's guards overpowered you! You take ${damage} damage and are sentenced to ${jailTime} days in jail.`);
            addLogEntry(`Robbery attempt failed! You were beaten and sentenced to ${jailTime} days in jail.`);
        } else {
            showModal("Robbery Failed", `The trader fights back! You take ${damage} damage.`);
            addLogEntry(`Robbery attempt failed! The trader fought back and you took ${damage} damage.`);
        }
        
        endTrade();
    }
    
    saveGameState();
}

// Negotiate trade
function negotiateTrade() {
    if (!gameState.currentTrader) return;
    
    // Base success chance based on trader trust
    let successChance = gameState.currentTrader.trust / 100;
    
    // Adjust based on how unfair the current offer is
    const playerValue = gameState.selectedPlayerItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    const traderValue = gameState.selectedTraderItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    const valueDiff = traderValue - playerValue;
    
    if (valueDiff > 0) {
        // Player is getting a worse deal - higher chance of successful negotiation
        successChance += 0.2;
    } else if (valueDiff < 0) {
        // Player is getting a better deal - lower chance
        successChance -= 0.2;
    }
    
    // Cap between 0.1 and 0.9
    successChance = Math.max(0.1, Math.min(0.9, successChance));
    
    if (Math.random() < successChance) {
        // Negotiation successful
        // Adjust values by 10-30%
        const adjustment = 1 + (0.1 + Math.random() * 0.2) * (valueDiff > 0 ? 1 : -1);
        
        gameState.selectedTraderItems.forEach(item => {
            item.value = Math.round(item.value * adjustment);
        });
        
        addLogEntry(`Negotiation successful! Trader adjusted their prices.`);
        renderTraderInventory();
    } else {
        // Negotiation failed
        gameState.currentTrader.trust -= 5;
        addLogEntry(`Negotiation failed. Trader is less trusting now.`);
        updateTraderInfo();
        
        // Small chance trader ends trade
        if (Math.random() < 0.2) {
            addLogEntry(`Trader is offended and ends the trade.`);
            endTrade();
        }
    }
}

// Resolve conflict (robbery, scam, etc.)
function resolveConflict(choice) {
    const conflictModal = document.getElementById('conflict-modal');
    conflictModal.style.display = 'none';
    
    let message = "";
    let damage = 0;
    let moneyLost = 0;
    let itemsLost = [];
    
    if (choice === 'shoot') {
        // 60% chance to succeed, 40% chance to fail
        if (Math.random() < 0.6) {
            message = "You open fire and scare off the attackers!";
            
            // Gain some of their items
            if (gameState.currentTrader && gameState.currentTrader.inventoryItems.length > 0) {
                const itemsToTake = Math.min(2, gameState.currentTrader.inventoryItems.length);
                for (let i = 0; i < itemsToTake; i++) {
                    const randomIndex = Math.floor(Math.random() * gameState.currentTrader.inventoryItems.length);
                    const stolenItem = JSON.parse(JSON.stringify(gameState.currentTrader.inventoryItems[randomIndex]));
                    stolenItem.quantity = 1;
                    addToInventory(stolenItem);
                    itemsLost.push(stolenItem.name);
                }
                
                if (itemsLost.length > 0) {
                    message += ` You managed to grab ${itemsLost.join(' and ')} in the chaos.`;
                }
            }
        } else {
            damage = 30 + Math.floor(Math.random() * 40);
            gameState.player.health -= damage;
            if (gameState.player.health <= 0) gameState.player.health = 1;
            
            moneyLost = Math.floor(gameState.player.money * 0.4);
            gameState.player.money -= moneyLost;
            
            message = `Your shots missed! The attackers retaliate. You take ${damage} damage and lose $${moneyLost}.`;
        }
        
        // Increase wanted level significantly
        gameState.player.wantedLevel += 30;
    } else if (choice === 'chase') {
        // 50/50 chance
        if (Math.random() < 0.5) {
            message = "You chase down the perpetrator and recover your goods!";
            
            // Get back some lost items
            if (gameState.selectedTraderItems.length > 0) {
                const recoveredItem = gameState.selectedTraderItems[
                    Math.floor(Math.random() * gameState.selectedTraderItems.length)
                ];
                addToInventory(recoveredItem);
                message += ` You recovered your ${recoveredItem.name}.`;
            }
        } else {
            damage = 10 + Math.floor(Math.random() * 20);
            gameState.player.health -= damage;
            if (gameState.player.health <= 0) gameState.player.health = 1;
            
            message = `You gave chase but tripped and fell! You take ${damage} damage and they get away.`;
        }
    } else { // let go
        message = "You let them go. Better to live to trade another day.";
        // No consequences
    }
    
    showModal("Conflict Resolved", message);
    addLogEntry(message);
    
    endTrade();
    saveGameState();
}

// Add item to player inventory
function addToInventory(item) {
    // If item is money, add to money directly
    if (item.id === 'cash') {
        gameState.player.money += item.value * item.quantity;
        return;
    }
    
    // Check inventory capacity
    const currentCapacity = gameState.player.inventory.reduce((sum, i) => sum + i.quantity, 0);
    if (currentCapacity + item.quantity > gameState.player.capacity) {
        addLogEntry(`Not enough inventory space for ${item.name}.`);
        return false;
    }
    
    const existingItem = gameState.player.inventory.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        gameState.player.inventory.push(JSON.parse(JSON.stringify(item)));
    }
    
    return true;
}

// Remove item from player inventory
function removeFromInventory(itemId, quantity) {
    const itemIndex = gameState.player.inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return false;
    
    const item = gameState.player.inventory[itemIndex];
    if (item.quantity > quantity) {
        item.quantity -= quantity;
    } else {
        gameState.player.inventory.splice(itemIndex, 1);
    }
    
    return true;
}

// Create an item
function createItem(itemId, quantity = 1) {
    let item = null;
    
    // Search all categories for the item
    for (const category in items) {
        const foundItem = items[category].find(i => i.id === itemId);
        if (foundItem) {
            item = JSON.parse(JSON.stringify(foundItem));
            item.quantity = quantity;
            break;
        }
    }
    
    return item;
}

// Add log entry
function addLogEntry(text) {
    const logEl = document.querySelector('.log-entries');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = text;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

// Show modal
function showModal(title, message) {
    const modal = document.getElementById('trade-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    modal.style.display = 'flex';
}

// Show conflict modal
function showConflictModal(title, message) {
    const modal = document.getElementById('conflict-modal');
    document.getElementById('conflict-title').textContent = title;
    document.getElementById('conflict-message').textContent = message;
    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('trade-modal').style.display = 'none';
}

// Update UI
function updateUI() {
    document.getElementById('health').textContent = `Health: ${gameState.player.health}%`;
    document.getElementById('money').textContent = `Money: $${gameState.player.money}`;
    document.getElementById('days').textContent = `Days Free: ${gameState.player.daysFree}`;
    document.getElementById('jail-time').textContent = `Jail Time: ${gameState.player.jailTime} days`;
    
    renderPlayerInventory();
    updateTraderInfo();
    updateTradeButtons();
}

// Save game state
function saveGameState() {
    localStorage.setItem('undergroundTraderGame', JSON.stringify(gameState));
}

// Load game state
function loadGameState() {
    const savedGame = localStorage.getItem('undergroundTraderGame');
    if (savedGame) {
        const parsed = JSON.parse(savedGame);
        Object.assign(gameState, parsed);
        updateUI();
    }
}

// Simulate day passing (to be called from your main game loop)
function simulateDay() {
    if (gameState.player.jailTime > 0) {
        gameState.player.jailTime--;
        if (gameState.player.jailTime === 0) {
            addLogEntry("You've been released from jail.");
        }
        return;
    }
    
    gameState.player.daysFree++;
    
    // Heal slightly each day
    if (gameState.player.health < 100) {
        gameState.player.health = Math.min(100, gameState.player.health + 5);
    }
    
    // Reduce wanted level over time
    if (gameState.player.wantedLevel > 0) {
        gameState.player.wantedLevel = Math.max(0, gameState.player.wantedLevel - 2);
    }
    
    updateUI();
    saveGameState();
}