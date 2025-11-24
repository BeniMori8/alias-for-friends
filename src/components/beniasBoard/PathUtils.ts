export interface Point {
    x: number;
    y: number;
}

// Define the path as a series of points (0-100 coordinate space)
// Outer Loop -> Inner Loop
// We use chamfered corners to prevent cells from bunching up
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

// Aspect ratio of the board (16:9)
const ASPECT_RATIO = 16 / 9;

// Calculate distance between two points, accounting for aspect ratio
// We normalize Y units to match X units visually
const distance = (p1: Point, p2: Point): number => {
    const dx = p1.x - p2.x;
    const dy = (p1.y - p2.y) / ASPECT_RATIO;
    return Math.sqrt(dx * dx + dy * dy);
};

// Calculate total path length
const getTotalLength = (): number => {
    let len = 0;
    for (let i = 0; i < PATH_POINTS.length - 1; i++) {
        len += distance(PATH_POINTS[i], PATH_POINTS[i + 1]);
    }
    return len;
};

const TOTAL_LENGTH = getTotalLength();

// Get point at a specific distance along the path
const getPointAtDistance = (dist: number): Point => {
    let currentDist = 0;

    for (let i = 0; i < PATH_POINTS.length - 1; i++) {
        const p1 = PATH_POINTS[i];
        const p2 = PATH_POINTS[i + 1];
        const segLen = distance(p1, p2);

        if (currentDist + segLen >= dist) {
            // Point is on this segment
            const remaining = dist - currentDist;
            const ratio = remaining / segLen;
            return {
                x: p1.x + (p2.x - p1.x) * ratio,
                y: p1.y + (p2.y - p1.y) * ratio,
            };
        }

        currentDist += segLen;
    }

    return PATH_POINTS[PATH_POINTS.length - 1];
};

// Get all cell positions
export const getCellPositions = (count: number): Point[] => {
    const positions: Point[] = [];
    // We want to place 'count' cells.
    // We can place them at centers of 'count' equal segments, or just distribute them evenly.
    // Let's distribute them evenly from start (0) to end (TOTAL_LENGTH).
    // If we want the first cell AT the start and last cell AT the end:
    const step = TOTAL_LENGTH / (count - 1);

    for (let i = 0; i < count; i++) {
        positions.push(getPointAtDistance(i * step));
    }

    return positions;
};

// Export the start position for PlayerTokens
export const START_POSITION = PATH_POINTS[0];
