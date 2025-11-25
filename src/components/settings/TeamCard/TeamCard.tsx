import React from 'react';
import { Card, Group, TextInput, Text, Select } from '@mantine/core';
import type { TeamSettings } from '../settings.types';
import { PRESET_COLORS, COLOR_NAMES } from '../settings.constants';
import './TeamCard.css';

interface TeamCardProps {
    team: TeamSettings;
    index: number;
    onNameChange: (id: number, name: string) => void;
    onColorChange: (id: number, color: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    team,
    index,
    onNameChange,
    onColorChange,
}) => {

    const teamCardColorData = PRESET_COLORS.map((color) => ({
        value: color,
        label: COLOR_NAMES[color] || color,
    }));
    return (
        <Card className="team-card">
            <Group gap="md" align="flex-end" wrap="nowrap">
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
                <TextInput
                    value={team.name}
                    onChange={(e) => onNameChange(team.id, e.target.value)}
                    placeholder={`קבוצה ${index + 1}`}
                    size="md"
                    className="team-name-input"
                    label="שם קבוצה"
                    styles={{
                        input: {
                            borderColor: team.color,
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
            </Group>
        </Card>
    );
};
