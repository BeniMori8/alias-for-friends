// Card Round Types

import type { CARD_ROUND_VIEW, CARD_STATUS } from './CardRound.constants';

export interface RoundHistoryItem {
    cardIndex: number;
    status: CardStatus;
}

export type CardRoundView = typeof CARD_ROUND_VIEW[keyof typeof CARD_ROUND_VIEW];

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS];

// Steal mechanic types
export interface TeamInfo {
    id: string;
    name: string;
    color: string;
}

export interface RoundResult {
    activeTeamId: string;
    completedCards: RoundHistoryItem[];  // cards finished before time-up
    lastShownCard: RoundHistoryItem | null;  // card shown at time-up
    stolenByTeamId: string | null;  // selected team for lastShownCard
}

