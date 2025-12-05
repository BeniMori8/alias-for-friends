// PlayerTokens Constants
export const PLAYER_TOKEN_SIZES = {
    MIN_SIZE: 16,
    MAX_SIZE: 32,
    VIEWPORT_SCALE: 2.5, // vw units
    MOBILE_MIN: 14,
    MOBILE_MAX: 24,
    MOBILE_VIEWPORT_SCALE: 3.5,
    DESKTOP_MIN: 24,
    DESKTOP_MAX: 36,
    DESKTOP_VIEWPORT_SCALE: 2,
} as const;

export const PLAYER_TOKEN_BORDERS = {
    DEFAULT_WIDTH: 2,
    MOBILE_WIDTH: 1.5,
    DESKTOP_WIDTH: 3,
} as const;

export const PLAYER_TOKEN_COLORS = {
    BORDER_COLOR: 'white',
    SHADOW_COLOR: 'rgba(0, 0, 0, 0.3)',
    INSET_SHADOW_COLOR: 'rgba(0, 0, 0, 0.15)',
} as const;
