import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BeniasBoard } from '../BeniasBoard';
import { CardRound } from '../../cards/CardRound';
import { TeamBar } from '../../TeamBar/TeamBar';
import { BENIAS_CARDS } from '../../../consts/BeniasCards';
import { useGameState } from '../../../state/GameState';
import { DEFAULT_BOARD_SIZE, DEFAULT_ROUND_DURATION } from '../../settings/settings.constants';
import type { TeamSettings } from '../../settings/settings.types';
import { loadSessionGame, clearSessionGame } from '../../../utils/sessionGame';
import './GameBoardScreen.css';
import { VictoryModal } from '../../VictoryModal/VictoryModal';

const MOVEMENT_DELAY = 500;

interface NavigationState {
    roundDurationSeconds?: number;
    teams?: TeamSettings[];
    boardSize?: number;
    resumeSession?: boolean;
}

export const GameBoardScreen: React.FC = () => {
    const [showCardRound, setShowCardRound] = useState(false);
    const [victoryTeam, setVictoryTeam] = useState<{ name: string; color: string } | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const {
        teams,
        currentTeamIndex,
        boardSize,
        roundDurationSeconds,
        setTeams,
        setBoardSize,
        setRoundDurationSeconds,
        nextTeam,
        updateTeamPosition,
        hydrateFromPersistedGame,
        saveToSession
    } = useGameState();

    const state = location.state as NavigationState | undefined;
    const hasInitialized = useRef(false);

    // Initialize game state on mount
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Check if we should resume from session
        if (state?.resumeSession) {
            const persisted = loadSessionGame();
            if (persisted) {
                hydrateFromPersistedGame(persisted);
                // Check if there was a winner
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
            // Clear any existing session when starting a new game
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
            setIsInitialized(true);
            return;
        }

        // Fallback: try to restore from session (e.g., page refresh)
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

    // Auto-save to session when game state changes
    useEffect(() => {
        if (!isInitialized || teams.length === 0) return;
        saveToSession();
    }, [teams, currentTeamIndex, boardSize, roundDurationSeconds, isInitialized]);

    const handleRoundEnd = async (score: number) => {
        if (teams.length === 0) return;

        setShowCardRound(false);

        const activeTeam = teams[currentTeamIndex];
        let targetPos = activeTeam.position + score;

        // Edge cases
        if (targetPos < 0) targetPos = 0;

        const lastCellIndex = boardSize - 1;
        if (targetPos > lastCellIndex) targetPos = lastCellIndex;

        if (targetPos === activeTeam.position) {
            nextTeam();
            return;
        }

        // Animate movement step by step
        const direction = targetPos > activeTeam.position ? 1 : -1;
        let currentPos = activeTeam.position;

        while (currentPos !== targetPos) {
            await new Promise(resolve => setTimeout(resolve, MOVEMENT_DELAY));
            currentPos += direction;
            updateTeamPosition(activeTeam.id, currentPos);
        }

        await new Promise(resolve => setTimeout(resolve, MOVEMENT_DELAY));

        if (targetPos === lastCellIndex) {
            showVictoryModalHandler(activeTeam);
        } else {
            nextTeam();
        }
    };

    const showVictoryModalHandler = (team: { name: string; color: string; id?: string }) => {
        setVictoryTeam(team);
        // Save winner to session so it persists on refresh
        saveToSession();
    };

    const handleStartRound = () => {
        if (!victoryTeam) {
            setShowCardRound(true);
        }
    };

    const handleBackToHome = () => {
        // Keep session intact so user can continue later
        // Session will be cleared when they start a new game from settings
        navigate('/');
    };

    return (
        <div className="game-board-screen">
            <BeniasBoard
                teams={teams.map((t: { id: string; name: string; color: string; position: number }) => ({
                    id: parseInt(t.id),
                    name: t.name,
                    color: t.color,
                    position: t.position
                }))}
                boardSize={boardSize}
            />

            <TeamBar
                onStartRound={handleStartRound}
                isRoundActive={showCardRound}
                isGameOver={!!victoryTeam}
            />

            {showCardRound && !victoryTeam && (
                <CardRound
                    cards={BENIAS_CARDS}
                    roundDurationSeconds={roundDurationSeconds}
                    onRoundEnd={handleRoundEnd}
                    onClose={() => setShowCardRound(false)}
                    teamPosition={teams[currentTeamIndex]?.position || 0}
                />
            )}

            <VictoryModal
                opened={!!victoryTeam}
                winnerTeam={victoryTeam}
                onBackToHome={handleBackToHome}
            />
        </div>
    );
};
