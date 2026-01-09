import { DEFAULT_BOARD_SIZE, STEAL_CELL_INTERVAL } from '../settings/settings.constants';

export interface BoardCellConfig {
    id: string;
    index: number;
    value: number; // 1–8
    isStart?: boolean;
    isEnd?: boolean;
    isSteal?: boolean;
}

/**
 * Determines if a cell at the given index is a steal cell.
 * Steal cells appear at every STEAL_CELL_INTERVAL (e.g., 11th, 22nd, 33rd...).
 * The last cell (victory cell) is never a steal cell.
 */
export const isStealCell = (index: number, boardSize: number): boolean => {
    if (index === 0) return false; // Start cell is never steal
    if (index === boardSize - 1) return false; // End cell is never steal
    return (index + 1) % STEAL_CELL_INTERVAL === 0;
};

/**
 * Factory function to generate board cells for a given board size.
 * Cells are distributed evenly along the spiral path.
 * Values cycle from 1-8 repeatedly.
 */
export const createBoardCells = (boardSize: number = DEFAULT_BOARD_SIZE): BoardCellConfig[] => {
    const cells: BoardCellConfig[] = [];

    for (let i = 0; i < boardSize; i++) {
        cells.push({
            id: `cell-${i}`,
            index: i,
            value: (i % 8) + 1,
            isStart: i === 0,
            isEnd: i === boardSize - 1,
            isSteal: isStealCell(i, boardSize),
        });
    }

    return cells;
};

// Default board cells for backwards compatibility
export const BOARD_CELLS: BoardCellConfig[] = createBoardCells(DEFAULT_BOARD_SIZE);
