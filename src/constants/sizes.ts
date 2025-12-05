/**
 * Global Size Constants
 * Centralized spacing, dimensions, and size values
 */

export const SPACING = {
    XXS: 2,
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
} as const;

export const BORDER_RADIUS = {
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
    ROUND: '50%',
} as const;

export const BORDER_WIDTH = {
    THIN: 1,
    DEFAULT: 2,
    THICK: 3,
    EXTRA_THICK: 4,
    VERY_THICK: 5,
} as const;

export const FONT_SIZE = {
    XS: '0.5rem',
    SM: '0.75rem',
    MD: '1rem',
    LG: '1.25rem',
    XL: '1.5rem',
    XXL: '2rem',
    XXXL: '2.5rem',
} as const;

export const FONT_WEIGHT = {
    NORMAL: 400,
    MEDIUM: 600,
    BOLD: 700,
    EXTRA_BOLD: 800,
    BLACK: 900,
} as const;

export const SHADOWS = {
    SM: '0 2px 4px rgba(0, 0, 0, 0.2)',
    MD: '0 4px 12px rgba(0, 0, 0, 0.25)',
    LG: '0 8px 20px rgba(0, 0, 0, 0.35)',
    XL: '0 20px 60px rgba(0, 0, 0, 0.4)',
} as const;

export const Z_INDEX = {
    BACKGROUND: 1,
    BASE: 10,
    ELEVATED: 20,
    OVERLAY: 50,
    MODAL: 100,
} as const;
