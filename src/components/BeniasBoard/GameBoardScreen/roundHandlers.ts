import type { RoundResult, RoundHistoryItem } from '../../cards/CardRound.types';
import type { StealRoundResult } from '../../cards/StealRoundView/StealRoundView';
import { CARD_STATUS, SCORE_VALUES } from '../../cards/CardRound.constants';

export const scoreFromHistory = (items: RoundHistoryItem[]): number => {
    return items.reduce((acc, item) => {
        return acc + (item.status === CARD_STATUS.SUCCESS ? SCORE_VALUES.SUCCESS : SCORE_VALUES.FAIL);
    }, 0);
};

interface Team {
    id: string;
    name: string;
    color: string;
    position: number;
}

interface RoundHandlerDeps {
    teams: Team[];
    setShowCardRound: (show: boolean) => void;
    setShowStealRound: (show: boolean) => void;
    animateTeamMovement: (teamId: string, fromPos: number, score: number) => Promise<{ finalPos: number; isVictory: boolean }>;
    showVictoryModalHandler: (team: { name: string; color: string }) => void;
    nextTeam: () => void;
}

export const createHandleRoundEnd = (deps: RoundHandlerDeps) => {
    return async (result: RoundResult) => {
        const { teams, setShowCardRound, animateTeamMovement, showVictoryModalHandler, nextTeam } = deps;

        if (teams.length === 0) return;
        setShowCardRound(false);

        const activeTeam = teams.find(t => t.id === result.activeTeamId);
        if (!activeTeam) {
            nextTeam();
            return;
        }

        const completedScore = scoreFromHistory(result.completedCards);
        const lastCardScore = result.lastShownCard
            ? (result.lastShownCard.status === CARD_STATUS.SUCCESS ? SCORE_VALUES.SUCCESS : SCORE_VALUES.FAIL)
            : 0;

        const { finalPos: activeTeamFinalPos, isVictory: activeWon } = await animateTeamMovement(
            activeTeam.id,
            activeTeam.position,
            completedScore
        );

        if (activeWon) {
            showVictoryModalHandler(activeTeam);
            return;
        }

        if (result.stolenByTeamId && result.lastShownCard) {
            const stealTeam = teams.find(t => t.id === result.stolenByTeamId);
            if (stealTeam) {
                const stealTeamStartPos = stealTeam.id === activeTeam.id
                    ? activeTeamFinalPos
                    : stealTeam.position;

                const { isVictory: stealWon } = await animateTeamMovement(
                    stealTeam.id,
                    stealTeamStartPos,
                    lastCardScore
                );

                if (stealWon) {
                    showVictoryModalHandler(stealTeam);
                    return;
                }
            }
        }

        nextTeam();
    };
};

export const createHandleStealRoundEnd = (deps: RoundHandlerDeps) => {
    return async (result: StealRoundResult) => {
        const { teams, setShowStealRound, animateTeamMovement, showVictoryModalHandler, nextTeam } = deps;

        if (teams.length === 0) return;
        setShowStealRound(false);

        const pointsPerTeam = new Map<string, number>();
        for (const cardResult of result.results) {
            if (cardResult.stolenByTeamId) {
                const current = pointsPerTeam.get(cardResult.stolenByTeamId) || 0;
                pointsPerTeam.set(cardResult.stolenByTeamId, current + 1);
            }
        }

        for (const [teamId, points] of pointsPerTeam) {
            const team = teams.find(t => t.id === teamId);
            if (team) {
                const { isVictory } = await animateTeamMovement(team.id, team.position, points);
                if (isVictory) {
                    showVictoryModalHandler(team);
                    return;
                }
            }
        }
        nextTeam();
    };
};
