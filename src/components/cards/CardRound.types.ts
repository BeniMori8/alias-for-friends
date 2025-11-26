// Card Round Types

import type { CARD_ROUND_VIEW, CARD_STATUS } from './CardRound.constants';

export interface RoundHistoryItem {
    cardIndex: number;
    status: CardStatus;
}

export type CardRoundView = typeof CARD_ROUND_VIEW[keyof typeof CARD_ROUND_VIEW];

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS];
