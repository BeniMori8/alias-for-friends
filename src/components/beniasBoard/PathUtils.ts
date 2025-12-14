export interface Point {
    x: number;
    y: number;
}

// Define the path as a series of points (0-100 coordinate space)
// Outer Loop -> Inner Loop
const PATH_POINTS: Point[] = [
    { x: 8, y: 8 },     // Top-Left (Start)
    { x: 80, y: 8 },    // Top-Right (Approach)
    { x: 92, y: 20 },   // Top-Right (Exit)
    { x: 92, y: 80 },   // Bottom-Right (Approach)
    { x: 80, y: 92 },   // Bottom-Right (Exit)
    { x: 20, y: 92 },   // Bottom-Left (Approach)
    { x: 8, y: 80 },    // Bottom-Left (Exit)
    { x: 8, y: 45 },    // Left (up to spiral entry)
    { x: 20, y: 35 },   // Inner Top-Left (Start)
    { x: 65, y: 35 },   // Inner Top-Right (Approach)
    { x: 75, y: 45 },   // Inner Top-Right (Exit)
    { x: 75, y: 55 },   // Inner Bottom-Right (Approach)
    { x: 65, y: 65 },   // Inner Bottom-Right (Exit)
    { x: 25, y: 65 },   // Inner Bottom-Left (End)
];

// Constants
const ASPECT_RATIO = 16 / 9;
const CORNER_RADIUS = 3; // Radius for corner smoothing in coordinate units
const DENSIFICATION_STEPS = 50; // Steps per segment for high-resolution sampling
const CORNER_STEPS = 8; // Number of interpolation points for each corner arc

// Board size thresholds for cell sizing
const MIN_BOARD_SIZE = 48;
const MAX_BOARD_SIZE = 80;
const DEFAULT_BOARD_SIZE = 64;

// Cell size percentages (width as % of board)
const CELL_SIZE_SPARSE = 5.2; // For smaller boards (48)
const CELL_SIZE_DEFAULT = 4.8; // For default (64)
const CELL_SIZE_DENSE = 3.8; // For larger boards (80)

// Calculate distance between two points, accounting for aspect ratio
const distance = (p1: Point, p2: Point): number => {
    const dx = p1.x - p2.x;
    const dy = (p1.y - p2.y) / ASPECT_RATIO;
    return Math.sqrt(dx * dx + dy * dy);
};

// Linear interpolation between two points
const lerp = (p1: Point, p2: Point, t: number): Point => ({
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
});

// Normalize a vector
const normalize = (dx: number, dy: number): { dx: number; dy: number } => {
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { dx: 0, dy: 0 };
    return { dx: dx / len, dy: dy / len };
};

// Create a smoothed path with rounded corners
const createSmoothedPath = (): Point[] => {
    const smoothed: Point[] = [];

    for (let i = 0; i < PATH_POINTS.length; i++) {
        const curr = PATH_POINTS[i];

        if (i === 0 || i === PATH_POINTS.length - 1) {
            // First and last points: keep as-is
            smoothed.push(curr);
            continue;
        }

        const prev = PATH_POINTS[i - 1];
        const next = PATH_POINTS[i + 1];

        // Calculate incoming and outgoing directions
        const inDir = normalize(curr.x - prev.x, curr.y - prev.y);
        const outDir = normalize(next.x - curr.x, next.y - curr.y);

        // Calculate the angle between segments
        const dot = inDir.dx * outDir.dx + inDir.dy * outDir.dy;
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

        // Only smooth if there's a significant turn (> 15 degrees)
        if (angle > Math.PI / 12) {
            // Calculate offset distance for corner rounding
            const offsetDist = Math.min(
                CORNER_RADIUS,
                distance(prev, curr) * 0.3,
                distance(curr, next) * 0.3
            );

            // Entry point before corner
            const entryPoint: Point = {
                x: curr.x - inDir.dx * offsetDist,
                y: curr.y - inDir.dy * offsetDist,
            };

            // Exit point after corner
            const exitPoint: Point = {
                x: curr.x + outDir.dx * offsetDist,
                y: curr.y + outDir.dy * offsetDist,
            };

            smoothed.push(entryPoint);

            // Add interpolated points along the corner arc
            for (let j = 1; j < CORNER_STEPS; j++) {
                const t = j / CORNER_STEPS;
                // Quadratic bezier-like interpolation through the corner
                const mid1 = lerp(entryPoint, curr, t);
                const mid2 = lerp(curr, exitPoint, t);
                smoothed.push(lerp(mid1, mid2, t));
            }

            smoothed.push(exitPoint);
        } else {
            // Straight segment, keep the point
            smoothed.push(curr);
        }
    }

    return smoothed;
};

// Densify the path for accurate arc-length sampling
const densifyPath = (path: Point[]): { points: Point[]; distances: number[] } => {
    const points: Point[] = [];
    const distances: number[] = [];
    let totalDist = 0;

    for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];
        const segLen = distance(p1, p2);

        // Determine number of subdivisions based on segment length
        const steps = Math.max(5, Math.ceil(segLen * DENSIFICATION_STEPS / 100));

        for (let j = 0; j < steps; j++) {
            const t = j / steps;
            const point = lerp(p1, p2, t);

            if (points.length > 0) {
                totalDist += distance(points[points.length - 1], point);
            }

            points.push(point);
            distances.push(totalDist);
        }
    }

    // Add the final point
    const lastPoint = path[path.length - 1];
    if (points.length > 0) {
        totalDist += distance(points[points.length - 1], lastPoint);
    }
    points.push(lastPoint);
    distances.push(totalDist);

    return { points, distances };
};

// Cached smoothed and densified path
const smoothedPath = createSmoothedPath();
const { points: denseSamples, distances: cumulativeDistances } = densifyPath(smoothedPath);
const TOTAL_LENGTH = cumulativeDistances[cumulativeDistances.length - 1];

// Find point at a specific distance using binary search
const getPointAtDistance = (targetDist: number): Point => {
    if (targetDist <= 0) return denseSamples[0];
    if (targetDist >= TOTAL_LENGTH) return denseSamples[denseSamples.length - 1];

    // Binary search for the segment containing targetDist
    let low = 0;
    let high = cumulativeDistances.length - 1;

    while (low < high - 1) {
        const mid = Math.floor((low + high) / 2);
        if (cumulativeDistances[mid] <= targetDist) {
            low = mid;
        } else {
            high = mid;
        }
    }

    // Interpolate between samples[low] and samples[high]
    const d1 = cumulativeDistances[low];
    const d2 = cumulativeDistances[high];
    const t = (targetDist - d1) / (d2 - d1);

    return lerp(denseSamples[low], denseSamples[high], t);
};

// Get all cell positions with even arc-length spacing
export const getCellPositions = (count: number): Point[] => {
    const positions: Point[] = [];

    if (count <= 1) {
        return [denseSamples[0]];
    }

    const step = TOTAL_LENGTH / (count - 1);

    for (let i = 0; i < count; i++) {
        positions.push(getPointAtDistance(i * step));
    }

    return positions;
};

// Calculate cell size based on board density
export const getCellSizePercent = (boardSize: number): number => {
    if (boardSize <= MIN_BOARD_SIZE) {
        return CELL_SIZE_SPARSE;
    }

    if (boardSize >= MAX_BOARD_SIZE) {
        return CELL_SIZE_DENSE;
    }

    // Linear interpolation between sparse and dense
    if (boardSize <= DEFAULT_BOARD_SIZE) {
        const t = (boardSize - MIN_BOARD_SIZE) / (DEFAULT_BOARD_SIZE - MIN_BOARD_SIZE);
        return CELL_SIZE_SPARSE + (CELL_SIZE_DEFAULT - CELL_SIZE_SPARSE) * t;
    } else {
        const t = (boardSize - DEFAULT_BOARD_SIZE) / (MAX_BOARD_SIZE - DEFAULT_BOARD_SIZE);
        return CELL_SIZE_DEFAULT + (CELL_SIZE_DENSE - CELL_SIZE_DEFAULT) * t;
    }
};

// Export the start position for PlayerTokens
export const START_POSITION = PATH_POINTS[0];
