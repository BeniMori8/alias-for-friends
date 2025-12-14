import React from 'react';
import './BoardCell.css';

const DEFAULT_CELL_SIZE = 4.8;

interface BoardCellProps {
    value: number;
    isStart?: boolean;
    isEnd?: boolean;
    cellSize?: number;
    style?: React.CSSProperties;
}

export const BoardCell: React.FC<BoardCellProps> = ({
    value,
    isStart,
    isEnd,
    cellSize = DEFAULT_CELL_SIZE,
    style
}) => {
    const combinedStyle: React.CSSProperties = {
        ...style,
        width: `${cellSize}%`,
    };

    return (
        <div
            className={`benias-board-cell ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''}`}
            style={combinedStyle}
        >
            <span className="benias-board-cell-text">
                {value}
            </span>
        </div>
    );
};
