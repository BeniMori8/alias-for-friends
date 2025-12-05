import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { BeniasBoard } from '../BeniasBoard';
import { CardRound } from '../../cards/CardRound';
import { TeamBar } from '../../TeamBar/TeamBar';
import { BENIAS_CARDS } from '../../../consts/BeniasCards';
import { useGameState } from '../../../state/GameState';
import { BOARD_CELLS } from '../types';
import type { TeamSettings } from '../../settings/settings.types';
import './GameBoardScreen.css';
import { VictoryModal } from './VictoryModal/VictoryModal';

const DEFAULT_ROUND_DURATION = 90;
const CONFETTI_DURATION = 3000;
const MOVEMENT_DELAY = 500;

export const GameBoardScreen: React.FC = () => {
    const [showCardRound, setShowCardRound] = useState(false);
    const [victoryTeam, setVictoryTeam] = useState<{ name: string; color: string } | null>(null);

    const location = useLocation();
    const { teams, currentTeamIndex, setTeams, nextTeam, updateTeamPosition } = useGameState();

    const state = location.state as { roundDurationSeconds?: number; teams?: TeamSettings[] } | undefined;
    const roundDurationSeconds = state?.roundDurationSeconds ?? DEFAULT_ROUND_DURATION;

    // Initialize teams on mount
    useEffect(() => {
        const defaultTeams: TeamSettings[] = [
            { id: 1, name: 'קבוצה 1', color: '#FFD700' },
            { id: 2, name: 'קבוצה 2', color: '#228BE6' },
        ];

        const initialTeams = state?.teams ?? defaultTeams;

        setTeams(initialTeams.map(t => ({
            id: t.id.toString(),
            name: t.name,
            color: t.color,
            position: 0
        })));
    }, []);

    const handleRoundEnd = async (score: number) => {
        if (teams.length === 0) return;

        setShowCardRound(false);

        const activeTeam = teams[currentTeamIndex];
        let targetPos = activeTeam.position + score;

        // Edge cases
        if (targetPos < 0) targetPos = 0;

        const lastCellIndex = BOARD_CELLS.length - 1;
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
            showVictoryModal(activeTeam);
        } else {
            nextTeam();
        }
    };

    const showVictoryModal = (team: { name: string; color: string }) => {
        setVictoryTeam(team);
        triggerConfetti(team.color);
    };

    const triggerConfetti = (teamColor: string) => {
        const end = Date.now() + CONFETTI_DURATION;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: [teamColor, '#ffffff']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: [teamColor, '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    return (
        <div className="game-board-screen">
            <BeniasBoard teams={teams.map(t => ({
                id: parseInt(t.id),
                name: t.name,
                color: t.color,
                position: t.position
            }))} />

            <TeamBar
                onStartRound={() => setShowCardRound(true)}
                isRoundActive={showCardRound}
                isGameOver={!!victoryTeam}
            />

            {showCardRound && (
                <CardRound
                    cards={BENIAS_CARDS}
                    roundDurationSeconds={roundDurationSeconds}
                    onRoundEnd={handleRoundEnd}
                    onClose={() => setShowCardRound(false)}
                    teamPosition={teams[currentTeamIndex]?.position || 0}
                />
            )}

            {victoryTeam && (
                <VictoryModal
                    isOpen={!!victoryTeam}
                    teamName={victoryTeam.name}
                    teamColor={victoryTeam.color}
                    onClose={() => { }}
                />
            )}
        </div>
    );
};
