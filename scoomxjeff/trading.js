// Trading System for Street Alchemist Game

// Connect to main game state
let gameState = JSON.parse(localStorage.getItem('mainGameState')) || {
    inventory: {},
    money: 10000,
    health: 100,
    daysFree: 0,
    jailTime: 0
};

// Trading system state
const tradingState = {
    currentTrader: null,
    isUndercoverCop: false,
    blackmarketRisk: 0.3,
    normalMarketRisk: 0.1,
    traders: [],
    blackmarketTraders: []
};

// Item values
const itemValues = {
    weed: 20,
    meth: 50,
    coke: 80,
    heroin: 100,
    pistol: 500,
    shotgun: 1200,
    rifle: 2500,
    switch: 5000
};

// Initialize trading system
function initTradingSystem() {
    updateUI();
    generateTraders();
    setupEventListeners();
    
    // Listen for messages from main window
    window.addEventListener('message', function(event) {
        if (event.data.type === 'updateGameState') {
            gameState = event.data.gameState;
            updateUI();
        }
    });
}

// Update UI with current game state
function updateUI() {
    document.getElementById('trading-money').textContent = `Money: $${gameState.money.toLocaleString()}`;
    document.getElementById('trading-police-heat').textContent = `Police Heat: ${gameState.policeHeat || 0}%`;
    
    // Update inventory lists
    updateInventoryDisplay();
}

// Update inventory display
function updateInventoryDisplay() {
    const drugsList = document.getElementById('trading-drugs-list');
    const weaponsList = document.getElementById('trading-weapons-list');
    
    drugsList.innerHTML = '';
    weaponsList.innerHTML = '';
    
    // Add drugs to inventory
    for (const drug in gameState.inventory) {
        if (gameState.inventory[drug] > 0) {
            const drugItem = document.createElement('div');
            drugItem.className = 'inventory-item';
            drugItem.textContent = `${drug}: ${gameState.inventory[drug]}g ($${itemValues[drug] * gameState.inventory[drug]})`;
            drugItem.dataset.item = drug;
            drugItem.dataset.type = 'drug';
            drugItem.dataset.quantity = gameState.inventory[drug];
            drugsList.appendChild(drugItem);
        }
    }
    
    // Add weapons to inventory
    for (const weapon in gameState.weapons) {
        if (gameState.weapons[weapon] > 0) {
            const weaponItem = document.createElement('div');
            weaponItem.className = 'inventory-item';
            weaponItem.textContent = `${weapon}: ${gameState.weapons[weapon]}x ($${itemValues[weapon] * gameState.weapons[weapon]})`;
            weaponItem.dataset.item = weapon;
            weaponItem.dataset.type = 'weapon';
            weaponItem.dataset.quantity = gameState.weapons[weapon];
            weaponsList.appendChild(weaponItem);
        }
    }
}

// Generate random traders
function generateTraders() {
    const normalTraders = document.getElementById('normal-traders');
    const blackmarketTraders = document.getElementById('blackmarket-traders');
    
    normalTraders.innerHTML = '';
    blackmarketTraders.innerHTML = '';
    
    tradingState.traders = [];
    tradingState.blackmarketTraders = [];
    
    // Possible trader types
    const traderTypes = [
        { name: 'Shady Dealer', risk: 0.15, minItems: 2, maxItems: 4, minValue: 500, maxValue: 2000 },
        { name: 'Street Vendor', risk: 0.1, minItems: 1, maxItems: 2, minValue: 200, maxValue: 800 },
        { name: 'Rich Buyer', risk: 0.05, minItems: 3, maxItems: 5, minValue: 1000, maxValue: 5000 },
        { name: 'Junkie', risk: 0.2, minItems: 1, maxItems: 1, minValue: 50, maxValue: 300 }
    ];
    
    // Generate 3-5 normal traders
    const normalTraderCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < normalTraderCount; i++) {
        const type = traderTypes[Math.floor(Math.random() * traderTypes.length)];
        const trader = createTrader(type, false);
        tradingState.traders.push(trader);
        normalTraders.appendChild(createTraderElement(trader));
    }
    
    // Generate 2-3 black market traders
    const blackmarketTraderCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < blackmarketTraderCount; i++) {
        const type = traderTypes[Math.floor(Math.random() * traderTypes.length)];
        const trader = createTrader(type, true);
        tradingState.blackmarketTraders.push(trader);
        blackmarketTraders.appendChild(createTraderElement(trader));
    }
    
    // 10% chance to have no traders in normal market
    if (Math.random() < 0.1) {
        normalTraders.innerHTML = '<div class="trader">No customers to trade with right now</div>';
    }
}

// Create a trader object
function createTrader(type, isBlackmarket) {
    const drugs = ['weed', 'meth', 'coke', 'heroin'];
    const weapons = ['pistol', 'shotgun', 'rifle', 'switch'];
    
    const trader = {
        name: type.name,
        type: isBlackmarket ? 'Black Market ' + type.name : type.name,
        isBlackmarket,
        isUndercoverCop: Math.random() < (isBlackmarket ? type.risk * 2 : type.risk),
        offer: [],
        demand: []
    };
    
    // Generate items they're offering
    const offerItemCount = type.minItems + Math.floor(Math.random() * (type.maxItems - type.minItems + 1));
    for (let i = 0; i < offerItemCount; i++) {
        if (Math.random() < 0.7) {
            // Offer drugs
            const drug = drugs[Math.floor(Math.random() * drugs.length)];
            const quantity = 1 + Math.floor(Math.random() * 5);
            trader.offer.push({ type: 'drug', item: drug, quantity });
        } else {
            // Offer weapons
            const weapon = weapons[Math.floor(Math.random() * weapons.length)];
            trader.offer.push({ type: 'weapon', item: weapon, quantity: 1 });
        }
    }
    
    // Generate items they want
    const demandItemCount = type.minItems + Math.floor(Math.random() * (type.maxItems - type.minItems + 1));
    for (let i = 0; i < demandItemCount; i++) {
        if (Math.random() < 0.7) {
            // Want drugs
            const drug = drugs[Math.floor(Math.random() * drugs.length)];
            const quantity = 1 + Math.floor(Math.random() * 5);
            trader.demand.push({ type: 'drug', item: drug, quantity });
        } else {
            // Want weapons
            const weapon = weapons[Math.floor(Math.random() * weapons.length)];
            trader.demand.push({ type: 'weapon', item: weapon, quantity: 1 });
        }
    }
    
    // Sometimes add money to offer or demand
    if (Math.random() < 0.5) {
        const moneyAmount = Math.floor(type.minValue + Math.random() * (type.maxValue - type.minValue));
        if (Math.random() < 0.5) {
            trader.offer.push({ type: 'money', amount: moneyAmount });
        } else {
            trader.demand.push({ type: 'money', amount: moneyAmount });
        }
    }
    
    return trader;
}

// Create HTML element for a trader
function createTraderElement(trader) {
    const element = document.createElement('div');
    element.className = 'trader';
    element.dataset.id = tradingState.traders.indexOf(trader);
    
    const name = document.createElement('div');
    name.className = 'trader-name';
    name.textContent = trader.name;
    
    const type = document.createElement('div');
    type.className = 'trader-type';
    type.textContent = `Type: ${trader.type}`;
    
    const offer = document.createElement('div');
    offer.className = 'trader-offer';
    
    // Summarize their offer
    const offerSummary = [];
    for (const item of trader.offer) {
        if (item.type === 'money') {
            offerSummary.push(`$${item.amount}`);
        } else {
            offerSummary.push(`${item.quantity} ${item.item}`);
        }
    }
    
    const demandSummary = [];
    for (const item of trader.demand) {
        if (item.type === 'money') {
            demandSummary.push(`$${item.amount}`);
        } else {
            demandSummary.push(`${item.quantity} ${item.item}`);
        }
    }
    
    offer.textContent = `Offers: ${offerSummary.join(', ')} | Wants: ${demandSummary.join(', ')}`;
    
    element.appendChild(name);
    element.appendChild(type);
    element.appendChild(offer);
    
    return element;
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Refresh traders
    document.getElementById('refresh-traders').addEventListener('click', generateTraders);
    document.getElementById('refresh-blackmarket').addEventListener('click', generateTraders);
    
    // Trader click events
    document.addEventListener('click', (e) => {
        const traderElement = e.target.closest('.trader');
        if (traderElement) {
            const traderId = traderElement.dataset.id;
            const isBlackmarket = document.getElementById('blackmarket-tab').classList.contains('active');
            
            tradingState.currentTrader = isBlackmarket ? 
                tradingState.blackmarketTraders[traderId] : 
                tradingState.traders[traderId];
            
            showTradeModal();
        }
    });
    
    // Trade modal buttons
    document.getElementById('accept-trade').addEventListener('click', acceptTrade);
    document.getElementById('negotiate-trade').addEventListener('click', showNegotiationModal);
    document.getElementById('rob-trader').addEventListener('click', showRobberyModal);
    document.getElementById('reject-trade').addEventListener('click', () => {
        document.getElementById('trade-modal').classList.add('hidden');
    });
    
    // Negotiation modal buttons
    document.getElementById('submit-counter').addEventListener('click', submitCounterOffer);
    document.getElementById('cancel-negotiation').addEventListener('click', () => {
        document.getElementById('negotiation-modal').classList.add('hidden');
    });
    
    // Robbery modal buttons
    document.getElementById('rob-shoot').addEventListener('click', () => attemptRobbery('shoot'));
    document.getElementById('rob-threaten').addEventListener('click', () => attemptRobbery('threaten'));
    document.getElementById('rob-stealth').addEventListener('click', () => attemptRobbery('stealth'));
    document.getElementById('cancel-robbery').addEventListener('click', () => {
        document.getElementById('robbery-modal').classList.add('hidden');
    });
    
    // Outcome modal button
    document.getElementById('close-outcome').addEventListener('click', () => {
        document.getElementById('outcome-modal').classList.add('hidden');
        updateUI();
    });
}

// Show trade modal with trader's offer
function showTradeModal() {
    const modal = document.getElementById('trade-modal');
    const trader = tradingState.currentTrader;
    
    document.getElementById('trade-trader-name').textContent = trader.name;
    document.getElementById('trade-trader-type').textContent = `Type: ${trader.type}`;
    
    // Clear previous items
    const theirOffer = document.getElementById('their-offer');
    const theirDemand = document.getElementById('their-demand');
    
    theirOffer.innerHTML = '';
    theirDemand.innerHTML = '';
    
    // Add their offer items
    for (const item of trader.offer) {
        const itemElement = document.createElement('div');
        itemElement.className = 'trade-item';
        
        if (item.type === 'money') {
            itemElement.textContent = `$${item.amount}`;
        } else {
            itemElement.textContent = `${item.quantity} ${item.item}`;
        }
        
        theirOffer.appendChild(itemElement);
    }
    
    // Add their demand items
    for (const item of trader.demand) {
        const itemElement = document.createElement('div');
        itemElement.className = 'trade-item';
        
        if (item.type === 'money') {
            itemElement.textContent = `$${item.amount}`;
        } else {
            itemElement.textContent = `${item.quantity} ${item.item}`;
        }
        
        theirDemand.appendChild(itemElement);
    }
    
    modal.classList.remove('hidden');
}

// Accept the trade as offered
function acceptTrade() {
    const trader = tradingState.currentTrader;
    const outcomeModal = document.getElementById('outcome-modal');
    
    // Check if player has all demanded items
    if (!checkPlayerHasItems(trader.demand)) {
        showOutcome('Trade Failed', 'You don\'t have all the requested items');
        return;
    }
    
    // Check for undercover cop
    if (trader.isUndercoverCop) {
        const jailDays = trader.isBlackmarket ? 50 : 30;
        showOutcome('BUSTED!', `This was an undercover cop! You've been arrested for ${jailDays} days.`);
        
        // Update game state with jail time
        gameState.jailTime = jailDays;
        saveGameState();
        return;
    }
    
    // Process the trade
    // Remove demanded items from player
    for (const item of trader.demand) {
        if (item.type === 'money') {
            gameState.money -= item.amount;
        } else if (item.type === 'drug') {
            gameState.inventory[item.item] -= item.quantity;
            if (gameState.inventory[item.item] <= 0) {
                delete gameState.inventory[item.item];
            }
        } else if (item.type === 'weapon') {
            gameState.weapons[item.item]--;
            if (gameState.weapons[item.item] <= 0) {
                delete gameState.weapons[item.item];
            }
        }
    }
    
    // Add offered items to player
    for (const item of trader.offer) {
        if (item.type === 'money') {
            gameState.money += item.amount;
        } else if (item.type === 'drug') {
            if (!gameState.inventory[item.item]) {
                gameState.inventory[item.item] = 0;
            }
            gameState.inventory[item.item] += item.quantity;
        } else if (item.type === 'weapon') {
            if (!gameState.weapons[item.item]) {
                gameState.weapons[item.item] = 0;
            }
            gameState.weapons[item.item]++;
        }
    }
    
    // Increase police heat slightly
    if (gameState.policeHeat === undefined) gameState.policeHeat = 0;
    gameState.policeHeat += trader.isBlackmarket ? 10 : 5;
    
    showOutcome('Trade Completed', 'The trade was successful!');
    saveGameState();
}

// Check if player has all required items
function checkPlayerHasItems(items) {
    for (const item of items) {
        if (item.type === 'money') {
            if (gameState.money < item.amount) return false;
        } else if (item.type === 'drug') {
            if (!gameState.inventory[item.item] || gameState.inventory[item.item] < item.quantity) return false;
        } else if (item.type === 'weapon') {
            if (!gameState.weapons[item.item] || gameState.weapons[item.item] < item.quantity) return false;
        }
    }
    return true;
}

// Show negotiation modal
function showNegotiationModal() {
    const modal = document.getElementById('negotiation-modal');
    const trader = tradingState.currentTrader;
    
    // Clear previous items
    document.getElementById('your-counter-offer').innerHTML = '';
    document.getElementById('your-counter-demand').innerHTML = '';
    
    // Add items from their demand to your offer (default negotiation)
    for (const item of trader.demand) {
        const itemElement = document.createElement('div');
        itemElement.className = 'select-item';
        
        if (item.type === 'money') {
            itemElement.textContent = `$${item.amount}`;
        } else {
            itemElement.textContent = `${item.quantity} ${item.item}`;
        }
        
        itemElement.dataset.type = item.type;
        itemElement.dataset.item = item.item;
        itemElement.dataset.quantity = item.quantity;
        itemElement.dataset.amount = item.amount;
        
        document.getElementById('your-counter-offer').appendChild(itemElement);
    }
    
    // Add items from their offer to your demand (default negotiation)
    for (const item of trader.offer) {
        const itemElement = document.createElement('div');
        itemElement.className = 'select-item';
        
        if (item.type === 'money') {
            itemElement.textContent = `$${item.amount}`;
        } else {
            itemElement.textContent = `${item.quantity} ${item.item}`;
        }
        
        itemElement.dataset.type = item.type;
        itemElement.dataset.item = item.item;
        itemElement.dataset.quantity = item.quantity;
        itemElement.dataset.amount = item.amount;
        
        document.getElementById('your-counter-demand').appendChild(itemElement);
    }
    
    // Add click handlers to select items
    document.querySelectorAll('.select-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    modal.classList.remove('hidden');
    document.getElementById('trade-modal').classList.add('hidden');
}

// Submit counter offer
function submitCounterOffer() {
    const trader = tradingState.currentTrader;
    const outcomeModal = document.getElementById('outcome-modal');
    
    // Get selected items from your offer
    const yourOfferItems = Array.from(document.getElementById('your-counter-offer').children)
        .filter(item => item.classList.contains('selected'))
        .map(item => ({
            type: item.dataset.type,
            item: item.dataset.item,
            quantity: parseInt(item.dataset.quantity) || 1,
            amount: parseInt(item.dataset.amount) || 0
        }));
    
    // Get selected items from your demand
    const yourDemandItems = Array.from(document.getElementById('your-counter-demand').children)
        .filter(item => item.classList.contains('selected'))
        .map(item => ({
            type: item.dataset.type,
            item: item.dataset.item,
            quantity: parseInt(item.dataset.quantity) || 1,
            amount: parseInt(item.dataset.amount) || 0
        }));
    
    // Check if player has all offered items
    if (!checkPlayerHasItems(yourOfferItems)) {
        showOutcome('Negotiation Failed', 'You don\'t have all the items you\'re offering');
        return;
    }
    
    // Check for undercover cop
    if (trader.isUndercoverCop) {
        const jailDays = trader.isBlackmarket ? 50 : 30;
        showOutcome('BUSTED!', `This was an undercover cop! You've been arrested for ${jailDays} days.`);
        
        // Update game state with jail time
        gameState.jailTime = jailDays;
        saveGameState();
        return;
    }
    
    // Calculate total value of offers
    const yourOfferValue = calculateItemsValue(yourOfferItems);
    const theirOriginalOfferValue = calculateItemsValue(trader.offer);
    const theirOriginalDemandValue = calculateItemsValue(trader.demand);
    
    // Calculate negotiation success chance
    const negotiationChance = 0.5 + (yourOfferValue / theirOriginalDemandValue) * 0.5;
    
    if (Math.random() < negotiationChance) {
        // Negotiation successful
        // Remove offered items from player
        for (const item of yourOfferItems) {
            if (item.type === 'money') {
                gameState.money -= item.amount;
            } else if (item.type === 'drug') {
                gameState.inventory[item.item] -= item.quantity;
                if (gameState.inventory[item.item] <= 0) {
                    delete gameState.inventory[item.item];
                }
            } else if (item.type === 'weapon') {
                gameState.weapons[item.item]--;
                if (gameState.weapons[item.item] <= 0) {
                    delete gameState.weapons[item.item];
                }
            }
        }
        
        // Add demanded items to player
        for (const item of yourDemandItems) {
            if (item.type === 'money') {
                gameState.money += item.amount;
            } else if (item.type === 'drug') {
                if (!gameState.inventory[item.item]) {
                    gameState.inventory[item.item] = 0;
                }
                gameState.inventory[item.item] += item.quantity;
            } else if (item.type === 'weapon') {
                if (!gameState.weapons[item.item]) {
                    gameState.weapons[item.item] = 0;
                }
                gameState.weapons[item.item]++;
            }
        }
        
        showOutcome('Negotiation Successful', 'The trader accepted your counter offer!');
    } else {
        // Negotiation failed
        showOutcome('Negotiation Failed', 'The trader rejected your counter offer.');
    }
    
    // Increase police heat slightly
    if (gameState.policeHeat === undefined) gameState.policeHeat = 0;
    gameState.policeHeat += trader.isBlackmarket ? 5 : 2;
    
    saveGameState();
    document.getElementById('negotiation-modal').classList.add('hidden');
}

// Calculate total value of items
function calculateItemsValue(items) {
    let total = 0;
    
    for (const item of items) {
        if (item.type === 'money') {
            total += item.amount;
        } else if (item.type === 'drug') {
            total += itemValues[item.item] * item.quantity;
        } else if (item.type === 'weapon') {
            total += itemValues[item.item] * item.quantity;
        }
    }
    
    return total;
}

// Show robbery modal
function showRobberyModal() {
    document.getElementById('robbery-modal').classList.remove('hidden');
    document.getElementById('trade-modal').classList.add('hidden');
    
    const trader = tradingState.currentTrader;
    document.getElementById('robbery-status').textContent = 
        `You're attempting to rob ${trader.name}. Choose your approach carefully...`;
}

// Attempt to rob the trader
function attemptRobbery(method) {
    const trader = tradingState.currentTrader;
    let successChance = 0;
    let damageRisk = 0;
    let outcomeMessage = '';
    let success = false;
    
    switch(method) {
        case 'shoot':
            successChance = 0.7;
            damageRisk = 0.5;
            outcomeMessage = 'You pulled your gun and demanded everything!';
            break;
        case 'threaten':
            successChance = 0.5;
            damageRisk = 0.3;
            outcomeMessage = 'You threatened the trader to hand over their goods!';
            break;
        case 'stealth':
            successChance = 0.3;
            damageRisk = 0.1;
            outcomeMessage = 'You tried to quietly steal from the trader...';
            break;
    }
    
    // Adjust success chance based on weapons
    if (gameState.weapons) {
        if (gameState.weapons.pistol) successChance += 0.1;
        if (gameState.weapons.shotgun) successChance += 0.15;
        if (gameState.weapons.rifle) successChance += 0.2;
        if (gameState.weapons.switch) successChance += 0.25;
    }
    
    // Check for undercover cop
    if (trader.isUndercoverCop) {
        const jailDays = trader.isBlackmarket ? 50 : 30;
        showOutcome('BUSTED!', `This was an undercover cop! You've been arrested for ${jailDays} days.`);
        
        // Update game state with jail time
        gameState.jailTime = jailDays;
        saveGameState();
        return;
    }
    
    // Determine outcome
    if (Math.random() < successChance) {
        // Robbery successful
        success = true;
        outcomeMessage += ' It worked!';
        
        // Steal some of their items
        const stolenItems = [];
        for (const item of trader.offer) {
            if (Math.random() < 0.7) { // 70% chance to steal each item
                if (item.type === 'money') {
                    const stolenAmount = Math.floor(item.amount * (0.5 + Math.random() * 0.5));
                    gameState.money += stolenAmount;
                    stolenItems.push(`$${stolenAmount}`);
                } else if (item.type === 'drug') {
                    const stolenQuantity = Math.floor(item.quantity * (0.5 + Math.random() * 0.5));
                    if (!gameState.inventory[item.item]) {
                        gameState.inventory[item.item] = 0;
                    }
                    gameState.inventory[item.item] += stolenQuantity;
                    stolenItems.push(`${stolenQuantity} ${item.item}`);
                } else if (item.type === 'weapon' && Math.random() < 0.5) {
                    // 50% chance to steal weapons
                    if (!gameState.weapons[item.item]) {
                        gameState.weapons[item.item] = 0;
                    }
                    gameState.weapons[item.item]++;
                    stolenItems.push(`1 ${item.item}`);
                }
            }
        }
        
        if (stolenItems.length > 0) {
            outcomeMessage += ` You stole: ${stolenItems.join(', ')}`;
        } else {
            outcomeMessage += ' But they had nothing valuable on them.';
        }
        
        // Increase police heat significantly
        if (gameState.policeHeat === undefined) gameState.policeHeat = 0;
        gameState.policeHeat += trader.isBlackmarket ? 20 : 30;
    } else {
        // Robbery failed
        outcomeMessage += ' It failed!';
        
        // Take damage
        if (Math.random() < damageRisk) {
            const damage = 10 + Math.floor(Math.random() * 30);
            gameState.health = Math.max(0, gameState.health - damage);
            outcomeMessage += ` You took ${damage}% damage in the struggle.`;
            
            if (gameState.health <= 0) {
                outcomeMessage += ' You were killed!';
                gameState.dead = true;
            }
        }
        
        // Sometimes lose items
        if (Math.random() < 0.3) {
            const lostItems = [];
            
            // Check for drugs to lose
            for (const drug in gameState.inventory) {
                if (Math.random() < 0.5) {
                    const lostQuantity = Math.floor(gameState.inventory[drug] * (0.2 + Math.random() * 0.3));
                    gameState.inventory[drug] -= lostQuantity;
                    if (gameState.inventory[drug] <= 0) {
                        delete gameState.inventory[drug];
                    }
                    lostItems.push(`${lostQuantity} ${drug}`);
                }
            }
            
            // Check for weapons to lose
            for (const weapon in gameState.weapons) {
                if (Math.random() < 0.3) {
                    gameState.weapons[weapon]--;
                    if (gameState.weapons[weapon] <= 0) {
                        delete gameState.weapons[weapon];
                    }
                    lostItems.push(`1 ${weapon}`);
                }
            }
            
            // Check for money to lose
            if (Math.random() < 0.5 && gameState.money > 0) {
                const lostAmount = Math.floor(gameState.money * (0.1 + Math.random() * 0.2));
                gameState.money -= lostAmount;
                lostItems.push(`$${lostAmount}`);
            }
            
            if (lostItems.length > 0) {
                outcomeMessage += ` You lost: ${lostItems.join(', ')}`;
            }
        }
        
        // Increase police heat
        if (gameState.policeHeat === undefined) gameState.policeHeat = 0;
        gameState.policeHeat += trader.isBlackmarket ? 15 : 25;
    }
    
    showOutcome(success ? 'Robbery Successful' : 'Robbery Failed', outcomeMessage);
    document.getElementById('robbery-modal').classList.add('hidden');
    saveGameState();
}

// Show outcome modal
function showOutcome(title, message) {
    document.getElementById('outcome-title').textContent = title;
    document.getElementById('outcome-message').textContent = message;
    
    // Update stats display
    const statsElement = document.getElementById('outcome-stats');
    statsElement.innerHTML = '';
    
    const moneyStat = document.createElement('div');
    moneyStat.className = 'outcome-stat';
    moneyStat.textContent = `Money: $${gameState.money.toLocaleString()}`;
    statsElement.appendChild(moneyStat);
    
    if (gameState.health !== undefined) {
        const healthStat = document.createElement('div');
        healthStat.className = 'outcome-stat';
        healthStat.textContent = `Health: ${gameState.health}%`;
        statsElement.appendChild(healthStat);
    }
    
    if (gameState.policeHeat !== undefined) {
        const heatStat = document.createElement('div');
        heatStat.className = 'outcome-stat';
        heatStat.textContent = `Police Heat: ${gameState.policeHeat}%`;
        statsElement.appendChild(heatStat);
    }
    
    if (gameState.jailTime !== undefined && gameState.jailTime > 0) {
        const jailStat = document.createElement('div');
        jailStat.className = 'outcome-stat';
        jailStat.textContent = `Jail Time: ${gameState.jailTime} days`;
        statsElement.appendChild(jailStat);
    }
    
    document.getElementById('outcome-modal').classList.remove('hidden');
    document.getElementById('trade-modal').classList.add('hidden');
}

// Save game state back to main game
function saveGameState() {
    localStorage.setItem('undergroundTraderGame', JSON.stringify({ player: gameState }));
    
    // Send message to main window if this is in an iframe
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'tradingUpdate',
            gameState: gameState
        }, '*');
    }
}

// Initialize the trading system
initTradingSystem();
