import React from 'react';
import { Stack, Title, Text, NumberInput, Paper } from '@mantine/core';
import {
    DEFAULT_ROUND_DURATION,
    MIN_ROUND_DURATION,
    MAX_ROUND_DURATION,
    MIN_TEAMS,
    MAX_TEAMS,
} from '../settings.constants';
import './GeneralSettings.css';

interface GeneralSettingsProps {
    roundDuration: number;
    teamCount: number;
    onRoundDurationChange: (value: number) => void;
    onTeamCountChange: (value: number | string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    roundDuration,
    teamCount,
    onRoundDurationChange,
    onTeamCountChange,
}) => {
    return (
        <Paper className="settings-card">
            <Stack gap="md">
                <Title order={3} className="settings-section-title">
                    🎛️ הגדרות כלליות
                </Title>

                {/* Round Duration */}
                <div>
                    <Text size="sm" fw={600} mb="xs" className="settings-label">
                        זמן לכל סיבוב (בשניות)
                    </Text>
                    <NumberInput
                        value={roundDuration}
                        onChange={(value) => {
                            const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
                            if (!isNaN(numValue)) {
                                onRoundDurationChange(numValue);
                            }
                        }}
                        min={MIN_ROUND_DURATION}
                        max={MAX_ROUND_DURATION}
                        step={10}
                        size="lg"
                        className="settings-number-input"
                    />
                    <Text size="xs" c="dimmed" mt="xs">
                        מומלץ: {DEFAULT_ROUND_DURATION} שניות ⏱️
                    </Text>
                </div>

                {/* Team Count */}
                <div>
                    <Text size="sm" fw={600} mb="xs" className="settings-label">
                        מספר קבוצות
                    </Text>
                    <NumberInput
                        value={teamCount}
                        onChange={onTeamCountChange}
                        min={MIN_TEAMS}
                        max={MAX_TEAMS}
                        step={1}
                        size="lg"
                        className="settings-number-input"
                    />
                    <Text size="xs" c="dimmed" mt="xs">
                        {MIN_TEAMS}-{MAX_TEAMS} קבוצות 👥
                    </Text>
                </div>
            </Stack>
        </Paper>
    );
};
