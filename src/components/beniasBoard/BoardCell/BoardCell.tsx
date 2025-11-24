import React from 'react';
import './BoardCell.css';

interface BoardCellProps {
    value: number;
    isStart?: boolean;
    isEnd?: boolean;
    style?: React.CSSProperties;
}

export const BoardCell: React.FC<BoardCellProps> = ({ value, isStart, isEnd, style }) => {
    return (
        <div
            className={`benias-board-cell ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''}`}
            style={style}
        >
            <span className="benias-board-cell-text">
                {value}
            </span>
        </div>
    );
};
