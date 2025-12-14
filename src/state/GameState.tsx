import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_BOARD_SIZE } from '../components/settings/settings.constants';

export interface Team {
    id: string;
    name: string;
    color: string;
    position: number;
}

interface GameState {
    teams: Team[];
    currentTeamIndex: number;
    boardSize: number;
    setTeams: (teams: Team[]) => void;
    setBoardSize: (size: number) => void;
    nextTeam: () => void;
    updateTeamPosition: (teamId: string, newPosition: number) => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeamsState] = useState<Team[]>([]);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [boardSize, setBoardSizeState] = useState(DEFAULT_BOARD_SIZE);

    const setTeams = (newTeams: Team[]) => {
        setTeamsState(newTeams);
        setCurrentTeamIndex(0);
    };

    const setBoardSize = (size: number) => {
        setBoardSizeState(size);
    };

    const nextTeam = () => {
        if (teams.length === 0) return;
        setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
    };

    const updateTeamPosition = (teamId: string, newPosition: number) => {
        setTeamsState((prev) =>
            prev.map((team) =>
                team.id === teamId ? { ...team, position: newPosition } : team
            )
        );
    };

    const value: GameState = {
        teams,
        currentTeamIndex,
        boardSize,
        setTeams,
        setBoardSize,
        nextTeam,
        updateTeamPosition,
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};
