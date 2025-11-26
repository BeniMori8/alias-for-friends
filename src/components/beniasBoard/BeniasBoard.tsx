import React from 'react';
import { BoardContainer } from './BoardContainer/BoardContainer';
import { BoardPath } from './BoardPath/BoardPath';
import { BoardCenterLogo } from './BoardCenterLogo/BoardCenterLogo';
import { PlayerTokens } from './PlayerTokens/PlayerTokens';
import { START_POSITION } from './PathUtils';
import type { TeamSettings } from '../settings/settings.types';

interface BeniasBoardProps {
    teams?: TeamSettings[];
}

export const BeniasBoard: React.FC<BeniasBoardProps> = ({ teams }) => {
    // Use the exact start position from our path logic
    const startPosition = {
        left: `${START_POSITION.x}%`,
        top: `${START_POSITION.y}%`
    };

    return (
        <BoardContainer>
            <BoardCenterLogo />
            <BoardPath />
            <PlayerTokens startPosition={startPosition} teams={teams} />
        </BoardContainer>
    );
};
