// External libraries
import React from 'react';
import { Group, Tooltip } from '@mantine/core';

// Types
import type { TeamInfo } from '../CardRound.types';

// Styles
import './TeamTokenPicker.css';

interface TeamTokenPickerProps {
    teams: TeamInfo[];
    selectedTeamId: string | null;
    onSelectTeam: (teamId: string) => void;
    locked: boolean;
    promptText?: string; // Optional, not currently displayed
}

export const TeamTokenPicker: React.FC<TeamTokenPickerProps> = ({
    teams,
    selectedTeamId,
    onSelectTeam,
    locked,
}) => {
    const handleClick = (teamId: string) => {
        if (locked) return;
        onSelectTeam(teamId);
    };

    return (
        <div className="team-token-picker">
            {/* <Text className="team-token-picker__prompt">{promptText}</Text> */}
            <Group gap="sm" justify="center" wrap="wrap" className="team-token-picker__tokens">
                {teams.map((team) => {
                    const isSelected = selectedTeamId === team.id;
                    return (
                        <Tooltip key={team.id} label={team.name} position="top" withArrow>
                            <button
                                type="button"
                                className={`team-token-picker__token ${isSelected ? 'team-token-picker__token--selected' : ''} ${locked ? 'team-token-picker__token--locked' : ''}`}
                                style={{ backgroundColor: team.color }}
                                onClick={() => handleClick(team.id)}
                                disabled={locked && !isSelected}
                                aria-label={team.name}
                            />
                        </Tooltip>
                    );
                })}
            </Group>
        </div>
    );
};
