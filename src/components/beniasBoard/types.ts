export interface BoardCellConfig {
    id: string;
    index: number;
    value: number; // 1–8
    isStart?: boolean;
    isEnd?: boolean;
}

const DEFAULT_BOARD_SIZE = 64;

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
        });
    }

    return cells;
};

// Default board cells for backwards compatibility
export const BOARD_CELLS: BoardCellConfig[] = createBoardCells(DEFAULT_BOARD_SIZE);
