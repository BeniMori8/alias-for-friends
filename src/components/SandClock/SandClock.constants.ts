// SandClock Constants

// Colors
export const SAND_COLORS = {
    DEFAULT: '#51cf66' as string,
    TIME_UP: '#FA5252' as string,
    WARNING: '#FD7E14' as string,
};

// Thresholds
export const SAND_CLOCK_THRESHOLDS = {
    TIME_UP_SECONDS: 0,
    WARNING_PERCENTAGE: 15,
} as const;

// Dimensions
export const SAND_CLOCK_DIMENSIONS = {
    DEFAULT_HEIGHT: 60,
    WIDTH_RATIO: 0.6,
    PERCENTAGE_MAX: 100,
    PERCENTAGE_MIN: 0,
} as const;

// SVG Coordinates
export const SVG_COORDS = {
    TOP_SAND_Y_OFFSET: 80,
    TOP_SAND_HEIGHT_DIVISOR: 70,
    BOTTOM_SAND_Y_BASE: 155,
    STREAM_X: 50,
    STREAM_Y_START: 80,
    STREAM_Y_END: 155,
} as const;
