// External libraries
import React from 'react';
import { Container, Stack, Title, Text, Paper, ScrollArea, Group } from '@mantine/core';

// Types
import type { RoundHistoryItem } from '../CardRound.types';

// Constants
import { CARD_STATUS, UI_STRINGS } from '../CardRound.constants';

// Styles
import './RoundSummaryView.css';

export interface RoundSummaryViewProps {
    roundHistory: RoundHistoryItem[];
    totalScore: number;
    cards: readonly string[][];
    onToggleItem: (index: number) => void;
    onClose?: () => void;
    highlightedWordIndex?: number;
}

export const RoundSummaryView: React.FC<RoundSummaryViewProps> = ({
    roundHistory,
    totalScore,
    cards,
    onToggleItem,
    onClose,
    highlightedWordIndex = 0,
}) => {
    return (
        <div className="card-round-overlay">
            <div className="card-round-container">
                <Container size="md">
                    <Stack gap="lg">
                        <div className="card-round-header">
                            <Title order={2} className="card-round-title">{UI_STRINGS.ROUND_SUMMARY_TITLE}</Title>
                            <div className="card-round-score">
                                <Text className="score-label">{UI_STRINGS.SCORE_LABEL}</Text>
                                <Text className="score-value">{totalScore}</Text>
                            </div>
                        </div>

                        <Paper className="card-round-summary-card">
                            <ScrollArea type="auto" className="summary-scroll-area">
                                <Stack gap="sm" className="summary-list">
                                    {roundHistory.map((item, index) => (
                                        <div key={index} className={`summary-row ${item.status}`}>
                                            <Text className="summary-word">
                                                {cards[item.cardIndex][highlightedWordIndex]}
                                            </Text>
                                            <Group gap="xs" className="summary-buttons">
                                                <button
                                                    className={`summary-toggle-btn success ${item.status === CARD_STATUS.SUCCESS ? 'active' : ''}`}
                                                    onClick={() => item.status !== CARD_STATUS.SUCCESS && onToggleItem(index)}
                                                >
                                                    <span className="button-icon">{UI_STRINGS.SUCCESS_ICON}</span>
                                                </button>
                                                <button
                                                    className={`summary-toggle-btn fail ${item.status === CARD_STATUS.FAIL ? 'active' : ''}`}
                                                    onClick={() => item.status !== CARD_STATUS.FAIL && onToggleItem(index)}
                                                >
                                                    <span className="button-icon">{UI_STRINGS.FAIL_ICON}</span>
                                                </button>
                                            </Group>
                                        </div>
                                    ))}
                                </Stack>
                            </ScrollArea>
                        </Paper>

                        <button onClick={onClose} className="action-button-compact close full-width">
                            <span className="button-label">{UI_STRINGS.FINISH_TURN_BUTTON}</span>
                        </button>
                    </Stack>
                </Container>
            </div>
        </div>
    );
};
