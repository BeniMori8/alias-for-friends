import React from 'react';
import { Stack, Text, Paper, Box } from '@mantine/core';
import { useVictoryConfetti } from './useVictoryConfetti';
import './VictoryModal.css';

interface VictoryModalProps {
    opened: boolean;
    winnerTeam: { name: string; color: string } | null;
    onBackToHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
    opened,
    winnerTeam,
    onBackToHome
}) => {
    useVictoryConfetti({
        isActive: opened && !!winnerTeam,
        teamColor: winnerTeam?.color
    });

    if (!opened || !winnerTeam) return null;

    return (
        <Box className="victory-overlay">
            <Box className="victory-container">
                <Paper
                    className="victory-card"
                    style={{ '--team-color': winnerTeam.color } as React.CSSProperties}
                >
                    <Stack align="center" gap="sm">
                        <Text className="victory-title">
                            🎉 ניצחון! 🎉
                        </Text>

                        <div className="victory-team-section">
                            <div className="victory-team-token" />
                            <Text className="victory-winner-label">המנצחת</Text>
                            <Text className="victory-team-name">
                                {winnerTeam.name}
                            </Text>
                        </div>

                        <button
                            className="victory-home-button"
                            onClick={onBackToHome}
                        >
                            חזרה למסך הבית
                        </button>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
};
