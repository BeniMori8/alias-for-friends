/**
 * Global Font Constants
 * Centralized font family definitions
 */

export const FONTS = {
    PRIMARY: "'Fredoka', sans-serif",
    SECONDARY: "'Outfit', sans-serif",
    SYSTEM: "system-ui, -apple-system, sans-serif",
} as const;

export const FONT_STACKS = {
    HEADINGS: FONTS.PRIMARY,
    BODY: FONTS.PRIMARY,
    UI: FONTS.PRIMARY,
} as const;
