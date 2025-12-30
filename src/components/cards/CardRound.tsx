// External libraries
import React, { useState } from 'react';

// Components
import { RoundSummaryView } from './RoundSummaryView/RoundSummaryView';
import { GameCardView } from './GameCardView/GameCardView';

// Hooks
import { useRoundTimer } from '../../hooks/useRoundTimer';

// Types
import type { RoundHistoryItem, TeamInfo, RoundResult, CardRoundView } from './CardRound.types';

// Constants
import { CARD_ROUND_VIEW, CARD_STATUS, SCORE_VALUES, ANIMATION_DELAYS } from './CardRound.constants';

// Styles
import './CardRound.css';

export interface CardRoundProps {
    cards: readonly string[][];
    roundDurationSeconds: number;
    teams: TeamInfo[];
    activeTeamId: string;
    onRoundEnd: (result: RoundResult) => void;
    onClose?: () => void;
    teamPosition?: number;
}

export const CardRound: React.FC<CardRoundProps> = ({
    cards, roundDurationSeconds, teams, activeTeamId, onRoundEnd, onClose, teamPosition = 0
}) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(() => Math.floor(Math.random() * cards.length));
    const [view, setView] = useState<CardRoundView>(CARD_ROUND_VIEW.GAME);
    const [completedCards, setCompletedCards] = useState<RoundHistoryItem[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [stealTeamId, setStealTeamId] = useState<string | null>(null);
    const [stealLocked, setStealLocked] = useState(false);
    const [lastShownCard, setLastShownCard] = useState<RoundHistoryItem | null>(null);

    const timer = useRoundTimer(roundDurationSeconds);
    const currentCard = cards[currentCardIndex];
    const highlightedWordIndex = teamPosition % 8;
    const completedScore = completedCards.reduce((acc, item) =>
        acc + (item.status === CARD_STATUS.SUCCESS ? SCORE_VALUES.SUCCESS : SCORE_VALUES.FAIL), 0);

    const handleNextCard = (status: typeof CARD_STATUS.SUCCESS | typeof CARD_STATUS.FAIL) => {
        setCompletedCards(prev => [...prev, { cardIndex: currentCardIndex, status }]);
        if (timer.isTimeUp) { setView(CARD_ROUND_VIEW.SUMMARY); return; }
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentCardIndex(Math.floor(Math.random() * cards.length));
            setTimeout(() => setIsAnimating(false), ANIMATION_DELAYS.CARD_REVEAL_MS);
        }, ANIMATION_DELAYS.CARD_CHANGE_MS);
    };

    const handleStealTeamSelect = (teamId: string) => {
        if (stealLocked) return;
        setStealTeamId(teamId);
        setStealLocked(true);
        setLastShownCard({ cardIndex: currentCardIndex, status: CARD_STATUS.SUCCESS });
        setView(CARD_ROUND_VIEW.SUMMARY);
    };

    const handleToggleHistoryItem = (index: number) => {
        setCompletedCards(prev => prev.map((item, i) => i === index
            ? { ...item, status: item.status === CARD_STATUS.SUCCESS ? CARD_STATUS.FAIL : CARD_STATUS.SUCCESS }
            : item));
    };

    const handleToggleStolenCard = () => {
        if (!lastShownCard) return;
        setLastShownCard({ ...lastShownCard, status: lastShownCard.status === CARD_STATUS.SUCCESS ? CARD_STATUS.FAIL : CARD_STATUS.SUCCESS });
    };

    const handleRoundComplete = () => {
        onRoundEnd({ activeTeamId, completedCards, lastShownCard, stolenByTeamId: stealTeamId });
        onClose?.();
    };

    if (view === CARD_ROUND_VIEW.SUMMARY) {
        return (
            <RoundSummaryView
                roundHistory={completedCards}
                totalScore={completedScore}
                cards={cards}
                onToggleItem={handleToggleHistoryItem}
                onClose={handleRoundComplete}
                highlightedWordIndex={highlightedWordIndex}
                lastShownCard={lastShownCard}
                teams={teams}
                stealTeamId={stealTeamId}
                onStealTeamChange={setStealTeamId}
                onToggleStolenCard={handleToggleStolenCard}
            />
        );
    }

    return (
        <GameCardView
            currentCard={currentCard}
            highlightedWordIndex={highlightedWordIndex}
            completedScore={completedScore}
            isAnimating={isAnimating}
            roundDurationSeconds={roundDurationSeconds}
            timer={timer}
            teams={teams}
            stealTeamId={stealTeamId}
            stealLocked={stealLocked}
            onStealTeamSelect={handleStealTeamSelect}
            onNextCard={handleNextCard}
        />
    );
};
