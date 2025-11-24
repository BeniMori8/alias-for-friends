import React from 'react';
import { BoardContainer } from './BoardContainer/BoardContainer';
import { BoardPath } from './BoardPath/BoardPath';
import { BoardCenterLogo } from './BoardCenterLogo/BoardCenterLogo';
import { PlayerTokens } from './PlayerTokens/PlayerTokens';
import { START_POSITION } from './PathUtils';

export const BeniasBoard: React.FC = () => {
    // Use the exact start position from our path logic
    const startPosition = {
        left: `${START_POSITION.x}%`,
        top: `${START_POSITION.y}%`
    };

    return (
        <BoardContainer>
            <BoardCenterLogo />
            <BoardPath />
            <PlayerTokens startPosition={startPosition} />
        </BoardContainer>
    );
};
