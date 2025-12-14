import React from 'react';
import { Group, Paper, Text, Stack } from '@mantine/core';
import { useGameState } from '../../state/GameState';
import { TEAM_BAR_TEXT } from './teamBar.constants';
import { ResponsiveText } from './ResponsiveText/ResponsiveText';
import './TeamBar.css';

interface TeamBarProps {
    onStartRound?: () => void;
    isRoundActive?: boolean;
    isGameOver?: boolean;
}

export const TeamBar: React.FC<TeamBarProps> = ({
    onStartRound,
    isRoundActive = false,
    isGameOver = false
}) => {
    const { teams, currentTeamIndex, boardSize } = useGameState();

    if (teams.length === 0) return null;

    return (
        <div className="team-bar-container">
            <Group justify="center" gap="md" className="team-bar-group">
                {teams.map((team, index) => {
                    const isActive = index === currentTeamIndex;
                    const cellsLeft = (boardSize - 1) - team.position;
                    const canStartRound = isActive && onStartRound && cellsLeft > 0 && !isRoundActive && !isGameOver;

                    return (
                        <Paper
                            key={team.id}
                            className={`team-bar-card ${isActive ? 'team-bar-card--active' : ''} ${canStartRound ? 'team-bar-card--clickable' : ''}`}
                            shadow={isActive ? 'lg' : 'md'}
                            withBorder
                            style={{ '--team-color': team.color } as React.CSSProperties}
                            onClick={canStartRound ? onStartRound : undefined}
                        >
                            <Stack gap="xs" align="center">
                                <Group gap="xs">
                                    <div
                                        className="team-bar-token-indicator"
                                        style={{ backgroundColor: team.color }}
                                    />
                                    <ResponsiveText
                                        text={team.name}
                                        maxWidth={80}
                                        minFontSize={10}
                                        maxFontSize={16}
                                        className={`team-bar-text-name ${isActive ? 'team-bar-text-name--active' : ''}`}
                                    />
                                </Group>
                                <Text
                                    size="sm"
                                    fw={600}
                                    className={`team-bar-text-status ${isActive ? 'team-bar-text-status--active' : ''}`}
                                >
                                    {TEAM_BAR_TEXT.STEPS_REMAINING(Math.max(0, cellsLeft))}
                                </Text>
                            </Stack>
                        </Paper>
                    );
                })}
            </Group>
        </div>
    );
};
