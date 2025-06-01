import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsDialog } from './SettingsDialog';
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
      value={value}
      onChange={(e) => onChange?.(e)}
      data-testid={props['data-testid'] || 'input'}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement> & {
    children: React.ReactNode;
  }) => <label {...props}>{children}</label>,
}));

describe('SettingsDialog', () => {
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

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    tempTeams: mockTeams,
    tempConfig: mockConfig,
    onTeamChange: vi.fn(),
    onConfigChange: vi.fn(),
    onReset: vi.fn(),
    onSave: vi.fn(),
  };

  it('should render when open', () => {
    render(<SettingsDialog {...defaultProps} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Cài đặt trận đấu')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<SettingsDialog {...defaultProps} open={false} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should display team names and colors', () => {
    render(<SettingsDialog {...defaultProps} />);

    expect(screen.getByDisplayValue('Team A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Team B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#2563eb')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#dc2626')).toBeInTheDocument();
  });

  it('should display game config values', () => {
    render(<SettingsDialog {...defaultProps} />);

    expect(screen.getByDisplayValue('21')).toBeInTheDocument(); // winScore
    expect(screen.getByDisplayValue('30')).toBeInTheDocument(); // maxScore
    expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // minDiff
    expect(screen.getByDisplayValue('3')).toBeInTheDocument(); // winRounds
    expect(screen.getByDisplayValue('1')).toBeInTheDocument(); // scoreStep
  });

  it('should call onTeamChange when team name is changed', () => {
    const onTeamChange = vi.fn();
    render(<SettingsDialog {...defaultProps} onTeamChange={onTeamChange} />);

    const teamAInput = screen.getByDisplayValue('Team A');
    fireEvent.change(teamAInput, { target: { value: 'New Team A' } });

    expect(onTeamChange).toHaveBeenCalledWith(0, 'name', 'New Team A');
  });

  it('should call onTeamChange when team color is changed', () => {
    const onTeamChange = vi.fn();
    render(<SettingsDialog {...defaultProps} onTeamChange={onTeamChange} />);

    const colorAInput = screen.getByDisplayValue('#2563eb');
    fireEvent.change(colorAInput, { target: { value: '#ff0000' } });

    expect(onTeamChange).toHaveBeenCalledWith(0, 'color', '#ff0000');
  });
  it('should call onConfigChange when config values are changed', () => {
    const onConfigChange = vi.fn();
    render(
      <SettingsDialog {...defaultProps} onConfigChange={onConfigChange} />
    );

    const winScoreInput = screen.getByDisplayValue('21');
    fireEvent.change(winScoreInput, { target: { value: '25' } });

    expect(onConfigChange).toHaveBeenCalledWith('winScore', '25');
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<SettingsDialog {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByText('Đặt lại');
    fireEvent.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });
  it('should call onSave when save button is clicked', () => {
    const onSave = vi.fn();
    render(<SettingsDialog {...defaultProps} onSave={onSave} />);

    const saveButton = screen.getByText('Lưu');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });
});
