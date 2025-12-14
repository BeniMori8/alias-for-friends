import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Title, Text, Center } from '@mantine/core';
import { hasValidSessionGame } from '../../utils/sessionGame';
import './HomeScreen.css';

export const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const [hasSession, setHasSession] = useState(false);

    // Check for resumable session on mount
    useEffect(() => {
        setHasSession(hasValidSessionGame());
    }, []);

    const handleStartGame = () => {
        navigate('/settings');
    };

    const handleContinueGame = () => {
        // Navigate to board with resume flag - sessionStorage is source of truth
        navigate('/board', { state: { resumeSession: true } });
    };

    return (
        <div className="home-screen-container">
            <Center style={{ minHeight: '100vh' }}>
                <Container size="lg">
                    <Stack align="center" gap="xl">
                        <div className="home-screen-title-wrapper">
                            <Title order={1} className="home-screen-title">
                                Benias
                            </Title>
                            <Text className="home-screen-subtitle-top">
                                במטרה להרוס חברויות
                            </Text>
                        </div>

                        <Stack align="center" gap="md">
                            <button
                                onClick={handleStartGame}
                                className="home-screen-start-button"
                            >
                                התחל משחק
                            </button>

                            {hasSession && (
                                <button
                                    onClick={handleContinueGame}
                                    className="home-screen-continue-button"
                                >
                                    המשך משחק נוכחי
                                </button>
                            )}
                        </Stack>

                        <div className="home-screen-decorations">
                            <span className="decoration-icon">🗣️</span>
                            <span className="decoration-icon">🤔</span>
                            <span className="decoration-icon">🗣️</span>
                        </div>
                    </Stack>
                </Container>
            </Center>
        </div>
    );
};
