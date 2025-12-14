/**
 * Access Authentication Helpers
 * Manages localStorage-based access with TTL
 */

const STORAGE_KEY = 'BENIAS_ACCESS_AUTH';
const TTL_7_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface AccessAuthRecord {
    authenticated: true;
    expiresAt: number;
}

export const getAccessAuth = (): AccessAuthRecord | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as AccessAuthRecord;

        if (parsed.authenticated !== true || typeof parsed.expiresAt !== 'number') {
            clearAccessAuth();
            return null;
        }

        return parsed;
    } catch {
        clearAccessAuth();
        return null;
    }
};

export const setAccessAuth = (ttlMs: number = TTL_7_DAYS_MS): void => {
    const record: AccessAuthRecord = {
        authenticated: true,
        expiresAt: Date.now() + ttlMs,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
};

export const clearAccessAuth = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};

export const isAccessAuthValid = (): boolean => {
    const auth = getAccessAuth();
    if (!auth) return false;

    if (auth.expiresAt < Date.now()) {
        clearAccessAuth();
        return false;
    }

    return true;
};

export { TTL_7_DAYS_MS };
