// External libraries
import React, { useState } from 'react';
import { Container, Stack, Text, Paper } from '@mantine/core';

// Components
import { TeamTokenPicker } from '../TeamTokenPicker/TeamTokenPicker';
import { StealRoundSummary } from './StealRoundSummary/StealRoundSummary';

// Types
import type { TeamInfo } from '../CardRound.types';

// Constants
import { UI_STRINGS } from '../CardRound.constants';
import { STEAL_ROUND_CARD_COUNT } from '../../settings/settings.constants';

// Styles
import '../CardRound.css';
import './StealRoundView.css';

export interface StealCardResult {
    cardIndex: number;
    stolenByTeamId: string | null;
}

export interface StealRoundResult {
    results: StealCardResult[];
}

export interface StealRoundViewProps {
    cards: readonly string[][];
    teams: TeamInfo[];
    teamPosition: number;
    onRoundEnd: (result: StealRoundResult) => void;
    onClose?: () => void;
}

export const StealRoundView: React.FC<StealRoundViewProps> = ({
    cards,
    teams,
    teamPosition,
    onRoundEnd,
    onClose,
}) => {
    const [currentCardStep, setCurrentCardStep] = useState(0);
    const [results, setResults] = useState<StealCardResult[]>([]);
    const [cardIndices] = useState(() =>
        Array.from({ length: STEAL_ROUND_CARD_COUNT }, () =>
            Math.floor(Math.random() * cards.length)
        )
    );
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const highlightedWordIndex = teamPosition % 8;
    const currentCardIndex = cardIndices[currentCardStep];
    const currentCard = cards[currentCardIndex];

    const handleTeamSelect = (teamId: string) => {
        setSelectedTeamId(teamId);
        const newResult: StealCardResult = {
            cardIndex: currentCardIndex,
            stolenByTeamId: teamId,
        };
        setResults(prev => [...prev, newResult]);
        setIsAnimating(true);

        setTimeout(() => {
            if (currentCardStep < STEAL_ROUND_CARD_COUNT - 1) {
                setCurrentCardStep(prev => prev + 1);
                setSelectedTeamId(null);
            } else {
                setShowSummary(true);
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleSummaryConfirm = () => {
        onRoundEnd({ results });
        onClose?.();
    };

    const handleChangeResult = (index: number, teamId: string | null) => {
        setResults(prev => prev.map((r, i) =>
            i === index ? { ...r, stolenByTeamId: teamId } : r
        ));
    };

    if (showSummary) {
        return (
            <StealRoundSummary
                results={results}
                cards={cards}
                teams={teams}
                highlightedWordIndex={highlightedWordIndex}
                onChangeResult={handleChangeResult}
                onConfirm={handleSummaryConfirm}
            />
        );
    }

    return (
        <div className="card-round-overlay">
            <div className="card-round-container">
                <Container size="md">
                    <Stack gap="lg">
                        <div className="card-round-header">
                            <div className="steal-round-progress">
                                <Text className="steal-round-progress-text">
                                    🎯 קלף {currentCardStep + 1}/{STEAL_ROUND_CARD_COUNT} 🎯
                                </Text>
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
                                <TeamTokenPicker
                                    teams={teams}
                                    selectedTeamId={selectedTeamId}
                                    onSelectTeam={handleTeamSelect}
                                    locked={false}
                                />
                            </div>
                        </Paper>
                    </Stack>
                </Container>
            </div>
        </div>
    );
};
