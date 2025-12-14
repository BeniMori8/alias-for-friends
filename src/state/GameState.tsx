import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_BOARD_SIZE, DEFAULT_ROUND_DURATION } from '../components/settings/settings.constants';
import {
    saveSessionGame,
    clearSessionGame,
    TTL_24_HOURS_MS,
    type PersistedGameState,
    type PersistedTeam
} from '../utils/sessionGame';

export interface Team {
    id: string;
    name: string;
    color: string;
    position: number;
}

interface GameState {
    teams: Team[];
    currentTeamIndex: number;
    boardSize: number;
    roundDurationSeconds: number;
    winnerTeamId: string | null;
    setTeams: (teams: Team[]) => void;
    setBoardSize: (size: number) => void;
    setRoundDurationSeconds: (duration: number) => void;
    setWinnerTeamId: (teamId: string | null) => void;
    nextTeam: () => void;
    updateTeamPosition: (teamId: string, newPosition: number) => void;
    setCurrentTeamIndex: (index: number) => void;
    // Session persistence methods
    hydrateFromPersistedGame: (persisted: PersistedGameState) => void;
    getPersistedSnapshot: () => PersistedGameState;
    saveToSession: () => void;
    clearGame: () => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeamsState] = useState<Team[]>([]);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [boardSize, setBoardSizeState] = useState(DEFAULT_BOARD_SIZE);
    const [roundDurationSeconds, setRoundDurationSecondsState] = useState(DEFAULT_ROUND_DURATION);
    const [winnerTeamId, setWinnerTeamIdState] = useState<string | null>(null);

    const setTeams = (newTeams: Team[]) => {
        setTeamsState(newTeams);
        setCurrentTeamIndex(0);
    };

    const setBoardSize = (size: number) => {
        setBoardSizeState(size);
    };

    const setRoundDurationSeconds = (duration: number) => {
        setRoundDurationSecondsState(duration);
    };

    const setWinnerTeamId = (teamId: string | null) => {
        setWinnerTeamIdState(teamId);
    };

    const nextTeam = () => {
        if (teams.length === 0) return;
        setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
    };

    const updateTeamPosition = (teamId: string, newPosition: number) => {
        setTeamsState((prev) =>
            prev.map((team) =>
                team.id === teamId ? { ...team, position: newPosition } : team
            )
        );
    };

    /**
     * Hydrate game state from persisted session
     */
    const hydrateFromPersistedGame = (persisted: PersistedGameState) => {
        const hydratedTeams: Team[] = persisted.teams.map((t: PersistedTeam) => ({
            id: t.id,
            name: t.name,
            color: t.color,
            position: t.position,
        }));

        setTeamsState(hydratedTeams);
        setCurrentTeamIndex(persisted.currentTeamIndex);
        setBoardSizeState(persisted.settings.boardSize);
        setRoundDurationSecondsState(persisted.settings.roundDurationSeconds);
        setWinnerTeamIdState(persisted.winnerTeamId ?? null);
    };

    /**
     * Create a snapshot of current game state for persistence
     */
    const getPersistedSnapshot = (): PersistedGameState => {
        const persistedTeams: PersistedTeam[] = teams.map((t) => ({
            id: t.id,
            name: t.name,
            color: t.color,
            position: t.position,
        }));

        return {
            version: 1,
            savedAt: Date.now(),
            expiresAt: Date.now() + TTL_24_HOURS_MS,
            settings: {
                roundDurationSeconds,
                boardSize,
            },
            teams: persistedTeams,
            currentTeamIndex,
            winnerTeamId,
        };
    };

    /**
     * Save current state to session storage
     */
    const saveToSession = () => {
        if (teams.length === 0) return;
        saveSessionGame(getPersistedSnapshot());
    };

    /**
     * Clear game state and session storage
     */
    const clearGame = () => {
        setTeamsState([]);
        setCurrentTeamIndex(0);
        setBoardSizeState(DEFAULT_BOARD_SIZE);
        setRoundDurationSecondsState(DEFAULT_ROUND_DURATION);
        setWinnerTeamIdState(null);
        clearSessionGame();
    };

    const value: GameState = {
        teams,
        currentTeamIndex,
        boardSize,
        roundDurationSeconds,
        winnerTeamId,
        setTeams,
        setBoardSize,
        setRoundDurationSeconds,
        setWinnerTeamId,
        nextTeam,
        updateTeamPosition,
        setCurrentTeamIndex,
        hydrateFromPersistedGame,
        getPersistedSnapshot,
        saveToSession,
        clearGame,
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};
