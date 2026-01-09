import { useGameState } from '../../../state/GameState';

const MOVEMENT_DELAY = 500;

interface UseTeamMovementResult {
    animateTeamMovement: (
        teamId: string,
        fromPos: number,
        score: number
    ) => Promise<{ finalPos: number; isVictory: boolean }>;
}

export const useTeamMovement = (): UseTeamMovementResult => {
    const { boardSize, updateTeamPosition } = useGameState();

    const animateTeamMovement = async (
        teamId: string,
        fromPos: number,
        score: number
    ): Promise<{ finalPos: number; isVictory: boolean }> => {
        const lastCellIndex = boardSize - 1;
        let targetPos = fromPos + score;
        if (targetPos < 0) targetPos = 0;
        if (targetPos > lastCellIndex) targetPos = lastCellIndex;

        if (targetPos === fromPos) {
            return { finalPos: fromPos, isVictory: false };
        }

        const direction = targetPos > fromPos ? 1 : -1;
        let currentPos = fromPos;

        while (currentPos !== targetPos) {
            await new Promise(resolve => setTimeout(resolve, MOVEMENT_DELAY));
            currentPos += direction;
            updateTeamPosition(teamId, currentPos);
        }

        await new Promise(resolve => setTimeout(resolve, MOVEMENT_DELAY));
        return { finalPos: targetPos, isVictory: targetPos === lastCellIndex };
    };

    return { animateTeamMovement };
};
