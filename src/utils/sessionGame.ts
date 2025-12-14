/**
 * Session Game Persistence Utilities
 * Stores a single game session in sessionStorage with 24h TTL
 */

const SESSION_GAME_KEY = 'BENIAS_SESSION_GAME';
const TTL_24_HOURS_MS = 24 * 60 * 60 * 1000;

// Types for persisted game state
export interface PersistedTeam {
    id: string;
    name: string;
    color: string;
    position: number;
}

export interface PersistedGameSettings {
    roundDurationSeconds: number;
    boardSize: number;
}

export interface PersistedGameState {
    version: 1;
    savedAt: number;
    expiresAt: number;
    settings: PersistedGameSettings;
    teams: PersistedTeam[];
    currentTeamIndex: number;
    winnerTeamId?: string | null;
}

/**
 * Validates the basic shape of persisted state
 */
const isValidPersistedState = (data: unknown): data is PersistedGameState => {
    if (!data || typeof data !== 'object') return false;

    const state = data as Record<string, unknown>;

    return (
        state.version === 1 &&
        typeof state.savedAt === 'number' &&
        typeof state.expiresAt === 'number' &&
        typeof state.settings === 'object' &&
        state.settings !== null &&
        Array.isArray(state.teams) &&
        typeof state.currentTeamIndex === 'number'
    );
};

/**
 * Save game state to localStorage (persists across tabs and browser closes)
 */
export const saveSessionGame = (state: PersistedGameState): void => {
    try {
        localStorage.setItem(SESSION_GAME_KEY, JSON.stringify(state));
    } catch {
        // Silently fail if storage is full or unavailable
    }
};

/**
 * Load game state from localStorage
 * Returns null if missing, expired, or invalid
 */
export const loadSessionGame = (): PersistedGameState | null => {
    try {
        const raw = localStorage.getItem(SESSION_GAME_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        if (!isValidPersistedState(parsed)) {
            clearSessionGame();
            return null;
        }

        // Check expiration
        if (parsed.expiresAt < Date.now()) {
            clearSessionGame();
            return null;
        }

        return parsed;
    } catch {
        clearSessionGame();
        return null;
    }
};

/**
 * Clear game session from storage
 */
export const clearSessionGame = (): void => {
    localStorage.removeItem(SESSION_GAME_KEY);
};

/**
 * Check if a valid session game exists
 */
export const hasValidSessionGame = (): boolean => {
    return loadSessionGame() !== null;
};

export { TTL_24_HOURS_MS };
