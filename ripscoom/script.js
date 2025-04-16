// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyADCVIINCBgvTBvClWqWI5o3SlVS47IJnw",
  authDomain: "fusioncya-cc20a.firebaseapp.com",
  databaseURL: "https://fusioncya-cc20a-default-rtdb.firebaseio.com",
  projectId: "fusioncya-cc20a",
  storageBucket: "fusioncya-cc20a.appspot.com",
  messagingSenderId: "765164293111",
  appId: "1:765164293111:web:43e051c755c4690c0c3cf2",
  measurementId: "G-4DT52P7MPB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
const { FieldValue } = firebase.firestore;

// DOM Elements
const gamesContainer = document.getElementById('gamesContainer');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');
const pinnedGamesContainer = document.getElementById('pinnedGamesContainer');
const pinnedGamesRow = document.querySelector('.pinned-games-row');
const clearPinsBtn = document.querySelector('.clear-pins');
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const glowEffect = document.querySelector('.glow-effect');
const favoritesContainer = document.getElementById('favoritesContainer');
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const dashboardUsername = document.getElementById('dashboard-username');
const updateUsernameBtn = document.getElementById('update-username-btn');
const newUsernameInput = document.getElementById('new-username');
const profilePicUpload = document.getElementById('profile-pic-upload');
const updateProfilePicBtn = document.getElementById('update-profile-pic-btn');
const profilePicPreview = document.getElementById('profile-pic-preview');
const claimRewardBtn = document.getElementById('claimRewardBtn');
const currentStreakDisplay = document.getElementById('currentStreak');
const totalCoinsEarnedDisplay = document.getElementById('totalCoinsEarned');
const shopCoinsDisplay = document.getElementById('shopCoins');
const profileCoinsDisplay = document.getElementById('profileCoins');
const profileStreakDisplay = document.getElementById('profileStreak');
const profileGamesDisplay = document.getElementById('profileGames');
const mysteryCrateBtn = document.querySelector('.btn-crate');
const shopTabs = document.querySelectorAll('.shop-tab');
const inventoryTabs = document.querySelectorAll('.inventory-tab');
const views = document.querySelectorAll('section[id$="-view"]');
const navItems = document.querySelectorAll('.nav-link');

// Game Data (same as your original)
const gamesData = [
    // ... (your existing gamesData array)
];

// Shop and Crate Items
const DAILY_REWARDS = [25, 50, 100, 125, 150, 175, 200];
const CRATE_PRICE = 200;

const CRATE_ITEMS = {
  pets: [
    { id: 'pet1', name: 'Common Pet', rarity: 'common', value: 50, probability: 0.6, image: 'images/pets/pet1.png' },
    { id: 'pet2', name: 'Rare Pet', rarity: 'rare', value: 150, probability: 0.3, image: 'images/pets/pet2.png' },
    { id: 'pet3', name: 'Epic Pet', rarity: 'epic', value: 300, probability: 0.08, image: 'images/pets/pet3.png' },
    { id: 'pet4', name: 'Legendary Pet', rarity: 'legendary', value: 600, probability: 0.02, image: 'images/pets/pet4.png' }
  ],
  knives: [
    { id: 'knife1', name: 'Basic Knife', rarity: 'common', value: 40, probability: 0.65, image: 'images/knives/knife1.png' },
    { id: 'knife2', name: 'Sharp Knife', rarity: 'rare', value: 120, probability: 0.25, image: 'images/knives/knife2.png' },
    { id: 'knife3', name: 'Golden Knife', rarity: 'epic', value: 250, probability: 0.08, image: 'images/knives/knife3.png' },
    { id: 'knife4', name: 'Diamond Knife', rarity: 'legendary', value: 500, probability: 0.02, image: 'images/knives/knife4.png' }
  ]
};

const SHOP_ITEMS = {
  pets: [
    { id: 'shop_pet1', name: 'Common Pet', price: 100, rarity: 'common', image: 'images/pets/pet1.png' },
    { id: 'shop_pet2', name: 'Rare Pet', price: 300, rarity: 'rare', image: 'images/pets/pet2.png' },
    { id: 'shop_pet3', name: 'Epic Pet', price: 600, rarity: 'epic', image: 'images/pets/pet3.png' },
    { id: 'shop_pet4', name: 'Legendary Pet', price: 1200, rarity: 'legendary', image: 'images/pets/pet4.png' }
  ],
  knives: [
    { id: 'shop_knife1', name: 'Basic Knife', price: 80, rarity: 'common', image: 'images/knives/knife1.png' },
    { id: 'shop_knife2', name: 'Sharp Knife', price: 240, rarity: 'rare', image: 'images/knives/knife2.png' },
    { id: 'shop_knife3', name: 'Golden Knife', price: 500, rarity: 'epic', image: 'images/knives/knife3.png' },
    { id: 'shop_knife4', name: 'Diamond Knife', price: 1000, rarity: 'legendary', image: 'images/knives/knife4.png' }
  ]
};

// State Management
let currentCategory = 'all';
let currentSearchTerm = '';
let currentUser = null;
let userFavorites = [];
let userInventory = { pets: [], knives: [] };

// Initialize Application
function init() {
    setupEventListeners();
    setupNavbar();
    renderAllGameRows();
    
    // Set up auth state listener
    auth.onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            updateUIForUser(user);
            loadUserData(user.uid);
            loadUserFavorites(user.uid);
            loadUserInventory(user.uid);
            checkDailyReward();
        } else {
            currentUser = null;
            userFavorites = [];
            userInventory = { pets: [], knives: [] };
            updateUIForGuest();
        }
    });
}

// ======================
// Existing Game Functions (from your code)
// ======================

// ... (All your existing game-related functions like createGameCard, renderAllGameRows, etc.)

// ======================
// Reward System
// ======================

// Claim daily reward
async function claimDailyReward() {
    if (!auth.currentUser) {
        alert("Please sign in to claim daily rewards");
        return;
    }

    const userId = auth.currentUser.uid;
    const userRef = db.collection('users').doc(userId);
    
    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();
            
            const streak = userData.streak || {
                lastClaimed: null,
                currentStreak: 0
            };
            
            const now = new Date();
            const lastClaimed = streak.lastClaimed ? streak.lastClaimed.toDate() : null;
            
            if (lastClaimed && isSameDay(lastClaimed, now)) {
                alert("You've already claimed your reward today!");
                return;
            }
            
            const isNewDay = !lastClaimed || !isYesterday(lastClaimed, now);
            const newStreak = isNewDay ? 1 : streak.currentStreak + 1;
            const rewardIndex = (newStreak - 1) % DAILY_REWARDS.length;
            const rewardAmount = DAILY_REWARDS[rewardIndex];
            
            transaction.update(userRef, {
                coins: FieldValue.increment(rewardAmount),
                streak: {
                    lastClaimed: FieldValue.serverTimestamp(),
                    currentStreak: newStreak
                },
                'stats.totalCoinsEarned': FieldValue.increment(rewardAmount),
                'stats.totalDaysLogged': FieldValue.increment(1)
            });
            
            showRewardNotification(rewardAmount, newStreak);
            updateRewardUI(newStreak);
        });
    } catch (error) {
        console.error("Error claiming daily reward:", error);
        alert("Failed to claim daily reward. Please try again.");
    }
}

// Check if daily reward is available
async function checkDailyReward() {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    try {
        const doc = await db.collection('users').doc(userId).get();
        const streak = doc.data().streak || { lastClaimed: null };
        
        if (!streak.lastClaimed || !isSameDay(streak.lastClaimed.toDate(), new Date())) {
            showDailyRewardPrompt();
        }
        
        updateRewardUI(streak.currentStreak || 0);
    } catch (error) {
        console.error("Error checking daily reward:", error);
    }
}

// Update reward UI
function updateRewardUI(streak) {
    if (!currentStreakDisplay) return;
    
    currentStreakDisplay.textContent = streak;
    
    // Update reward days display
    document.querySelectorAll('.reward-day').forEach((day, index) => {
        day.classList.remove('claimed', 'today');
        
        if (index < streak) {
            day.classList.add('claimed');
        } else if (index === streak) {
            day.classList.add('today');
        }
    });
    
    // Update progress bar
    const progress = document.querySelector('.reward-progress');
    if (progress) {
        const progressPercent = (streak / DAILY_REWARDS.length) * 100;
        progress.style.setProperty('--progress', `${progressPercent}%`);
    }
}

// Show reward notification
function showRewardNotification(amount, streak) {
    const notification = document.createElement('div');
    notification.className = 'reward-notification';
    notification.innerHTML = `
        <h3>Daily Reward Claimed!</h3>
        <p>+${amount} coins</p>
        <p>Current streak: ${streak} day${streak !== 1 ? 's' : ''}</p>
        <p>Come back tomorrow for ${DAILY_REWARDS[streak % DAILY_REWARDS.length]} coins!</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Show daily reward prompt
function showDailyRewardPrompt() {
    const rewardPrompt = document.createElement('div');
    rewardPrompt.className = 'reward-prompt';
    
    rewardPrompt.innerHTML = `
        <div class="reward-content">
            <h3>Daily Reward Available!</h3>
            <p>Claim your reward for logging in today</p>
            <button id="claimRewardBtnPrompt">Claim Now</button>
        </div>
    `;
    
    document.body.appendChild(rewardPrompt);
    
    rewardPrompt.querySelector('#claimRewardBtnPrompt').addEventListener('click', () => {
        claimDailyReward();
        rewardPrompt.remove();
    });
}

// Date helpers
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function isYesterday(date, now) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
}

// ======================
// Crate System
// ======================

// Open mystery crate
async function openMysteryCrate() {
    if (!auth.currentUser) {
        alert("Please sign in to open crates");
        return;
    }

    const userId = auth.currentUser.uid;
    const userRef = db.collection('users').doc(userId);
    
    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();
            
            if (userData.coins < CRATE_PRICE) {
                alert(`You need ${CRATE_PRICE} coins to open a mystery crate!`);
                return;
            }
            
            transaction.update(userRef, {
                coins: FieldValue.increment(-CRATE_PRICE)
            });
            
            const itemType = Math.random() < 0.6 ? 'pets' : 'knives';
            const items = CRATE_ITEMS[itemType];
            const randomItem = getRandomItem(items);
            
            transaction.update(userRef, {
                [`inventory.${itemType}`]: FieldValue.arrayUnion(randomItem.id)
            });
            
            showCrateResult(randomItem, itemType);
            loadUserInventory(userId);
        });
    } catch (error) {
        console.error("Error opening crate:", error);
        alert("Failed to open crate. Please try again.");
    }
}

// Get random item based on probabilities
function getRandomItem(items) {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const item of items) {
        cumulativeProbability += item.probability;
        if (random <= cumulativeProbability) {
            return item;
        }
    }
    
    return items[0];
}

// Show crate result
function showCrateResult(item, itemType) {
    const crateModal = document.getElementById('crateModal');
    const itemImage = document.getElementById('itemImage');
    const itemName = document.getElementById('itemName');
    const itemRarity = document.getElementById('itemRarity');
    const itemValue = document.getElementById('itemValue');
    const itemTypeDisplay = document.getElementById('itemType');
    
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemName.textContent = item.name;
    itemRarity.textContent = item.rarity;
    itemRarity.className = item.rarity;
    itemValue.textContent = item.value;
    itemTypeDisplay.textContent = itemType === 'pets' ? 'pet' : 'knife';
    
    crateModal.style.display = 'flex';
    
    // Close modal
    document.querySelector('.close-crate').addEventListener('click', () => {
        crateModal.style.display = 'none';
    });
}

// ======================
// Inventory System
// ======================

// Load user inventory
async function loadUserInventory(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        userInventory = doc.data().inventory || { pets: [], knives: [] };
        renderInventory();
    } catch (error) {
        console.error("Error loading inventory:", error);
    }
}

// Sell item from inventory
async function sellItem(itemId, itemType, itemValue) {
    if (!auth.currentUser) {
        alert("Please sign in to sell items");
        return;
    }

    const userId = auth.currentUser.uid;
    const userRef = db.collection('users').doc(userId);
    
    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const inventory = userDoc.data().inventory || { pets: [], knives: [] };
            
            if (!inventory[itemType] || !inventory[itemType].includes(itemId)) {
                alert("Item not found in inventory!");
                return;
            }
            
            transaction.update(userRef, {
                [`inventory.${itemType}`]: FieldValue.arrayRemove(itemId),
                coins: FieldValue.increment(itemValue),
                'stats.totalCoinsEarned': FieldValue.increment(itemValue)
            });
            
            loadUserInventory(userId);
        });
    } catch (error) {
        console.error("Error selling item:", error);
        alert("Failed to sell item. Please try again.");
    }
}

// Render inventory
function renderInventory() {
    const petsContainer = document.getElementById('petsInventory');
    const knivesContainer = document.getElementById('knivesInventory');
    
    if (!petsContainer || !knivesContainer) return;
    
    // Clear containers
    petsContainer.innerHTML = '';
    knivesContainer.innerHTML = '';
    
    // Render pets
    if (userInventory.pets && userInventory.pets.length > 0) {
        userInventory.pets.forEach(petId => {
            const pet = CRATE_ITEMS.pets.find(p => p.id === petId) || 
                       SHOP_ITEMS.pets.find(p => p.id === petId) ||
                       { id: petId, name: 'Unknown Pet', rarity: 'common', value: 50, image: 'images/pets/default.png' };
            
            const petCard = createInventoryCard(pet, 'pets');
            petsContainer.appendChild(petCard);
        });
    } else {
        petsContainer.innerHTML = '<p class="no-items">No pets in inventory</p>';
    }
    
    // Render knives
    if (userInventory.knives && userInventory.knives.length > 0) {
        userInventory.knives.forEach(knifeId => {
            const knife = CRATE_ITEMS.knives.find(k => k.id === knifeId) || 
                         SHOP_ITEMS.knives.find(k => k.id === knifeId) ||
                         { id: knifeId, name: 'Unknown Knife', rarity: 'common', value: 40, image: 'images/knives/default.png' };
            
            const knifeCard = createInventoryCard(knife, 'knives');
            knivesContainer.appendChild(knifeCard);
        });
    } else {
        knivesContainer.innerHTML = '<p class="no-items">No knives in inventory</p>';
    }
}

// Create inventory card
function createInventoryCard(item, itemType) {
    const card = document.createElement('div');
    card.className = `inventory-card ${item.rarity}`;
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p class="rarity">${item.rarity.toUpperCase()}</p>
        <p>Value: ${item.value} coins</p>
        <button class="btn-sell" data-id="${item.id}" data-type="${itemType}" data-value="${item.value}">
            Sell
        </button>
    `;
    
    card.querySelector('.btn-sell').addEventListener('click', (e) => {
        sellItem(e.target.dataset.id, e.target.dataset.type, parseInt(e.target.dataset.value));
    });
    
    return card;
}

// ======================
// Shop System
// ======================

// Buy item from shop
async function buyShopItem(itemId, itemType, itemPrice) {
    if (!auth.currentUser) {
        alert("Please sign in to buy items");
        return;
    }

    const userId = auth.currentUser.uid;
    const userRef = db.collection('users').doc(userId);
    
    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();
            
            if (userData.coins < itemPrice) {
                alert(`You need ${itemPrice} coins to buy this item!`);
                return;
            }
            
            transaction.update(userRef, {
                coins: FieldValue.increment(-itemPrice),
                [`inventory.${itemType}`]: FieldValue.arrayUnion(itemId),
                'stats.totalCoinsSpent': FieldValue.increment(itemPrice)
            });
            
            loadUserInventory(userId);
            updateCoinDisplays(userData.coins - itemPrice);
        });
    } catch (error) {
        console.error("Error buying item:", error);
        alert("Failed to buy item. Please try again.");
    }
}

// Render shop
function renderShop() {
    const petsContainer = document.getElementById('petsShop');
    const knivesContainer = document.getElementById('knivesShop');
    
    if (!petsContainer || !knivesContainer) return;
    
    // Clear containers
    petsContainer.innerHTML = '';
    knivesContainer.innerHTML = '';
    
    // Render pets
    SHOP_ITEMS.pets.forEach(pet => {
        const petCard = createShopCard(pet, 'pets');
        petsContainer.appendChild(petCard);
    });
    
    // Render knives
    SHOP_ITEMS.knives.forEach(knife => {
        const knifeCard = createShopCard(knife, 'knives');
        knivesContainer.appendChild(knifeCard);
    });
}

// Create shop card
function createShopCard(item, itemType) {
    const card = document.createElement('div');
    card.className = `shop-card ${item.rarity}`;
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p class="rarity">${item.rarity.toUpperCase()}</p>
        <p class="price">${item.price} coins</p>
        <button class="btn-buy" data-id="${item.id}" data-type="${itemType}" data-price="${item.price}">
            Buy
        </button>
    `;
    
    card.querySelector('.btn-buy').addEventListener('click', (e) => {
        buyShopItem(e.target.dataset.id, e.target.dataset.type, parseInt(e.target.dataset.price));
    });
    
    return card;
}

// ======================
// User Management
// ======================

// Update UI for logged in user
function updateUIForUser(user) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (signInButton) signInButton.style.display = 'none';
    if (signOutButton) signOutButton.style.display = 'block';
    
    // Update profile info
    if (usernameDisplay) usernameDisplay.textContent = user.displayName || 'User';
    if (dashboardUsername) dashboardUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        if (profilePic) profilePic.src = user.photoURL;
        if (profilePicPreview) profilePicPreview.src = user.photoURL;
    }
    
    // Load user data
    loadUserData(user.uid);
}

// Update UI for guest
function updateUIForGuest() {
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    if (signInButton) signInButton.style.display = 'block';
    if (signOutButton) signOutButton.style.display = 'none';
    
    if (usernameDisplay) usernameDisplay.textContent = 'Guest';
    if (profilePic) profilePic.src = 'https://via.placeholder.com/40';
    if (profilePicPreview) profilePicPreview.src = 'https://via.placeholder.com/150';
    
    // Reset displays
    if (currentStreakDisplay) currentStreakDisplay.textContent = '0';
    if (totalCoinsEarnedDisplay) totalCoinsEarnedDisplay.textContent = '0';
    if (shopCoinsDisplay) shopCoinsDisplay.textContent = '0';
    if (profileCoinsDisplay) profileCoinsDisplay.textContent = '0';
    if (profileStreakDisplay) profileStreakDisplay.textContent = '0';
    if (profileGamesDisplay) profileGamesDisplay.textContent = '0';
}

// Load user data
async function loadUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const userData = doc.data();
            
            // Update username
            if (userData.username) {
                if (usernameDisplay) usernameDisplay.textContent = userData.username;
                if (dashboardUsername) dashboardUsername.textContent = userData.username;
            }
            
            // Update profile picture
            if (userData.photoBase64) {
                if (profilePic) profilePic.src = userData.photoBase64;
                if (profilePicPreview) profilePicPreview.src = userData.photoBase64;
            }
            
            // Update coin displays
            updateCoinDisplays(userData.coins || 0);
            
            // Update streak and stats
            if (currentStreakDisplay) {
                currentStreakDisplay.textContent = userData.streak?.currentStreak || 0;
            }
            
            if (totalCoinsEarnedDisplay) {
                totalCoinsEarnedDisplay.textContent = userData.stats?.totalCoinsEarned || 0;
            }
            
            if (profileStreakDisplay) {
                profileStreakDisplay.textContent = userData.streak?.currentStreak || 0;
            }
            
            if (profileGamesDisplay) {
                profileGamesDisplay.textContent = userData.stats?.gamesPlayed || 0;
            }
            
            // Update reward UI
            updateRewardUI(userData.streak?.currentStreak || 0);
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Update coin displays
function updateCoinDisplays(coins) {
    if (shopCoinsDisplay) shopCoinsDisplay.textContent = coins;
    if (profileCoinsDisplay) profileCoinsDisplay.textContent = coins;
}

// Create user document
async function createUserDocument(user) {
    try {
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            username: user.displayName || 'user' + user.uid.substring(0, 4),
            photoBase64: user.photoURL || '',
            coins: 100,
            streak: {
                lastClaimed: null,
                currentStreak: 0
            },
            inventory: {
                pets: [],
                knives: []
            },
            stats: {
                totalCoinsEarned: 0,
                totalDaysLogged: 0,
                gamesPlayed: 0,
                totalCoinsSpent: 0
            },
            createdAt: FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error creating user document:", error);
    }
}

// ======================
// Event Listeners
// ======================

function setupEventListeners() {
    // Existing event listeners from your code
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                renderAllGameRows(category, searchInput.value);
            });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeCategory = document.querySelector('.tab-btn.active').dataset.category;
            renderAllGameRows(activeCategory, searchInput.value);
        });
    }
    
    if (clearPinsBtn) {
        clearPinsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to clear all favorites?')) {
                clearAllFavorites();
            }
        });
    }

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navbar.classList.toggle('closed');
            const icon = this.querySelector('i');
            if (navbar.classList.contains('closed')) {
                icon.classList.replace('bx-menu', 'bx-menu-alt-right');
            } else {
                icon.classList.replace('bx-menu-alt-right', 'bx-menu');
            }
        });
    }

    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                updateGlowEffect(this);
            });
        });
    }

    // Auth listeners
    if (signInButton) {
        signInButton.addEventListener('click', function() {
            auth.signInWithPopup(provider)
                .then(function(result) {
                    if (result.additionalUserInfo.isNewUser) {
                        return createUserDocument(result.user);
                    }
                })
                .catch(function(error) {
                    console.error('Sign in error:', error);
                    alert('Sign in failed: ' + error.message);
                });
        });
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', function() {
            auth.signOut()
                .catch(function(error) {
                    console.error('Sign out error:', error);
                });
        });
    }

    // Profile update listeners
    if (updateUsernameBtn) {
        updateUsernameBtn.addEventListener('click', function() {
            const newUsername = newUsernameInput.value.trim();
            if (newUsername.length < 3) {
                alert('Username must be at least 3 characters');
                return;
            }

            const userId = auth.currentUser.uid;
            db.collection('users').doc(userId).update({
                username: newUsername
            })
            .then(function() {
                if (usernameDisplay) usernameDisplay.textContent = newUsername;
                if (dashboardUsername) dashboardUsername.textContent = newUsername;
                if (newUsernameInput) newUsernameInput.value = '';
                alert('Username updated!');
            })
            .catch(function(error) {
                console.error('Error updating username:', error);
                alert('Update failed: ' + error.message);
            });
        });
    }

    if (profilePicUpload) {
        profilePicUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 500 * 1024) {
                alert('Image must be smaller than 500KB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                if (profilePicPreview) profilePicPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    if (updateProfilePicBtn) {
        updateProfilePicBtn.addEventListener('click', function() {
            const file = profilePicUpload.files[0];
            if (!file) {
                alert('Please select an image first');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Image = event.target.result;
                const userId = auth.currentUser.uid;
                
                db.collection('users').doc(userId).update({
                    photoBase64: base64Image
                })
                .then(function() {
                    if (profilePic) profilePic.src = base64Image;
                    if (profilePicPreview) profilePicPreview.src = base64Image;
                    if (profilePicUpload) profilePicUpload.value = '';
                    alert('Profile picture updated!');
                })
                .catch(function(error) {
                    console.error('Error saving image:', error);
                    alert('Upload failed: ' + error.message);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // New reward system listeners
    if (claimRewardBtn) {
        claimRewardBtn.addEventListener('click', claimDailyReward);
    }

    if (mysteryCrateBtn) {
        mysteryCrateBtn.addEventListener('click', openMysteryCrate);
    }

    // Shop and inventory tab listeners
    if (shopTabs) {
        shopTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                shopTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabId = this.dataset.tab;
                document.querySelectorAll('.shop-items').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}Shop`).classList.add('active');
            });
        });
    }

    if (inventoryTabs) {
        inventoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                inventoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabId = this.dataset.tab;
                document.querySelectorAll('.inventory-items').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}Inventory`).classList.add('active');
            });
        });
    }

    // Navigation view switching
    if (navItems) {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const viewId = this.textContent.trim().toLowerCase();
                switchView(viewId);
            });
        });
    }
}

// Switch between views
function switchView(viewName) {
    // Hide all views
    views.forEach(view => {
        view.classList.remove('active-view');
    });

    // Show selected view
    let viewId;
    switch(viewName) {
        case 'home':
            viewId = 'home-view';
            break;
        case 'games':
            viewId = 'games-view';
            break;
        case 'shop':
            viewId = 'shop-view';
            renderShop();
            break;
        case 'inventory':
            viewId = 'inventory-view';
            renderInventory();
            break;
        case 'rewards':
            viewId = 'rewards-view';
            break;
        case 'profile':
            viewId = 'profile-view';
            break;
        default:
            viewId = 'home-view';
    }

    document.getElementById(viewId).classList.add('active-view');
}

// Initialize glow effect
function updateGlowEffect(element, isHover = false) {
    if (!element || !glowEffect) return;
    
    const linkRect = element.getBoundingClientRect();
    const containerRect = element.parentElement.getBoundingClientRect();
    
    const glowColor = element.getAttribute('data-glow-color') || '#4fc3f7';
    const y = linkRect.top - containerRect.top;
    
    glowEffect.style.top = `${y}px`;
    glowEffect.style.backgroundColor = glowColor;
    glowEffect.style.opacity = isHover ? '0.7' : '0.5';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);