class FavoritoService {
    constructor() {
        this.favorites = new Map(); // Using a Map to store favorites by user ID
    }

    // Get all favorites
    getAll() {
        return Array.from(this.favorites.values()).flat();
    }

    // Get favorite by ID
    getById(userId, favoriteId) {
        const userFavorites = this.favorites.get(userId);
        return userFavorites ? userFavorites.find(fav => fav.id === favoriteId) : null;
    }

    // Check if an item is a favorite
    isFavorite(userId, itemId) {
        const userFavorites = this.favorites.get(userId);
        return userFavorites ? userFavorites.some(fav => fav.id === itemId) : false;
    }

    // Add a favorite
    addFavorite(userId, item) {
        if (!this.favorites.has(userId)) {
            this.favorites.set(userId, []);
        }
        this.favorites.get(userId).push(item);
    }

    // Remove a favorite
    removeFavorite(userId, favoriteId) {
        const userFavorites = this.favorites.get(userId);
        if (userFavorites) {
            this.favorites.set(userId, userFavorites.filter(fav => fav.id !== favoriteId));
        }
    }

    // Get favorite count
    getFavoriteCount(userId) {
        const userFavorites = this.favorites.get(userId);
        return userFavorites ? userFavorites.length : 0;
    }

    // Get user favorites
    getUserFavorites(userId) {
        return this.favorites.get(userId) || [];
    }
}

export default FavoritoService;
