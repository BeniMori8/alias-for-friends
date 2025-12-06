import React from 'react';
import { Card, Group, TextInput, Text, Select } from '@mantine/core';
import type { TeamSettings } from '../settings.types';
import { PRESET_COLORS, COLOR_NAMES, MAX_TEAM_NAME_LENGTH } from '../settings.constants';
import './TeamCard.css';

interface TeamCardProps {
    team: TeamSettings;
    index: number;
    allTeams: TeamSettings[];
    onNameChange: (id: number, name: string) => void;
    onColorChange: (id: number, color: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    team,
    index,
    allTeams,
    onNameChange,
    onColorChange,
}) => {
    // Filter out colors already used by other teams
    const usedColors = allTeams
        .filter(t => t.id !== team.id)
        .map(t => t.color);

    const availableColors = PRESET_COLORS.filter(color => !usedColors.includes(color));

    const teamCardColorData = availableColors.map((color) => ({
        value: color,
        label: COLOR_NAMES[color] || color,
    }));

    const nameLength = team.name.length;
    const isNameTooLong = nameLength > MAX_TEAM_NAME_LENGTH;
    const charsRemaining = MAX_TEAM_NAME_LENGTH - nameLength;

    return (
        <Card className="team-card">
            <Group gap="md" align="baseline" wrap="nowrap">
                {/* Color Picker */}
                <div className="team-card-color-select-container">
                    <Text size="xs" mb={4} className="color-label">
                        צבע
                    </Text>
                    <Select
                        value={team.color}
                        onChange={(value) => value && onColorChange(team.id, value)}
                        data={teamCardColorData}
                        className='test'
                        comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
                        maxDropdownHeight={200}
                        renderOption={({ option }) => (
                            <Group className='team-card-color-option' gap="sm">
                                <div
                                    className="team-card-color-token"
                                    style={{
                                        backgroundColor: option.value,
                                    }}
                                />
                                <Text size="sm">{option.label}</Text>
                            </Group>
                        )}
                        leftSection={
                            <div
                                className="team-card-color-token-small"
                                style={{
                                    backgroundColor: team.color,
                                }}
                            />
                        }
                        classNames={{
                            input: 'team-card-color-select',
                            dropdown: 'team-card-color-dropdown',
                            option: 'team-card-color-option-item',
                        }}
                        size="md"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <TextInput
                        value={team.name}
                        onChange={(e) => onNameChange(team.id, e.target.value)}
                        placeholder={`קבוצה ${index + 1}`}
                        size="md"
                        className="team-name-input"
                        label="שם קבוצה"
                        error={isNameTooLong}
                        styles={{
                            input: {
                                borderColor: isNameTooLong ? '#fa5252' : team.color,
                                borderWidth: '3px',
                                fontWeight: 600,
                                fontFamily: 'Fredoka, sans-serif',
                            },
                            label: {
                                fontSize: '0.75rem',
                                marginBottom: '4px',
                                fontFamily: 'Fredoka, sans-serif',
                                fontWeight: 600,
                                color: '#6c757d',
                            },
                        }}
                    />
                    <Text
                        size="xs"
                        mt={4}
                        className={`team-name-counter ${isNameTooLong ? 'team-name-counter--error' : ''}`}
                    >
                        {isNameTooLong
                            ? `ארוך מדי! ${Math.abs(charsRemaining)} תווים יותר מדי`
                            : `${charsRemaining} תווים נותרו`
                        }
                    </Text>
                </div>
            </Group>
        </Card>
    );
};
