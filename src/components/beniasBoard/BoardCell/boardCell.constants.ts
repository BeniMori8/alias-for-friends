// BoardCell Constants
export const BOARD_CELL_SIZES = {
    CELL_WIDTH_PERCENTAGE: 4.8,
    MOBILE_WIDTH_PERCENTAGE: 5.5,
    TABLET_WIDTH_PERCENTAGE: 5,
} as const;

export const BOARD_CELL_BORDERS = {
    DEFAULT_WIDTH: 2,
    START_END_WIDTH: 4,
    MOBILE_WIDTH: 1.5,
    MOBILE_START_END_WIDTH: 2.5,
    DESKTOP_WIDTH: 3,
    DESKTOP_START_END_WIDTH: 5,
} as const;

export const BOARD_CELL_COLORS = {
    BACKGROUND: 'white',
    BORDER_DEFAULT: '#c92a2a',
    BORDER_START: '#ffd700',
    BORDER_END: '#40c057',
    BACKGROUND_END: '#e9fac8',
    TEXT_COLOR: '#c92a2a',
} as const;

export const BOARD_CELL_SHADOW = {
    DEFAULT: '0 2px 5px rgba(0, 0, 0, 0.2)',
    START: '0 0 20px 5px rgba(255, 215, 0, 0.6)',
    END: '0 0 15px 3px rgba(64, 192, 87, 0.5)',
} as const;

export const BOARD_CELL_FONT = {
    FAMILY: "'Fredoka', sans-serif",
    WEIGHT_DEFAULT: 900,
    WEIGHT_MOBILE: 700,
} as const;
