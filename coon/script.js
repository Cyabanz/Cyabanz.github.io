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
const ITEMS = {
  pets: {
    common: [
      { id: 'pet1', name: 'Common Cat', value: 50, image: 'https://via.placeholder.com/150?text=Common+Cat', description: 'A cute common cat companion' },
      { id: 'pet2', name: 'Common Dog', value: 50, image: 'https://via.placeholder.com/150?text=Common+Dog', description: 'A loyal common dog companion' },
      { id: 'pet3', name: 'Common Bird', value: 50, image: 'https://via.placeholder.com/150?text=Common+Bird', description: 'A cheerful common bird companion' }
    ],
    rare: [
      { id: 'pet4', name: 'Rare Fox', value: 150, image: 'https://via.placeholder.com/150?text=Rare+Fox', description: 'A clever rare fox companion' },
      { id: 'pet5', name: 'Rare Rabbit', value: 150, image: 'https://via.placeholder.com/150?text=Rare+Rabbit', description: 'A quick rare rabbit companion' }
    ],
    epic: [
      { id: 'pet6', name: 'Epic Dragon', value: 300, image: 'https://via.placeholder.com/150?text=Epic+Dragon', description: 'A majestic epic dragon companion' },
      { id: 'pet7', name: 'Epic Unicorn', value: 300, image: 'https://via.placeholder.com/150?text=Epic+Unicorn', description: 'A magical epic unicorn companion' }
    ],
    legendary: [
      { id: 'pet8', name: 'Legendary Phoenix', value: 500, image: 'https://via.placeholder.com/150?text=Legendary+Phoenix', description: 'A fiery legendary phoenix companion' },
      { id: 'pet9', name: 'Legendary Griffin', value: 500, image: 'https://via.placeholder.com/150?text=Legendary+Griffin', description: 'A powerful legendary griffin companion' }
    ]
  },
  knives: {
    common: [
      { id: 'knife1', name: 'Common Dagger', value: 40, image: 'https://via.placeholder.com/150?text=Common+Dagger', description: 'A basic common dagger' },
      { id: 'knife2', name: 'Common Knife', value: 40, image: 'https://via.placeholder.com/150?text=Common+Knife', description: 'A standard common knife' }
    ],
    rare: [
      { id: 'knife3', name: 'Rare Bowie', value: 120, image: 'https://via.placeholder.com/150?text=Rare+Bowie', description: 'A sharp rare bowie knife' },
      { id: 'knife4', name: 'Rare Karambit', value: 120, image: 'https://via.placeholder.com/150?text=Rare+Karambit', description: 'A curved rare karambit' }
    ],
    epic: [
      { id: 'knife5', name: 'Epic Butterfly', value: 250, image: 'https://via.placeholder.com/150?text=Epic+Butterfly', description: 'A flashy epic butterfly knife' },
      { id: 'knife6', name: 'Epic Katana', value: 250, image: 'https://via.placeholder.com/150?text=Epic+Katana', description: 'A sleek epic katana' }
    ],
    legendary: [
      { id: 'knife7', name: 'Legendary Sword', value: 400, image: 'https://via.placeholder.com/150?text=Legendary+Sword', description: 'An ancient legendary sword' },
      { id: 'knife8', name: 'Legendary Scythe', value: 400, image: 'https://via.placeholder.com/150?text=Legendary+Scythe', description: 'A deadly legendary scythe' }
    ]
  }
};

const LOOT_BOXES = {
  free: {
    name: "Free Box",
    cost: 0,
    image: "https://via.placeholder.com/200x150?text=Free+Box",
    rewards: {
      pets: { common: 70, rare: 25, epic: 5, legendary: 0 },
      knives: { common: 70, rare: 25, epic: 5, legendary: 0 },
      coins: { min: 10, max: 50, chance: 30 }
    }
  },
  bronze: {
    name: "Bronze Box",
    cost: 100,
    image: "https://via.placeholder.com/200x150?text=Bronze+Box",
    rewards: {
      pets: { common: 50, rare: 35, epic: 10, legendary: 5 },
      knives: { common: 50, rare: 35, epic: 10, legendary: 5 },
      coins: { min: 25, max: 75, chance: 40 }
    }
  },
  silver: {
    name: "Silver Box",
    cost: 250,
    image: "https://via.placeholder.com/200x150?text=Silver+Box",
    rewards: {
      pets: { common: 20, rare: 50, epic: 25, legendary: 5 },
      knives: { common: 20, rare: 50, epic: 25, legendary: 5 },
      coins: { min: 50, max: 100, chance: 50 }
    }
  },
  gold: {
    name: "Gold Box",
    cost: 500,
    image: "https://via.placeholder.com/200x150?text=Gold+Box",
    rewards: {
      pets: { common: 0, rare: 30, epic: 50, legendary: 20 },
      knives: { common: 0, rare: 30, epic: 50, legendary: 20 },
      coins: { min: 75, max: 150, chance: 60 }
    }
  }
};

// Game State
let userData = {
  coins: 0,
  streak: 0,
  lastClaim: null,
  inventory: {
    pets: [],
    knives: []
  }
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
  updateProfilePicBtn: document.getElementById('update-profile-pic-btn'),
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

// Utility Functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRarity(probabilities) {
  const total = Object.values(probabilities).reduce((sum, prob) => sum + prob, 0);
  const random = Math.random() * total;
  
  let cumulative = 0;
  for (const [rarity, prob] of Object.entries(probabilities)) {
    cumulative += prob;
    if (random <= cumulative) {
      return rarity;
    }
  }
  
  return 'common'; // fallback
}

function getRandomItem(type, rarity) {
  const items = ITEMS[type][rarity];
  return items[Math.floor(Math.random() * items.length)];
}

function getRarityColor(rarity) {
  const colors = {
    common: 'secondary',
    rare: 'primary',
    epic: 'danger',
    legendary: 'warning'
  };
  return colors[rarity] || 'secondary';
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Firebase Functions
async function createUserDocument(user) {
  const userDoc = {
    uid: user.uid,
    email: user.email,
    username: user.displayName || 'user' + user.uid.substring(0, 4),
    photoBase64: user.photoURL || '',
    coins: 100,
    streak: 0,
    lastClaim: null,
    inventory: {
      pets: [],
      knives: []
    },
    lastFreeBox: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  return db.collection('users').doc(user.uid).set(userDoc);
}

async function loadUserData(userId) {
  const doc = await db.collection('users').doc(userId).get();
  if (doc.exists) {
    const data = doc.data();
    userData = data;
    
    // Update UI
    updateUI();
    updateInventoryUI();
    updateShopUI();
    startFreeBoxTimer();
    
    // Check if daily reward can be claimed
    checkDailyReward();
  }
}

async function updateUserData(data) {
  await db.collection('users').doc(auth.currentUser.uid).update(data);
  Object.assign(userData, data);
  updateUI();
}

async function addItemToInventory(item, type) {
  const inventoryKey = `${type}Inventory`;
  await db.collection('users').doc(auth.currentUser.uid).update({
    [`inventory.${type}`]: firebase.firestore.FieldValue.arrayUnion(item)
  });
  
  userData.inventory[type].push(item);
  updateInventoryUI();
}

async function removeItemFromInventory(item, type) {
  await db.collection('users').doc(auth.currentUser.uid).update({
    [`inventory.${type}`]: firebase.firestore.FieldValue.arrayRemove(item)
  });
  
  userData.inventory[type] = userData.inventory[type].filter(i => i.id !== item.id);
  updateInventoryUI();
}

// Game Functions
function checkDailyReward() {
  if (!userData.lastClaim) {
    elements.claimDailyBtn.disabled = false;
    return;
  }
  
  const lastClaim = userData.lastClaim.toDate();
  const now = new Date();
  const diffHours = (now - lastClaim) / (1000 * 60 * 60);
  
  // Reset streak if more than 48 hours since last claim
  if (diffHours > 48) {
    updateUserData({ streak: 0 });
  }
  
  // Enable button if more than 24 hours since last claim
  elements.claimDailyBtn.disabled = diffHours < 24;
}

async function claimDailyReward() {
  const now = new Date();
  const lastClaim = userData.lastClaim ? userData.lastClaim.toDate() : null;
  const diffDays = lastClaim ? (now - lastClaim) / (1000 * 60 * 60 * 24) : 0;
  
  let newStreak = userData.streak;
  let coinsToAdd = 50; // base reward
  
  // Increase streak if claimed within 48 hours of last claim
  if (diffDays >= 1 && diffDays <= 2) {
    newStreak += 1;
  } else if (diffDays > 2) {
    newStreak = 1; // reset streak if too much time passed
  } else if (!lastClaim) {
    newStreak = 1; // first claim
  }
  
  // Streak bonus
  if (newStreak >= 7) {
    coinsToAdd += 100; // 7-day streak bonus
  } else if (newStreak >= 3) {
    coinsToAdd += 25; // 3-day streak bonus
  }
  
  // Update user data
  await updateUserData({
    coins: userData.coins + coinsToAdd,
    streak: newStreak,
    lastClaim: firebase.firestore.Timestamp.fromDate(now)
  });
  
  // Show reward
  showReward({
    type: 'coins',
    amount: coinsToAdd,
    message: `Daily Reward (${newStreak} day streak)`
  });
  
  // Disable button until next day
  elements.claimDailyBtn.disabled = true;
}

function startFreeBoxTimer() {
  if (!userData.lastFreeBox) {
    // First time, enable free box
    elements.freeBoxTimer.textContent = "Ready!";
    return;
  }
  
  const lastClaim = userData.lastFreeBox.toDate();
  const now = new Date();
  const nextClaim = new Date(lastClaim);
  nextClaim.setDate(nextClaim.getDate() + 1);
  
  if (now >= nextClaim) {
    elements.freeBoxTimer.textContent = "Ready!";
    return;
  }
  
  const updateTimer = () => {
    const now = new Date();
    const diff = nextClaim - now;
    
    if (diff <= 0) {
      elements.freeBoxTimer.textContent = "Ready!";
      return;
    }
    
    elements.freeBoxTimer.textContent = formatTime(Math.floor(diff / 1000));
    setTimeout(updateTimer, 1000);
  };
  
  updateTimer();
}

function openLootBox(tier) {
  if (tier !== 'free' && userData.coins < LOOT_BOXES[tier].cost) {
    alert("Not enough coins!");
    return;
  }
  
  if (tier === 'free' && userData.lastFreeBox) {
    const lastClaim = userData.lastFreeBox.toDate();
    const now = new Date();
    const nextClaim = new Date(lastClaim);
    nextClaim.setDate(nextClaim.getDate() + 1);
    
    if (now < nextClaim) {
      alert("You've already claimed your free box today!");
      return;
    }
  }
  
  // Determine reward type (item or coins)
  const box = LOOT_BOXES[tier];
  const rewardType = Math.random() * 100 < box.rewards.coins.chance ? 'coins' : 
                    Math.random() < 0.5 ? 'pets' : 'knives';
  
  let reward;
  
  if (rewardType === 'coins') {
    const amount = getRandomInt(box.rewards.coins.min, box.rewards.coins.max);
    reward = {
      type: 'coins',
      amount: amount,
      message: `Coins from ${box.name}`
    };
    
    // Add coins immediately
    updateUserData({
      coins: userData.coins + amount
    });
  } else {
    const rarity = getRandomRarity(box.rewards[rewardType]);
    reward = {
      type: rewardType,
      item: getRandomItem(rewardType, rarity),
      rarity: rarity
    };
    
    // Add item to inventory
    addItemToInventory(reward.item, rewardType);
  }
  
  // Deduct coins if not free box
  if (tier !== 'free') {
    updateUserData({
      coins: userData.coins - box.cost
    });
  } else {
    // Update last free box time
    updateUserData({
      lastFreeBox: firebase.firestore.Timestamp.fromDate(new Date())
    });
    startFreeBoxTimer();
  }
  
  // Show reward with animation
  showReward(reward);
  
  // Confetti effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function showReward(reward) {
  if (reward.type === 'coins') {
    elements.rewardImage.src = 'https://via.placeholder.com/150?text=' + reward.amount + '+Coins';
    elements.rewardName.textContent = reward.message;
    elements.rewardDescription.textContent = `You received ${reward.amount} coins!`;
    elements.rewardRarityBadge.className = 'badge bg-warning';
    elements.rewardRarityBadge.textContent = 'Coins';
    elements.sellRewardBtn.style.display = 'none';
  } else {
    elements.rewardImage.src = reward.item.image;
    elements.rewardName.textContent = reward.item.name;
    elements.rewardDescription.textContent = reward.item.description;
    elements.rewardRarityBadge.className = `badge bg-${getRarityColor(reward.rarity)}`;
    elements.rewardRarityBadge.textContent = reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1);
    elements.sellRewardBtn.style.display = 'block';
    elements.sellPrice.textContent = Math.floor(reward.item.value * 0.7); // 70% of value
    
    // Set up sell button
    elements.sellRewardBtn.onclick = () => {
      sellItem(reward.item, reward.type);
    };
  }
  
  elements.rewardModal.show();
}

async function sellItem(item, type) {
  const sellPrice = Math.floor(item.value * 0.7); // 70% of value
  
  showConfirmation(
    `Sell ${item.name}?`,
    `Are you sure you want to sell this ${type} for ${sellPrice} coins?`,
    async () => {
      await updateUserData({
        coins: userData.coins + sellPrice
      });
      await removeItemFromInventory(item, type);
      elements.rewardModal.hide();
    }
  );
}

function showConfirmation(title, message, callback) {
  elements.confirmationModalTitle.textContent = title;
  elements.confirmationModalBody.textContent = message;
  elements.confirmActionBtn.onclick = () => {
    callback();
    elements.confirmationModal.hide();
  };
  elements.confirmationModal.show();
}

// UI Update Functions
function updateUI() {
  elements.coinBalance.textContent = userData.coins;
  elements.currentStreak.textContent = userData.streak;
  
  // Streak progress (next reward at 7 days)
  const progress = Math.min(100, (userData.streak % 7) / 7 * 100);
  elements.streakProgress.style.width = `${progress}%`;
  elements.nextStreakReward.textContent = 7 - (userData.streak % 7);
}

function updateInventoryUI() {
  // Pets inventory
  if (userData.inventory.pets.length > 0) {
    elements.petsInventory.innerHTML = userData.inventory.pets.map(pet => `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${pet.image}" class="card-img-top" alt="${pet.name}">
          <div class="card-body">
            <h5 class="card-title">${pet.name}</h5>
            <p class="card-text">${pet.description}</p>
            <button class="btn btn-outline-danger sell-item-btn" data-id="${pet.id}" data-type="pets">
              Sell for ${Math.floor(pet.value * 0.7)} <i class="fas fa-coins text-warning"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    elements.petsInventory.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">No pets in your inventory yet</p>
      </div>
    `;
  }
  
  // Knives inventory
  if (userData.inventory.knives.length > 0) {
    elements.knivesInventory.innerHTML = userData.inventory.knives.map(knife => `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${knife.image}" class="card-img-top" alt="${knife.name}">
          <div class="card-body">
            <h5 class="card-title">${knife.name}</h5>
            <p class="card-text">${knife.description}</p>
            <button class="btn btn-outline-danger sell-item-btn" data-id="${knife.id}" data-type="knives">
              Sell for ${Math.floor(knife.value * 0.7)} <i class="fas fa-coins text-warning"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    elements.knivesInventory.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">No knives in your inventory yet</p>
      </div>
    `;
  }
  
  // Add event listeners to sell buttons
  document.querySelectorAll('.sell-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      const item = userData.inventory[type].find(i => i.id === id);
      
      if (item) {
        showConfirmation(
          `Sell ${item.name}?`,
          `Are you sure you want to sell this ${type.slice(0, -1)} for ${Math.floor(item.value * 0.7)} coins?`,
          async () => {
            await updateUserData({
              coins: userData.coins + Math.floor(item.value * 0.7)
            });
            await removeItemFromInventory(item, type);
          }
        );
      }
    });
  });
}

function updateShopUI() {
  // Pets shop
  elements.shopPets.innerHTML = Object.entries(ITEMS.pets).map(([rarity, pets]) => `
    ${pets.map(pet => `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${pet.image}" class="card-img-top" alt="${pet.name}">
          <div class="card-body">
            <h5 class="card-title">${pet.name}</h5>
            <span class="badge bg-${getRarityColor(rarity)} mb-2">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
            <p class="card-text">${pet.description}</p>
            <button class="btn btn-primary buy-item-btn" data-id="${pet.id}" data-type="pets" ${userData.coins < pet.value ? 'disabled' : ''}>
              Buy for ${pet.value} <i class="fas fa-coins text-warning"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('')}
  `).join('');
  
  // Knives shop
  elements.shopKnives.innerHTML = Object.entries(ITEMS.knives).map(([rarity, knives]) => `
    ${knives.map(knife => `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${knife.image}" class="card-img-top" alt="${knife.name}">
          <div class="card-body">
            <h5 class="card-title">${knife.name}</h5>
            <span class="badge bg-${getRarityColor(rarity)} mb-2">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
            <p class="card-text">${knife.description}</p>
            <button class="btn btn-primary buy-item-btn" data-id="${knife.id}" data-type="knives" ${userData.coins < knife.value ? 'disabled' : ''}>
              Buy for ${knife.value} <i class="fas fa-coins text-warning"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('')}
  `).join('');
  
  // Add event listeners to buy buttons
  document.querySelectorAll('.buy-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      
      // Find item in ITEMS
      let item;
      for (const rarity of Object.keys(ITEMS[type])) {
        const found = ITEMS[type][rarity].find(i => i.id === id);
        if (found) {
          item = found;
          break;
        }
      }
      
      if (item && userData.coins >= item.value) {
        showConfirmation(
          `Buy ${item.name}?`,
          `Are you sure you want to buy this ${type.slice(0, -1)} for ${item.value} coins?`,
          async () => {
            await updateUserData({
              coins: userData.coins - item.value
            });
            await addItemToInventory(item, type);
            updateShopUI(); // Refresh shop to update button states
          }
        );
      }
    });
  });
}

// Event Listeners
function setupEventListeners() {
  // Auth
  elements.signInButton.addEventListener('click', () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        if (result.additionalUserInfo.isNewUser) {
          return createUserDocument(result.user);
        }
      })
      .catch((error) => {
        console.error('Sign in error:', error);
        alert('Sign in failed: ' + error.message);
      });
  });
  
  elements.signOutButton.addEventListener('click', () => {
    auth.signOut();
  });
  
  // Profile
  elements.updateUsernameBtn.addEventListener('click', () => {
    const newUsername = elements.newUsernameInput.value.trim();
    if (newUsername.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }
    
    updateUserData({ username: newUsername })
      .then(() => {
        elements.dashboardUsername.textContent = newUsername;
        elements.usernameDisplay.textContent = newUsername;
        elements.newUsernameInput.value = '';
        alert('Username updated!');
      })
      .catch((error) => {
        console.error('Error updating username:', error);
        alert('Update failed: ' + error.message);
      });
  });
  
  elements.updateProfilePicBtn.addEventListener('click', () => {
    const file = elements.profilePicUpload.files[0];
    if (!file) {
      alert('Please select an image first');
      return;
    }
    
    if (file.size > 500 * 1024) {
      alert('Image must be smaller than 500KB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      updateUserData({ photoBase64: base64Image })
        .then(() => {
          elements.profilePic.src = base64Image;
          elements.profilePicPreview.src = base64Image;
          elements.profilePicUpload.value = '';
          alert('Profile picture updated!');
        })
        .catch((error) => {
          console.error('Error saving image:', error);
          alert('Upload failed: ' + error.message);
        });
    };
    reader.readAsDataURL(file);
  });
  
  // Game
  elements.claimDailyBtn.addEventListener('click', claimDailyReward);
  
  // Loot boxes
  document.querySelectorAll('.open-lootbox-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.dataset.tier;
      openLootBox(tier);
    });
  });
}

// Auth State Listener
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    elements.loginView.style.display = 'none';
    elements.dashboardView.style.display = 'block';
    
    // Set profile info
    const displayName = user.displayName || 'User';
    elements.usernameDisplay.textContent = displayName;
    elements.dashboardUsername.textContent = displayName;
    
    if (user.photoURL) {
      elements.profilePic.src = user.photoURL;
      elements.profilePicPreview.src = user.photoURL;
    }
    
    // Load user data
    loadUserData(user.uid);
  } else {
    // User is signed out
    elements.loginView.style.display = 'block';
    elements.dashboardView.style.display = 'none';
    elements.usernameDisplay.textContent = 'Guest';
    elements.profilePic.src = 'https://via.placeholder.com/40';
    elements.profilePicPreview.src = 'https://via.placeholder.com/150';
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});
