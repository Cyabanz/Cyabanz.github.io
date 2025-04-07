// Game Data (Simplified)
const games = [
    {
        id: 1,
        title: "Bullet Force",
        category: "action",
        staticImg: "https://via.placeholder.com/300x200/333/fff?text=Bullet+Force",
        gifImg: "https://via.placeholder.com/300x200/555/fff?text=GIF+Preview",
        banner: "hot",
        url: "#bullet-force"
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
];

// DOM Elements
const gameGrid = document.getElementById('gameGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGames(games);
    setupEventListeners();
});

// Render Games
function renderGames(gamesToRender) {
    gameGrid.innerHTML = gamesToRender.map(game => `
        <div class="game-card">
            <a href="${game.url}" class="game-link">
                <div class="thumbnail-container">
                    ${game.banner ? `
                    <div class="ribbon ${game.banner} ${game.banner === 'hot' ? 'pulse' : ''}">
                        <i class='${getBannerIcon(game.banner)}'></i>
                        ${game.banner.toUpperCase()}
                    </div>` : ''}
                    <img src="${game.staticImg}" class="game-thumbnail static" alt="${game.title}">
                    <img src="${game.gifImg}" class="game-thumbnail gif" alt="${game.title} GIF">
                </div>
                <div class="game-title">${game.title}</div>
            </a>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Category tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterGames(category, searchInput.value);
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.tab-btn.active').dataset.category;
        filterGames(activeCategory, searchInput.value);
    });
}

// Filter Games
function filterGames(category, searchTerm) {
    let filteredGames = games;
    
    // Filter by category
    if (category !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(term)
        );
    }
    
    renderGames(filteredGames);
}

// Helper Function
function getBannerIcon(type) {
    const icons = {
        hot: 'bx bx-hot',
        new: 'bx bx-star',
        popular: 'bx bx-trending-up'
    };
    return icons[type] || 'bx bx-info-circle';
}