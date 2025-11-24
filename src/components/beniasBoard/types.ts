export interface BoardCellConfig {
    id: string;
    index: number;
    value: number; // 1–8
    isStart?: boolean;
    isEnd?: boolean;
    side:
    | 'outer-top'
    | 'outer-right'
    | 'outer-bottom'
    | 'outer-left'
    | 'inner-top'
    | 'inner-right'
    | 'inner-bottom';
}

// Helper to generate cells
const generateCells = (): BoardCellConfig[] => {
    const cells: BoardCellConfig[] = [];
    let count = 0;

    // Configuration for sides
    // Outer Loop
    const OUTER_TOP = 14;
    const OUTER_RIGHT = 8;
    const OUTER_BOTTOM = 14;
    const OUTER_LEFT = 6; // Shorter to allow entry to inner loop

    // Inner Loop
    const INNER_TOP = 10;
    const INNER_RIGHT = 4;
    const INNER_BOTTOM = 8;

    const addCells = (num: number, side: BoardCellConfig['side']) => {
        for (let i = 0; i < num; i++) {
            cells.push({
                id: `cell-${count}`,
                index: count,
                value: (count % 8) + 1,
                isStart: count === 0,
                side: side,
            });
            count++;
        }
    };

    addCells(OUTER_TOP, 'outer-top');
    addCells(OUTER_RIGHT, 'outer-right');
    addCells(OUTER_BOTTOM, 'outer-bottom');
    addCells(OUTER_LEFT, 'outer-left');

    addCells(INNER_TOP, 'inner-top');
    addCells(INNER_RIGHT, 'inner-right');
    addCells(INNER_BOTTOM, 'inner-bottom');

    // Mark last cell as end
    if (cells.length > 0) {
        cells[cells.length - 1].isEnd = true;
    }

    return cells;
};

export const BOARD_CELLS: BoardCellConfig[] = generateCells();
