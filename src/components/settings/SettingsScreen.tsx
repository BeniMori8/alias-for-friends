import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Title, Text, Center, SimpleGrid } from '@mantine/core';
import { GeneralSettings } from './GeneralSettings/GeneralSettings';
import { TeamConfiguration } from './TeamConfiguration/TeamConfiguration';
import type { TeamSettings, GameSettings } from './settings.types';
import {
    PRESET_COLORS,
    DEFAULT_ROUND_DURATION,
    MIN_ROUND_DURATION,
    MAX_ROUND_DURATION,
    MIN_TEAMS,
    MAX_TEAMS,
    MAX_TEAM_NAME_LENGTH,
    DEFAULT_BOARD_SIZE,
    MIN_BOARD_SIZE,
    MAX_BOARD_SIZE,
} from './settings.constants';
import './SettingsScreen.css';

export const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [roundDuration, setRoundDuration] = useState<number>(DEFAULT_ROUND_DURATION);
    const [teamCount, setTeamCount] = useState<number>(MIN_TEAMS);
    const [boardSize, setBoardSize] = useState<number>(DEFAULT_BOARD_SIZE);
    const [teams, setTeams] = useState<TeamSettings[]>([
        { id: 1, name: 'קבוצה 1', color: PRESET_COLORS[0] },
        { id: 2, name: 'קבוצה 2', color: PRESET_COLORS[1] },
    ]);

    // Handle team count change
    const handleTeamCountChange = (value: number | string) => {
        const newCount = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(newCount) || newCount < MIN_TEAMS || newCount > MAX_TEAMS) return;

        setTeamCount(newCount);

        // Adjust teams array
        setTeams((prevTeams) => {
            const updated = [...prevTeams];
            if (newCount > updated.length) {
                // Add new teams
                for (let i = updated.length; i < newCount; i++) {
                    updated.push({
                        id: i + 1,
                        name: `קבוצה ${i + 1}`,
                        color: PRESET_COLORS[i % PRESET_COLORS.length],
                    });
                }
            } else if (newCount < updated.length) {
                // Remove excess teams
                return updated.slice(0, newCount);
            }
            return updated;
        });
    };

    // Update team name
    const handleTeamNameChange = (id: number, name: string) => {
        // Enforce max length
        if (name.length > MAX_TEAM_NAME_LENGTH) {
            return;
        }
        setTeams((prevTeams) =>
            prevTeams.map((team) => (team.id === id ? { ...team, name } : team))
        );
    };

    // Update team color
    const handleTeamColorChange = (id: number, color: string) => {
        setTeams((prevTeams) =>
            prevTeams.map((team) => (team.id === id ? { ...team, color } : team))
        );
    };

    // Validate and continue
    const handleContinue = () => {
        // Round duration validation
        if (roundDuration < MIN_ROUND_DURATION || roundDuration > MAX_ROUND_DURATION) {
            alert(`זמן סיבוב חייב להיות בין ${MIN_ROUND_DURATION} ל-${MAX_ROUND_DURATION} שניות`);
            return;
        }

        // Board size validation
        if (boardSize < MIN_BOARD_SIZE || boardSize > MAX_BOARD_SIZE) {
            alert(`גודל הלוח חייב להיות בין ${MIN_BOARD_SIZE} ל-${MAX_BOARD_SIZE} תאים`);
            return;
        }

        // Auto-fill empty names
        const validatedTeams = teams.map((team, index) => ({
            ...team,
            name: team.name.trim() || `קבוצה ${index + 1}`,
        }));

        const gameSettings: GameSettings = {
            roundDurationSeconds: roundDuration,
            teams: validatedTeams,
        };

        console.log('Game Settings:', gameSettings);
        navigate('/board', {
            state: {
                roundDurationSeconds: roundDuration,
                teams: validatedTeams,
                boardSize,
            },
        });
    };

    return (
        <div className="settings-screen-container">
            <Center>
                <Container size="md" className="settings-content">
                    <Stack gap="xl">
                        {/* Header */}
                        <div className="settings-header">
                            <Title order={1} className="settings-title">
                                ⚙️ הגדרות משחק ⚙️
                            </Title>
                            <Text className="settings-subtitle">
                                התאם את המשחק בדיוק כפי שאתה רוצה
                            </Text>
                        </div>
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                            {/* General Settings */}
                            <GeneralSettings
                                roundDuration={roundDuration}
                                teamCount={teamCount}
                                boardSize={boardSize}
                                onRoundDurationChange={setRoundDuration}
                                onTeamCountChange={handleTeamCountChange}
                                onBoardSizeChange={setBoardSize}
                            />

                            {/* Team Configuration */}
                            <TeamConfiguration
                                teams={teams}
                                onTeamNameChange={handleTeamNameChange}
                                onTeamColorChange={handleTeamColorChange}
                            />
                        </SimpleGrid>
                        {/* Continue Button */}
                        <button onClick={handleContinue} className="settings-continue-button">
                            המשך למשחק 🎮
                        </button>
                    </Stack>
                </Container>
            </Center>
        </div>
    );
};
