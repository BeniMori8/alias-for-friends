import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import './SettingsScreen.css';

export const SettingsScreen: React.FC = () => {
    return (
        <Container size="md" className="settings-screen-container">
            <Stack gap="md">
                <Title order={1}>Settings</Title>
                <Text c="dimmed">Settings screen (to be implemented)</Text>
            </Stack>
        </Container>
    );
};
