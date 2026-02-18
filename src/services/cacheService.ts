export const cacheService = {
    cache: {},

    set(key, value, ttl = 3600000) {
        const expirationTime = Date.now() + ttl;
        this.cache[key] = { value, expirationTime };
    },

    get(key) {
        const item = this.cache[key];
        if (!item) return null;
        if (Date.now() > item.expirationTime) {
            delete this.cache[key];
            return null;
        }
        return item.value;
    },

    remove(key) {
        delete this.cache[key];
    },

    clear() {
        this.cache = {};
    },

    has(key) {
        const item = this.cache[key];
        if (!item) return false;
        if (Date.now() > item.expirationTime) {
            delete this.cache[key];
            return false;
        }
        return true;
    },

    getOrSet(key, fetchFn, ttl = 3600000) {
        const cached = this.get(key);
        if (cached) return Promise.resolve(cached);
        
        return fetchFn().then(value => {
            this.set(key, value, ttl);
            return value;
        });
    }
};