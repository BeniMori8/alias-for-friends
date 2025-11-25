import React from 'react';
import { Stack, Title, Paper } from '@mantine/core';
import type { TeamSettings } from '../settings.types';
import { TeamCard } from '../TeamCard/TeamCard';

interface TeamConfigurationProps {
    teams: TeamSettings[];
    onTeamNameChange: (id: number, name: string) => void;
    onTeamColorChange: (id: number, color: string) => void;
}

export const TeamConfiguration: React.FC<TeamConfigurationProps> = ({
    teams,
    onTeamNameChange,
    onTeamColorChange,
}) => {
    return (
        <Paper className="settings-card">
            <Stack gap="md">
                <Title order={3} className="settings-section-title">
                    🎨 קבוצות
                </Title>

                {teams.map((team, index) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        index={index}
                        onNameChange={onTeamNameChange}
                        onColorChange={onTeamColorChange}
                    />
                ))}
            </Stack>
        </Paper>
    );
};
