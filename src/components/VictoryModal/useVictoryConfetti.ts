import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const CONFETTI_CONFIG = {
    DURATION_MS: 4000,
    PARTICLE_COUNT: 3,
    SPREAD: 55,
    SCALAR: 1.2,
    Z_INDEX: 2000,
    ORIGIN_Y: 0.6,
} as const;

const CONFETTI_COLORS = {
    WHITE: '#ffffff'
} as const;

interface UseVictoryConfettiProps {
    isActive: boolean;
    teamColor: string | undefined;
}

export const useVictoryConfetti = ({ isActive, teamColor }: UseVictoryConfettiProps) => {
    const fireConfetti = useCallback((angle: number, originX: number, colors: string[]) => {
        confetti({
            particleCount: CONFETTI_CONFIG.PARTICLE_COUNT,
            angle,
            spread: CONFETTI_CONFIG.SPREAD,
            origin: { x: originX, y: CONFETTI_CONFIG.ORIGIN_Y },
            colors,
            disableForReducedMotion: true,
            scalar: CONFETTI_CONFIG.SCALAR,
            zIndex: CONFETTI_CONFIG.Z_INDEX,
        });
    }, []);

    useEffect(() => {
        if (!isActive || !teamColor) return;

        const colors = [teamColor, CONFETTI_COLORS.WHITE];
        const endTime = Date.now() + CONFETTI_CONFIG.DURATION_MS;

        const animate = () => {
            fireConfetti(60, 0, colors);   // Left side
            fireConfetti(120, 1, colors);  // Right side

            if (Date.now() < endTime) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [isActive, teamColor, fireConfetti]);
};
