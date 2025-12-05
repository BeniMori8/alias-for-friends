// TeamBar Constants
export const TEAM_BAR_COLORS = {
    ACTIVE_BACKGROUND: '#c92a2a',
    INACTIVE_BACKGROUND: 'white',
    ACTIVE_TEXT: 'white',
    INACTIVE_TEXT: '#c92a2a',
    ACTIVE_BORDER: 'white',
    INACTIVE_BORDER: '#c92a2a',
} as const;

export const TEAM_BAR_SIZES = {
    MIN_WIDTH: 140,
    PADDING_Y: 12,
    PADDING_X: 16,
    BORDER_RADIUS: 16,
    BORDER_WIDTH: 3,
    TOKEN_SIZE: 20,
} as const;

export const TEAM_BAR_FONT = {
    FAMILY: "'Fredoka', sans-serif",
} as const;

export const TEAM_BAR_TEXT = {
    STEPS_REMAINING: (count: number) => `עוד ${count} צעדים 🎯`,
    VICTORY: '🏆 ניצחון!',
} as const;
