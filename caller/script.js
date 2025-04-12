function createFavoriteGameCard(game) {
    const card = document.createElement('div');
    card.className = 'favorite-game-card';
    card.dataset.id = game.id;
    
    card.innerHTML = `
        <a href="${game.url}" class="game-link">
            <div class="thumbnail-container">
                ${game.banner ? createBannerElement(game.banner) : ''}
                <img src="${game.staticImg}" class="game-thumbnail" alt="${game.title}" 
                     onerror="this.src='https://via.placeholder.com/300x200'">
            </div>
            <div class="game-title">${game.title}</div>
        </a>
        <button class="remove-favorite-btn">
            <i class="bx bx-trash"></i>
        </button>
    `;
    
    card.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(game.id).then(() => {
            card.remove();
            if (!favoritesContainer.children.length) {
                favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite games yet.</p>';
            }
        });
    });
    
    return card;
}