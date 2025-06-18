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

function setLocalStorage<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

function getLocalStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    const data = localStorage.getItem(key);
    if (data !== null) {
        try {
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
        }
    }
    return null;
}

function resetLocalStorage(key: string): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
    }
}

export { setSessionStorage, getSessionStorage, getLocalStorage, setLocalStorage, resetLocalStorage };
