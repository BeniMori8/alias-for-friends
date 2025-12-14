import React from 'react';
import { Stack, Title, Text, NumberInput, Paper } from '@mantine/core';
import {
    DEFAULT_ROUND_DURATION,
    MIN_ROUND_DURATION,
    MAX_ROUND_DURATION,
    MIN_TEAMS,
    MAX_TEAMS,
    DEFAULT_BOARD_SIZE,
    MIN_BOARD_SIZE,
    MAX_BOARD_SIZE,
} from '../settings.constants';
import './GeneralSettings.css';

interface GeneralSettingsProps {
    roundDuration: number;
    teamCount: number;
    boardSize: number;
    onRoundDurationChange: (value: number) => void;
    onTeamCountChange: (value: number | string) => void;
    onBoardSizeChange: (value: number) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    roundDuration,
    teamCount,
    boardSize,
    onRoundDurationChange,
    onTeamCountChange,
    onBoardSizeChange,
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

                {/* Board Size */}
                <div>
                    <Text size="sm" fw={600} mb="xs" className="settings-label">
                        גודל הלוח (מספר תאים)
                    </Text>
                    <NumberInput
                        value={boardSize}
                        onChange={(value) => {
                            const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
                            if (!isNaN(numValue)) {
                                onBoardSizeChange(numValue);
                            }
                        }}
                        min={MIN_BOARD_SIZE}
                        max={MAX_BOARD_SIZE}
                        step={4}
                        size="lg"
                        className="settings-number-input"
                    />
                    <Text size="xs" c="dimmed" mt="xs">
                        טווח: {MIN_BOARD_SIZE}–{MAX_BOARD_SIZE}, ברירת מחדל: {DEFAULT_BOARD_SIZE} 🎲
                    </Text>
                </div>
            </Stack>
        </Paper>
    );
};
