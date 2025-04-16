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

// Game Data
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

const RARITY_WEIGHTS = {
    [RARITIES.COMMON]: 50,
    [RARITIES.UNCOMMON]: 30,
    [RARITIES.RARE]: 15,
    [RARITIES.EPIC]: 4,
    [RARITIES.LEGENDARY]: 1
};

const LOOTBOX_TIERS = {
    FREE: 'free',
    BRONZE: 'bronze',
    SILVER: 'silver',
    GOLD: 'gold'
};

const LOOTBOX_DROP_RATES = {
    [LOOTBOX_TIERS.FREE]: {
        [RARITIES.COMMON]: 60,
        [RARITIES.UNCOMMON]: 30,
        [RARITIES.RARE]: 10,
        [RARITIES.EPIC]: 0,
        [RARITIES.LEGENDARY]: 0
    },
    [LOOTBOX_TIERS.BRONZE]: {
        [RARITIES.COMMON]: 50,
        [RARITIES.UNCOMMON]: 35,
        [RARITIES.RARE]: 13,
        [RARITIES.EPIC]: 2,
        [RARITIES.LEGENDARY]: 0
    },
    [LOOTBOX_TIERS.SILVER]: {
        [RARITIES.COMMON]: 30,
        [RARITIES.UNCOMMON]: 40,
        [RARITIES.RARE]: 20,
        [RARITIES.EPIC]: 9,
        [RARITIES.LEGENDARY]: 1
    },
    [LOOTBOX_TIERS.GOLD]: {
        [RARITIES.COMMON]: 10,
        [RARITIES.UNCOMMON]: 25,
        [RARITIES.RARE]: 35,
        [RARITIES.EPIC]: 25,
        [RARITIES.LEGENDARY]: 5
    }
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
const uploadProfilePicBtn = document.getElementById('upload-profile-pic-btn');
const profilePicPreview = document.getElementById('profile-pic-preview');
const coinBalance = document.getElementById('coin-balance');
const claimDailyBtn = document.getElementById('claim-daily-btn');
const currentStreak = document.getElementById('current-streak');
const streakProgress = document.getElementById('streak-progress');
const nextStreakReward = document.getElementById('next-streak-reward');
const freeBoxTimer = document.getElementById('free-box-timer');
const petsInventory = document.getElementById('pets-inventory');
const knivesInventory = document.getElementById('knives-inventory');
const shopPets = document.getElementById('shop-pets');
const shopKnives = document.getElementById('shop-knives');
const rewardModal = new bootstrap.Modal(document.getElementById('rewardModal'));
const rewardImage = document.getElementById('reward-image');
const rewardName = document.getElementById('reward-name');
const rewardDescription = document.getElementById('reward-description');
const rewardRarityBadge = document.getElementById('reward-rarity-badge');
const sellRewardBtn = document.getElementById('sell-reward-btn');
const sellPrice = document.getElementById('sell-price');
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const confirmationModalTitle = document.getElementById('confirmationModalTitle');
const confirmationModalBody = document.getElementById('confirmationModalBody');
const confirmActionBtn = document.getElementById('confirmActionBtn');

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auth state listener
    auth.onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            updateUIForUser(user);
            loadUserData(user.uid);
            startFreeBoxTimer();
        } else {
            currentUser = null;
            updateUIForGuest();
        }
    });

    // Event listeners
    signInButton.addEventListener('click', signInWithGoogle);
    signOutButton.addEventListener('click', signOut);
    updateUsernameBtn.addEventListener('click', updateUsername);
    uploadProfilePicBtn.addEventListener('click', () => profilePicUpload.click());
    profilePicUpload.addEventListener('change', handleProfilePicUpload);
    claimDailyBtn.addEventListener('click', claimDailyReward);
    
    // Loot box event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('open-lootbox-btn') || e.target.closest('.open-lootbox-btn')) {
            const btn = e.target.classList.contains('open-lootbox-btn') ? e.target : e.target.closest('.open-lootbox-btn');
            const tier = btn.dataset.tier;
            openLootBox(tier);
        }
        
        if (e.target.classList.contains('sell-item-btn') || e.target.closest('.sell-item-btn')) {
            const btn = e.target.classList.contains('sell-item-btn') ? e.target : e.target.closest('.sell-item-btn');
            const itemId = btn.dataset.itemId;
            confirmSellItem(itemId);
        }
        
        if (e.target.classList.contains('buy-item-btn') || e.target.closest('.buy-item-btn')) {
            const btn = e.target.classList.contains('buy-item-btn') ? e.target : e.target.closest('.buy-item-btn');
            const itemId = btn.dataset.itemId;
            confirmBuyItem(itemId);
        }
    });
    
    // Reward modal sell button
    sellRewardBtn.addEventListener('click', sellRewardItem);
    
    // Initialize shop
    initializeShop();
});

// Auth Functions
function signInWithGoogle() {
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
}

function signOut() {
    auth.signOut()
        .catch(function(error) {
            console.error('Sign out error:', error);
        });
}

// User Document Functions
function createUserDocument(user) {
    const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User' + user.uid.substring(0, 4),
        photoURL: user.photoURL || '',
        coins: 100,
        streak: 0,
        lastLogin: null,
        inventory: [],
        lootBoxesOpened: 0,
        freeBoxAvailable: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    return db.collection('users').doc(user.uid).set(userDoc)
        .catch(function(error) {
            console.error('Error creating user document:', error);
        });
}

function loadUserData(userId) {
    db.collection('users').doc(userId).onSnapshot(function(doc) {
        if (doc.exists) {
            const data = doc.data();
            userData = {
                coins: data.coins || 0,
                streak: data.streak || 0,
                lastLogin: data.lastLogin ? data.lastLogin.toDate() : null,
                inventory: data.inventory || [],
                lootBoxesOpened: data.lootBoxesOpened || 0,
                freeBoxAvailable: data.freeBoxAvailable !== undefined ? data.freeBoxAvailable : true
            };
            
            updateUIWithUserData();
            
            // Check if we need to reset the free box
            checkFreeBoxReset();
        }
    });
}

function updateUserData() {
    if (!currentUser) return;
    
    const updateData = {
        coins: userData.coins,
        streak: userData.streak,
        lastLogin: userData.lastLogin ? firebase.firestore.Timestamp.fromDate(userData.lastLogin) : null,
        inventory: userData.inventory,
        lootBoxesOpened: userData.lootBoxesOpened,
        freeBoxAvailable: userData.freeBoxAvailable
    };
    
    return db.collection('users').doc(currentUser.uid).update(updateData)
        .catch(function(error) {
            console.error('Error updating user data:', error);
        });
}

// UI Functions
function updateUIForUser(user) {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    usernameDisplay.textContent = user.displayName || 'User';
    dashboardUsername.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        profilePic.src = user.photoURL;
        profilePicPreview.src = user.photoURL;
    }
}

function updateUIForGuest() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    usernameDisplay.textContent = 'Guest';
    profilePic.src = 'https://via.placeholder.com/40';
    profilePicPreview.src = 'https://via.placeholder.com/150';
}

function updateUIWithUserData() {
    // Update coin balance
    coinBalance.textContent = userData.coins;
    
    // Update streak
    currentStreak.textContent = userData.streak;
    const nextRewardDay = Math.min(7, userData.streak + 1);
    nextStreakReward.textContent = nextRewardDay;
    streakProgress.style.width = `${(userData.streak % 7) * (100 / 7)}%`;
    
    // Update inventory
    renderInventory();
    
    // Update free box availability
    updateFreeBoxUI();
}

function updateUsername() {
    const newUsername = newUsernameInput.value.trim();
    if (newUsername.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }

    if (!currentUser) return;

    db.collection('users').doc(currentUser.uid).update({
        displayName: newUsername
    })
    .then(function() {
        usernameDisplay.textContent = newUsername;
        dashboardUsername.textContent = newUsername;
        newUsernameInput.value = '';
        alert('Username updated!');
    })
    .catch(function(error) {
        console.error('Error updating username:', error);
        alert('Update failed: ' + error.message);
    });
}

function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
        alert('Image must be smaller than 500KB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        profilePicPreview.src = event.target.result;
        
        if (currentUser) {
            db.collection('users').doc(currentUser.uid).update({
                photoURL: event.target.result
            })
            .then(function() {
                profilePic.src = event.target.result;
                alert('Profile picture updated!');
            })
            .catch(function(error) {
                console.error('Error saving image:', error);
                alert('Upload failed: ' + error.message);
            });
        }
    };
    reader.readAsDataURL(file);
}

// Reward System Functions
function claimDailyReward() {
    if (!currentUser) return;
    
    const now = new Date();
    const lastLogin = userData.lastLogin;
    let newStreak = userData.streak;
    let coinsEarned = 50; // Base reward
    
    // Check if the user logged in yesterday to maintain streak
    if (lastLogin) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Reset streak if it's been more than 1 day
        if (now.toDateString() !== lastLogin.toDateString()) {
            if (now.getDate() === lastLogin.getDate() + 1 && 
                now.getMonth() === lastLogin.getMonth() && 
                now.getFullYear() === lastLogin.getFullYear()) {
                // Consecutive day
                newStreak++;
            } else {
                // Broken streak
                newStreak = 1;
            }
        } else {
            // Already claimed today
            alert('You already claimed your daily reward today!');
            return;
        }
    } else {
        // First time claiming
        newStreak = 1;
    }
    
    // Bonus coins based on streak (every 7 days)
    const streakBonus = Math.floor(newStreak / 7) * 100;
    coinsEarned += streakBonus;
    
    // Update user data
    userData.coins += coinsEarned;
    userData.streak = newStreak;
    userData.lastLogin = now;
    userData.freeBoxAvailable = true;
    
    // Update UI and database
    updateUIWithUserData();
    updateUserData().then(() => {
        // Show reward message
        let message = `You earned ${coinsEarned} coins!`;
        if (streakBonus > 0) {
            message += ` (Including ${streakBonus} bonus coins for your ${newStreak}-day streak!)`;
        }
        alert(message);
        
        // Also give a free loot box
        alert('You also received a free loot box for today!');
    });
}

function startFreeBoxTimer() {
    updateFreeBoxTimer();
    setInterval(updateFreeBoxTimer, 1000);
}

function updateFreeBoxTimer() {
    if (!userData.lastLogin) {
        freeBoxTimer.textContent = '00:00:00';
        return;
    }
    
    const now = new Date();
    const nextReset = new Date(userData.lastLogin);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);
    
    if (now >= nextReset) {
        freeBoxTimer.textContent = '00:00:00';
        checkFreeBoxReset();
        return;
    }
    
    const diff = nextReset - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    freeBoxTimer.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function checkFreeBoxReset() {
    if (!userData.lastLogin) return;
    
    const now = new Date();
    const lastLoginDate = new Date(userData.lastLogin);
    
    // Reset if it's a new day and the box hasn't been opened yet
    if (now.toDateString() !== lastLoginDate.toDateString() && !userData.freeBoxAvailable) {
        userData.freeBoxAvailable = true;
        updateUserData();
        updateFreeBoxUI();
    }
}

function updateFreeBoxUI() {
    const freeBoxBtn = document.querySelector('.open-lootbox-btn[data-tier="free"]');
    if (freeBoxBtn) {
        freeBoxBtn.disabled = !userData.freeBoxAvailable;
        freeBoxBtn.textContent = userData.freeBoxAvailable ? 
            '<i class="fas fa-box-open me-1"></i>Open Now' : 
            '<i class="fas fa-check me-1"></i>Claimed Today';
    }
}

// Loot Box Functions
function openLootBox(tier) {
    if (!currentUser) return;
    
    // Check if it's a free box and if it's available
    if (tier === LOOTBOX_TIERS.FREE && !userData.freeBoxAvailable) {
        alert('You already opened your free box today!');
        return;
    }
    
    // Check if user has enough coins for paid boxes
    if (tier !== LOOTBOX_TIERS.FREE && userData.coins < LOOTBOX_PRICES[tier]) {
        alert(`You need ${LOOTBOX_PRICES[tier]} coins to open this box!`);
        return;
    }
    
    // Deduct coins for paid boxes
    if (tier !== LOOTBOX_TIERS.FREE) {
        userData.coins -= LOOTBOX_PRICES[tier];
    } else {
        userData.freeBoxAvailable = false;
    }
    
    // Increment opened boxes counter
    userData.lootBoxesOpened++;
    
    // Get a random item
    const item = getRandomItemFromLootBox(tier);
    
    // Add to inventory
    userData.inventory.push({
        id: item.id,
        type: item.type,
        obtainedAt: new Date()
    });
    
    // Update database
    updateUserData().then(() => {
        // Animate the box opening
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
    });
}

function getRandomItemFromLootBox(tier) {
    // Determine rarity based on drop rates
    const rarity = getRandomRarity(tier);
    
    // Filter items by rarity
    let eligibleItems = [];
    for (const type of [ITEM_TYPES.PET, ITEM_TYPES.KNIFE]) {
        eligibleItems = eligibleItems.concat(
            ITEMS_DATABASE[type].filter(item => item.rarity === rarity)
        );
    }
    
    // Select a random item
    const randomIndex = Math.floor(Math.random() * eligibleItems.length);
    return eligibleItems[randomIndex];
}

function getRandomRarity(tier) {
    const rates = LOOTBOX_DROP_RATES[tier];
    const total = Object.values(rates).reduce((sum, rate) => sum + rate, 0);
    const random = Math.random() * total;
    
    let cumulative = 0;
    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (random <= cumulative) {
            return rarity;
        }
    }
    
    return RARITIES.COMMON; // fallback
}

function showReward(item) {
    // Set reward details
    rewardImage.src = item.image;
    rewardName.textContent = item.name;
    rewardDescription.textContent = item.description;
    
    // Set rarity badge
    rewardRarityBadge.textContent = item.rarity.toUpperCase();
    rewardRarityBadge.className = 'badge';
    rewardRarityBadge.classList.add(`badge-${item.rarity}`);
    
    // Set sell button
    sellRewardBtn.style.display = 'block';
    sellPrice.textContent = Math.floor(item.value * 0.7); // 70% of value when selling
    sellRewardBtn.dataset.itemId = item.id;
    
    // Show confetti for rare or better items
    if (item.rarity !== RARITIES.COMMON && item.rarity !== RARITIES.UNCOMMON) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    // Show the modal
    rewardModal.show();
}

function sellRewardItem() {
    const itemId = sellRewardBtn.dataset.itemId;
    const item = findItemInDatabase(itemId);
    
    if (!item) return;
    
    // Add coins (70% of item value)
    userData.coins += Math.floor(item.value * 0.7);
    
    // Remove from inventory (find by ID and type)
    const itemIndex = userData.inventory.findIndex(invItem => invItem.id === itemId);
    if (itemIndex !== -1) {
        userData.inventory.splice(itemIndex, 1);
    }
    
    // Update database
    updateUserData().then(() => {
        rewardModal.hide();
        alert(`You sold ${item.name} for ${Math.floor(item.value * 0.7)} coins!`);
    });
}

// Inventory Functions
function renderInventory() {
    renderPetsInventory();
    renderKnivesInventory();
}

function renderPetsInventory() {
    const pets = userData.inventory
        .filter(item => item.type === ITEM_TYPES.PET)
        .map(invItem => findItemInDatabase(invItem.id))
        .filter(Boolean); // Remove undefined if item not found
    
    if (pets.length === 0) {
        petsInventory.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <p class="text-muted">No pets in your inventory yet</p>
            </div>
        `;
        return;
    }
    
    petsInventory.innerHTML = pets.map(pet => `
        <div class="col-md-4 col-6">
            <div class="inventory-item card">
                <img src="${pet.image}" class="card-img-top item-image" alt="${pet.name}">
                <div class="card-body item-details">
                    <h5 class="card-title">${pet.name}</h5>
                    <span class="badge badge-${pet.rarity}">${pet.rarity.toUpperCase()}</span>
                    <p class="card-text mt-2">${pet.description}</p>
                    <button class="btn btn-outline-danger w-100 sell-item-btn" data-item-id="${pet.id}">
                        <i class="fas fa-coins me-1"></i>Sell for ${Math.floor(pet.value * 0.7)} coins
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderKnivesInventory() {
    const knives = userData.inventory
        .filter(item => item.type === ITEM_TYPES.KNIFE)
        .map(invItem => findItemInDatabase(invItem.id))
        .filter(Boolean); // Remove undefined if item not found
    
    if (knives.length === 0) {
        knivesInventory.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <p class="text-muted">No knives in your inventory yet</p>
            </div>
        `;
        return;
    }
    
    knivesInventory.innerHTML = knives.map(knife => `
        <div class="col-md-4 col-6">
            <div class="inventory-item card">
                <img src="${knife.image}" class="card-img-top item-image" alt="${knife.name}">
                <div class="card-body item-details">
                    <h5 class="card-title">${knife.name}</h5>
                    <span class="badge badge-${knife.rarity}">${knife.rarity.toUpperCase()}</span>
                    <p class="card-text mt-2">${knife.description}</p>
                    <button class="btn btn-outline-danger w-100 sell-item-btn" data-item-id="${knife.id}">
                        <i class="fas fa-coins me-1"></i>Sell for ${Math.floor(knife.value * 0.7)} coins
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Shop Functions
function initializeShop() {
    renderShopPets();
    renderShopKnives();
}

function renderShopPets() {
    shopPets.innerHTML = ITEMS_DATABASE[ITEM_TYPES.PET].map(pet => `
        <div class="col-md-4 col-6">
            <div class="shop-item card">
                <img src="${pet.image}" class="card-img-top item-image" alt="${pet.name}">
                <div class="card-body item-details">
                    <h5 class="card-title">${pet.name}</h5>
                    <span class="badge badge-${pet.rarity}">${pet.rarity.toUpperCase()}</span>
                    <p class="card-text mt-2">${pet.description}</p>
                    <button class="btn btn-primary w-100 buy-item-btn" data-item-id="${pet.id}">
                        <i class="fas fa-shopping-cart me-1"></i>Buy for ${pet.value} coins
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderShopKnives() {
    shopKnives.innerHTML = ITEMS_DATABASE[ITEM_TYPES.KNIFE].map(knife => `
        <div class="col-md-4 col-6">
            <div class="shop-item card">
                <img src="${knife.image}" class="card-img-top item-image" alt="${knife.name}">
                <div class="card-body item-details">
                    <h5 class="card-title">${knife.name}</h5>
                    <span class="badge badge-${knife.rarity}">${knife.rarity.toUpperCase()}</span>
                    <p class="card-text mt-2">${knife.description}</p>
                    <button class="btn btn-primary w-100 buy-item-btn" data-item-id="${knife.id}">
                        <i class="fas fa-shopping-cart me-1"></i>Buy for ${knife.value} coins
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Confirmation Dialogs
function confirmSellItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) return;
    
    confirmationModalTitle.textContent = 'Confirm Sale';
    confirmationModalBody.innerHTML = `
        <p>Are you sure you want to sell <strong>${item.name}</strong> for ${Math.floor(item.value * 0.7)} coins?</p>
        <p>This action cannot be undone.</p>
    `;
    
    confirmActionBtn.onclick = function() {
        sellItem(itemId);
        confirmationModal.hide();
    };
    
    confirmationModal.show();
}

function confirmBuyItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) return;
    
    if (userData.coins < item.value) {
        alert(`You don't have enough coins to buy this item. You need ${item.value - userData.coins} more coins.`);
        return;
    }
    
    confirmationModalTitle.textContent = 'Confirm Purchase';
    confirmationModalBody.innerHTML = `
        <p>Are you sure you want to buy <strong>${item.name}</strong> for ${item.value} coins?</p>
        <p>You will have ${userData.coins - item.value} coins remaining.</p>
    `;
    
    confirmActionBtn.onclick = function() {
        buyItem(itemId);
        confirmationModal.hide();
    };
    
    confirmationModal.show();
}

function sellItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) return;
    
    // Add coins (70% of item value)
    userData.coins += Math.floor(item.value * 0.7);
    
    // Remove from inventory (find by ID and type)
    const itemIndex = userData.inventory.findIndex(invItem => invItem.id === itemId);
    if (itemIndex !== -1) {
        userData.inventory.splice(itemIndex, 1);
    }
    
    // Update database and UI
    updateUserData().then(() => {
        alert(`You sold ${item.name} for ${Math.floor(item.value * 0.7)} coins!`);
    });
}

function buyItem(itemId) {
    const item = findItemInDatabase(itemId);
    if (!item) return;
    
    // Check if user has enough coins
    if (userData.coins < item.value) {
        alert(`You don't have enough coins to buy this item. You need ${item.value - userData.coins} more coins.`);
        return;
    }
    
    // Deduct coins
    userData.coins -= item.value;
    
    // Add to inventory
    userData.inventory.push({
        id: item.id,
        type: item.type,
        obtainedAt: new Date()
    });
    
    // Update database and UI
    updateUserData().then(() => {
        alert(`You bought ${item.name} for ${item.value} coins!`);
    });
}

// Helper Functions
function findItemInDatabase(itemId) {
    for (const type of [ITEM_TYPES.PET, ITEM_TYPES.KNIFE]) {
        const foundItem = ITEMS_DATABASE[type].find(item => item.id === itemId);
        if (foundItem) return foundItem;
    }
    return null;
}