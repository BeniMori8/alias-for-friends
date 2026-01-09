import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameState } from '../../../state/GameState';
import { loadSessionGame, clearSessionGame } from '../../../utils/sessionGame';
import { DEFAULT_BOARD_SIZE, DEFAULT_ROUND_DURATION, DEFAULT_STEAL_ROUNDS_ENABLED } from '../../settings/settings.constants';
import type { TeamSettings } from '../../settings/settings.types';

interface NavigationState {
    roundDurationSeconds?: number;
    teams?: TeamSettings[];
    boardSize?: number;
    resumeSession?: boolean;
    stealRoundsEnabled?: boolean;
}

interface UseGameInitializationResult {
    isInitialized: boolean;
    stealRoundsEnabled: boolean;
    victoryTeam: { name: string; color: string } | null;
    setVictoryTeam: (team: { name: string; color: string } | null) => void;
}

export const useGameInitialization = (): UseGameInitializationResult => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [stealRoundsEnabled, setStealRoundsEnabled] = useState(DEFAULT_STEAL_ROUNDS_ENABLED);
    const [victoryTeam, setVictoryTeam] = useState<{ name: string; color: string } | null>(null);

    const location = useLocation();
    const hasInitialized = useRef(false);
    const {
        setTeams,
        setBoardSize,
        setRoundDurationSeconds,
        hydrateFromPersistedGame,
    } = useGameState();

    const state = location.state as NavigationState | undefined;

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Check if we should resume from session
        if (state?.resumeSession) {
            const persisted = loadSessionGame();
            if (persisted) {
                hydrateFromPersistedGame(persisted);
                if (persisted.winnerTeamId) {
                    const winner = persisted.teams.find(t => t.id === persisted.winnerTeamId);
                    if (winner) {
                        setVictoryTeam({ name: winner.name, color: winner.color });
                    }
                }
                setIsInitialized(true);
                return;
            }
        }

        // Check if navigation state has teams (new game from settings)
        if (state?.teams && state.teams.length > 0) {
            clearSessionGame();
            const newTeams = state.teams.map(t => ({
                id: t.id.toString(),
                name: t.name,
                color: t.color,
                position: 0
            }));
            setTeams(newTeams);
            setBoardSize(state.boardSize ?? DEFAULT_BOARD_SIZE);
            setRoundDurationSeconds(state.roundDurationSeconds ?? DEFAULT_ROUND_DURATION);
            setStealRoundsEnabled(state.stealRoundsEnabled ?? DEFAULT_STEAL_ROUNDS_ENABLED);
            setIsInitialized(true);
            return;
        }

        // Fallback: try to restore from session
        const persisted = loadSessionGame();
        if (persisted) {
            hydrateFromPersistedGame(persisted);
            if (persisted.winnerTeamId) {
                const winner = persisted.teams.find(t => t.id === persisted.winnerTeamId);
                if (winner) {
                    setVictoryTeam({ name: winner.name, color: winner.color });
                }
            }
            setIsInitialized(true);
            return;
        }

        // No session and no navigation state - use defaults
        const defaultTeams: TeamSettings[] = [
            { id: 1, name: 'קבוצה 1', color: '#FFD700' },
            { id: 2, name: 'קבוצה 2', color: '#228BE6' },
        ];
        setTeams(defaultTeams.map(t => ({
            id: t.id.toString(),
            name: t.name,
            color: t.color,
            position: 0
        })));
        setBoardSize(DEFAULT_BOARD_SIZE);
        setRoundDurationSeconds(DEFAULT_ROUND_DURATION);
        setIsInitialized(true);
    }, []);

    return {
        isInitialized,
        stealRoundsEnabled,
        victoryTeam,
        setVictoryTeam,
    };
};
