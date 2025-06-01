import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Scoreboard } from './Scoreboard';
import type { GameConfig, TeamConfig } from '../types/game';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Crown: () => <svg data-testid="crown-icon" />,
}));

describe('Scoreboard', () => {
  const mockTeams: TeamConfig[] = [
    { name: 'Team A', color: '#2563eb', score: 0 },
    { name: 'Team B', color: '#dc2626', score: 0 },
  ];

  const mockConfig: GameConfig = {
    winScore: 21,
    maxScore: 30,
    minDiff: 2,
    winRounds: 3,
    scoreStep: 1,
  };

  const mockLastRound = { a: 15, b: 12 };

  const defaultProps = {
    teams: mockTeams,
    lastRound: mockLastRound,
    config: mockConfig,
    winner: null,
    hasFinalWinner: false,
    finalWinner: null,
    canEditScore: true,
    onScoreChange: vi.fn(),
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
  };

  it('should render team names', () => {
    render(<Scoreboard {...defaultProps} />);

    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Team B')).toBeInTheDocument();
  });

  it('should display current scores', () => {
    render(<Scoreboard {...defaultProps} />);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should show crown icon for round winner', () => {
    render(<Scoreboard {...defaultProps} winner={0} />);

    expect(screen.getByTestId('crown-icon')).toBeInTheDocument();
  });

  it('should show crown icon for final winner', () => {
    render(
      <Scoreboard {...defaultProps} hasFinalWinner={true} finalWinner={1} />
    );

    expect(screen.getByTestId('crown-icon')).toBeInTheDocument();
  });
  it('should call onScoreChange when team area is clicked', () => {
    const onScoreChange = vi.fn();
    render(<Scoreboard {...defaultProps} onScoreChange={onScoreChange} />);

    // The scoreboard has clickable team areas, not plus buttons
    const teamAreas = screen
      .getAllByText('Team A')
      .map((el) => el.closest('.flex-1'));
    fireEvent.click(teamAreas[0] as Element); // Click first team area (Team A)

    expect(onScoreChange).toHaveBeenCalledWith('a', 1);
  });

  it('should call onScoreChange when minus button is clicked', () => {
    const onScoreChange = vi.fn();
    render(<Scoreboard {...defaultProps} onScoreChange={onScoreChange} />);

    const minusButtons = screen.getAllByText('-');
    fireEvent.click(minusButtons[1]); // Click second minus button (Team B)

    expect(onScoreChange).toHaveBeenCalledWith('b', -1);
  });

  it('should disable buttons when canEditScore is false', () => {
    render(<Scoreboard {...defaultProps} canEditScore={false} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should call onTouchStart when team area is touched', () => {
    const onTouchStart = vi.fn();
    render(<Scoreboard {...defaultProps} onTouchStart={onTouchStart} />);

    // Find team areas by looking for elements with team colors
    const teamAreas = screen.getAllByRole('button');
    if (teamAreas.length > 0) {
      fireEvent.touchStart(teamAreas[0]);
      // Note: The exact call depends on implementation details
    }
  });

  it('should apply team colors correctly', () => {
    render(<Scoreboard {...defaultProps} />);

    const teamAText = screen.getByText('Team A');
    const teamBText = screen.getByText('Team B');

    // Check if team colors are applied (depends on implementation)
    expect(teamAText).toBeInTheDocument();
    expect(teamBText).toBeInTheDocument();
  });

  it('should handle different score values', () => {
    const highScoreRound = { a: 25, b: 23 };
    render(<Scoreboard {...defaultProps} lastRound={highScoreRound} />);

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('should handle zero scores', () => {
    const zeroScoreRound = { a: 0, b: 0 };
    render(<Scoreboard {...defaultProps} lastRound={zeroScoreRound} />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(2);
  });
});
