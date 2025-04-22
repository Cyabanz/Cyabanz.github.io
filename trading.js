// Trading Game State
const tradeState = {
    currentTrader: null,
    currentOffer: null,
    currentDemand: null,
    isCop: false,
    robberyProgress: 0,
    robberySuccess: false
};

// Trader types and their behaviors
const traderTypes = {
    regular: {
        name: "Regular",
        risk: 0.1,
        offerMultiplier: 0.8,
        fightChance: 0.3,
        copChance: 0.05
    },
    rich: {
        name: "Rich",
        risk: 0.3,
        offerMultiplier: 1.2,
        fightChance: 0.5,
        copChance: 0.1
    },
    wholesale: {
        name: "Wholesale",
        risk: 0.5,
        offerMultiplier: 1.0,
        fightChance: 0.2,
        copChance: 0.2
    }
};

// Initialize the trading game
function initTradingGame() {
    // Load game state from localStorage or main game
    loadGameState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI
    updateTradeUI();
}

// Load game state from localStorage
function loadGameState() {
    const savedState = localStorage.getItem('streetAlchemistGameState');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
    } else {
        // Default state if none exists
        gameState = {
            money: 10000,
            reputation: 0,
            health: 100,
            time: 0,
            ingredients: {},
            inventory: {},
            weapons: {},
            policeHeat: 0,
            inJail: false,
            jailDays: 0,
            dead: false
        };
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('streetAlchemistGameState', JSON.stringify(gameState));
}

// Set up event listeners
function setupEventListeners() {
    // Find trader buttons
    document.querySelectorAll('.trade-action').forEach(button => {
        button.addEventListener('click', (e) => {
            const option = e.target.closest('.trading-option').dataset.option;
            findTrader(option);
        });
    });
    
    // Trade decision buttons
    document.querySelectorAll('.trade-decision').forEach(button => {
        button.addEventListener('click', (e) => {
            const decision = e.target.dataset.decision;
            handleTradeDecision(decision);
        });
    });
    
    // Continue button
    document.getElementById('trade-continue').addEventListener('click', resetTrade);
    
    // Robbery button
    document.getElementById('robbery-action').addEventListener('click', attemptRobbery);
    
    // Robbery continue button
    document.getElementById('robbery-continue').addEventListener('click', finishRobbery);
    
    // Exit trading button
    document.getElementById('exit-trading').addEventListener('click', exitTrading);
}

// Update trading UI
function updateTradeUI() {
    // Update money and time
    document.getElementById('trade-money').textContent = `$${gameState.money.toLocaleString()}`;
    document.getElementById('trade-health').textContent = `Health: ${gameState.health}%`;
    updateTimeDisplay();
    
    // Update inventory list
    updateInventoryDisplay();
}

function updateTimeDisplay() {
    const hours = Math.floor(gameState.time / 60) % 24;
    const minutes = gameState.time % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('trade-time').textContent = timeString;
}

// Update inventory display
function updateInventoryDisplay() {
    const inventoryList = document.getElementById('trade-inventory');
    inventoryList.innerHTML = '';
    
    // Show drugs
    for (const drug in gameState.inventory) {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.textContent = `${drug}: ${gameState.inventory[drug]}g`;
        inventoryList.appendChild(item);
    }
    
    // Show weapons
    for (const weapon in gameState.weapons) {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.textContent = `${weapon}: ${gameState.weapons[weapon]}`;
        inventoryList.appendChild(item);
    }
    
    // Show cash
    const cashItem = document.createElement('div');
    cashItem.className = 'inventory-item';
    cashItem.textContent = `Cash: $${gameState.money}`;
    inventoryList.appendChild(cashItem);
}

// Find a trader
function findTrader(type) {
    // Determine trader type
    let traderType;
    let isCop = false;
    
    // Check if this is an undercover cop (based on police heat)
    if (Math.random() < traderTypes[type.split('-')[1]].copChance * (1 + gameState.policeHeat / 100)) {
        isCop = true;
        traderType = {
            name: "Undercover Cop",
            risk: 1.0,
            offerMultiplier: 1.0,
            fightChance: 0.8
        };
    } else {
        traderType = traderTypes[type.split('-')[1]];
    }
    
    tradeState.currentTrader = traderType;
    tradeState.isCop = isCop;
    
    // Generate an offer
    generateTradeOffer();
    
    // Show the trade interface
    document.querySelector('.trading-options').classList.add('hidden');
    document.getElementById('current-trade').classList.remove('hidden');
    
    // Update trader display
    updateTraderDisplay();
}

// Generate a trade offer
function generateTradeOffer() {
    const trader = tradeState.currentTrader;
    const isCop = tradeState.isCop;
    
    // What they're offering (money or items)
    if (Math.random() < 0.7 || isCop) {
        // Offering money for drugs
        const drugTypes = Object.keys(gameState.inventory);
        if (drugTypes.length === 0) {
            // If player has no drugs, offer to sell something
            tradeState.currentOffer = {
                type: "item",
                item: getRandomDrug(),
                amount: Math.floor(1 + Math.random() * 5)
            };
        } else {
            const drug = drugTypes[Math.floor(Math.random() * drugTypes.length)];
            const amount = Math.min(
                gameState.inventory[drug],
                Math.floor(1 + Math.random() * 10)
            );
            
            const value = amount * (50 + Math.random() * 50) * trader.offerMultiplier;
            
            tradeState.currentOffer = {
                type: "money",
                amount: Math.floor(value)
            };
        }
    } else {
        // Offering items for money or other items
        tradeState.currentOffer = {
            type: "item",
            item: getRandomDrug(),
            amount: Math.floor(1 + Math.random() * 5)
        };
    }
    
    // What they want in return
    if (isCop) {
        // Cops always want drugs as evidence
        const drugTypes = Object.keys(gameState.inventory);
        if (drugTypes.length > 0) {
            const drug = drugTypes[Math.floor(Math.random() * drugTypes.length)];
            tradeState.currentDemand = {
                type: "item",
                item: drug,
                amount: Math.min(
                    gameState.inventory[drug],
                    Math.floor(1 + Math.random() * 5)
                )
            };
        } else {
            // If player has no drugs, cop will arrest for attempted trade
            tradeState.currentDemand = {
                type: "arrest",
                days: 5 + Math.floor(Math.random() * 10)
            };
        }
    } else if (Math.random() < 0.6) {
        // Want money
        tradeState.currentDemand = {
            type: "money",
            amount: Math.floor(100 + Math.random() * 900)
        };
    } else {
        // Want specific item
        tradeState.currentDemand = {
            type: "item",
            item: getRandomDrug(),
            amount: Math.floor(1 + Math.random() * 3)
        };
    }
    
    // Update offer display
    updateOfferDisplay();
}

// Get a random drug type
function getRandomDrug() {
    const drugs = ["weed", "meth", "coke", "heroin"];
    return drugs[Math.floor(Math.random() * drugs.length)];
}

// Update trader display
function updateTraderDisplay() {
    const traderInfo = document.querySelector('.trader-info');
    const avatar = traderInfo.querySelector('.trader-avatar');
    
    // Reset avatar classes
    avatar.className = 'trader-avatar';
    
    if (tradeState.isCop) {
        avatar.classList.add('cop');
        document.getElementById('trader-type').textContent = "Type: Undercover Cop";
    } else if (tradeState.currentTrader.name === "Rich") {
        avatar.classList.add('rich');
        document.getElementById('trader-type').textContent = "Type: Rich Buyer";
    } else if (tradeState.currentTrader.name === "Wholesale") {
        avatar.classList.add('dealer');
        document.getElementById('trader-type').textContent = "Type: Wholesaler";
    } else {
        document.getElementById('trader-type').textContent = "Type: Regular Trader";
    }
    
    // Set trust level (lower for cops)
    const trust = tradeState.isCop ? 
        Math.floor(10 + Math.random() * 20) : 
        Math.floor(40 + Math.random() * 50);
    document.getElementById('trader-trust').textContent = `Trust: ${trust}%`;
}

// Update offer display
function updateOfferDisplay() {
    const theirOffer = document.getElementById('their-offer');
    const theirDemand = document.getElementById('their-demand');
    
    // What they're offering
    theirOffer.innerHTML = '';
    if (tradeState.currentOffer.type === "money") {
        theirOffer.textContent = `$${tradeState.currentOffer.amount}`;
    } else {
        theirOffer.textContent = `${tradeState.currentOffer.amount}g ${tradeState.currentOffer.item}`;
    }
    
    // What they want
    theirDemand.innerHTML = '';
    if (tradeState.currentDemand.type === "money") {
        theirDemand.textContent = `$${tradeState.currentDemand.amount}`;
    } else if (tradeState.currentDemand.type === "arrest") {
        theirDemand.textContent = `Arrest you for ${tradeState.currentDemand.days} days`;
    } else {
        theirDemand.textContent = `${tradeState.currentDemand.amount}g ${tradeState.currentDemand.item}`;
    }
}

// Handle trade decision
function handleTradeDecision(decision) {
    if (decision === "accept") {
        completeTrade(false);
    } else if (decision === "negotiate") {
        negotiateTrade();
    } else if (decision === "rob") {
        attemptRobbery();
    } else if (decision === "decline") {
        declineTrade();
    }
}

// Complete the trade
function completeTrade(negotiated) {
    const offer = tradeState.currentOffer;
    const demand = tradeState.currentDemand;
    let resultText = "";
    
    if (tradeState.isCop) {
        // Special handling for undercover cops
        if (demand.type === "arrest") {
            // Arrested for attempted trade with cop
            gameState.inJail = true;
            gameState.jailDays = demand.days;
            resultText = `It was a setup! You've been arrested by an undercover cop and sentenced to ${demand.days} days in jail.`;
        } else {
            // Arrested for actually trading drugs to cop
            gameState.inJail = true;
            gameState.jailDays = demand.days * 2;
            
            // Confiscate the drugs
            if (gameState.inventory[demand.item]) {
                gameState.inventory[demand.item] -= demand.amount;
                if (gameState.inventory[demand.item] <= 0) {
                    delete gameState.inventory[demand.item];
                }
            }
            
            resultText = `It was a setup! You've been arrested for selling drugs to an undercover cop and sentenced to ${demand.days * 2} days in jail.`;
        }
        
        // Reset police heat
        gameState.policeHeat = 0;
    } else {
        // Normal trade
        let success = true;
        
        // Check if player can fulfill demand
        if (demand.type === "money") {
            if (gameState.money < demand.amount) {
                success = false;
                resultText = "You don't have enough money for this trade!";
            }
        } else if (demand.type === "item") {
            if (!gameState.inventory[demand.item] || gameState.inventory[demand.item] < demand.amount) {
                success = false;
                resultText = `You don't have enough ${demand.item} for this trade!`;
            }
        }
        
        if (success) {
            // Process the trade
            if (demand.type === "money") {
                gameState.money -= demand.amount;
            } else if (demand.type === "item") {
                gameState.inventory[demand.item] -= demand.amount;
                if (gameState.inventory[demand.item] <= 0) {
                    delete gameState.inventory[demand.item];
                }
            }
            
            if (offer.type === "money") {
                gameState.money += offer.amount;
                resultText = `Trade complete! You received $${offer.amount}.`;
            } else {
                if (!gameState.inventory[offer.item]) {
                    gameState.inventory[offer.item] = 0;
                }
                gameState.inventory[offer.item] += offer.amount;
                resultText = `Trade complete! You received ${offer.amount}g ${offer.item}.`;
            }
            
            // Small reputation increase
            gameState.reputation += 5;
        }
    }
    
    // Show result
    document.getElementById('current-trade').classList.add('hidden');
    document.getElementById('trade-result').classList.remove('hidden');
    document.getElementById('trade-result-title').textContent = tradeState.isCop ? "Busted!" : "Trade Complete";
    document.getElementById('trade-result-text').textContent = resultText;
    
    // Update game state
    updateTradeUI();
    saveGameState();
}

// Negotiate the trade
function negotiateTrade() {
    const trader = tradeState.currentTrader;
    const trust = Math.random() * 50 + 30; // 30-80% chance based on random "trust"
    
    if (Math.random() < trust / 100) {
        // Negotiation successful - improve terms by 10-20%
        if (tradeState.currentOffer.type === "money") {
            tradeState.currentOffer.amount = Math.floor(tradeState.currentOffer.amount * (1.1 + Math.random() * 0.1));
        } else {
            tradeState.currentOffer.amount = Math.floor(tradeState.currentOffer.amount * (1.1 + Math.random() * 0.1));
        }
        
        if (tradeState.currentDemand.type === "money") {
            tradeState.currentDemand.amount = Math.floor(tradeState.currentDemand.amount * (0.8 - Math.random() * 0.1));
        } else if (tradeState.currentDemand.type === "item") {
            tradeState.currentDemand.amount = Math.floor(tradeState.currentDemand.amount * (0.8 - Math.random() * 0.1));
        }
        
        // Update display
        updateOfferDisplay();
        
        // Show success message
        alert("Negotiation successful! The trader agreed to better terms.");
    } else {
        // Negotiation failed - trader might walk away
        if (Math.random() < 0.3) {
            // Trader walks away
            document.getElementById('current-trade').classList.add('hidden');
            document.getElementById('trade-result').classList.remove('hidden');
            document.getElementById('trade-result-title').textContent = "Trade Failed";
            document.getElementById('trade-result-text').textContent = "The trader didn't like your negotiation and walked away.";
        } else {
            // Trader stays but no change
            alert("Negotiation failed. The trader won't change the terms.");
        }
    }
}

// Decline the trade
function declineTrade() {
    document.getElementById('current-trade').classList.add('hidden');
    document.getElementById('trade-result').classList.remove('hidden');
    document.getElementById('trade-result-title').textContent = "Trade Declined";
    document.getElementById('trade-result-text').textContent = "You declined the trade offer.";
}

// Attempt to rob the trader
function attemptRobbery() {
    // Show robbery screen
    document.getElementById('current-trade').classList.add('hidden');
    document.getElementById('robbery-screen').classList.remove('hidden');
    
    // Reset robbery progress
    tradeState.robberyProgress = 0;
    tradeState.robberySuccess = false;
    document.getElementById('robbery-progress').value = 0;
    document.getElementById('robbery-outcome').classList.add('hidden');
    
    // Start robbery timer
    clearInterval(robberyInterval);
    robberyInterval = setInterval(updateRobbery, 100);
}

// Update robbery progress
function updateRobbery() {
    // Decrease progress over time
    tradeState.robberyProgress = Math.max(0, tradeState.robberyProgress - 1);
    document.getElementById('robbery-progress').value = tradeState.robberyProgress;
    
    // Check if robbery failed (progress reaches 0)
    if (tradeState.robberyProgress <= 0 && !tradeState.robberySuccess) {
        finishRobbery(false);
    }
}

// Player action during robbery
function attemptRobberyAction() {
    // Increase progress
    tradeState.robberyProgress += 10 + Math.random() * 10;
    tradeState.robberyProgress = Math.min(100, tradeState.robberyProgress);
    document.getElementById('robbery-progress').value = tradeState.robberyProgress;
    
    // Check if robbery succeeds
    if (tradeState.robberyProgress >= 100) {
        tradeState.robberySuccess = true;
        finishRobbery(true);
    }
}

// Finish robbery attempt
function finishRobbery(success) {
    clearInterval(robberyInterval);
    
    // Show outcome
    document.getElementById('robbery-outcome').classList.remove('hidden');
    
    if (success) {
        // Robbery succeeded
        document.getElementById('robbery-result-title').textContent = "Robbery Successful!";
        
        // Get everything the trader was offering
        let lootText = "";
        if (tradeState.currentOffer.type === "money") {
            gameState.money += tradeState.currentOffer.amount;
            lootText = `You stole $${tradeState.currentOffer.amount}`;
        } else {
            if (!gameState.inventory[tradeState.currentOffer.item]) {
                gameState.inventory[tradeState.currentOffer.item] = 0;
            }
            gameState.inventory[tradeState.currentOffer.item] += tradeState.currentOffer.amount;
            lootText = `You stole ${tradeState.currentOffer.amount}g ${tradeState.currentOffer.item}`;
        }
        
        // Also take some of what they demanded (if item)
        if (tradeState.currentDemand.type === "item" && Math.random() < 0.5) {
            const extraAmount = Math.floor(tradeState.currentDemand.amount * 0.5);
            if (!gameState.inventory[tradeState.currentDemand.item]) {
                gameState.inventory[tradeState.currentDemand.item] = 0;
            }
            gameState.inventory[tradeState.currentDemand.item] += extraAmount;
            lootText += ` and ${extraAmount}g ${tradeState.currentDemand.item}`;
        }
        
        document.getElementById('robbery-result-text').textContent = `${lootText}.`;
        
        // Increase reputation but also police heat
        gameState.reputation += 10;
        gameState.policeHeat += 15;
    } else {
        // Robbery failed
        document.getElementById('robbery-result-title').textContent = "Robbery Failed!";
        
        if (tradeState.isCop) {
            // Extra penalty for trying to rob a cop
            gameState.inJail = true;
            gameState.jailDays = 30 + Math.floor(Math.random() * 30);
            gameState.health = Math.max(0, gameState.health - 30);
            document.getElementById('robbery-result-text').textContent = 
                `You tried to rob an undercover cop! You've been sentenced to ${gameState.jailDays} days in jail and took 30% damage.`;
        } else if (Math.random() < tradeState.currentTrader.fightChance) {
            // Trader fights back
            const damage = 20 + Math.floor(Math.random() * 30);
            gameState.health = Math.max(0, gameState.health - damage);
            
            if (gameState.health <= 0) {
                gameState.dead = true;
                document.getElementById('robbery-result-text').textContent = 
                    `The trader fought back and killed you!`;
            } else {
                document.getElementById('robbery-result-text').textContent = 
                    `The trader fought back! You took ${damage}% damage.`;
            }
        } else {
            // Trader runs away
            document.getElementById('robbery-result-text').textContent = 
                "The trader managed to get away before you could rob them.";
        }
    }
    
    // Update game state
    updateTradeUI();
    saveGameState();
}

// Reset trade screen
function resetTrade() {
    document.getElementById('trade-result').classList.add('hidden');
    document.querySelector('.trading-options').classList.remove('hidden');
}

// Exit trading screen
function exitTrading() {
    // Save game state before exiting
    saveGameState();
    
    // In a real implementation, this would return to the main game
    // For this example, we'll just show an alert
    alert("Returning to main game...");
    // window.location.href = "index.html"; // Uncomment in actual implementation
}

// Initialize the game when loaded
let gameState = {};
let robberyInterval = null;

document.addEventListener('DOMContentLoaded', initTradingGame);