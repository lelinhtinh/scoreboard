import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithI18n } from '../test/i18n-test-utils';
import { EditScoreDialog } from './EditScoreDialog';
import type { GameConfig, TeamConfig } from '../types/game';

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    children: React.ReactNode;
  }) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({
    value,
    onChange,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    'data-testid'?: string;
  }) => (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange?.(e)}
      data-testid={props['data-testid'] || 'input'}
      {...props}
    />
  ),
}));

describe('EditScoreDialog', () => {
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

  const mockEditScores = [
    { a: 21, b: 18 },
    { a: 19, b: 21 },
    { a: 15, b: 12 },
  ];

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    editScores: mockEditScores,
    config: mockConfig,
    teams: mockTeams,
    onScoreChange: vi.fn(),
    onSave: vi.fn(),
  };
  it('should render when open', () => {
    renderWithI18n(<EditScoreDialog {...defaultProps} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Round Results')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    renderWithI18n(<EditScoreDialog {...defaultProps} open={false} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
  it('should display round labels', () => {
    renderWithI18n(<EditScoreDialog {...defaultProps} />);

    // Should display round labels (the component doesn't show team names, only round numbers)
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('Round 3')).toBeInTheDocument();
  });
  it('should display round scores', () => {
    renderWithI18n(<EditScoreDialog {...defaultProps} />);

    // Check some of the scores are displayed (use getAllByDisplayValue for duplicates)
    const scores21 = screen.getAllByDisplayValue('21');
    expect(scores21.length).toBe(2); // Should have 2 inputs with value 21
    expect(screen.getByDisplayValue('18')).toBeInTheDocument();
    expect(screen.getByDisplayValue('19')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
  });

  it('should call onScoreChange when score is modified', () => {
    const onScoreChange = vi.fn();
    renderWithI18n(
      <EditScoreDialog {...defaultProps} onScoreChange={onScoreChange} />
    );

    // Find first input and change its value
    const scoreInputs = screen.getAllByDisplayValue('21');
    if (scoreInputs.length > 0) {
      fireEvent.change(scoreInputs[0], { target: { value: '25' } });

      expect(onScoreChange).toHaveBeenCalled();
    }
  });
  it('should call onSave when save button is clicked', () => {
    const onSave = vi.fn();
    renderWithI18n(<EditScoreDialog {...defaultProps} onSave={onSave} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });
  it('should handle empty scores array', () => {
    renderWithI18n(<EditScoreDialog {...defaultProps} editScores={[]} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Round Results')).toBeInTheDocument();
  });
  it('should display round numbers correctly', () => {
    renderWithI18n(<EditScoreDialog {...defaultProps} />);

    // Should show round labels
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('Round 3')).toBeInTheDocument();
  });
});
