// TeamBar Constants
import { COLORS, FONTS } from '../../constants';

export const TEAM_BAR_COLORS = {
    ACTIVE_BACKGROUND: COLORS.PRIMARY_RED,
    INACTIVE_BACKGROUND: COLORS.WHITE,
    ACTIVE_TEXT: COLORS.WHITE,
    INACTIVE_TEXT: COLORS.PRIMARY_RED,
    ACTIVE_BORDER: COLORS.WHITE,
    INACTIVE_BORDER: COLORS.PRIMARY_RED,
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
    FAMILY: FONTS.PRIMARY,
} as const;

export const TEAM_BAR_TEXT = {
    STEPS_REMAINING: (count: number) => `עוד ${count} צעדים 🎯`,
} as const;
