import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithI18n } from '../test/i18n-test-utils';
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
    renderWithI18n(<SettingsDialog {...defaultProps} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Match Settings')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    renderWithI18n(<SettingsDialog {...defaultProps} open={false} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
  it('should display team names and colors', () => {
    renderWithI18n(<SettingsDialog {...defaultProps} />);

    expect(screen.getByDisplayValue('Team A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Team B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#2563eb')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#dc2626')).toBeInTheDocument();
  });

  it('should display game config values', () => {
    renderWithI18n(<SettingsDialog {...defaultProps} />);

    expect(screen.getByDisplayValue('21')).toBeInTheDocument(); // winScore
    expect(screen.getByDisplayValue('30')).toBeInTheDocument(); // maxScore
    expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // minDiff
    expect(screen.getByDisplayValue('3')).toBeInTheDocument(); // winRounds
    expect(screen.getByDisplayValue('1')).toBeInTheDocument(); // scoreStep
  });

  it('should call onTeamChange when team name is changed', () => {
    const onTeamChange = vi.fn();
    renderWithI18n(
      <SettingsDialog {...defaultProps} onTeamChange={onTeamChange} />
    );

    const teamAInput = screen.getByDisplayValue('Team A');
    fireEvent.change(teamAInput, { target: { value: 'New Team A' } });

    expect(onTeamChange).toHaveBeenCalledWith(0, 'name', 'New Team A');
  });

  it('should call onTeamChange when team color is changed', () => {
    const onTeamChange = vi.fn();
    renderWithI18n(
      <SettingsDialog {...defaultProps} onTeamChange={onTeamChange} />
    );

    const colorAInput = screen.getByDisplayValue('#2563eb');
    fireEvent.change(colorAInput, { target: { value: '#ff0000' } });

    expect(onTeamChange).toHaveBeenCalledWith(0, 'color', '#ff0000');
  });
  it('should call onConfigChange when config values are changed', () => {
    const onConfigChange = vi.fn();
    renderWithI18n(
      <SettingsDialog {...defaultProps} onConfigChange={onConfigChange} />
    );

    const winScoreInput = screen.getByDisplayValue('21');
    fireEvent.change(winScoreInput, { target: { value: '25' } });

    expect(onConfigChange).toHaveBeenCalledWith('winScore', '25');
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    renderWithI18n(<SettingsDialog {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });
  it('should call onSave when save button is clicked', () => {
    const onSave = vi.fn();
    renderWithI18n(<SettingsDialog {...defaultProps} onSave={onSave} />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });

  describe('Validation', () => {
    it('should show error for empty team name', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      fireEvent.change(teamAInput, { target: { value: '' } });

      expect(screen.getByText('Team name cannot be empty')).toBeInTheDocument();
    });

    it('should show error for team name with only whitespace', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      fireEvent.change(teamAInput, { target: { value: '   ' } });
      expect(
        screen.getByText('Team name cannot contain only whitespace')
      ).toBeInTheDocument();
    });

    it('should show error for team name longer than 50 characters', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      const longName = 'A'.repeat(51);
      fireEvent.change(teamAInput, { target: { value: longName } });
      expect(
        screen.getByText('Team name cannot exceed 50 characters')
      ).toBeInTheDocument();
    });
    it('should show error for invalid color format', async () => {
      // Test color validation by triggering save with invalid data
      // This simulates cases where invalid color data comes from external sources
      const onSave = vi.fn();
      const propsWithInvalidColor = {
        ...defaultProps,
        onSave,
        tempTeams: [
          { name: 'Team A', color: 'invalid-color', score: 0 }, // Invalid color format
          { name: 'Team B', color: '#dc2626', score: 0 },
        ],
      };

      renderWithI18n(<SettingsDialog {...propsWithInvalidColor} />); // Click save to trigger validation
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Wait for validation to complete
      await new Promise((resolve) => setTimeout(resolve, 0)); // Should not save due to validation error
      expect(onSave).not.toHaveBeenCalled();
      // Should show the color validation error
      expect(screen.getByText('Invalid color format')).toBeInTheDocument();
    });

    it('should show error for non-integer values in numeric fields', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);

      const winScoreInput = screen.getByDisplayValue('21');
      fireEvent.change(winScoreInput, { target: { value: '21.5' } });

      expect(screen.getByText('Only integers allowed')).toBeInTheDocument();
    });

    it('should show error for zero or negative values in numeric fields', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);

      const winScoreInput = screen.getByDisplayValue('21');
      fireEvent.change(winScoreInput, { target: { value: '0' } });

      expect(
        screen.getByText('Value must be greater than 0')
      ).toBeInTheDocument();
    });

    it('should show error for even numbers in winRounds field', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);
      const winRoundsInput = screen.getByDisplayValue('3');
      fireEvent.change(winRoundsInput, { target: { value: '4' } });

      expect(screen.getByText('Rounds to win must be odd')).toBeInTheDocument();
    });
    it('should show validation errors when save button is clicked with form errors', async () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      fireEvent.change(teamAInput, { target: { value: '' } }); // Validation should trigger immediately on change, showing error
      expect(screen.getByText('Team name cannot be empty')).toBeInTheDocument();

      // Save button should remain enabled
      const saveButton = screen.getByText('Save');
      expect(saveButton).not.toBeDisabled();
    });

    it('should enable save button when form is valid', () => {
      renderWithI18n(<SettingsDialog {...defaultProps} />);
      const saveButton = screen.getByText('Save');
      expect(saveButton).not.toBeDisabled();
    });
    it('should validate all fields when save is clicked', async () => {
      const onSave = vi.fn();
      const invalidProps = {
        ...defaultProps,
        onSave,
        tempTeams: [
          { name: '', color: '#2563eb', score: 0 }, // Invalid name
          { name: 'Team B', color: 'invalid', score: 0 }, // Invalid color
        ],
        tempConfig: {
          ...mockConfig,
          winRounds: 4, // Invalid - even number
        },
      };

      renderWithI18n(<SettingsDialog {...invalidProps} />);
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Wait for validation to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should not call onSave due to validation errors
      expect(onSave).not.toHaveBeenCalled(); // Should show error messages
      expect(screen.getByText('Team name cannot be empty')).toBeInTheDocument();
      expect(screen.getByText('Invalid color format')).toBeInTheDocument();
      expect(screen.getByText('Rounds to win must be odd')).toBeInTheDocument();
    });
  });
});
