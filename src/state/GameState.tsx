import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Team {
    id: string;
    name: string;
    color: string;
    position: number;
}

interface GameState {
    teams: Team[];
    currentTeamIndex: number;
    setTeams: (teams: Team[]) => void;
    nextTeam: () => void;
    updateTeamPosition: (teamId: string, newPosition: number) => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeamsState] = useState<Team[]>([]);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

    const setTeams = (newTeams: Team[]) => {
        setTeamsState(newTeams);
        setCurrentTeamIndex(0);
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
        setTeams,
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
