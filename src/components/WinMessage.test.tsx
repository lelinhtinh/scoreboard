import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithI18n } from '../test/i18n-test-utils';
import { WinMessage } from './WinMessage';
import type { GameConfig, TeamConfig } from '../types/game';

const defaultConfig: GameConfig = {
  winScore: 21,
  maxScore: 30,
  minDiff: 2,
  winRounds: 3,
  scoreStep: 1,
};

const mockTeams: TeamConfig[] = [
  { name: 'Team A', color: '#2563eb', score: 0 },
  { name: 'Team B', color: '#dc2626', score: 0 },
];

describe('WinMessage', () => {
  it('should not show anything when no win state is active', () => {
    const { container } = renderWithI18n(
      <WinMessage
        showRoundWin={false}
        roundWinner={null}
        hasFinalWinner={false}
        winner={null}
        finalWinner={null}
        teams={mockTeams}
        config={defaultConfig}
        currentRound={1}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show round win message', () => {
    renderWithI18n(
      <WinMessage
        showRoundWin={true}
        roundWinner={0}
        hasFinalWinner={false}
        winner={null}
        finalWinner={null}
        teams={mockTeams}
        config={defaultConfig}
        currentRound={2}
      />
    );

    expect(screen.getByText('Team A won round 2')).toBeInTheDocument();
  });

  it('should show final winner message', () => {
    renderWithI18n(
      <WinMessage
        showRoundWin={false}
        roundWinner={null}
        hasFinalWinner={true}
        winner={null}
        finalWinner={1}
        teams={mockTeams}
        config={defaultConfig}
        currentRound={3}
      />
    );

    expect(screen.getByText('Team B won the match!')).toBeInTheDocument();
  });

  it('should show single round winner message', () => {
    const singleRoundConfig = { ...defaultConfig, winRounds: 1 };
    renderWithI18n(
      <WinMessage
        showRoundWin={false}
        roundWinner={null}
        hasFinalWinner={false}
        winner={0}
        finalWinner={null}
        teams={mockTeams}
        config={singleRoundConfig}
        currentRound={1}
      />
    );

    expect(screen.getByText('Team A won the match!')).toBeInTheDocument();
  });

  it('should prioritize final winner over round winner', () => {
    renderWithI18n(
      <WinMessage
        showRoundWin={false}
        roundWinner={0}
        hasFinalWinner={true}
        winner={null}
        finalWinner={1}
        teams={mockTeams}
        config={defaultConfig}
        currentRound={3}
      />
    );

    // Should show final winner, not round winner
    expect(screen.getByText('Team B won the match!')).toBeInTheDocument();
    expect(screen.queryByText(/won round/)).not.toBeInTheDocument();
  });

  it('should display correct team name in message', () => {
    renderWithI18n(
      <WinMessage
        showRoundWin={false}
        roundWinner={null}
        hasFinalWinner={true}
        winner={null}
        finalWinner={0}
        teams={mockTeams}
        config={defaultConfig}
        currentRound={3}
      />
    );

    expect(screen.getByText('Team A won the match!')).toBeInTheDocument();
  });
});
