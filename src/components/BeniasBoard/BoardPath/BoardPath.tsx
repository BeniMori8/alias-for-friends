import React, { useMemo } from 'react';
import { BoardCell } from '../BoardCell/BoardCell';
import { createBoardCells } from '../types';
import { getCellPositions, getCellSizePercent } from '../PathUtils';
import { DEFAULT_BOARD_SIZE } from '../../settings/settings.constants';

interface BoardPathProps {
    boardSize?: number;
}

export const BoardPath: React.FC<BoardPathProps> = ({ boardSize = DEFAULT_BOARD_SIZE }) => {
    const cells = useMemo(() => createBoardCells(boardSize), [boardSize]);
    const positions = useMemo(() => getCellPositions(boardSize), [boardSize]);
    const cellSize = useMemo(() => getCellSizePercent(boardSize), [boardSize]);

    return (
        <>
            {cells.map((cell, index) => {
                const pos = positions[index];
                return (
                    <BoardCell
                        key={cell.id}
                        value={cell.value}
                        isStart={cell.isStart}
                        isEnd={cell.isEnd}
                        isSteal={cell.isSteal}
                        cellSize={cellSize}
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                );
            })}
        </>
    );
};
