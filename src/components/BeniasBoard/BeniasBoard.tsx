import React from 'react';
import { BoardContainer } from './BoardContainer/BoardContainer';
import { BoardPath } from './BoardPath/BoardPath';
import { BoardCenterLogo } from './BoardCenterLogo/BoardCenterLogo';
import { PlayerTokens } from './PlayerTokens/PlayerTokens';
import type { TeamSettings } from '../settings/settings.types';
import { DEFAULT_BOARD_SIZE } from '../settings/settings.constants';

interface BeniasBoardProps {
    teams?: TeamSettings[];
    boardSize?: number;
}

export const BeniasBoard: React.FC<BeniasBoardProps> = ({
    teams,
    boardSize = DEFAULT_BOARD_SIZE
}) => {
    return (
        <BoardContainer>
            <BoardCenterLogo />
            <BoardPath boardSize={boardSize} />
            <PlayerTokens teams={teams} boardSize={boardSize} />
        </BoardContainer>
    );
};
