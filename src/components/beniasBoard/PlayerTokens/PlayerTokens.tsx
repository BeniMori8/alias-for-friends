import React from 'react';
import './PlayerTokens.css';

interface PlayerTokensProps {
    startPosition?: { top: string; left: string };
}

export const PlayerTokens: React.FC<PlayerTokensProps> = ({ startPosition }) => {
    // If no start position is provided, default to top-left
    const pos = startPosition || { top: '2%', left: '5%' };

    const tokens = [
        { color: '#FFD700', offset: { x: -40, y: -40 } }, // Yellow
        { color: '#228BE6', offset: { x: 40, y: -40 } },  // Blue
        { color: '#40C057', offset: { x: -40, y: 40 } },  // Green
        { color: '#FA5252', offset: { x: 40, y: 40 } },   // Red
        { color: '#000000', offset: { x: 0, y: -60 } },   // Black
        { color: '#FFFFFF', offset: { x: 0, y: 60 } },    // White
    ];

    return (
        <div
            className="benias-player-tokens-container"
            style={{
                top: pos.top,
                left: pos.left,
            }}
        >
            {tokens.map((token, index) => (
                <div
                    key={index}
                    className="benias-player-token"
                    style={{
                        backgroundColor: token.color,
                        transform: `translate(calc(-50% + ${token.offset.x}%), calc(-50% + ${token.offset.y}%))`,
                    }}
                />
            ))}
        </div>
    );
};
