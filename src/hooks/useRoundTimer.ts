// External libraries
import { useState, useEffect } from 'react';

// Constants
import { TIMER_CONSTANTS } from '../components/cards/CardRound.constants';

export interface UseRoundTimerResult {
    remainingSeconds: number;
    isTimeUp: boolean;
    isPaused: boolean;
    isUrgent: boolean;
    handleTogglePause: () => void;
}

export const useRoundTimer = (roundDurationSeconds: number): UseRoundTimerResult => {
    const [remainingSeconds, setRemainingSeconds] = useState(roundDurationSeconds);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const isUrgent = remainingSeconds <= TIMER_CONSTANTS.URGENT_THRESHOLD_SECONDS && remainingSeconds > 0;

    // Timer Effect
    useEffect(() => {
        if (isTimeUp || isPaused) return;

        const id = window.setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= TIMER_CONSTANTS.TIME_COMPLETE_THRESHOLD) {
                    clearInterval(id);
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, TIMER_CONSTANTS.INTERVAL_MS);

        return () => clearInterval(id);
    }, [isTimeUp, isPaused]);

    const handleTogglePause = () => {
        setIsPaused(prev => !prev);
    };

    return {
        remainingSeconds,
        isTimeUp,
        isPaused,
        isUrgent,
        handleTogglePause,
    };
};
