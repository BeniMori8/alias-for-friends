import React from 'react';
import { BoardContainer } from './BoardContainer/BoardContainer';
import { BoardPath } from './BoardPath/BoardPath';
import { BoardCenterLogo } from './BoardCenterLogo/BoardCenterLogo';
import { PlayerTokens } from './PlayerTokens/PlayerTokens';
import type { TeamSettings } from '../settings/settings.types';

interface BeniasBoardProps {
    teams?: TeamSettings[];
}

export const BeniasBoard: React.FC<BeniasBoardProps> = ({ teams }) => {
    return (
        <BoardContainer>
            <BoardCenterLogo />
            <BoardPath />
            <PlayerTokens teams={teams} />
        </BoardContainer>
    );
};
