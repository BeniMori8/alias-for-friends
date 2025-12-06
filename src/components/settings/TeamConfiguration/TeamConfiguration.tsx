import React, { useState } from 'react';
import { Stack, Title, Paper, Group, ActionIcon, Text } from '@mantine/core';
import type { TeamSettings } from '../settings.types';
import { TeamCard } from '../TeamCard/TeamCard';

interface TeamConfigurationProps {
    teams: TeamSettings[];
    onTeamNameChange: (id: number, name: string) => void;
    onTeamColorChange: (id: number, color: string) => void;
}

const TEAMS_PER_PAGE = 2;

export const TeamConfiguration: React.FC<TeamConfigurationProps> = ({
    teams,
    onTeamNameChange,
    onTeamColorChange,
}) => {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(teams.length / TEAMS_PER_PAGE);
    const startIndex = currentPage * TEAMS_PER_PAGE;
    const endIndex = startIndex + TEAMS_PER_PAGE;
    const visibleTeams = teams.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <Paper className="settings-card">
            <Stack gap="md">
                <Group justify="space-between" align="center">
                    <Title order={3} className="settings-section-title">
                        🎨 קבוצות
                    </Title>

                    {totalPages > 1 && (
                        <Group gap="xs">
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="lg"
                                onClick={handlePrevious}
                                disabled={currentPage === 0}
                                className="pagination-arrow"
                            >
                                <span style={{ fontSize: '20px' }}>→</span>
                            </ActionIcon>

                            <Text size="sm" fw={600} className="pagination-text">
                                {currentPage + 1} / {totalPages}
                            </Text>

                            <ActionIcon
                                variant="light"
                                color="red"
                                size="lg"
                                onClick={handleNext}
                                disabled={currentPage === totalPages - 1}
                                className="pagination-arrow"
                            >
                                <span style={{ fontSize: '20px' }}>←</span>
                            </ActionIcon>
                        </Group>
                    )}
                </Group>

                {visibleTeams.map((team, index) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        index={startIndex + index}
                        allTeams={teams}
                        onNameChange={onTeamNameChange}
                        onColorChange={onTeamColorChange}
                    />
                ))}
            </Stack>
        </Paper>
    );
};
