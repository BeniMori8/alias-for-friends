/**
 * Global Color Palette
 * Centralized color constants for the entire application
 */

export const COLORS = {
    // Primary Colors
    PRIMARY_RED: '#c92a2a',
    PRIMARY_RED_DARK: '#7d1212',

    // Gold/Yellow
    GOLD: '#ffd700',
    GOLD_LIGHT: '#ffed4e',
    GOLD_LIGHTEST: '#fff9db',

    // Success/Green
    SUCCESS: '#40c057',
    SUCCESS_LIGHT: '#51cf66',
    SUCCESS_LIGHTEST: '#e9fac8',
    SUCCESS_BG: '#e6fcf5',

    // Error/Red
    ERROR: '#fa5252',
    ERROR_LIGHT: '#ff6b6b',
    ERROR_LIGHTER: '#ff8787',
    ERROR_BG: '#fff5f5',
    ERROR_BG_LIGHT: '#ffc9c9',

    // Info/Blue
    INFO: '#228BE6',
    INFO_LIGHT: '#339af0',

    // Neutral/Gray Scale
    TEXT_PRIMARY: '#212529',
    TEXT_SECONDARY: '#495057',
    TEXT_MUTED: '#868e96',
    TEXT_DISABLED: '#6c757d',

    BORDER_LIGHT: '#e9ecef',
    BORDER_DEFAULT: '#dee2e6',
    BORDER_SUBTLE: '#eee',

    BACKGROUND_WHITE: '#ffffff',
    BACKGROUND_LIGHT: '#f8f9fa',
    BACKGROUND_GRAY: '#e9ecef',

    // Special
    WHITE: 'white',
    BLACK: 'black',
    TRANSPARENT: 'transparent',
} as const;

/**
 * Color with opacity helpers
 */
export const withOpacity = (color: string, opacity: number): string => {
    return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace(/(.{2})(.{2})(.{2})/, '$1, $2, $3');
};

/**
 * Semantic color mappings
 */
export const SEMANTIC_COLORS = {
    BOARD_BACKGROUND: COLORS.PRIMARY_RED_DARK,
    BOARD_SURFACE: COLORS.PRIMARY_RED,
    CELL_BACKGROUND: COLORS.WHITE,
    CELL_BORDER: COLORS.PRIMARY_RED,
    CELL_TEXT: COLORS.PRIMARY_RED,
    START_CELL_BORDER: COLORS.GOLD,
    END_CELL_BORDER: COLORS.SUCCESS,
    END_CELL_BACKGROUND: COLORS.SUCCESS_LIGHTEST,
} as const;
