document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gameFrameContainer = document.querySelector('.game-frame-container');
    const closeGameFrameBtn = document.querySelector('.close-game-frame');
    const gameFrame = document.getElementById('gameFrame');
    const gameTitle = document.getElementById('gameTitle');
    const gameDescription = document.getElementById('gameDescription');
    const likeCount = document.getElementById('likeCount');
    const dislikeCount = document.getElementById('dislikeCount');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const controlsList = document.getElementById('controlsList');
    const playButtons = document.querySelectorAll('.play-btn');
    
    // Current game state
    let currentGame = null;
    let currentGameId = null;
    let userVote = null; // 'like', 'dislike', or null
    
    // Initialize game cards
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const gameCard = this.closest('.game-card');
            openGameFrame(
                gameCard.dataset.id,
                gameCard.dataset.title,
                gameCard.dataset.description,
                gameCard.dataset.controls,
                "https://example.com" // Replace with actual game URL
            );
        });
    });
    
    // Close game frame
    closeGameFrameBtn.addEventListener('click', closeGameFrame);
    
    // Fullscreen button
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Like button
    likeBtn.addEventListener('click', function() {
        if (!currentGameId) return;
        
        if (userVote === 'like') {
            // Remove like
            updateVote(null);
        } else {
            // Add like (and remove dislike if exists)
            updateVote('like');
        }
    });
    
    // Dislike button
    dislikeBtn.addEventListener('click', function() {
        if (!currentGameId) return;
        
        if (userVote === 'dislike') {
            // Remove dislike
            updateVote(null);
        } else {
            // Add dislike (and remove like if exists)
            updateVote('dislike');
        }
    });
    
    // Open game frame function
    function openGameFrame(gameId, title, description, controls, url) {
        currentGameId = gameId;
        currentGame = { id: gameId, title, description, url };
        
        // Update UI
        gameTitle.textContent = title;
        gameDescription.textContent = description;
        
        // Parse and display controls
        controlsList.innerHTML = '';
        if (controls) {
            const controlItems = controls.split('|');
            controlItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'control-item';
                li.innerHTML = `<i class='bx bx-right-arrow-alt'></i> ${item}`;
                controlsList.appendChild(li);
            });
        }
        
        // Load game stats
        loadGameStats(gameId);
        
        // Set iframe source
        gameFrame.src = url;
        
        // Show frame
        gameFrameContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close game frame function
    function closeGameFrame() {
        gameFrame.src = '';
        gameFrameContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentGameId = null;
        currentGame = null;
        userVote = null;
    }
    
    // Toggle fullscreen function
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            gameFrame.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Load game stats from Firebase
    function loadGameStats(gameId) {
        const gameRef = db.collection('games').doc(gameId);
        
        gameRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                likeCount.textContent = data.likes || 0;
                dislikeCount.textContent = data.dislikes || 0;
            } else {
                // Initialize if doesn't exist
                gameRef.set({
                    likes: 0,
                    dislikes: 0
                });
                likeCount.textContent = '0';
                dislikeCount.textContent = '0';
            }
        });
        
        // Check user's vote if logged in
        if (auth.currentUser) {
            checkUserVote(gameId);
        }
    }
    
    // Check user's existing vote
    function checkUserVote(gameId) {
        const userId = auth.currentUser.uid;
        db.collection('games').doc(gameId).collection('votes').doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    userVote = doc.data().vote;
                    updateVoteUI();
                } else {
                    userVote = null;
                    updateVoteUI();
                }
            });
    }
    
    // Update vote in Firebase
    function updateVote(newVote) {
        if (!auth.currentUser) {
            alert('Please sign in to vote');
            return;
        }
        
        const userId = auth.currentUser.uid;
        const gameRef = db.collection('games').doc(currentGameId);
        const userVoteRef = gameRef.collection('votes').doc(userId);
        
        // First, remove existing vote counts
        const updates = {};
        if (userVote === 'like') {
            updates.likes = firebase.firestore.FieldValue.increment(-1);
        } else if (userVote === 'dislike') {
            updates.dislikes = firebase.firestore.FieldValue.increment(-1);
        }
        
        // Then add new vote counts
        if (newVote === 'like') {
            updates.likes = firebase.firestore.FieldValue.increment(1);
        } else if (newVote === 'dislike') {
            updates.dislikes = firebase.firestore.FieldValue.increment(1);
        }
        
        // Batch update
        const batch = db.batch();
        
        // Update game stats
        batch.update(gameRef, updates);
        
        // Update user vote
        if (newVote) {
            batch.set(userVoteRef, { vote: newVote });
        } else {
            batch.delete(userVoteRef);
        }
        
        batch.commit().then(() => {
            userVote = newVote;
            updateVoteUI();
            
            // Update counts display
            gameRef.get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    likeCount.textContent = data.likes || 0;
                    dislikeCount.textContent = data.dislikes || 0;
                }
            });
        });
    }
    
    // Update vote buttons UI
    function updateVoteUI() {
        likeBtn.classList.toggle('liked', userVote === 'like');
        dislikeBtn.classList.toggle('disliked', userVote === 'dislike');
    }
    
    // Auth state listener
    auth.onAuthStateChanged(user => {
        if (user && currentGameId) {
            checkUserVote(currentGameId);
        } else {
            userVote = null;
            updateVoteUI();
        }
    });
    
    // Sample function to initialize some games in Firebase
    // This would only be run once to set up the database
    function initializeSampleGames() {
        const games = [
            {
                id: "1",
                title: "Bullet Force",
                description: "An exciting first-person shooter game with multiple weapons and maps.",
                controls: "WASD: Move|Mouse: Aim|Left Click: Shoot|R: Reload",
                url: "https://example.com",
                likes: 0,
                dislikes: 0
            }
        ];
        
        games.forEach(game => {
            db.collection('games').doc(game.id).set({
                title: game.title,
                description: game.description,
                likes: game.likes,
                dislikes: game.dislikes
            });
        });
    }
    
    // Uncomment to initialize sample games (run once)
    // initializeSampleGames();
});