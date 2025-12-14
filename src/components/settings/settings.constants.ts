// Settings Screen Constants

// Predefined team colors matching the board tokens
export const PRESET_COLORS = [
    '#FFD700', // Yellow
    '#228BE6', // Blue
    '#40C057', // Green
    '#FA5252', // Red
    '#9C36B5', // Purple
    '#FD7E14', // Orange
    '#E64980', // Pink
    '#20C997', // Teal
    '#FF6B6B', // Coral
    '#4DABF7', // Sky Blue
    '#FFB84D', // Amber
    '#A78BFA', // Lavender
    '#51CF66', // Lime
] as const;

// Hebrew names for colors
export const COLOR_NAMES: Record<string, string> = {
    '#FFD700': 'זהב',
    '#228BE6': 'כחול',
    '#40C057': 'ירוק',
    '#FA5252': 'אדום',
    '#9C36B5': 'סגול',
    '#FD7E14': 'כתום',
    '#E64980': 'ורוד',
    '#20C997': 'טורקיז',
    '#FF6B6B': 'אלמוגים',
    '#4DABF7': 'תכלת',
    '#FFB84D': 'ענבר',
    '#A78BFA': 'לבנדר',
    '#51CF66': 'ליים',
};

// Round duration settings
export const DEFAULT_ROUND_DURATION = 90;
export const MIN_ROUND_DURATION = 10;
export const MAX_ROUND_DURATION = 120;

// Team settings
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 6;
export const MAX_TEAM_NAME_LENGTH = 30;

// Board size settings
export const DEFAULT_BOARD_SIZE = 64;
export const MIN_BOARD_SIZE = 48;
export const MAX_BOARD_SIZE = 80;
