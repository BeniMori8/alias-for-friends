import React from 'react';
import { Card, Group, TextInput, Text, Select } from '@mantine/core';
import type { TeamSettings } from '../settings.types';
import { PRESET_COLORS, COLOR_NAMES } from '../settings.constants';

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
    return (
        <Card className="team-card">
            <Group gap="md" align="flex-end" wrap="nowrap">
                {/* Color Picker */}
                <div style={{ width: '180px', flexShrink: 0 }}>
                    <Text size="xs" mb={4} className="color-label">
                        צבע
                    </Text>
                    <Select
                        value={team.color}
                        onChange={(value) => value && onColorChange(team.id, value)}
                        data={PRESET_COLORS.map((color) => ({
                            value: color,
                            label: COLOR_NAMES[color] || color,
                        }))}

                        renderOption={({ option }) => (
                            <Group gap="sm">
                                <div
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '12px',
                                        backgroundColor: option.value,
                                        border: '2px solid #fff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    }}
                                />
                                <Text size="sm">{option.label}</Text>
                            </Group>
                        )}
                        leftSection={
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '12px',
                                    backgroundColor: team.color,
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }}
                            />
                        }
                        styles={{
                            input: {
                                fontWeight: 500,
                                fontFamily: 'Outfit, sans-serif',
                                borderRadius: '12px',
                            },
                            dropdown: {
                                borderRadius: '12px',
                            },
                            option: {
                                borderRadius: '8px',
                                transition: 'background-color 0.2s ease',
                                '&[data-combobox-option][data-hovered]': {
                                    backgroundColor: '#c92a2a !important',
                                    color: 'white !important',
                                },
                                '&[data-combobox-option][data-selected]': {
                                    backgroundColor: '#c92a2a !important',
                                    color: 'white !important',
                                },
                            },
                        }}
                        size="md"
                    />
                </div>

                {/* Team Name */}
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
                        },
                        label: {
                            fontSize: '0.75rem',
                            marginBottom: '4px',
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 600,
                            color: '#6c757d',
                        },
                    }}
                />
            </Group>
        </Card>
    );
};
