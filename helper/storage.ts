function setSessionStorage<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function getSessionStorage<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    if (data !== null) {
        try {
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Error parsing sessionStorage item "${key}":`, error);
        }
    }
    return null;
}

export { setSessionStorage, getSessionStorage };
