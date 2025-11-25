import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Title, Text, Center } from '@mantine/core';
import './HomeScreen.css';

export const HomeScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/settings');
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

                        <button
                            onClick={handleStartGame}
                            className="home-screen-start-button"
                        >
                            התחל משחק
                        </button>

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
