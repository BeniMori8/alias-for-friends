import React, { useMemo } from 'react';
import type { TeamSettings } from '../../settings/settings.types';
import { getCellPositions } from '../PathUtils';
import './PlayerTokens.css';

const DEFAULT_BOARD_SIZE = 64;

interface PlayerTokensProps {
    teams?: (TeamSettings & { position?: number })[];
    boardSize?: number;
}

export const PlayerTokens: React.FC<PlayerTokensProps> = ({
    teams,
    boardSize = DEFAULT_BOARD_SIZE
}) => {
    // Calculate all cell positions once
    const cellPositions = useMemo(() => getCellPositions(boardSize), [boardSize]);

    // Default tokens if no teams provided (fallback)
    const defaultTokens = [
        { color: '#FFD700', id: 1, position: 0 }, // Yellow
        { color: '#228BE6', id: 2, position: 0 }, // Blue
    ];

    const activeTeams = teams || defaultTokens.map(t => ({ ...t, name: `Team ${t.id}` }));

    // Calculate offsets to spread tokens around the center of the cell
    // We'll arrange them in a circle if multiple are on the same cell
    const radius = 40; // Distance from center in percentage relative to token size

    // Group teams by position to handle collisions
    const teamsByPosition = activeTeams.reduce((acc, team) => {
        const pos = team.position || 0;
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(team);
        return acc;
    }, {} as Record<number, typeof activeTeams>);

    return (
        <div className="benias-player-tokens-container">
            {Object.entries(teamsByPosition).map(([posIndexStr, teamsOnCell]) => {
                const posIndex = parseInt(posIndexStr);
                const cellPos = cellPositions[posIndex] || cellPositions[0];

                return teamsOnCell.map((team, index) => {
                    // Calculate offset if multiple teams on same cell
                    let offsetX = 0;
                    let offsetY = 0;

                    if (teamsOnCell.length > 1) {
                        const angle = (index * (360 / teamsOnCell.length)) * (Math.PI / 180);
                        offsetX = Math.cos(angle) * radius;
                        offsetY = Math.sin(angle) * radius;
                    }

                    return (
                        <div
                            key={team.id}
                            className="benias-player-token"
                            style={{
                                left: `${cellPos.x}%`,
                                top: `${cellPos.y}%`,
                                backgroundColor: team.color,
                                transform: `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%))`,
                            }}
                            title={`${team.name} (Step ${posIndex + 1})`}
                        />
                    );
                });
            })}
        </div>
    );
};
