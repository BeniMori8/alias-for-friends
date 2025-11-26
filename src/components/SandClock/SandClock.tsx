// External libraries
import React, { useEffect, useState } from 'react';

// Constants
import { SAND_CLOCK_PATHS } from '../../assets/SandClockAssets';
import {
    SAND_COLORS,
    SAND_CLOCK_THRESHOLDS,
    SAND_CLOCK_DIMENSIONS,
} from './SandClock.constants';

// Styles
import './SandClock.css';

interface SandClockProps {
    totalSeconds: number;
    remainingSeconds: number;
    height?: number;
    className?: string;
}

export const SandClock: React.FC<SandClockProps> = ({
    totalSeconds,
    remainingSeconds,
    height = SAND_CLOCK_DIMENSIONS.DEFAULT_HEIGHT,
    className = '',
}) => {

    const [sandColor, setSandColor] = useState(SAND_COLORS.DEFAULT);

    // Calculate percentages
    const topSandHeight = (remainingSeconds / totalSeconds) * SAND_CLOCK_DIMENSIONS.PERCENTAGE_MAX;
    const bottomSandHeight = SAND_CLOCK_DIMENSIONS.PERCENTAGE_MAX - topSandHeight;

    // Determine color based on remaining time
    useEffect(() => {
        const percentage = (remainingSeconds / totalSeconds) * SAND_CLOCK_DIMENSIONS.PERCENTAGE_MAX;
        if (remainingSeconds <= SAND_CLOCK_THRESHOLDS.TIME_UP_SECONDS) {
            setSandColor(SAND_COLORS.TIME_UP);
        } else if (percentage <= SAND_CLOCK_THRESHOLDS.WARNING_PERCENTAGE) {
            setSandColor(SAND_COLORS.WARNING);
        }
    }, [remainingSeconds, totalSeconds]);

    return (
        <div
            className={`sand-clock-container ${className}`}
            style={{ height: `${height}px`, width: `${height * 0.6}px` }}
        >
            <svg
                viewBox="0 0 100 160"
                className="sand-clock-svg"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Glass Container Definition */}
                <defs>
                    <clipPath id="glassClip">
                        <path d={SAND_CLOCK_PATHS.GLASS_CLIP_PATH} />
                    </clipPath>

                    {/* Top Sand Clip - Drains from top down */}
                    <clipPath id="topSandClip">
                        <rect x="0" y={80 - (70 * (topSandHeight / 100))} width="100" height={70 * (topSandHeight / 100)} />
                    </clipPath>

                    {/* Bottom Sand Clip - Fills from bottom up */}
                    <clipPath id="bottomSandClip">
                        <rect x="0" y={155 - (70 * (bottomSandHeight / 100))} width="100" height={70 * (bottomSandHeight / 100)} />
                    </clipPath>
                </defs>

                {/* Glass Frame */}
                <path
                    d={SAND_CLOCK_PATHS.GLASS_FRAME}
                    fill="rgba(255, 255, 255, 0.3)"
                    stroke="white"
                    strokeWidth="4"
                    className="glass-frame"
                />

                {/* Top Sand */}
                <g clipPath="url(#glassClip)">
                    <rect
                        x="0"
                        y={80 - (70 * (topSandHeight / 100))}
                        width="100"
                        height="80"
                        fill={sandColor}
                        clipPath="url(#topSandClip)"
                        className="sand-top"
                    />
                </g>

                {/* Falling Stream */}
                {remainingSeconds > 0 && (
                    <line
                        x1="50"
                        y1="80"
                        x2="50"
                        y2="155"
                        stroke={sandColor}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="sand-stream"
                    />
                )}

                {/* Bottom Sand */}
                <g clipPath="url(#glassClip)">
                    <rect
                        x="0"
                        y="80"
                        width="100"
                        height="80"
                        fill={sandColor}
                        clipPath="url(#bottomSandClip)"
                        className="sand-bottom"
                    />
                </g>

                {/* Glass Highlights */}
                <path d={SAND_CLOCK_PATHS.TOP_HIGHLIGHT} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
                <path d={SAND_CLOCK_PATHS.BOTTOM_HIGHLIGHT} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
    );
};
