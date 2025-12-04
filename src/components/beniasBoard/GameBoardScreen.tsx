import React, { useState, useEffect } from 'react';
import { Button, Stack, Modal, Text } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { BeniasBoard } from './BeniasBoard';
import { CardRound } from '../cards/CardRound';
import { TeamBar } from '../TeamBar/TeamBar';
import { BENIAS_CARDS } from '../../consts/BeniasCards';
import { useGameState } from '../../state/GameState';
import { BOARD_CELLS } from './types';
import type { TeamSettings } from '../settings/settings.types';
import './GameBoardScreen.css';

export const GameBoardScreen: React.FC = () => {
    const [showCardRound, setShowCardRound] = useState(false);
    const [victoryTeam, setVictoryTeam] = useState<{ name: string; color: string } | null>(null);

    const location = useLocation();
    const {
        teams,
        currentTeamIndex,
        setTeams,
        nextTeam,
        updateTeamPosition
    } = useGameState();

    const state = location.state as { roundDurationSeconds?: number; teams?: TeamSettings[] } | undefined;
    const roundDurationSeconds = state?.roundDurationSeconds ?? 90;

    // Initialize teams on mount
    useEffect(() => {
        // Default teams if not provided (e.g. direct access)
        const defaultTeams: TeamSettings[] = [
            { id: 1, name: 'קבוצה 1', color: '#FFD700' }, // Yellow
            { id: 2, name: 'קבוצה 2', color: '#228BE6' }, // Blue
        ];

        const initialTeams = state?.teams ?? defaultTeams;

        // Map to GameState Team format (adding position)
        setTeams(initialTeams.map(t => ({
            id: t.id.toString(),
            name: t.name,
            color: t.color,
            position: 0
        })));
    }, []); // Run once on mount

    const handleOpenCards = () => {
        setShowCardRound(true);
    };

    const handleCloseCards = () => {
        setShowCardRound(false);
    };

    const handleRoundEnd = async (score: number) => {
        if (teams.length === 0) return;

        // Close the card round immediately so we can see the board
        setShowCardRound(false);

        const activeTeam = teams[currentTeamIndex];
        let targetPos = activeTeam.position + score;

        // Edge case 1: cannot move below 0
        if (targetPos < 0) targetPos = 0;

        // Edge case 2: clamp to last cell
        const lastCellIndex = BOARD_CELLS.length - 1;
        if (targetPos > lastCellIndex) targetPos = lastCellIndex;

        // If no movement needed
        if (targetPos === activeTeam.position) {
            nextTeam();
            return;
        }

        // Animate movement step by step
        const direction = targetPos > activeTeam.position ? 1 : -1;
        let currentPos = activeTeam.position;

        while (currentPos !== targetPos) {
            // Wait before next step (gives time for CSS transition of previous step)
            await new Promise(resolve => setTimeout(resolve, 500));

            currentPos += direction;
            updateTeamPosition(activeTeam.id, currentPos);
        }

        // Wait a moment after finishing movement before passing turn or victory
        await new Promise(resolve => setTimeout(resolve, 500));

        if (targetPos === lastCellIndex) {
            showVictoryModal(activeTeam);
        } else {
            nextTeam();
        }
    };

    const showVictoryModal = (team: { name: string; color: string }) => {
        setVictoryTeam(team);

        // Fire confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: [team.color, '#ffffff']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: [team.color, '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const activeTeam = teams[currentTeamIndex];

    return (
        <div className="game-board-screen">
            <Stack gap="md" className="board-controls">
                <Button
                    size="lg"
                    onClick={handleOpenCards}
                    className="open-cards-button"
                    disabled={showCardRound || !!victoryTeam}
                    style={activeTeam ? {
                        borderColor: activeTeam.color,
                        boxShadow: `0 4px 15px ${activeTeam.color}40`
                    } : undefined}
                >
                    {activeTeam ? `🃏 התור של ${activeTeam.name}` : '🃏 פתח כרטיס מילים'}
                </Button>
            </Stack>

            <BeniasBoard teams={teams.map(t => ({
                id: parseInt(t.id),
                name: t.name,
                color: t.color,
                position: t.position
            }))} />

            <TeamBar />

            {/* Card Round Modal/Overlay */}
            {showCardRound && (
                <CardRound
                    cards={BENIAS_CARDS}
                    roundDurationSeconds={roundDurationSeconds}
                    onRoundEnd={handleRoundEnd}
                    onClose={handleCloseCards}
                />
            )}

            {/* Victory Modal */}
            <Modal
                opened={!!victoryTeam}
                onClose={() => { }}
                withCloseButton={false}
                centered
                size="lg"
                styles={{
                    content: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        border: `4px solid ${victoryTeam?.color || 'gold'}`
                    }
                }}
            >
                <Stack align="center" gap="xl" py="xl">
                    <Text size="3rem">🏆</Text>
                    <Text
                        size="xl"
                        fw={900}
                        style={{ fontSize: '2.5rem', fontFamily: 'Fredoka, sans-serif' }}
                        c={victoryTeam?.color}
                    >
                        {victoryTeam?.name} ניצחה!
                    </Text>
                    <Text size="lg">כל הכבוד! סיימתם את המסלול.</Text>
                    <Button
                        size="lg"
                        color={victoryTeam?.color}
                        onClick={() => window.location.href = '/'}
                    >
                        חזרה למסך הבית
                    </Button>
                </Stack>
            </Modal>
        </div>
    );
};
