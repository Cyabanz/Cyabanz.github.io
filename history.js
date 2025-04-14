// Use the same Firebase config as your main page
const firebaseConfig = {
  apiKey: "AIzaSyADCVIINCBgvTBvClWqWI5o3SlVS47IJnw",
  authDomain: "fusioncya-cc20a.firebaseapp.com",
  projectId: "fusioncya-cc20a",
  storageBucket: "fusioncya-cc20a.appspot.com",
  messagingSenderId: "765164293111",
  appId: "1:765164293111:web:43e051c755c4690c0c3cf2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const gamesData = [
    {
        id: "popular",
        title: "Popular Games",
        games: [
            {
                id: 1,
                title: "Bullet Force",
                category: "action",
                staticImg: "https://help.learningmath.infinityfreeapp.com/images/apps/chatgpt.png",
                gifImg: "https://help.learningmath.infinityfreeapp.com/images/apps/chatgpt.png",
                banner: "hot",
                url: "https://example.com"
            },
            {
                id: 2,
                title: "Cut the Rope",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Cut+the+Rope",
                gifImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#cut-the-rope"
            },
            {
                id: 3,
                title: "Basketball Stars",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/2196F3/fff?text=Basketball+Stars",
                gifImg: "https://via.placeholder.com/300x200/03A9F4/fff?text=GIF+Preview",
                banner: "new",
                url: "#basketball-stars"
            },
            {
                id: 4,
                title: "Agar.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Agar.io",
                gifImg: "https://via.placeholder.com/300x200/FFEB3B/fff?text=GIF+Preview",
                banner: "hot",
                url: "#agar-io"
            },
            {
                id: 5,
                title: "Slither.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Slither.io",
                gifImg: "https://via.placeholder.com/300x200/E91E63/fff?text=GIF+Preview",
                url: "#slither-io"
            },
            {
                id: 6,
                title: "Zombie Derby",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Zombie+Derby",
                gifImg: "https://via.placeholder.com/300x200/FF5252/fff?text=GIF+Preview",
                banner: "new",
                url: "#zombie-derby"
            },
            {
                id: 7,
                title: "Sudoku",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Sudoku",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                url: "#sudoku"
            },
            {
                id: 8,
                title: "Soccer Skills",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Skills",
                gifImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#soccer-skills"
            },
            {
                id: 9,
                title: "Tank Wars",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Tank+Wars",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                url: "#tank-wars"
            },
            {
                id: 10,
                title: "2048",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=2048",
                gifImg: "https://via.placeholder.com/300x200/80DEEA/fff?text=GIF+Preview",
                banner: "hot",
                url: "#2048"
            }
        ]
    },
    {
        id: "new",
        title: "New Releases",
        games: [
            {
                id: 11,
                title: "Epic Adventure",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Epic+Adventure",
                gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=GIF+Preview",
                banner: "new",
                url: "#epic-adventure"
            },
            {
                id: 12,
                title: "Brain Teaser",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Brain+Teaser",
                gifImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=GIF+Preview",
                banner: "new",
                url: "#brain-teaser"
            },
            {
                id: 13,
                title: "Soccer Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Soccer+Pro",
                gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=GIF+Preview",
                banner: "new",
                url: "#soccer-pro"
            },
            {
                id: 14,
                title: "WormZone.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=WormZone.io",
                gifImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=GIF+Preview",
                banner: "new",
                url: "#wormzone-io"
            },
            {
                id: 15,
                title: "Zombie Shooter",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/E91E63/fff?text=Zombie+Shooter",
                gifImg: "https://via.placeholder.com/300x200/EC407A/fff?text=GIF+Preview",
                banner: "hot",
                url: "#zombie-shooter"
            },
            {
                id: 16,
                title: "Space Warriors",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Space+Warriors",
                gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=GIF+Preview",
                url: "#space-warriors"
            },
            {
                id: 17,
                title: "Ninja Combat",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Ninja+Combat",
                gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=GIF+Preview",
                banner: "popular",
                url: "#ninja-combat"
            },
            {
                id: 18,
                title: "Cyber Strike",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Cyber+Strike",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                url: "#cyber-strike"
            },
            {
                id: 19,
                title: "Jigsaw Master",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Jigsaw+Master",
                gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=GIF+Preview",
                url: "#jigsaw-master"
            },
            {
                id: 20,
                title: "Memory Challenge",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Memory+Challenge",
                gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=GIF+Preview",
                banner: "new",
                url: "#memory-challenge"
            }
        ]
    },
    {
        id: "action",
        title: "Action Games",
        games: [
            {
                id: 21,
                title: "Commando Raid",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=Commando+Raid",
                gifImg: "https://via.placeholder.com/300x200/A1887F/fff?text=GIF+Preview",
                banner: "new",
                url: "#commando-raid"
            },
            {
                id: 22,
                title: "Street Fighter",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/5D4037/fff?text=Street+Fighter",
                gifImg: "https://via.placeholder.com/300x200/6D4C41/fff?text=GIF+Preview",
                banner: "popular",
                url: "#street-fighter"
            },
            {
                id: 23,
                title: "Warzone Legends",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/455A64/fff?text=Warzone+Legends",
                gifImg: "https://via.placeholder.com/300x200/546E7A/fff?text=GIF+Preview",
                url: "#warzone-legends"
            },
            {
                id: 24,
                title: "Shadow Strike",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/263238/fff?text=Shadow+Strike",
                gifImg: "https://via.placeholder.com/300x200/37474F/fff?text=GIF+Preview",
                banner: "hot",
                url: "#shadow-strike"
            },
            {
                id: 25,
                title: "Dragon Slayer",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/D32F2F/fff?text=Dragon+Slayer",
                gifImg: "https://via.placeholder.com/300x200/E53935/fff?text=GIF+Preview",
                url: "#dragon-slayer"
            },
            {
                id: 26,
                title: "Space Invaders",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/7B1FA2/fff?text=Space+Invaders",
                gifImg: "https://via.placeholder.com/300x200/8E24AA/fff?text=GIF+Preview",
                banner: "new",
                url: "#space-invaders"
            },
            {
                id: 27,
                title: "Zombie Apocalypse",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/C2185B/fff?text=Zombie+Apocalypse",
                gifImg: "https://via.placeholder.com/300x200/D81B60/fff?text=GIF+Preview",
                url: "#zombie-apocalypse"
            },
            {
                id: 28,
                title: "Battle Royale",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/0288D1/fff?text=Battle+Royale",
                gifImg: "https://via.placeholder.com/300x200/039BE5/fff?text=GIF+Preview",
                banner: "popular",
                url: "#battle-royale"
            },
            {
                id: 29,
                title: "Stealth Ops",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/512DA8/fff?text=Stealth+Ops",
                gifImg: "https://via.placeholder.com/300x200/5E35B1/fff?text=GIF+Preview",
                url: "#stealth-ops"
            },
            {
                id: 30,
                title: "Super Soldier",
                category: "action",
                staticImg: "https://via.placeholder.com/300x200/303F9F/fff?text=Super+Soldier",
                gifImg: "https://via.placeholder.com/300x200/3949AB/fff?text=GIF+Preview",
                banner: "hot",
                url: "#super-soldier"
            }
        ]
    },
    {
        id: "puzzle",
        title: "Puzzle Games",
        games: [
            {
                id: 31,
                title: "Block Puzzle",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/009688/fff?text=Block+Puzzle",
                gifImg: "https://via.placeholder.com/300x200/26A69A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#block-puzzle"
            },
            {
                id: 32,
                title: "Sudoku Pro",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Sudoku+Pro",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                url: "#sudoku-pro"
            },
            {
                id: 33,
                title: "Word Search",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/7E57C2/fff?text=Word+Search",
                gifImg: "https://via.placeholder.com/300x200/9575CD/fff?text=GIF+Preview",
                banner: "new",
                url: "#word-search"
            },
            {
                id: 34,
                title: "Crossword",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/EF5350/fff?text=Crossword",
                gifImg: "https://via.placeholder.com/300x200/EF9A9A/fff?text=GIF+Preview",
                url: "#crossword"
            },
            {
                id: 35,
                title: "Jewel Match",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/43A047/fff?text=Jewel+Match",
                gifImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=GIF+Preview",
                banner: "hot",
                url: "#jewel-match"
            },
            {
                id: 36,
                title: "Pipe Dream",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=Pipe+Dream",
                gifImg: "https://via.placeholder.com/300x200/7986CB/fff?text=GIF+Preview",
                url: "#pipe-dream"
            },
            {
                id: 37,
                title: "Mahjong Solitaire",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=Mahjong+Solitaire",
                gifImg: "https://via.placeholder.com/300x200/4DD0E1/fff?text=GIF+Preview",
                banner: "popular",
                url: "#mahjong-solitaire"
            },
            {
                id: 38,
                title: "Tetris Blitz",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/EC407A/fff?text=Tetris+Blitz",
                gifImg: "https://via.placeholder.com/300x200/F06292/fff?text=GIF+Preview",
                url: "#tetris-blitz"
            },
            {
                id: 39,
                title: "Candy Crush",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=Candy+Crush",
                gifImg: "https://via.placeholder.com/300x200/BA68C8/fff?text=GIF+Preview",
                banner: "hot",
                url: "#candy-crush"
            },
            {
                id: 40,
                title: "Bubble Shooter",
                category: "puzzle",
                staticImg: "https://via.placeholder.com/300x200/FFA000/fff?text=Bubble+Shooter",
                gifImg: "https://via.placeholder.com/300x200/FFB300/fff?text=GIF+Preview",
                url: "#bubble-shooter"
            }
        ]
    },
    {
        id: "sports",
        title: "Sports Games",
        games: [
            {
                id: 41,
                title: "Basketball Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/2196F3/fff?text=Basketball+Pro",
                gifImg: "https://via.placeholder.com/300x200/03A9F4/fff?text=GIF+Preview",
                banner: "hot",
                url: "#basketball-pro"
            },
            {
                id: 42,
                title: "Football Legends",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Football+Legends",
                gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=GIF+Preview",
                banner: "popular",
                url: "#football-legends"
            },
            {
                id: 43,
                title: "Tennis Championship",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Tennis+Championship",
                gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=GIF+Preview",
                banner: "new",
                url: "#tennis-championship"
            },
            {
                id: 44,
                title: "Golf Masters",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/009688/fff?text=Golf+Masters",
                gifImg: "https://via.placeholder.com/300x200/26A69A/fff?text=GIF+Preview",
                url: "#golf-masters"
            },
            {
                id: 45,
                title: "Boxing Knockout",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Boxing+Knockout",
                gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=GIF+Preview",
                banner: "hot",
                url: "#boxing-knockout"
            },
            {
                id: 46,
                title: "Hockey Shootout",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=Hockey+Shootout",
                gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=GIF+Preview",
                url: "#hockey-shootout"
            },
            {
                id: 47,
                title: "Baseball Pro",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Baseball+Pro",
                gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=GIF+Preview",
                banner: "new",
                url: "#baseball-pro"
            },
            {
                id: 48,
                title: "Soccer Manager",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Soccer+Manager",
                gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=GIF+Preview",
                url: "#soccer-manager"
            },
            {
                id: 49,
                title: "Cricket Challenge",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Cricket+Challenge",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                banner: "popular",
                url: "#cricket-challenge"
            },
            {
                id: 50,
                title: "Extreme Skate",
                category: "sports",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Extreme+Skate",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                url: "#extreme-skate"
            }
        ]
    },
    {
        id: "io",
        title: "IO Games",
        games: [
            {
                id: 51,
                title: "Diep.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/9C27B0/fff?text=Diep.io",
                gifImg: "https://via.placeholder.com/300x200/AB47BC/fff?text=GIF+Preview",
                banner: "hot",
                url: "#diep-io"
            },
            {
                id: 52,
                title: "Moomoo.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/00BCD4/fff?text=Moomoo.io",
                gifImg: "https://via.placeholder.com/300x200/26C6DA/fff?text=GIF+Preview",
                url: "#moomoo-io"
            },
            {
                id: 53,
                title: "Krunker.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FF5722/fff?text=Krunker.io",
                gifImg: "https://via.placeholder.com/300x200/FF7043/fff?text=GIF+Preview",
                banner: "popular",
                url: "#krunker-io"
            },
            {
                id: 54,
                title: "Surviv.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/4CAF50/fff?text=Surviv.io",
                gifImg: "https://via.placeholder.com/300x200/66BB6A/fff?text=GIF+Preview",
                banner: "new",
                url: "#surviv-io"
            },
            {
                id: 55,
                title: "ZombsRoyale.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/3F51B5/fff?text=ZombsRoyale.io",
                gifImg: "https://via.placeholder.com/300x200/5C6BC0/fff?text=GIF+Preview",
                url: "#zombsroyale-io"
            },
            {
                id: 56,
                title: "Bonk.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/F44336/fff?text=Bonk.io",
                gifImg: "https://via.placeholder.com/300x200/EF5350/fff?text=GIF+Preview",
                banner: "hot",
                url: "#bonk-io"
            },
            {
                id: 57,
                title: "Skribbl.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/FFC107/fff?text=Skribbl.io",
                gifImg: "https://via.placeholder.com/300x200/FFCA28/fff?text=GIF+Preview",
                url: "#skribbl-io"
            },
            {
                id: 58,
                title: "Paper.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/607D8B/fff?text=Paper.io",
                gifImg: "https://via.placeholder.com/300x200/78909C/fff?text=GIF+Preview",
                banner: "new",
                url: "#paper-io"
            },
            {
                id: 59,
                title: "Wings.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/8BC34A/fff?text=Wings.io",
                gifImg: "https://via.placeholder.com/300x200/9CCC65/fff?text=GIF+Preview",
                url: "#wings-io"
            },
            {
                id: 60,
                title: "Spinz.io",
                category: "io",
                staticImg: "https://via.placeholder.com/300x200/795548/fff?text=Spinz.io",
                gifImg: "https://via.placeholder.com/300x200/8D6E63/fff?text=GIF+Preview",
                banner: "popular",
                url: "#spinz-io"
            }
        ]
    }
];
    
    // Render history items
    function renderHistory(items) {
        if (items.length === 0) {
            historyItemsContainer.innerHTML = `
                <div class="no-history">
                    <i class='bx bx-history' style="font-size: 40px; margin-bottom: 10px;"></i>
                    <p>No game history yet. Play some games to see them here!</p>
                </div>
            `;
            return;
        }

        historyItemsContainer.innerHTML = items.map(item => {
            const game = findGameById(item.gameId);
            if (!game) return '';
            
            return `
                <div class="history-item" data-game-id="${item.gameId}">
                    <img src="${game.staticImg}" class="history-thumbnail">
                    <div class="history-content">
                        <h3 class="history-title">${game.title}</h3>
                        <div class="history-date">${formatDate(item.timestamp?.toDate())}</div>
                        <button class="remove-btn" data-history-id="${item.id}">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeHistoryItem(btn.dataset.historyId);
            });
        });
    }
    
    // Helper function to find game by ID
    function findGameById(id) {
        for (const category of gamesData) {
            const game = category.games.find(g => g.id === id);
            if (game) return game;
        }
        return null;
    }
    
    // Format date
    function formatDate(date) {
        if (!date) return "Unknown date";
        return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
    }
    
    // Remove single history item
    function removeHistoryItem(historyId) {
        if (!auth.currentUser || !confirm("Remove this item from history?")) return;
        
        db.collection('users').doc(auth.currentUser.uid).collection('history')
            .doc(historyId).delete()
            .then(() => {
                userHistory = userHistory.filter(item => item.id !== historyId);
                renderHistory(userHistory);
            })
            .catch(error => {
                console.error("Error removing history item:", error);
            });
    }
    
    // Clear all history
    clearHistoryBtn.addEventListener('click', function() {
        if (!auth.currentUser || !confirm("Clear ALL your game history?")) return;
        
        const batch = db.batch();
        const historyRef = db.collection('users').doc(auth.currentUser.uid).collection('history');
        
        historyRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            userHistory = [];
            renderHistory([]);
        })
        .catch(error => {
            console.error("Error clearing history:", error);
        });
    });
    
    // Filter history
    searchHistoryInput.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const filtered = userHistory.filter(item => {
            const game = findGameById(item.gameId);
            return game?.title.toLowerCase().includes(term);
        });
        renderHistory(filtered);
    });
    
    // Show login prompt
    function showLoginPrompt() {
        historyItemsContainer.innerHTML = `
            <div class="no-history">
                <i class='bx bx-log-in' style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Please sign in to view your game history</p>
                <button id="signInBtn" style="margin-top: 15px; padding: 8px 16px; background: #4361ee; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Sign In
                </button>
            </div>
        `;
        
        document.getElementById('signInBtn')?.addEventListener('click', function() {
            auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        });
    }
});
