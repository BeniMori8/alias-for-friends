import React from 'react';
import './BoardContainer.css';

interface BoardContainerProps {
    children: React.ReactNode;
}

export const BoardContainer: React.FC<BoardContainerProps> = ({ children }) => {
    return (
        <div className="benias-board-container">
            <div className="benias-board-aspect-wrapper">
                <div className="benias-board-surface">
                    {children}
                </div>
            </div>
        </div>
    );
};
