import React, { useState } from 'react';
import { Button, Stack } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { BeniasBoard } from './BeniasBoard';
import { CardRound } from '../cards/CardRound';
import { BENIAS_CARDS } from '../../consts/BeniasCards';
import type { TeamSettings } from '../settings/settings.types';
import './GameBoardScreen.css';

export const GameBoardScreen: React.FC = () => {
    const [showCardRound, setShowCardRound] = useState(false);
    const location = useLocation();

    const state = location.state as { roundDurationSeconds?: number; teams?: TeamSettings[] } | undefined;
    const roundDurationSeconds = state?.roundDurationSeconds ?? 90;

    // Default teams if not provided (e.g. direct access)
    const defaultTeams: TeamSettings[] = [
        { id: 1, name: 'קבוצה 1', color: '#FFD700' }, // Yellow
        { id: 2, name: 'קבוצה 2', color: '#228BE6' }, // Blue
    ];

    const teams = state?.teams ?? defaultTeams;

    // TODO: This button is temporary - in the future, only the active team
    // will be able to open the card deck during their turn
    const handleOpenCards = () => {
        setShowCardRound(true);
    };

    const handleCloseCards = () => {
        setShowCardRound(false);
    };

    return (
        <div className="game-board-screen">
            <Stack gap="md" className="board-controls">
                {/* Temporary button for opening card round */}
                <Button
                    size="lg"
                    onClick={handleOpenCards}
                    className="open-cards-button"
                    disabled={showCardRound}
                >
                    🃏 פתח כרטיס מילים
                </Button>
            </Stack>

            <BeniasBoard teams={teams} />

            {/* Card Round Modal/Overlay */}
            {showCardRound && (
                <CardRound
                    cards={BENIAS_CARDS}
                    roundDurationSeconds={roundDurationSeconds}
                    onClose={handleCloseCards}
                />
            )}
        </div>
    );
};
