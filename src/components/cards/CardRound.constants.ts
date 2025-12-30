// Card Round Constants

// View States
export const CARD_ROUND_VIEW = {
    GAME: 'game' as const,
    SUMMARY: 'summary' as const,
} as const;


// Card Status
export const CARD_STATUS = {
    SUCCESS: 'success' as const,
    FAIL: 'fail' as const,
} as const;


// Scoring
export const SCORE_VALUES = {
    SUCCESS: 1,
    FAIL: -1,
} as const;

// Timer
export const TIMER_CONSTANTS = {
    URGENT_THRESHOLD_SECONDS: 10,
    TIME_COMPLETE_THRESHOLD: 1,
    INTERVAL_MS: 1000,
} as const;

// Animation
export const ANIMATION_DELAYS = {
    CARD_CHANGE_MS: 150,
    CARD_REVEAL_MS: 150,
} as const;

// Target Word Index (temporary - will be dynamic based on board position)
export const TARGET_WORD_INDEX = 1;

// Rotation Angles
export const ROTATION_ANGLES = {
    PAUSED: 90,
    NORMAL: 0,
} as const;

// UI Strings
export const UI_STRINGS = {
    SCORE_LABEL: 'נקודות',
    ROUND_SUMMARY_TITLE: 'סיכום סיבוב',
    FINISH_TURN_BUTTON: 'סיום תור',
    SUCCESS_BUTTON: 'הצליח',
    FAIL_BUTTON: 'נכשל',
    WATERMARK_TEXT: 'Benias',
    SUCCESS_ICON: '✔',
    FAIL_ICON: '✖',
    // Steal mechanic
    TIME_UP_STEAL_PROMPT: 'הזמן נגמר — מי גנב את הקלף?',
    STEAL_DROPDOWN_PLACEHOLDER: 'בחר קבוצה שגנבה את הקלף',
    STOLEN_CARD_HEADER: 'קלף שנגנב',
} as const;

// Layout Constants
export const LAYOUT_CONSTANTS = {
    SAND_CLOCK_HEIGHT: 80,
} as const;

