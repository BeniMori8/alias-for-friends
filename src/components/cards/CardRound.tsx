// External libraries
import React, { useState } from 'react';
import { Container, Stack, Text, Paper, Group } from '@mantine/core';

// Components
import { SandClock } from '../SandClock/SandClock';
import { RoundSummaryView } from './RoundSummaryView/RoundSummaryView';

// Hooks
import { useRoundTimer } from '../../hooks/useRoundTimer';

// Types
import type { RoundHistoryItem } from './CardRound.types';
import type { CardRoundView } from './CardRound.types';

// Constants
import {
    CARD_ROUND_VIEW,
    CARD_STATUS,
    SCORE_VALUES,
    ANIMATION_DELAYS,
    UI_STRINGS,
    LAYOUT_CONSTANTS,
} from './CardRound.constants';

// Styles
import './CardRound.css';

export interface CardRoundProps {
    cards: readonly string[][];
    roundDurationSeconds: number;
    onRoundEnd: (score: number) => void;
    onClose?: () => void;
}

export const CardRound: React.FC<CardRoundProps> = ({ cards, roundDurationSeconds, onRoundEnd, onClose }) => {
    // Card navigation state
    const [currentCardIndex, setCurrentCardIndex] = useState(() =>
        Math.floor(Math.random() * cards.length)
    );

    // View and history state
    const [view, setView] = useState<CardRoundView>(CARD_ROUND_VIEW.GAME);
    const [roundHistory, setRoundHistory] = useState<RoundHistoryItem[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Use timer hook
    const { remainingSeconds, isTimeUp, isPaused, isUrgent, handleTogglePause } = useRoundTimer(roundDurationSeconds);

    const currentCard = cards[currentCardIndex];

    // Calculate total score from history
    const totalScore = roundHistory.reduce((acc, item) => {
        return acc + (item.status === CARD_STATUS.SUCCESS ? SCORE_VALUES.SUCCESS : SCORE_VALUES.FAIL);
    }, 0);

    // Handle card change with slide animation
    const handleNextCard = (status: typeof CARD_STATUS.SUCCESS | typeof CARD_STATUS.FAIL) => {
        const newHistoryItem: RoundHistoryItem = { cardIndex: currentCardIndex, status };
        setRoundHistory(prev => [...prev, newHistoryItem]);

        if (isTimeUp) {
            setView(CARD_ROUND_VIEW.SUMMARY);
            return;
        }

        setIsAnimating(true);
        setTimeout(() => {
            setCurrentCardIndex(Math.floor(Math.random() * cards.length));
            setTimeout(() => setIsAnimating(false), ANIMATION_DELAYS.CARD_REVEAL_MS);
        }, ANIMATION_DELAYS.CARD_CHANGE_MS);
    };

    const handleToggleHistoryItem = (index: number) => {
        setRoundHistory(prev => {
            const newHistory = [...prev];
            newHistory[index] = {
                ...newHistory[index],
                status: newHistory[index].status === CARD_STATUS.SUCCESS ? CARD_STATUS.FAIL : CARD_STATUS.SUCCESS
            };
            return newHistory;
        });
    };

    const handleRoundComplete = () => {
        onRoundEnd(totalScore);
        if (onClose) onClose();
    };

    // Render summary view
    if (view === CARD_ROUND_VIEW.SUMMARY) {
        return (
            <RoundSummaryView
                roundHistory={roundHistory}
                totalScore={totalScore}
                cards={cards}
                onToggleItem={handleToggleHistoryItem}
                onClose={handleRoundComplete}
            />
        );
    }

    // Render game view
    return (
        <div className="card-round-overlay">
            <div className="card-round-container">
                <Container size="md">
                    <Stack gap="lg">
                        <div className="card-round-header">
                            <div className="header-content">
                                <div className="timer-section">
                                    <div
                                        className={`timer-container ${isPaused ? 'paused' : ''}`}
                                        onClick={handleTogglePause}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <SandClock
                                            totalSeconds={roundDurationSeconds}
                                            remainingSeconds={remainingSeconds}
                                            height={LAYOUT_CONSTANTS.SAND_CLOCK_HEIGHT}
                                            className={isUrgent && !isPaused ? 'urgent' : ''}
                                        />
                                    </div>
                                    <Text className={`timer-text ${isUrgent ? 'urgent' : ''}`}>
                                        {remainingSeconds}
                                    </Text>
                                </div>

                                <div className="card-round-score">
                                    <Text className="score-label">{UI_STRINGS.SCORE_LABEL}</Text>
                                    <Text className="score-value">{totalScore}</Text>
                                </div>
                            </div>
                        </div>

                        <Paper className={`card-round-main-card ${isAnimating ? 'animating' : ''}`}>
                            <div className="card-watermark">
                                <Text className="watermark-text">{UI_STRINGS.WATERMARK_TEXT}</Text>
                            </div>

                            <Stack gap="xs" className="words-list">
                                {currentCard.map((word, index) => (
                                    <div key={index} className="word-row">
                                        <Text className="word-number">{index + 1}.</Text>
                                        <Text className="word-text">{word}</Text>
                                    </div>
                                ))}
                            </Stack>

                            <Group gap="sm" className="action-buttons-inside" grow>
                                <button onClick={() => handleNextCard(CARD_STATUS.FAIL)} className="action-button-compact fail" disabled={isAnimating}>
                                    <span className="button-icon">{UI_STRINGS.FAIL_ICON}</span>
                                    <span className="button-label">{UI_STRINGS.FAIL_BUTTON}</span>
                                </button>

                                <button onClick={() => handleNextCard(CARD_STATUS.SUCCESS)} className="action-button-compact success" disabled={isAnimating}>
                                    <span className="button-icon">{UI_STRINGS.SUCCESS_ICON}</span>
                                    <span className="button-label">{UI_STRINGS.SUCCESS_BUTTON}</span>
                                </button>
                            </Group>
                        </Paper>
                    </Stack>
                </Container>
            </div>
        </div>
    );
};
