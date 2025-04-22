// Trading System for Street Alchemist
// This integrates with the main game through localStorage

// Trading system state
const tradingState = {
    traders: [],
    blackMarketTraders: [],
    currentTrade: null,
    playerInventory: {},
    playerMoney: 0,
    playerHealth: 100,
    playerJailTime: 0,
    playerDaysFree: 0,
    gameTime: 0
};

// Trader types and their characteristics
const TRADER_TYPES = {
    shadyDealer: {
        name: "Shady Dealer",
        description: "Deals in bulk but prices are high",
        risk: 0.2,
        undercoverChance: 0.1,
        robberySuccess: 0.4
    },
    streetVendor: {
        name: "Street Vendor",
        description: "Small quantities, fair prices",
        risk: 0.1,
        undercoverChance: 0.05,
        robberySuccess: 0.6
    },
    randomCharacter: {
        name: "Mysterious Stranger",
        description: "Unpredictable offers",
        risk: 0.3,
        undercoverChance: 0.15,
        robberySuccess: 0.3
    },
    blackMarket: {
        name: "Black Market Dealer",
        description: "High risk, high reward",
        risk: 0.5,
        undercoverChance: 0.3,
        robberySuccess: 0.2
    }
};

// Item values for trading
const ITEM_VALUES = {
    weed: { min: 15, max: 25, quantity: [1, 10] },
    meth: { min: 40, max: 60, quantity: [1, 5] },
    coke: { min: 70, max: 90, quantity: [1, 3] },
    heroin: { min: 90, max: 110, quantity: [1, 2] },
    pistol: { min: 400, max: 600, quantity: [1, 1] },
    shotgun: { min: 1000, max: 1400, quantity: [1, 1] },
    rifle: { min: 2000, max: 3000, quantity: [1, 1] },
    switch: { min: 4000, max: 6000, quantity: [1, 1] },
    cash: { min: 100, max: 5000, quantity: [100, 5000] }
};

// Initialize the trading system
function initTradingSystem() {
    // Load game state from main game
    loadGameState();
    
    // Set up UI
    setupUI();
    
    // Generate initial traders
    generateTraders();
    generateBlackMarketTraders();
    
    // Set up event listeners
    setupEventListeners();
}

// Load game state from main game through localStorage
function loadGameState() {
    const mainGameState = JSON.parse(localStorage.getItem('mainGameState'));
    
    if (mainGameState) {
        tradingState.playerInventory = mainGameState.inventory || {};
        tradingState.playerMoney = mainGameState.money || 0;
        tradingState.playerHealth = mainGameState.health || 100;
        tradingState.playerJailTime = mainGameState.jailTime || 0;
        tradingState.playerDaysFree = mainGameState.daysFree || 0;
        tradingState.gameTime = mainGameState.time || 0;
        
        // Add weapons to inventory
        if (mainGameState.weapons) {
            for (const weapon in mainGameState.weapons) {
                tradingState.playerInventory[weapon] = (tradingState.playerInventory[weapon] || 0) + mainGameState.weapons[weapon];
            }
        }
    }
}

// Save game state back to main game
function saveGameState() {
    const gameState = {
        inventory: tradingState.playerInventory,
        money: tradingState.playerMoney,
        health: tradingState.playerHealth,
        jailTime: tradingState.playerJailTime,
        daysFree: tradingState.playerDaysFree,
        time: tradingState.gameTime
    };
    
    localStorage.setItem('mainGameState', JSON.stringify(gameState));
    
    // Notify main window of updates
    if (window.opener) {
        window.opener.postMessage({
            type: 'tradingUpdate',
            inventory: tradingState.playerInventory,
            money: tradingState.playerMoney,
            health: tradingState.playerHealth,
            jailTime: tradingState.playerJailTime,
            daysFree: tradingState.playerDaysFree
        }, '*');
    }
}

// Set up UI elements
function setupUI() {
    // Update money and time displays
    updateMoneyDisplay();
    updateTimeDisplay();
    
    // Show inventory
    updateInventoryDisplay();
}

// Update money display
function updateMoneyDisplay() {
    document.getElementById('trading-money').textContent = `$${tradingState.playerMoney.toLocaleString()}`;
}

// Update time display
function updateTimeDisplay() {
    const hours = Math.floor(tradingState.gameTime / 60) % 24;
    const minutes = tradingState.gameTime % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    document.getElementById('trading-time').textContent = 
        `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Generate random traders
function generateTraders() {
    tradingState.traders = [];
    const traderCount = Math.floor(Math.random() * 3) + 1; // 1-3 traders
    
    for (let i = 0; i < traderCount; i++) {
        const traderType = getRandomTraderType();
        const trader = createTrader(traderType);
        tradingState.traders.push(trader);
    }
    
    updateTraderDisplay();
}

// Generate black market traders
function generateBlackMarketTraders() {
    tradingState.blackMarketTraders = [];
    
    // 50% chance to have a black market trader
    if (Math.random() > 0.5) {
        const trader = createTrader('blackMarket');
        tradingState.blackMarketTraders.push(trader);
    }
    
    updateBlackMarketDisplay();
}

// Get a random trader type (excluding black market)
function getRandomTraderType() {
    const types = Object.keys(TRADER_TYPES).filter(type => type !== 'blackMarket');
    return types[Math.floor(Math.random() * types.length)];
}

// Create a trader with random offers
function createTrader(type) {
    const traderInfo = TRADER_TYPES[type];
    const trader = {
        type: type,
        name: traderInfo.name,
        description: traderInfo.description,
        risk: traderInfo.risk,
        undercover: Math.random() < traderInfo.undercoverChance,
        robberySuccess: traderInfo.robberySuccess,
        offer: generateTradeOffer(type),
        originalOffer: null // Will be set when negotiating
    };
    
    return trader;
}

// Generate a random trade offer
function generateTradeOffer(traderType) {
    const offer = {
        gives: [],
        wants: []
    };
    
    // Determine number of items to trade (1-3)
    const itemCount = Math.floor(Math.random() * 3) + 1;
    
    // Generate items they're giving
    for (let i = 0; i < itemCount; i++) {
        const itemType = getRandomItemType();
        const itemValue = ITEM_VALUES[itemType];
        const quantity = getRandomQuantity(itemValue.quantity);
        
        // Adjust value based on trader type
        let valueModifier = 1;
        if (traderType === 'shadyDealer') valueModifier = 1.2; // More expensive
        if (traderType === 'streetVendor') valueModifier = 0.9; // Cheaper
        if (traderType === 'blackMarket') valueModifier = 1.5; // Much more expensive but higher risk
        
        const value = Math.floor(getRandomValue(itemValue.min, itemValue.max) * valueModifier);
        
        offer.gives.push({
            type: itemType,
            quantity: quantity,
            value: value
        });
    }
    
    // Generate items they want (try to match value)
    const totalGiveValue = offer.gives.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    let remainingValue = totalGiveValue;
    
    while (remainingValue > 0) {
        const itemType = getRandomItemType();
        const itemValue = ITEM_VALUES[itemType];
        const maxQuantity = Math.min(
            Math.floor(remainingValue / itemValue.min),
            itemValue.quantity[1]
        );
        
        if (maxQuantity < 1) break;
        
        const quantity = Math.max(1, Math.floor(Math.random() * maxQuantity) + 1);
        const value = Math.floor(getRandomValue(itemValue.min, itemValue.max) * 0.9); // Slightly in their favor
        
        offer.wants.push({
            type: itemType,
            quantity: quantity,
            value: value
        });
        
        remainingValue -= value * quantity;
    }
    
    return offer;
}

// Get a random item type
function getRandomItemType() {
    const items = Object.keys(ITEM_VALUES);
    return items[Math.floor(Math.random() * items.length)];
}

// Get a random quantity within range
function getRandomQuantity(range) {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

// Get a random value within range
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update trader display
function updateTraderDisplay() {
    const traderList = document.querySelector('.trader-list');
    traderList.innerHTML = '';
    
    if (tradingState.traders.length === 0) {
        document.querySelector('#market-tab .no-traders').classList.remove('hidden');
    } else {
        document.querySelector('#market-tab .no-traders').classList.add('hidden');
        
        tradingState.traders.forEach((trader, index) => {
            const traderEl = document.createElement('div');
            traderEl.className = 'trader';
            traderEl.dataset.index = index;
            
            let offerText = trader.offer.gives.map(item => 
                `${item.quantity} ${item.type} ($${item.value * item.quantity})`
            ).join(', ');
            
            let requestText = trader.offer.wants.map(item => 
                `${item.quantity} ${item.type}`
            ).join(', ');
            
            traderEl.innerHTML = `
                <h4>${trader.name}</h4>
                <p>${trader.description}</p>
                <p><strong>Offers:</strong> ${offerText}</p>
                <p><strong>Wants:</strong> ${requestText}</p>
            `;
            
            traderList.appendChild(traderEl);
        });
    }
}

// Update black market display
function updateBlackMarketDisplay() {
    const blackMarketList = document.querySelector('.black-market-traders');
    blackMarketList.innerHTML = '';
    
    if (tradingState.blackMarketTraders.length === 0) {
        document.querySelector('#black-market-tab .no-traders').classList.remove('hidden');
    } else {
        document.querySelector('#black-market-tab .no-traders').classList.add('hidden');
        
        tradingState.blackMarketTraders.forEach((trader, index) => {
            const traderEl = document.createElement('div');
            traderEl.className = 'black-market-trader';
            traderEl.dataset.index = index;
            
            let offerText = trader.offer.gives.map(item => 
                `${item.quantity} ${item.type} ($${item.value * item.quantity})`
            ).join(', ');
            
            let requestText = trader.offer.wants.map(item => 
                `${item.quantity} ${item.type}`
            ).join(', ');
            
            traderEl.innerHTML = `
                <h4>${trader.name}</h4>
                <p>${trader.description}</p>
                <p><strong>Offers:</strong> ${offerText}</p>
                <p><strong>Wants:</strong> ${requestText}</p>
                <p class="warning">⚠️ HIGH RISK ⚠️</p>
            `;
            
            blackMarketList.appendChild(traderEl);
        });
    }
}

// Update inventory display
function updateInventoryDisplay() {
    const inventoryList = document.querySelector('.inventory-list');
    inventoryList.innerHTML = '';
    
    if (Object.keys(tradingState.playerInventory).length === 0) {
        inventoryList.innerHTML = '<p>Your inventory is empty.</p>';
    } else {
        for (const item in tradingState.playerInventory) {
            const quantity = tradingState.playerInventory[item];
            const itemValue = ITEM_VALUES[item] ? ITEM_VALUES[item].min : 0;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.innerHTML = `
                <h4>${item.charAt(0).toUpperCase() + item.slice(1)}</h4>
                <p>Quantity: ${quantity}</p>
                <p>Value: ~$${itemValue * quantity}</p>
            `;
            
            inventoryList.appendChild(itemEl);
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.trading-tabs .tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            showTab(tab);
        });
    });
    
    // Back button
    document.querySelector('.back-button').addEventListener('click', () => {
        saveGameState();
        window.close();
    });
    
    // Refresh traders buttons
    document.getElementById('refresh-traders').addEventListener('click', () => {
        generateTraders();
    });
    
    document.getElementById('refresh-black-market').addEventListener('click', () => {
        generateBlackMarketTraders();
    });
    
    // Trader click handlers (delegated)
    document.querySelector('.trader-list').addEventListener('click', (e) => {
        const traderEl = e.target.closest('.trader');
        if (traderEl) {
            const index = parseInt(traderEl.dataset.index);
            startTrade(index, false);
        }
    });
    
    document.querySelector('.black-market-traders').addEventListener('click', (e) => {
        const traderEl = e.target.closest('.black-market-trader');
        if (traderEl) {
            const index = parseInt(traderEl.dataset.index);
            startTrade(index, true);
        }
    });
    
    // Trade modal buttons
    document.getElementById('accept-trade').addEventListener('click', completeTrade);
    document.getElementById('negotiate-trade').addEventListener('click', startNegotiation);
    document.getElementById('rob-trader').addEventListener('click', attemptRobbery);
    document.getElementById('cancel-trade').addEventListener('click', cancelTrade);
    
    // Negotiation modal buttons
    document.getElementById('submit-counter').addEventListener('click', submitCounterOffer);
    document.getElementById('cancel-negotiation').addEventListener('click', cancelNegotiation);
    
    // Offer modifier slider
    document.getElementById('offer-modifier').addEventListener('input', (e) => {
        document.getElementById('offer-percentage').textContent = `${e.target.value}%`;
        updateCounterOffer(parseInt(e.target.value));
    });
    
    // Robbery modal buttons
    document.getElementById('proceed-robbery').addEventListener('click', proceedWithRobbery);
    document.getElementById('cancel-robbery').addEventListener('click', cancelRobbery);
    
    // Outcome modal button
    document.getElementById('close-outcome').addEventListener('click', closeOutcome);
    
    // Arrest modal button
    document.getElementById('accept-arrest').addEventListener('click', acceptArrest);
}

// Show a specific tab
function showTab(tab) {
    document.querySelectorAll('.trading-content .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.trading-tabs .tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add('active');
}

// Start a trade with a trader
function startTrade(index, isBlackMarket) {
    const traders = isBlackMarket ? tradingState.blackMarketTraders : tradingState.traders;
    tradingState.currentTrade = {
        trader: traders[index],
        isBlackMarket: isBlackMarket,
        traderIndex: index
    };
    
    // Show trade modal
    document.getElementById('trader-name').textContent = tradingState.currentTrade.trader.name;
    document.querySelector('.trade-modal').classList.remove('hidden');
    
    // Populate offer items
    const offerItems = document.querySelector('.offer-items');
    offerItems.innerHTML = '';
    
    tradingState.currentTrade.trader.offer.gives.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'trade-item';
        itemEl.innerHTML = `
            <span>${item.quantity} ${item.type}</span>
            <span>$${item.value * item.quantity}</span>
        `;
        offerItems.appendChild(itemEl);
    });
    
    // Populate request items
    const requestItems = document.querySelector('.request-items');
    requestItems.innerHTML = '';
    
    tradingState.currentTrade.trader.offer.wants.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'trade-item';
        itemEl.innerHTML = `
            <span>${item.quantity} ${item.type}</span>
            <span>${getItemValueEstimate(item.type)} each</span>
        `;
        requestItems.appendChild(itemEl);
    });
    
    // Show undercover warning if applicable (10% chance to detect)
    const undercoverWarning = document.getElementById('undercover-warning');
    if (tradingState.currentTrade.trader.undercover && Math.random() < 0.1) {
        undercoverWarning.classList.remove('hidden');
    } else {
        undercoverWarning.classList.add('hidden');
    }
}

// Get an estimate of an item's value
function getItemValueEstimate(itemType) {
    const value = ITEM_VALUES[itemType];
    if (!value) return '?';
    return `~$${value.min}-${value.max}`;
}

// Complete the current trade
function completeTrade() {
    const trade = tradingState.currentTrade;
    
    // Check if undercover cop
    if (trade.trader.undercover) {
        handleUndercoverArrest();
        return;
    }
    
    // Check if player has all requested items
    for (const item of trade.trader.offer.wants) {
        if (!tradingState.playerInventory[item.type] || 
            tradingState.playerInventory[item.type] < item.quantity) {
            showOutcome("Trade Failed", `You don't have enough ${item.type}!`);
            return;
        }
    }
    
    // Process the trade
    try {
        // Remove items player is giving
        for (const item of trade.trader.offer.wants) {
            tradingState.playerInventory[item.type] -= item.quantity;
            if (tradingState.playerInventory[item.type] <= 0) {
                delete tradingState.playerInventory[item.type];
            }
        }
        
        // Add items player is receiving
        for (const item of trade.trader.offer.gives) {
            if (!tradingState.playerInventory[item.type]) {
                tradingState.playerInventory[item.type] = 0;
            }
            tradingState.playerInventory[item.type] += item.quantity;
        }
        
        // Calculate total value for message
        const totalValue = trade.trader.offer.gives.reduce(
            (sum, item) => sum + (item.value * item.quantity), 0
        );
        
        // Show success message
        showOutcome(
            "Trade Completed", 
            `You successfully traded with ${trade.trader.name} for $${totalValue} worth of goods.`,
            trade.trader.offer.gives
        );
        
        // Remove trader
        if (trade.isBlackMarket) {
            tradingState.blackMarketTraders.splice(trade.traderIndex, 1);
            updateBlackMarketDisplay();
        } else {
            tradingState.traders.splice(trade.traderIndex, 1);
            updateTraderDisplay();
        }
    } catch (error) {
        showOutcome("Trade Failed", "Something went wrong with the trade.");
    }
}

// Start negotiation with current trader
function startNegotiation() {
    const trade = tradingState.currentTrade;
    
    // Save original offer
    trade.originalOffer = JSON.parse(JSON.stringify(trade.trader.offer));
    
    // Show negotiation modal
    document.getElementById('negotiate-trader-name').textContent = trade.trader.name;
    document.querySelector('.negotiation-modal').classList.remove('hidden');
    document.querySelector('.trade-modal').classList.add('hidden');
    
    // Populate original offer
    const originalItems = document.querySelector('.original-items');
    originalItems.innerHTML = '';
    
    trade.originalOffer.gives.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'offer-item';
        itemEl.innerHTML = `
            <span>${item.quantity} ${item.type}</span>
            <span>$${item.value * item.quantity}</span>
        `;
        originalItems.appendChild(itemEl);
    });
    
    trade.originalOffer.wants.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'offer-item';
        itemEl.innerHTML = `
            <span>${item.quantity} ${item.type}</span>
            <span>${getItemValueEstimate(item.type)} each</span>
        `;
        originalItems.appendChild(itemEl);
    });
    
    // Initialize counter offer
    updateCounterOffer(100);
}

// Update counter offer based on percentage
function updateCounterOffer(percentage) {
    const trade = tradingState.currentTrade;
    const counterItems = document.querySelector('.counter-items');
    counterItems.innerHTML = '';
    
    // Calculate modified offer
    const modifier = percentage / 100;
    const counterOffer = {
        gives: [],
        wants: []
    };
    
    // Adjust what they're giving (less if percentage < 100, more if > 100)
    trade.originalOffer.gives.forEach(item => {
        counterOffer.gives.push({
            type: item.type,
            quantity: Math.max(1, Math.floor(item.quantity * modifier)),
            value: item.value
        });
    });
    
    // Adjust what they want (more if percentage < 100, less if > 100)
    trade.originalOffer.wants.forEach(item => {
        counterOffer.wants.push({
            type: item.type,
            quantity: Math.max(1, Math.floor(item.quantity * (2 - modifier))),
            value: item.value
        });
    });
    
    // Display counter offer
    counterOffer.gives.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'counter-item';
        itemEl.innerHTML = `
            <span>${item.quantity} ${item.type}</span>
            <span>$${item.value * item.quantity}</span>
        `;
        counterItems.appendChild(itemEl);
    });
    
    counterOffer.wants.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'counter-item';
        itemEl.innerHTML = `
            <span>${item.quantity} ${item.type}</span>
            <span>${getItemValueEstimate(item.type)} each</span>
        `;
        counterItems.appendChild(itemEl);
    });
    
    // Store the counter offer
    trade.counterOffer = counterOffer;
}

// Submit counter offer
function submitCounterOffer() {
    const trade = tradingState.currentTrade;
    
    // Determine if trader accepts (better chance if offer is fair)
    const percentage = parseInt(document.getElementById('offer-modifier').value);
    const acceptChance = Math.min(0.9, 0.5 + (percentage / 200)); // 50-90% chance
    
    if (Math.random() < acceptChance) {
        // Trader accepts - update offer
        trade.trader.offer = trade.counterOffer;
        
        // Close modals and show updated trade
        document.querySelector('.negotiation-modal').classList.add('hidden');
        document.querySelector('.trade-modal').classList.remove('hidden');
        
        // Update trade modal with new offer
        const offerItems = document.querySelector('.offer-items');
        offerItems.innerHTML = '';
        
        trade.trader.offer.gives.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'trade-item';
            itemEl.innerHTML = `
                <span>${item.quantity} ${item.type}</span>
                <span>$${item.value * item.quantity}</span>
            `;
            offerItems.appendChild(itemEl);
        });
        
        const requestItems = document.querySelector('.request-items');
        requestItems.innerHTML = '';
        
        trade.trader.offer.wants.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'trade-item';
            itemEl.innerHTML = `
                <span>${item.quantity} ${item.type}</span>
                <span>${getItemValueEstimate(item.type)} each</span>
            `;
            requestItems.appendChild(itemEl);
        });
    } else {
        // Trader rejects
        showOutcome("Negotiation Failed", `${trade.trader.name} rejected your offer.`);
        document.querySelector('.negotiation-modal').classList.add('hidden');
    }
}

// Cancel negotiation
function cancelNegotiation() {
    document.querySelector('.negotiation-modal').classList.add('hidden');
    document.querySelector('.trade-modal').classList.remove('hidden');
}

// Attempt to rob the trader
function attemptRobbery() {
    const trade = tradingState.currentTrade;
    
    // Show robbery modal
    document.querySelector('.robbery-modal').classList.remove('hidden');
    document.querySelector('.trade-modal').classList.add('hidden');
    
    // Set robbery outcome message
    const outcomeMessage = document.getElementById('robbery-outcome');
    outcomeMessage.textContent = 
        `You're about to rob ${trade.trader.name}. Success chance: ${Math.floor(trade.trader.robberySuccess * 100)}%.`;
}

// Proceed with robbery
function proceedWithRobbery() {
    const trade = tradingState.currentTrade;
    
    // Determine if robbery succeeds
    if (Math.random() < trade.trader.robberySuccess) {
        // Robbery succeeds - get all their items
        let stolenValue = 0;
        const stolenItems = [];
        
        trade.trader.offer.gives.forEach(item => {
            if (!tradingState.playerInventory[item.type]) {
                tradingState.playerInventory[item.type] = 0;
            }
            tradingState.playerInventory[item.type] += item.quantity;
            stolenValue += item.value * item.quantity;
            stolenItems.push(item);
        });
        
        // Also take some of their cash (random amount)
        const stolenCash = Math.floor(Math.random() * 500) + 100;
        tradingState.playerMoney += stolenCash;
        stolenItems.push({ type: 'cash', quantity: stolenCash, value: 1 });
        
        // Show success message
        showOutcome(
            "Robbery Successful", 
            `You robbed ${trade.trader.name} and got away with $${stolenValue + stolenCash} worth of goods!`,
            stolenItems
        );
        
        // Remove trader
        if (trade.isBlackMarket) {
            tradingState.blackMarketTraders.splice(trade.traderIndex, 1);
            updateBlackMarketDisplay();
        } else {
            tradingState.traders.splice(trade.traderIndex, 1);
            updateTraderDisplay();
        }
    } else {
        // Robbery fails
        const damage = Math.floor(Math.random() * 30) + 10; // 10-40 damage
        tradingState.playerHealth = Math.max(0, tradingState.playerHealth - damage);
        
        if (trade.isBlackMarket) {
            // In black market, you get arrested for robbery
            tradingState.playerJailTime = 50;
            showOutcome(
                "Robbery Failed", 
                `${trade.trader.name} fought back and called the cops! You got 50 days in jail.`
            );
        } else {
            let outcomeMessage = `${trade.trader.name} fought back! You took ${damage}% damage.`;
            
            // 50% chance they take some of your items
            if (Math.random() < 0.5 && Object.keys(tradingState.playerInventory).length > 0) {
                const items = Object.keys(tradingState.playerInventory);
                const stolenItem = items[Math.floor(Math.random() * items.length)];
                const stolenQuantity = Math.min(
                    tradingState.playerInventory[stolenItem],
                    Math.floor(Math.random() * 3) + 1
                );
                
                tradingState.playerInventory[stolenItem] -= stolenQuantity;
                if (tradingState.playerInventory[stolenItem] <= 0) {
                    delete tradingState.playerInventory[stolenItem];
                }
                
                outcomeMessage += ` They also took ${stolenQuantity} ${stolenItem}.`;
            }
            
            showOutcome("Robbery Failed", outcomeMessage);
        }
    }
    
    // Update UI
    updateMoneyDisplay();
    updateInventoryDisplay();
}

// Cancel robbery attempt
function cancelRobbery() {
    document.querySelector('.robbery-modal').classList.add('hidden');
    document.querySelector('.trade-modal').classList.remove('hidden');
}

// Cancel trade
function cancelTrade() {
    document.querySelector('.trade-modal').classList.add('hidden');
    tradingState.currentTrade = null;
}

// Handle undercover cop arrest
function handleUndercoverArrest() {
    const trade = tradingState.currentTrade;
    
    // Set jail time (30 days normal, 50 days black market)
    tradingState.playerJailTime = trade.isBlackMarket ? 50 : 30;
    
    // Show arrest modal
    document.querySelector('.arrest-modal').classList.remove('hidden');
    document.querySelector('.trade-modal').classList.add('hidden');
    document.getElementById('jail-sentence').textContent = 
        `Sentence: ${tradingState.playerJailTime} days in jail`;
    
    // Remove trader
    if (trade.isBlackMarket) {
        tradingState.blackMarketTraders.splice(trade.traderIndex, 1);
        updateBlackMarketDisplay();
    } else {
        tradingState.traders.splice(trade.traderIndex, 1);
        updateTraderDisplay();
    }
}

// Accept arrest and close modal
function acceptArrest() {
    document.querySelector('.arrest-modal').classList.add('hidden');
    tradingState.currentTrade = null;
}

// Show trade outcome
function showOutcome(title, message, items = []) {
    document.getElementById('outcome-title').textContent = title;
    document.getElementById('outcome-message').textContent = message;
    
    const outcomeItems = document.querySelector('.outcome-items');
    outcomeItems.innerHTML = '';
    
    if (items.length > 0) {
        const itemsHeader = document.createElement('h4');
        itemsHeader.textContent = 'Items Received:';
        outcomeItems.appendChild(itemsHeader);
        
        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'outcome-item';
            itemEl.innerHTML = `
                <span>${item.quantity} ${item.type}</span>
                <span>${item.type === 'cash' ? `$${item.quantity}` : `$${item.value * item.quantity}`}</span>
            `;
            outcomeItems.appendChild(itemEl);
        });
    }
    
    document.querySelector('.outcome-modal').classList.remove('hidden');
    document.querySelector('.trade-modal').classList.add('hidden');
    document.querySelector('.negotiation-modal').classList.add('hidden');
    document.querySelector('.robbery-modal').classList.add('hidden');
}

// Close outcome modal
function closeOutcome() {
    document.querySelector('.outcome-modal').classList.add('hidden');
    tradingState.currentTrade = null;
}

// Initialize the trading system when the page loads
window.addEventListener('load', initTradingSystem);

// Listen for messages from the main game
window.addEventListener('message', (event) => {
    if (event.data.type === 'updateGameState') {
        // Update our state from the main game
        tradingState.gameTime = event.data.time;
        updateTimeDisplay();
    }
});
