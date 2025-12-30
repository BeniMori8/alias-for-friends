// External libraries
import React from 'react';
import { Container, Stack, Text, Paper, Group } from '@mantine/core';

// Components
import { SandClock } from '../../SandClock/SandClock';
import { TeamTokenPicker } from '../TeamTokenPicker/TeamTokenPicker';

// Types
import type { TeamInfo } from '../CardRound.types';
import type { UseRoundTimerResult } from '../../../hooks/useRoundTimer';

// Constants
import { CARD_STATUS, UI_STRINGS, LAYOUT_CONSTANTS } from '../CardRound.constants';

export interface GameCardViewProps {
    currentCard: string[];
    highlightedWordIndex: number;
    completedScore: number;
    isAnimating: boolean;
    roundDurationSeconds: number;
    timer: UseRoundTimerResult;
    teams: TeamInfo[];
    stealTeamId: string | null;
    stealLocked: boolean;
    onStealTeamSelect: (teamId: string) => void;
    onNextCard: (status: typeof CARD_STATUS.SUCCESS | typeof CARD_STATUS.FAIL) => void;
}

export const GameCardView: React.FC<GameCardViewProps> = ({
    currentCard,
    highlightedWordIndex,
    completedScore,
    isAnimating,
    roundDurationSeconds,
    timer,
    teams,
    stealTeamId,
    stealLocked,
    onStealTeamSelect,
    onNextCard,
}) => {
    const { remainingSeconds, isTimeUp, isPaused, isUrgent, handleTogglePause } = timer;

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
                                    <Text className="score-value">{completedScore}</Text>
                                </div>
                            </div>
                        </div>

                        <Paper className={`card-round-main-card ${isAnimating ? 'animating' : ''}`}>
                            <div className="card-watermark">
                                <Text className="watermark-text">{UI_STRINGS.WATERMARK_TEXT}</Text>
                            </div>

                            <Stack gap="xs" className="words-list">
                                {currentCard.map((word, index) => (
                                    <div
                                        key={index}
                                        className={`word-row ${index === highlightedWordIndex ? 'word-row--highlighted' : ''}`}
                                    >
                                        <Text className="word-number">{index + 1}.</Text>
                                        <Text className="word-text">{word}</Text>
                                    </div>
                                ))}
                            </Stack>

                            <div className="card-actions-container">
                                {isTimeUp ? (
                                    <TeamTokenPicker
                                        teams={teams}
                                        selectedTeamId={stealTeamId}
                                        onSelectTeam={onStealTeamSelect}
                                        locked={stealLocked}
                                    />
                                ) : (
                                    <Group gap="sm" className="action-buttons-inside" grow>
                                        <button onClick={() => onNextCard(CARD_STATUS.FAIL)} className="action-button-compact fail" disabled={isAnimating}>
                                            <span className="button-icon">{UI_STRINGS.FAIL_ICON}</span>
                                            <span className="button-label">{UI_STRINGS.FAIL_BUTTON}</span>
                                        </button>

                                        <button onClick={() => onNextCard(CARD_STATUS.SUCCESS)} className="action-button-compact success" disabled={isAnimating}>
                                            <span className="button-icon">{UI_STRINGS.SUCCESS_ICON}</span>
                                            <span className="button-label">{UI_STRINGS.SUCCESS_BUTTON}</span>
                                        </button>
                                    </Group>
                                )}
                            </div>
                        </Paper>
                    </Stack>
                </Container>
            </div>
        </div>
    );
};
