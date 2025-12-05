import React from 'react';
import { Modal, Stack, Text, Button } from '@mantine/core';
import { FONTS } from '../../../../constants';
import './VictoryModal.css';

interface VictoryModalProps {
    isOpen: boolean;
    teamName: string;
    teamColor: string;
    onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
    isOpen,
    teamName,
    teamColor,
    onClose
}) => {
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            withCloseButton={false}
            centered
            size="lg"
            className="victory-modal"
            style={{ '--team-color': teamColor } as React.CSSProperties}
        >
            <Stack align="center" gap="xl" py="xl">
                <Text size="3rem">🏆</Text>
                <Text
                    size="xl"
                    fw={900}
                    className="victory-modal__team-name"
                    style={{ fontFamily: FONTS.PRIMARY }}
                >
                    {teamName} ניצחה!
                </Text>
                <Text size="lg" className="victory-modal__message">
                    כל הכבוד! סיימתם את המסלול.
                </Text>
                <Button
                    size="lg"
                    color={teamColor}
                    onClick={() => window.location.href = '/'}
                    className="victory-modal__button"
                >
                    חזרה למסך הבית
                </Button>
            </Stack>
        </Modal>
    );
};
