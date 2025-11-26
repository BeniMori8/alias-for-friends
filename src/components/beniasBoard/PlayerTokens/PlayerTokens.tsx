import React from 'react';
import type { TeamSettings } from '../../settings/settings.types';
import './PlayerTokens.css';

interface PlayerTokensProps {
    startPosition?: { top: string; left: string };
    teams?: TeamSettings[];
}

export const PlayerTokens: React.FC<PlayerTokensProps> = ({ startPosition, teams }) => {
    // If no start position is provided, default to top-left
    const pos = startPosition || { top: '2%', left: '5%' };

    // Default tokens if no teams provided (fallback)
    const defaultTokens = [
        { color: '#FFD700', id: 1 }, // Yellow
        { color: '#228BE6', id: 2 }, // Blue
    ];

    const activeTeams = teams || defaultTokens.map(t => ({ ...t, name: `Team ${t.id}` }));

    // Calculate offsets to spread tokens around the center
    // We'll arrange them in a circle
    const radius = 40; // Distance from center in percentage relative to token size
    const getTokenOffset = (index: number, total: number) => {
        if (total === 1) return { x: 0, y: 0 };

        const angle = (index * (360 / total)) * (Math.PI / 180);
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    };

    return (
        <div
            className="benias-player-tokens-container"
            style={{
                top: pos.top,
                left: pos.left,
            }}
        >
            {activeTeams.map((team, index) => {
                const offset = getTokenOffset(index, activeTeams.length);
                return (
                    <div
                        key={team.id}
                        className="benias-player-token"
                        style={{
                            backgroundColor: team.color,
                            transform: `translate(calc(-50% + ${offset.x}%), calc(-50% + ${offset.y}%))`,
                        }}
                        title={team.name}
                    />
                );
            })}
        </div>
    );
};
