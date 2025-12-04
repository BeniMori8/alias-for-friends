import React from 'react';
import { Group, Paper, Text, Stack } from '@mantine/core';
import { useGameState } from '../../state/GameState';
import { BOARD_CELLS } from '../beniasBoard/types';
import './TeamBar.css';

export const TeamBar: React.FC = () => {
    const { teams, currentTeamIndex } = useGameState();
    const boardLength = BOARD_CELLS.length;

    if (teams.length === 0) return null;

    return (
        <div className="team-bar-container">
            <Group justify="center" gap="md" className="team-bar-group">
                {teams.map((team, index) => {
                    const isActive = index === currentTeamIndex;
                    const cellsLeft = (boardLength - 1) - team.position;

                    return (
                        <Paper
                            key={team.id}
                            className={`team-card ${isActive ? 'active' : ''}`}
                            shadow={isActive ? 'md' : 'sm'}
                            withBorder
                            style={{ borderColor: isActive ? team.color : undefined }}
                        >
                            <Stack gap="xs" align="center">
                                <Group gap="xs">
                                    <div
                                        className="team-token-indicator"
                                        style={{ backgroundColor: team.color }}
                                    />
                                    <Text fw={700} size="sm">{team.name}</Text>
                                </Group>
                                <Text size="xs" c="dimmed">
                                    {cellsLeft > 0 ? `עוד ${cellsLeft} צעדים` : 'ניצחון!'}
                                </Text>
                            </Stack>
                        </Paper>
                    );
                })}
            </Group>
        </div>
    );
};
