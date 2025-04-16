// Blackjack Game Variables
let blackjackGame = {
    betAmount: 50,
    deck: [],
    dealerHand: [],
    playerHand: [],
    gameInProgress: false,
    playerBalance: 0
};

// Card images - using a free card API
const CARD_API = 'https://deckofcardsapi.com/static/img/';

// Blackjack Game Functions
function initializeBlackjack() {
    // Set up event listeners
    document.getElementById('blackjack-bet').addEventListener('input', function() {
        const bet = parseInt(this.value);
        document.getElementById('current-blackjack-bet').textContent = bet;
        document.getElementById('blackjack-bet-display').textContent = bet;
        blackjackGame.betAmount = bet;
    });

    document.getElementById('start-blackjack-btn').addEventListener('click', startBlackjackGame);
    document.getElementById('hit-btn').addEventListener('click', playerHit);
    document.getElementById('stand-btn').addEventListener('click', playerStand);
    document.getElementById('double-btn').addEventListener('click', playerDouble);
}

function startBlackjackGame() {
    if (blackjackGame.gameInProgress) return;
    
    // Check if player has enough coins
    if (userData.coins < blackjackGame.betAmount) {
        alert("Not enough coins to place this bet!");
        return;
    }
    
    // Deduct bet amount
    updateUserData({
        coins: userData.coins - blackjackGame.betAmount
    });
    
    // Reset game state
    blackjackGame.deck = createDeck();
    blackjackGame.dealerHand = [];
    blackjackGame.playerHand = [];
    blackjackGame.gameInProgress = true;
    
    // Clear display
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('game-result').textContent = '';
    
    // Deal initial cards
    dealCard(blackjackGame.playerHand, 'player-cards');
    dealCard(blackjackGame.dealerHand, 'dealer-cards', true); // First dealer card is hidden
    dealCard(blackjackGame.playerHand, 'player-cards');
    dealCard(blackjackGame.dealerHand, 'dealer-cards');
    
    // Update scores
    updateScores();
    
    // Show/hide buttons
    document.getElementById('start-blackjack-btn').classList.add('d-none');
    document.getElementById('game-controls').classList.remove('d-none');
    
    // Check for blackjack
    if (calculateScore(blackjackGame.playerHand) === 21) {
        playerStand();
    }
}

function createDeck() {
    const suits = ['H', 'D', 'C', 'S']; // Hearts, Diamonds, Clubs, Spades
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A']; // 0 represents 10
    
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
}

function dealCard(hand, containerId, isHidden = false) {
    if (blackjackGame.deck.length === 0) {
        blackjackGame.deck = createDeck(); // Reshuffle if deck is empty
    }
    
    const card = blackjackGame.deck.pop();
    hand.push(card);
    
    const container = document.getElementById(containerId);
    const cardSlot = document.createElement('div');
    cardSlot.className = 'card-slot';
    
    if (isHidden) {
        cardSlot.classList.add('card-back');
        cardSlot.textContent = '?';
    } else {
        const cardImg = document.createElement('img');
        const cardCode = card.value + card.suit;
        cardImg.src = `${CARD_API}${cardCode}.png`;
        cardImg.alt = `${getCardName(card.value)} of ${getSuitName(card.suit)}`;
        cardSlot.appendChild(cardImg);
    }
    
    container.appendChild(cardSlot);
    return card;
}

function getCardName(value) {
    switch(value) {
        case '0': return '10';
        case 'J': return 'Jack';
        case 'Q': return 'Queen';
        case 'K': return 'King';
        case 'A': return 'Ace';
        default: return value;
    }
}

function getSuitName(suit) {
    switch(suit) {
        case 'H': return 'Hearts';
        case 'D': return 'Diamonds';
        case 'C': return 'Clubs';
        case 'S': return 'Spades';
        default: return '';
    }
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['J', 'Q', 'K', '0'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    
    // Adjust for aces if score is over 21
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    
    return score;
}

function updateScores() {
    const playerScore = calculateScore(blackjackGame.playerHand);
    document.getElementById('player-score').textContent = playerScore;
    
    // Only show dealer's visible cards
    const visibleDealerCards = blackjackGame.dealerHand.slice(1); // Skip first hidden card
    const dealerScore = visibleDealerCards.length > 0 ? calculateScore(visibleDealerCards) : 0;
    document.getElementById('dealer-score').textContent = blackjackGame.gameInProgress ? '?' : calculateScore(blackjackGame.dealerHand);
    
    // Check for player bust
    if (playerScore > 21) {
        endGame('You busted! Dealer wins.');
    }
}

function playerHit() {
    if (!blackjackGame.gameInProgress) return;
    
    dealCard(blackjackGame.playerHand, 'player-cards');
    updateScores();
    
    // Disable double after hit
    document.getElementById('double-btn').disabled = true;
}

function playerStand() {
    if (!blackjackGame.gameInProgress) return;
    
    // Reveal dealer's hidden card
    const dealerCardsContainer = document.getElementById('dealer-cards');
    dealerCardsContainer.innerHTML = '';
    
    for (let i = 0; i < blackjackGame.dealerHand.length; i++) {
        const card = blackjackGame.playerHand[i];
        const cardSlot = document.createElement('div');
        cardSlot.className = 'card-slot';
        const cardImg = document.createElement('img');
        const cardCode = blackjackGame.dealerHand[i].value + blackjackGame.dealerHand[i].suit;
        cardImg.src = `${CARD_API}${cardCode}.png`;
        cardImg.alt = `${getCardName(blackjackGame.dealerHand[i].value)} of ${getSuitName(blackjackGame.dealerHand[i].suit)}`;
        cardSlot.appendChild(cardImg);
        dealerCardsContainer.appendChild(cardSlot);
    }
    
    // Dealer draws until score is 17 or higher
    while (calculateScore(blackjackGame.dealerHand) < 17) {
        dealCard(blackjackGame.dealerHand, 'dealer-cards');
    }
    
    // Update dealer score
    const dealerScore = calculateScore(blackjackGame.dealerHand);
    document.getElementById('dealer-score').textContent = dealerScore;
    
    // Determine winner
    const playerScore = calculateScore(blackjackGame.playerHand);
    
    if (dealerScore > 21) {
        endGame('Dealer busted! You win!');
    } else if (dealerScore > playerScore) {
        endGame('Dealer wins!');
    } else if (playerScore > dealerScore) {
        // Check for blackjack (21 with only 2 cards)
        if (playerScore === 21 && blackjackGame.playerHand.length === 2) {
            endGame('Blackjack! You win 2.5x!', 2.5);
        } else {
            endGame('You win!', 2);
        }
    } else {
        endGame('Push! It\'s a tie.', 1);
    }
}

function playerDouble() {
    if (!blackjackGame.gameInProgress) return;
    
    // Check if player has enough coins to double
    if (userData.coins < blackjackGame.betAmount) {
        alert("Not enough coins to double your bet!");
        return;
    }
    
    // Deduct additional bet
    updateUserData({
        coins: userData.coins - blackjackGame.betAmount
    });
    
    blackjackGame.betAmount *= 2;
    
    // Deal one more card and stand
    playerHit();
    if (blackjackGame.gameInProgress) { // Player didn't bust
        playerStand();
    }
}

function endGame(message, multiplier = 0) {
    blackjackGame.gameInProgress = false;
    
    document.getElementById('game-result').textContent = message;
    document.getElementById('start-blackjack-btn').classList.remove('d-none');
    document.getElementById('game-controls').classList.add('d-none');
    
    // Reset double button for next game
    document.getElementById('double-btn').disabled = false;
    
    // Award winnings if applicable
    if (multiplier > 0) {
        const winnings = Math.floor(blackjackGame.betAmount * multiplier);
        updateUserData({
            coins: userData.coins + winnings
        });
        
        // Show confetti for wins
        if (multiplier >= 1) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
}
