// External libraries
import React from 'react';
import { Container, Stack, Text, Paper, Select, Title } from '@mantine/core';

// Types
import type { TeamInfo } from '../../CardRound.types';
import type { StealCardResult } from '../StealRoundView';

// Constants
import { UI_STRINGS } from '../../CardRound.constants';

// Styles
import '../../CardRound.css';
import '../../RoundSummaryView/RoundSummaryView.css';

interface StealRoundSummaryProps {
    results: StealCardResult[];
    cards: readonly string[][];
    teams: TeamInfo[];
    highlightedWordIndex: number;
    onChangeResult: (index: number, teamId: string | null) => void;
    onConfirm: () => void;
}

export const StealRoundSummary: React.FC<StealRoundSummaryProps> = ({
    results,
    cards,
    teams,
    highlightedWordIndex,
    onChangeResult,
    onConfirm,
}) => {
    const teamSelectData = teams.map(t => ({ value: t.id, label: t.name }));

    return (
        <div className="card-round-overlay">
            <div className="card-round-container">
                <Container size="md">
                    <Stack gap="lg">
                        <div className="card-round-header">
                            <Title order={2} className="card-round-title">🎯 {UI_STRINGS.ROUND_SUMMARY_TITLE} 🎯</Title>
                        </div>

                        <Paper className="card-round-summary-card">
                            <Stack gap="sm" className="summary-list" p="md">
                                {results.map((result, index) => {
                                    const card = cards[result.cardIndex];
                                    const selectedTeam = teams.find(t => t.id === result.stolenByTeamId);
                                    return (
                                        <div key={index} className="summary-row stolen">
                                            <Text className="summary-word">
                                                {card[highlightedWordIndex]}
                                            </Text>
                                            <div className="team-card-color-select-container summary-token-select">
                                                <Select
                                                    value={result.stolenByTeamId}
                                                    onChange={(value) => onChangeResult(index, value)}
                                                    data={teamSelectData}
                                                    placeholder="?"
                                                    comboboxProps={{
                                                        position: 'bottom',
                                                        middlewares: { flip: false, shift: false },
                                                        withinPortal: true,
                                                        zIndex: 10000,
                                                    }}
                                                    maxDropdownHeight={130}
                                                    renderOption={({ option }) => {
                                                        const team = teams.find(t => t.id === option.value);
                                                        return (
                                                            <div
                                                                className="team-card-color-token"
                                                                style={{ backgroundColor: team?.color }}
                                                            />
                                                        );
                                                    }}
                                                    leftSection={
                                                        <div
                                                            className="team-card-color-token-small"
                                                            style={{
                                                                backgroundColor: selectedTeam?.color || '#e9ecef',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                color: selectedTeam ? 'transparent' : '#868e96',
                                                            }}
                                                        >
                                                            {!selectedTeam && '?'}
                                                        </div>
                                                    }
                                                    classNames={{
                                                        input: 'team-card-color-select',
                                                        dropdown: 'team-card-color-dropdown',
                                                        option: 'team-card-color-option-item',
                                                    }}
                                                    size="md"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </Stack>
                        </Paper>

                        <button onClick={onConfirm} className="action-button-compact close full-width">
                            <span className="button-label">{UI_STRINGS.FINISH_TURN_BUTTON}</span>
                        </button>
                    </Stack>
                </Container>
            </div>
        </div>
    );
};
