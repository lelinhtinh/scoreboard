import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoundIndicator } from './RoundIndicator';
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

describe('RoundIndicator', () => {
  it('should not render for single round games', () => {
    const singleRoundConfig = { ...defaultConfig, winRounds: 1 };
    const { container } = render(
      <RoundIndicator
        config={singleRoundConfig}
        rounds={[{ a: 0, b: 0, hasEnded: false }]}
        teams={mockTeams}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render correct number of round indicators', () => {
    const rounds = [
      { a: 21, b: 18, hasEnded: true },
      { a: 19, b: 21, hasEnded: true },
      { a: 10, b: 8, hasEnded: false },
    ];

    render(
      <RoundIndicator
        config={defaultConfig}
        rounds={rounds}
        teams={mockTeams}
      />
    );

    // Should show indicators for all 3 rounds in config
    const indicators = screen.getAllByTestId(/round-indicator-/);
    expect(indicators).toHaveLength(3);
  });

  it('should show correct round status with colors', () => {
    const rounds = [
      { a: 21, b: 18, hasEnded: true }, // Team A wins
      { a: 19, b: 21, hasEnded: true }, // Team B wins
      { a: 10, b: 8, hasEnded: false }, // Current round
    ];

    render(
      <RoundIndicator
        config={defaultConfig}
        rounds={rounds}
        teams={mockTeams}
      />
    );
    // First round - Team A won (should have Team A's color)
    const round1 = screen.getByTestId('round-indicator-0');
    expect(round1).toHaveStyle({ background: '#2563eb' });

    // Second round - Team B won (should have Team B's color)
    const round2 = screen.getByTestId('round-indicator-1');
    expect(round2).toHaveStyle({ background: '#dc2626' });

    // Third round - not finished (should be white/neutral)
    const round3 = screen.getByTestId('round-indicator-2');
    expect(round3).toHaveStyle({ background: '#fff' });
  });

  it('should handle rounds that exceed config winRounds', () => {
    const rounds = [
      { a: 21, b: 18, hasEnded: true },
      { a: 19, b: 21, hasEnded: true },
      { a: 21, b: 19, hasEnded: true },
      { a: 10, b: 8, hasEnded: false },
    ];

    render(
      <RoundIndicator
        config={defaultConfig}
        rounds={rounds}
        teams={mockTeams}
      />
    );

    // Should still only show 3 indicators (as per config)
    const indicators = screen.getAllByTestId(/round-indicator-/);
    expect(indicators).toHaveLength(3);
  });

  it('should handle empty rounds array', () => {
    render(
      <RoundIndicator config={defaultConfig} rounds={[]} teams={mockTeams} />
    );
    // Should show indicators for all rounds in config, all white
    const indicators = screen.getAllByTestId(/round-indicator-/);
    expect(indicators).toHaveLength(3);
    indicators.forEach((indicator) => {
      expect(indicator).toHaveStyle({ background: '#fff' });
    });
  });

  it('should show tie rounds correctly', () => {
    const rounds = [
      { a: 21, b: 21, hasEnded: true }, // Tie round
    ];

    render(
      <RoundIndicator
        config={defaultConfig}
        rounds={rounds}
        teams={mockTeams}
      />
    );

    // Tie round should be gray (no winner)
    const round1 = screen.getByTestId('round-indicator-0');
    expect(round1).toHaveClass('bg-gray-300');
  });
});
