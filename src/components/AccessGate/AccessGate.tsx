import React, { useState, useEffect } from 'react';
import {
    Center,
    Paper,
    Stack,
    Title,
    Text,
    PasswordInput
} from '@mantine/core';
import { isAccessAuthValid, setAccessAuth, TTL_7_DAYS_MS } from '../../utils/accessAuth';
import { ACCESS_PASSWORD } from '../../config/access';
import './AccessGate.css';

export interface AccessGateProps {
    children: React.ReactNode;
}

export const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsAuthed(isAccessAuthValid());
        setIsLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === ACCESS_PASSWORD) {
            setAccessAuth(TTL_7_DAYS_MS);
            setIsAuthed(true);
            setError(null);
        } else {
            setError('סיסמה שגויה, נסה שוב');
        }
    };

    if (isLoading) {
        return null;
    }

    if (isAuthed) {
        return <>{children}</>;
    }

    return (
        <div className="access-gate-container">
            <Center style={{ minHeight: '100vh' }}>
                <Paper className="access-gate-card" p="xl" radius="lg">
                    <form onSubmit={handleSubmit}>
                        <Stack align="center" gap="md">
                            <Title order={2} className="access-gate-title">
                                גישה פרטית
                            </Title>

                            <Text className="access-gate-description">
                                כדי להיכנס למשחק צריך סיסמה.
                                <br />
                                אם קיבלת לינק ממני — הסיסמה אצלך 🙂
                            </Text>

                            <PasswordInput
                                placeholder="הכנס סיסמה"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                error={error}
                                className="access-gate-input"
                                size="md"
                                autoFocus
                            />

                            <button
                                type="submit"
                                className="access-gate-button"
                            >
                                כניסה
                            </button>
                        </Stack>
                    </form>
                </Paper>
            </Center>
        </div>
    );
};
