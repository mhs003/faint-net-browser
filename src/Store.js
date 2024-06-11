class LocalStorageAPI {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key} to localStorage`, error);
        }
    }

    getItem(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage`, error);
        }
    }

    hasItem(key) {
        return this.getItem(key) !== null;
    }

    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(
                `Error removing item ${key} from localStorage`,
                error
            );
        }
    }

    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("Error clearing localStorage", error);
        }
    }
}

module.exports = new LocalStorageAPI();
