import React, { useMemo } from 'react';
import { BoardCell } from '../BoardCell/BoardCell';
import { BOARD_CELLS } from '../types';
import { getCellPositions } from '../PathUtils';

export const BoardPath: React.FC = () => {
    const positions = useMemo(() => getCellPositions(BOARD_CELLS.length), []);

    return (
        <>
            {BOARD_CELLS.map((cell, index) => {
                const pos = positions[index];
                return (
                    <BoardCell
                        key={cell.id}
                        value={cell.value}
                        isStart={cell.isStart}
                        isEnd={cell.isEnd}
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
