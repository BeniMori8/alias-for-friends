import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BeniasBoard } from '../BeniasBoard';
import { CardRound } from '../../cards/CardRound';
import { TeamBar } from '../../TeamBar/TeamBar';
import { BENIAS_CARDS } from '../../../consts/BeniasCards';
import { useGameState } from '../../../state/GameState';
import { DEFAULT_BOARD_SIZE, DEFAULT_ROUND_DURATION } from '../../settings/settings.constants';
import type { TeamSettings } from '../../settings/settings.types';
import type { RoundResult, RoundHistoryItem } from '../../cards/CardRound.types';
import { loadSessionGame, clearSessionGame } from '../../../utils/sessionGame';
import './GameBoardScreen.css';
import { VictoryModal } from '../../VictoryModal/VictoryModal';
import { CARD_STATUS, SCORE_VALUES } from '../../cards/CardRound.constants';

const MOVEMENT_DELAY = 500;

interface NavigationState {
    roundDurationSeconds?: number;
    teams?: TeamSettings[];
    boardSize?: number;
    resumeSession?: boolean;
}

// Helper to calculate score from history items
const scoreFromHistory = (items: RoundHistoryItem[]): number => {
    return items.reduce((acc, item) => {
        return acc + (item.status === CARD_STATUS.SUCCESS ? SCORE_VALUES.SUCCESS : SCORE_VALUES.FAIL);
    }, 0);
};

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

    // Helper to animate team movement
    const animateTeamMovement = async (teamId: string, fromPos: number, score: number): Promise<{ finalPos: number; isVictory: boolean }> => {
        const lastCellIndex = boardSize - 1;
        let targetPos = fromPos + score;

        // Clamp position
        if (targetPos < 0) targetPos = 0;
        if (targetPos > lastCellIndex) targetPos = lastCellIndex;

        if (targetPos === fromPos) {
            return { finalPos: fromPos, isVictory: false };
        }

        // Animate movement step by step
        const direction = targetPos > fromPos ? 1 : -1;
        let currentPos = fromPos;

        while (currentPos !== targetPos) {
            await new Promise(resolve => setTimeout(resolve, MOVEMENT_DELAY));
            currentPos += direction;
            updateTeamPosition(teamId, currentPos);
        }

        await new Promise(resolve => setTimeout(resolve, MOVEMENT_DELAY));

        return { finalPos: targetPos, isVictory: targetPos === lastCellIndex };
    };

    const handleRoundEnd = async (result: RoundResult) => {
        if (teams.length === 0) return;

        setShowCardRound(false);

        const activeTeam = teams.find(t => t.id === result.activeTeamId);
        if (!activeTeam) {
            nextTeam();
            return;
        }

        // Calculate scores
        const completedScore = scoreFromHistory(result.completedCards);
        const lastCardScore = result.lastShownCard
            ? (result.lastShownCard.status === CARD_STATUS.SUCCESS ? SCORE_VALUES.SUCCESS : SCORE_VALUES.FAIL)
            : 0;

        // Move active team by completed cards score
        const { finalPos: activeTeamFinalPos, isVictory: activeWon } = await animateTeamMovement(
            activeTeam.id,
            activeTeam.position,
            completedScore
        );

        if (activeWon) {
            showVictoryModalHandler(activeTeam);
            return;
        }

        // If there's a stolen card, move the steal team
        if (result.stolenByTeamId && result.lastShownCard) {
            const stealTeam = teams.find(t => t.id === result.stolenByTeamId);
            if (stealTeam) {
                // Get the current position (may have changed if same team)
                const stealTeamStartPos = stealTeam.id === activeTeam.id
                    ? activeTeamFinalPos
                    : stealTeam.position;

                const { isVictory: stealWon } = await animateTeamMovement(
                    stealTeam.id,
                    stealTeamStartPos,
                    lastCardScore
                );

                if (stealWon) {
                    showVictoryModalHandler(stealTeam);
                    return;
                }
            }
        }

        nextTeam();
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

    // Prepare team info for CardRound
    const teamInfoForCardRound = teams.map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
    }));

    const activeTeamId = teams[currentTeamIndex]?.id ?? '';

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
                    teams={teamInfoForCardRound}
                    activeTeamId={activeTeamId}
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
