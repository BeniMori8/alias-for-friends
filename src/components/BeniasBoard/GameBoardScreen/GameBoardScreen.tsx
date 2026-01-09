import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeniasBoard } from '../BeniasBoard';
import { CardRound } from '../../cards/CardRound';
import { StealRoundView } from '../../cards/StealRoundView/StealRoundView';
import { TeamBar } from '../../TeamBar/TeamBar';
import { BENIAS_CARDS } from '../../../consts/BeniasCards';
import { useGameState } from '../../../state/GameState';
import { isStealCell } from '../types';
import './GameBoardScreen.css';
import { VictoryModal } from '../../VictoryModal/VictoryModal';
import { useGameInitialization } from './useGameInitialization';
import { useTeamMovement } from './useTeamMovement';
import { createHandleRoundEnd, createHandleStealRoundEnd } from './roundHandlers';

export const GameBoardScreen: React.FC = () => {
    const [showCardRound, setShowCardRound] = useState(false);
    const [showStealRound, setShowStealRound] = useState(false);

    const navigate = useNavigate();
    const { isInitialized, stealRoundsEnabled, victoryTeam, setVictoryTeam } = useGameInitialization();
    const { animateTeamMovement } = useTeamMovement();
    const {
        teams,
        currentTeamIndex,
        boardSize,
        roundDurationSeconds,
        nextTeam,
        saveToSession
    } = useGameState();

    // Auto-save to session when game state changes
    useEffect(() => {
        if (!isInitialized || teams.length === 0) return;
        saveToSession();
    }, [teams, currentTeamIndex, boardSize, roundDurationSeconds, isInitialized]);

    const showVictoryModalHandler = (team: { name: string; color: string }) => {
        setVictoryTeam(team);
        saveToSession();
    };

    const handlerDeps = useMemo(() => ({
        teams,
        setShowCardRound,
        setShowStealRound,
        animateTeamMovement,
        showVictoryModalHandler,
        nextTeam,
    }), [teams, animateTeamMovement, nextTeam]);

    const handleRoundEnd = useMemo(() => createHandleRoundEnd(handlerDeps), [handlerDeps]);
    const handleStealRoundEnd = useMemo(() => createHandleStealRoundEnd(handlerDeps), [handlerDeps]);

    const handleStartRound = () => {
        if (!victoryTeam) {
            const currentTeam = teams[currentTeamIndex];
            const isOnStealCell = currentTeam && stealRoundsEnabled && isStealCell(currentTeam.position, boardSize);
            if (isOnStealCell) {
                setShowStealRound(true);
            } else {
                setShowCardRound(true);
            }
        }
    };

    const handleBackToHome = () => navigate('/');

    const teamInfoForCardRound = teams.map(t => ({ id: t.id, name: t.name, color: t.color }));
    const activeTeamId = teams[currentTeamIndex]?.id ?? '';

    return (
        <div className="game-board-screen">
            <BeniasBoard
                teams={teams.map(t => ({
                    id: parseInt(t.id),
                    name: t.name,
                    color: t.color,
                    position: t.position
                }))}
                boardSize={boardSize}
            />

            <TeamBar
                onStartRound={handleStartRound}
                isRoundActive={showCardRound || showStealRound}
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

            {showStealRound && !victoryTeam && (
                <StealRoundView
                    cards={BENIAS_CARDS}
                    teams={teamInfoForCardRound}
                    teamPosition={teams[currentTeamIndex]?.position || 0}
                    onRoundEnd={handleStealRoundEnd}
                    onClose={() => setShowStealRound(false)}
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
