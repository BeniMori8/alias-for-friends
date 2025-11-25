// Settings Screen Types

export interface TeamSettings {
    id: number;
    name: string;
    color: string;
}

export interface GameSettings {
    roundDurationSeconds: number;
    teams: TeamSettings[];
}
