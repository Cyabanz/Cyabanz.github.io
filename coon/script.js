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

// Initialize Firebase with persistence
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// Enable Firestore offline persistence
db.enablePersistence()
  .catch((err) => {
      if (err.code === 'failed-precondition') {
          console.warn("Persistence enabled in another tab");
      } else if (err.code === 'unimplemented') {
          console.warn("Browser doesn't support all persistence features");
      }
  });

// Game Constants
const ITEM_TYPES = {
    PET: 'pet',
    KNIFE: 'knife'
};

const RARITIES = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

const RARITY_COLORS = {
    [RARITIES.COMMON]: '#6c757d',
    [RARITIES.UNCOMMON]: '#28a745',
    [RARITIES.RARE]: '#17a2b8',
    [RARITIES.EPIC]: '#6f42c1',
    [RARITIES.LEGENDARY]: '#fd7e14'
};

const LOOTBOX_TIERS = {
    FREE: 'free',
    BRONZE: 'bronze',
    SILVER: 'silver',
    GOLD: 'gold'
};

const LOOTBOX_PRICES = {
    [LOOTBOX_TIERS.BRONZE]: 100,
    [LOOTBOX_TIERS.SILVER]: 250,
    [LOOTBOX_TIERS.GOLD]: 500
};

// Item Database
const ITEMS_DATABASE = {
    [ITEM_TYPES.PET]: [
        { id: 'pet1', name: 'Common Cat', rarity: RARITIES.COMMON, image: 'https://via.placeholder.com/150?text=Common+Cat', value: 20, description: 'A regular house cat' },
        { id: 'pet2', name: 'Uncommon Dog', rarity: RARITIES.UNCOMMON, image: 'https://via.placeholder.com/150?text=Uncommon+Dog', value: 50, description: 'A loyal companion' },
        { id: 'pet3', name: 'Rare Parrot', rarity: RARITIES.RARE, image: 'https://via.placeholder.com/150?text=Rare+Parrot', value: 100, description: 'Colorful and talkative' },
        { id: 'pet4', name: 'Epic Dragon', rarity: RARITIES.EPIC, image: 'https://via.placeholder.com/150?text=Epic+Dragon', value: 250, description: 'A majestic fire-breathing beast' },
        { id: 'pet5', name: 'Legendary Phoenix', rarity: RARITIES.LEGENDARY, image: 'https://via.placeholder.com/150?text=Legendary+Phoenix', value: 500, description: 'Reborn from its ashes' }
    ],
    [ITEM_TYPES.KNIFE]: [
        { id: 'knife1', name: 'Common Dagger', rarity: RARITIES.COMMON, image: 'https://via.placeholder.com/150?text=Common+Dagger', value: 15, description: 'A basic sharp blade' },
        { id: 'knife2', name: 'Uncommon Hunting Knife', rarity: RARITIES.UNCOMMON, image: 'https://via.placeholder.com/150?text=Uncommon+Hunting+Knife', value: 40, description: 'Good for survival' },
        { id: 'knife3', name: 'Rare Butterfly Knife', rarity: RARITIES.RARE, image: 'https://via.placeholder.com/150?text=Rare+Butterfly+Knife', value: 90, description: 'Flips elegantly' },
        { id: 'knife4', name: 'Epic Karambit', rarity: RARITIES.EPIC, image: 'https://via.placeholder.com/150?text=Epic+Karambit', value: 200, description: 'Curved for maximum damage' },
        { id: 'knife5', name: 'Legendary Excalibur', rarity: RARITIES.LEGENDARY, image: 'https://via.placeholder.com/150?text=Legendary+Excalibur', value: 450, description: 'The sword of kings' }
    ]
};

// Game State
let currentUser = null;
let userData = {
    coins: 100,
    streak: 0,
    lastLogin: null,
    inventory: [],
    lootBoxesOpened: 0,
    freeBoxAvailable: true
};

// DOM Elements
const elements = {
    signInButton: document.getElementById('signInButton'),
    signOutButton: document.getElementById('signOutButton'),
    usernameDisplay: document.getElementById('username-display'),
    profilePic: document.getElementById('profile-pic'),
    loginView: document.getElementById('login-view'),
    dashboardView: document.getElementById('dashboard-view'),
    dashboardUsername: document.getElementById('dashboard-username'),
    updateUsernameBtn: document.getElementById('update-username-btn'),
    newUsernameInput: document.getElementById('new-username'),
    profilePicUpload: document.getElementById('profile-pic-upload'),
    uploadProfilePicBtn: document.getElementById('upload-profile-pic-btn'),
    profilePicPreview: document.getElementById('profile-pic-preview'),
    coinBalance: document.getElementById('coin-balance'),
    claimDailyBtn: document.getElementById('claim-daily-btn'),
    currentStreak: document.getElementById('current-streak'),
    streakProgress: document.getElementById('streak-progress'),
    nextStreakReward: document.getElementById('next-streak-reward'),
    freeBoxTimer: document.getElementById('free-box-timer'),
    petsInventory: document.getElementById('pets-inventory'),
    knivesInventory: document.getElementById('knives-inventory'),
    shopPets: document.getElementById('shop-pets'),
    shopKnives: document.getElementById('shop-knives'),
    rewardModal: new bootstrap.Modal(document.getElementById('rewardModal')),
    rewardImage: document.getElementById('reward-image'),
    rewardName: document.getElementById('reward-name'),
    rewardDescription: document.getElementById('reward-description'),
    rewardRarityBadge: document.getElementById('reward-rarity-badge'),
    sellRewardBtn: document.getElementById('sell-reward-btn'),
    sellPrice: document.getElementById('sell-price'),
    confirmationModal: new bootstrap.Modal(document.getElementById('confirmationModal')),
    confirmationModalTitle: document.getElementById('confirmationModalTitle'),
    confirmationModalBody: document.getElementById('confirmationModalBody'),
    confirmActionBtn: document.getElementById('confirmActionBtn')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    setupAuthListener();
    setupEventListeners();
    initializeShop();
}

function setupAuthListener() {
    auth.onAuthStateChanged(async (user) => {
        try {
            if (user) {
                currentUser = user;
                updateUIForUser(user);
                await loadUserData(user.uid);
                startFreeBoxTimer();
            } else {
                currentUser = null;
                updateUIForGuest();
            }
        } catch (error) {
            console.error("Auth state error:", error);
            showError("Error initializing session. Please refresh.");
        }
    });
}

function setupEventListeners() {
    elements.signInButton.addEventListener('click', signInWithGoogle);
    elements.signOutButton.addEventListener('click', signOut);
    elements.updateUsernameBtn.addEventListener('click', updateUsername);
    elements.uploadProfilePicBtn.addEventListener('click', () => elements.profilePicUpload.click());
    elements.profilePicUpload.addEventListener('change', handleProfilePicUpload);
    elements.claimDailyBtn.addEventListener('click', claimDailyReward);
    elements.sellRewardBtn.addEventListener('click', sellRewardItem);
    
    // Delegated event listeners
    document.addEventListener('click', handleDelegatedEvents);
}

function handleDelegatedEvents(e) {
    // Loot box opening
    if (e.target.closest('.open-lootbox-btn')) {
        const btn = e.target.closest('.open-lootbox-btn');
        openLootBox(btn.dataset.tier);
    }
    
    // Item selling
    if (e.target.closest('.sell-item-btn')) {
        const btn = e.target.closest('.sell-item-btn');
        confirmSellItem(btn.dataset.itemId);
    }
    
    // Item buying
    if (e.target.closest('.buy-item-btn')) {
        const btn = e.target.closest('.buy-item-btn');
        confirmBuyItem(btn.dataset.itemId);
    }
}

// Authentication Functions
async function signInWithGoogle() {
    try {
        elements.signInButton.disabled = true;
        const result = await auth.signInWithPopup(provider);
        
        if (result.additionalUserInfo.isNewUser) {
            await createUserDocument(result.user);
        }
    } catch (error) {
        console.error("Sign in error:", error);
        showError(`Sign in failed: ${error.message}`);
    } finally {
        elements.signInButton.disabled = false;
    }
}

async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Sign out error:", error);
        showError("Failed to sign out");
    }
}

// User Data Functions
async function createUserDocument(user) {
    const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || `User${user.uid.substring(0, 4)}`,
        photoURL: user.photoURL || '',
        coins: 100,
        streak: 0,
        lastLogin: null,
        inventory: [],
        lootBoxesOpened: 0,
        freeBoxAvailable: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('users').doc(user.uid).set(userDoc);
        Object.assign(userData, userDoc);
        updateUIWithUserData();
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

async function loadUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        
        if (!doc.exists) {
            throw new Error("User document not found");
        }
        
        const data = doc.data();
        userData = {
            coins: data.coins || 0,
            streak: data.streak || 0,
            lastLogin: data.lastLogin?.toDate() || null,
            inventory: data.inventory || [],
            lootBoxesOpened: data.lootBoxesOpened || 0,
            freeBoxAvailable: data.freeBoxAvailable ?? true
        };
        
        updateUIWithUserData();
        checkFreeBoxReset();
    } catch (error) {
        console.error("Error loading user data:", error);
        throw error;
    }
}

async function updateUserData() {
    if (!currentUser) return false;

    try {
        const updateData = {
            coins: userData.coins,
            streak: userData.streak,
            inventory: userData.inventory,
            lootBoxesOpened: userData.lootBoxesOpened,
            freeBoxAvailable: userData.freeBoxAvailable
        };
        
        if (userData.lastLogin) {
            updateData.lastLogin = firebase.firestore.Timestamp.fromDate(userData.lastLogin);
        }
        
        await db.collection('users').doc(currentUser.uid).update(updateData);
        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

// UI Functions
function updateUIForUser(user) {
    elements.loginView.style.display = 'none';
    elements.dashboardView.style.display = 'block';
    elements.usernameDisplay.textContent = user.displayName || 'User';
    elements.dashboardUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        elements.profilePic.src = user.photoURL;
        elements.profilePicPreview.src = user.photoURL;
    }
}

function updateUIForGuest() {
    elements.loginView.style.display = 'block';
    elements.dashboardView.style.display = 'none';
    elements.usernameDisplay.textContent = 'Guest';
    elements.profilePic.src = 'https://via.placeholder.com/40';
    elements.profilePicPreview.src = 'https://via.placeholder.com/150';
}

function updateUIWithUserData() {
    // Update coin balance
    elements.coinBalance.textContent = userData.coins;
    
    // Update streak
    elements.currentStreak.textContent = userData.streak;
    const nextRewardDay = Math.min(7, userData.streak + 1);
    elements.nextStreakReward.textContent = nextRewardDay;
    elements.streakProgress.style.width = `${(userData.streak % 7) * (100 / 7)}%`;
    
    // Update inventory
    renderInventory();
    
    // Update free box availability
    updateFreeBoxUI();
}

async function updateUsername() {
    const newUsername = elements.newUsernameInput.value.trim();
    if (newUsername.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }

    try {
        elements.updateUsernameBtn.disabled = true;
        await db.collection('users').doc(currentUser.uid).update({
            displayName: newUsername
        });
        
        elements.usernameDisplay.textContent = newUsername;
        elements.dashboardUsername.textContent = newUsername;
        elements.newUsernameInput.value = '';
        showSuccess('Username updated!');
    } catch (error) {
        console.error("Username update error:", error);
        showError('Failed to update username');
    } finally {
        elements.updateUsernameBtn.disabled = false;
    }
}

async function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
        showError('Image must be smaller than 500KB');
        return;
    }

    try {
        const reader = new FileReader();
        const imageUrl = await new Promise((resolve, reject) => {
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        elements.profilePicPreview.src = imageUrl;
        
        await db.collection('users').doc(currentUser.uid).update({
            photoURL: imageUrl
        });
        
        elements.profilePic.src = imageUrl;
        showSuccess('Profile picture updated!');
    } catch (error) {
        console.error("Profile pic error:", error);
        showError('Failed to update profile picture');
    }
}

// Reward System Functions
async function claimDailyReward() {
    if (!currentUser) return;
    
    try {
        elements.claimDailyBtn.disabled = true;
        
        const now = new Date();
        const lastLogin = userData.lastLogin;
        let newStreak = userData.streak;
        let coinsEarned = 50; // Base reward
        
        // Check streak
        if (lastLogin) {
            if (isSameDay(now, lastLogin)) {
                showError('You already claimed your reward today!');
                return;
            }
            newStreak = isYesterday(lastLogin, now) ? newStreak + 1 : 1;
        } else {
            newStreak = 1;
        }
        
        // Calculate bonus
        const streakBonus = Math.floor(newStreak / 7) * 100;
        coinsEarned += streakBonus;
        
        // Update state
        userData.coins += coinsEarned;
        userData.streak = newStreak;
        userData.lastLogin = now;
        userData.freeBoxAvailable = true;
        
        // Update database
        await updateUserData();
        updateUIWithUserData();
        
        // Show rewards
        let message = `You earned ${coinsEarned} coins!`;
        if (streakBonus > 0) {
            message += ` (Including ${streakBonus} bonus coins for your ${newStreak}-day streak!)`;
        }
        showSuccess(message);
        showSuccess('You received a free loot box for today!');
    } catch (error) {
        console.error("Daily reward error:", error);
        showError('Failed to claim daily reward');
    } finally {
        elements.claimDailyBtn.disabled = false;
    }
}

function startFreeBoxTimer() {
    updateFreeBoxTimer();
    setInterval(updateFreeBoxTimer, 1000);
}

function updateFreeBoxTimer() {
    if (!userData.lastLogin) {
        elements.freeBoxTimer.textContent = '00:00:00';
        return;
    }
    
    const now = new Date();
    const nextReset = getNextResetTime(userData.lastLogin);
    
    if (now >= nextReset) {
        elements.freeBoxTimer.textContent = '00:00:00';
        checkFreeBoxReset();
        return;
    }
    
    const diff = nextReset - now;
    elements.freeBoxTimer.textContent = formatTimeRemaining(diff);
}

function checkFreeBoxReset() {
    if (!userData.lastLogin) return;
    
    const now = new Date();
    if (!isSameDay(now, userData.lastLogin) && !userData.freeBoxAvailable) {
        userData.freeBoxAvailable = true;
        updateUserData().then(updateFreeBoxUI);
    }
}

function updateFreeBoxUI() {
    const freeBoxBtn = document.querySelector('.open-lootbox-btn[data-tier="free"]');
    if (freeBoxBtn) {
        freeBoxBtn.disabled = !userData.freeBoxAvailable;
        freeBoxBtn.innerHTML = userData.freeBoxAvailable ? 
            '<i class="fas fa-box-open me-1"></i>Open Now' : 
            '<i class="fas fa-check me-1"></i>Claimed Today';
    }
}

// Loot Box Functions
async function openLootBox(tier) {
    if (!currentUser) return;
    
    const boxBtn = document.querySelector(`.open-lootbox-btn[data-tier="${tier}"]`);
    if (!boxBtn) return;
    
    try {
        boxBtn.disabled = true;
        
        // Validate
        if (tier === LOOTBOX_TIERS.FREE && !userData.freeBoxAvailable) {
            showError('You already opened your free box today!');
            return;
        }
        
        if (tier !== LOOTBOX_TIERS.FREE && userData.coins < LOOTBOX_PRICES[tier]) {
            showError(`You need ${LOOTBOX_PRICES[tier]} coins to open this box!`);
            return;
        }
        
        // Deduct coins if paid box
        if (tier !== LOOTBOX_TIERS.FREE) {
            userData.coins -= LOOTBOX_PRICES[tier];
        } else {
            userData.freeBoxAvailable = false;
        }
        
        userData.lootBoxesOpened++;
        
        // Get random item
        const item = getRandomItemFromLootBox(tier);
        userData.inventory.push({
            id: item.id,
            type: item.type,
            obtainedAt: new Date()
        });
        
        // Update database
        await updateUserData();
        
        // Animate and show reward
        const boxElement = document.getElementById(`${tier}-box`);
        if (boxElement) {
            boxElement.classList.add('shake');
            setTimeout(() => {
                boxElement.classList.remove('shake');
                showReward(item);
            }, 1000);
        } else {
            showReward(item);
        }
    } catch (error) {
        console.error("Loot box error:", error);
        showError('Failed to open loot box');
    } finally {
        boxBtn.disabled = false;
    }
}

function getRandomItemFromLootBox(tier) {
    const rarity = determineRarity(tier);
    const eligibleItems = [...ITEMS_DATABASE[ITEM_TYPES.PET], ...ITEMS_DATABASE[ITEM_TYPES.KNIFE]]
        .filter(item => item.rarity === rarity);
    
    return eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
}

function determineRarity(tier) {
    const roll = Math.random() * 100;
    
    if (tier === LOOTBOX_TIERS.FREE) {
        if (roll < 60) return RARITIES.COMMON;
        if (roll < 90) return RARITIES.UNCOMMON;
        return RARITIES.RARE;
    } 
    if (tier === LOOTBOX_TIERS.BRONZE) {
        if (roll < 50) return RARITIES.COMMON;
        if (roll < 85) return RARITIES.UNCOMMON;
        if (roll < 98) return RARITIES.RARE;
        return RARITIES.EPIC;
    }
    if (tier === LOOTBOX_TIERS.SILVER) {
        if (roll < 30) return RARITIES.COMMON;
        if (roll < 70) return RARITIES.UNCOMMON;
        if (roll < 90) return RARITIES.RARE;
        if (roll < 99) return RARITIES.EPIC;
        return RARITIES.LEGENDARY;
    }
    if (tier === LOOTBOX_TIERS.GOLD) {
        if (roll < 10) return RARITIES.COMMON;
        if (roll < 35) return RARITIES.UNCOMMON;
        if (roll < 70) return RARITIES.RARE;
        if (roll < 95) return RARITIES.EPIC;
        return RARITIES.LEGENDARY;
    }
    return RARITIES.COMMON;
}

function showReward(item) {
    elements.rewardImage.src = item.image;
    elements.rewardName.textContent = item.name;
    elements.rewardDescription.textContent = item.description;
    
    elements.rewardRarityBadge.textContent = item.rarity.toUpperCase();
    elements.rewardRarityBadge.className = `badge badge-${item.rarity}`;
    
    elements.sellRewardBtn.style.display = 'block';
    elements.sellPrice.textContent = Math.floor(item.value * 0.7);
    elements.sellRewardBtn.dataset.itemId = item.id;
    
    if (item.rarity !== RARITIES.COMMON && item.rarity !== RARITIES.UNCOMMON) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    elements.rewardModal.show();
}

async function sellRewardItem() {
    const itemId = elements.sellRewardBtn.dataset.itemId;
    const item = findItemInDatabase(itemId);
    
    if (!item) return;
    
    try {
        // Calculate sell price
        const sellPrice = Math.floor(item.value * 0.7);
        userData.coins += sellPrice;
        
        // Remove from inventory
        const itemIndex = userData.inventory.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            userData.inventory.splice(itemIndex, 1);
        }
        
        // Update database
        await updateUserData();
        
        // Update UI
        elements.rewardModal.hide();
        showSuccess(`Sold ${item.name} for ${sellPrice} coins!`);
    } catch (error) {
        console.error("Sell error:", error);
        showError('Failed to sell item');
    }
}

// Inventory Functions
function renderInventory() {
    renderPetsInventory();
    renderKnivesInventory();
}

function renderPetsInventory() {
    const pets = getInventoryItems(ITEM_TYPES.PET);
    elements.petsInventory.innerHTML = pets.length ? 
        pets.map(renderInventoryItem).join('') : 
        renderEmptyInventory(ITEM_TYPES.PET);
}

function renderKnivesInventory() {
    const knives = getInventoryItems(ITEM_TYPES.KNIFE);
    elements.knivesInventory.innerHTML = knives.length ? 
        knives.map(renderInventoryItem).join('') : 
        renderEmptyInventory(ITEM_TYPES.KNIFE);
}

function getInventoryItems(type) {
    return userData.inventory
        .filter(item => item.type === type)
        .map(invItem => findItemInDatabase(invItem.id))
        .filter(Boolean);
}

function renderInventoryItem(item) {
    return `
        <div class="col-md-4 col-6">
            <div class="inventory-item card">
                <img src="${item.image}" class="card-img-top item-image" alt="${item.name}">
                <div class="card-body item-details">
                    <h5 class="card-title">${item.name}</h5>
                    <span class="badge badge-${item.rarity}">${item.rarity.toUpperCase()}</span>
                    <p class="card-text mt-2">${item.description}</p>
                    <button class="btn btn-outline-danger w-100 sell-item-btn" data-item-id="${item.id}">
                        <i class="fas fa-coins me-1"></i>Sell for ${Math.floor(item.value * 0.7)} coins
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderEmptyInventory(type) {
    return `
        <div class="col-12 text-center py-5">
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <p class="text-muted">No ${type}s in your inventory yet</p>
        </div>
    `;
}

// Shop Functions
function initializeShop() {
    renderShopPets();
    renderShopKnives();
}

function renderShopPets() {
    elements.shopPets.innerHTML = ITEMS_DATABASE[ITEM_TYPES.PET].map(renderShopItem).join('');
}

function renderShopKnives() {
    elements.shopKnives.innerHTML = ITEMS_DATABASE[ITEM_TYPES.KNIFE].map(renderShopItem).join('');
}

function renderShopItem(item) {
    return `
        <div class="col-md-4 col-6">
            <div class="shop-item card">
                <img src="${item.image}" class="card-img-top item-image" alt="${item.name}">
                <div class="card-body item-details">
                    <h5 class="card-title">${item.name}</h5>
                    <span class="badge badge-${item.rarity}">${item.rarity.toUpperCase()}</span>
                    <p class="card-text mt-2">${item.description}</p>
                    <button class="btn btn-primary w-100 buy-item-btn" data-item-id="${item.id}">
                        <i class="fas fa-shopping-cart me-1"></i>Buy for ${item.value} coins
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Transaction Functions
function confirmSellItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) return;
    
    elements.confirmationModalTitle.textContent = 'Confirm Sale';
    elements.confirmationModalBody.innerHTML = `
        <p>Sell <strong>${item.name}</strong> for ${Math.floor(item.value * 0.7)} coins?</p>
        <p>This action cannot be undone.</p>
    `;
    
    elements.confirmActionBtn.onclick = () => {
        sellItem(itemId);
        elements.confirmationModal.hide();
    };
    
    elements.confirmationModal.show();
}

function confirmBuyItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) return;
    
    if (userData.coins < item.value) {
        showError(`You need ${item.value - userData.coins} more coins to buy this!`);
        return;
    }
    
    elements.confirmationModalTitle.textContent = 'Confirm Purchase';
    elements.confirmationModalBody.innerHTML = `
        <p>Buy <strong>${item.name}</strong> for ${item.value} coins?</p>
        <p>You'll have ${userData.coins - item.value} coins remaining.</p>
    `;
    
    elements.confirmActionBtn.onclick = async () => {
        elements.confirmationModal.hide();
        await buyItem(itemId);
    };
    
    elements.confirmationModal.show();
}

async function buyItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) {
        showError("Item not found");
        return;
    }

    const buyButton = document.querySelector(`.buy-item-btn[data-item-id="${itemId}"]`);
    if (buyButton) buyButton.disabled = true;

    try {
        // Verify funds locally first
        if (userData.coins < item.value) {
            throw new Error(`Not enough coins. Need ${item.value - userData.coins} more.`);
        }

        // Use transaction for atomic operation
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(currentUser.uid);
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new Error("User not found");
            }

            const currentCoins = userDoc.data().coins;
            if (currentCoins < item.value) {
                throw new Error(`Not enough coins. You have ${currentCoins}, need ${item.value}`);
            }

            // Create new inventory array
            const newInventory = [...(userDoc.data().inventory || [])];
            newInventory.push({
                id: item.id,
                type: item.type,
                obtainedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Perform transaction
            transaction.update(userRef, {
                coins: firebase.firestore.FieldValue.increment(-item.value),
                inventory: newInventory
            });

            // Update local state
            userData.coins -= item.value;
            userData.inventory = newInventory;
        });

        // Update UI
        updateUIWithUserData();
        showSuccess(`Purchased ${item.name}!`);
    } catch (error) {
        console.error("Purchase error:", error);
        
        if (error.message.includes("Not enough coins")) {
            showError(error.message);
        } else {
            showError("Purchase failed. Please try again.");
        }

        // Reload data to ensure sync
        await loadUserData(currentUser.uid);
    } finally {
        if (buyButton) buyButton.disabled = false;
    }
}

// Helper Functions
function findItemInDatabase(itemId) {
    return [...ITEMS_DATABASE[ITEM_TYPES.PET], ...ITEMS_DATABASE[ITEM_TYPES.KNIFE]]
        .find(item => item.id === itemId);
}

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

function getNextResetTime(lastLogin) {
    const nextReset = new Date(lastLogin);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);
    return nextReset;
}

function formatTimeRemaining(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showError(message) {
    alert(`Error: ${message}`);
}

function showSuccess(message) {
    alert(`Success: ${message}`);
}
