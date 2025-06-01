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

  describe('Validation', () => {
    it('should show error for empty team name', () => {
      render(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      fireEvent.change(teamAInput, { target: { value: '' } });

      expect(
        screen.getByText('Tên đội không được để trống')
      ).toBeInTheDocument();
    });

    it('should show error for team name with only whitespace', () => {
      render(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      fireEvent.change(teamAInput, { target: { value: '   ' } });

      expect(
        screen.getByText('Tên đội không được chỉ chứa khoảng trắng')
      ).toBeInTheDocument();
    });

    it('should show error for team name longer than 50 characters', () => {
      render(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      const longName = 'A'.repeat(51);
      fireEvent.change(teamAInput, { target: { value: longName } });

      expect(
        screen.getByText('Tên đội không được vượt quá 50 ký tự')
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

      render(<SettingsDialog {...propsWithInvalidColor} />);

      // Click save to trigger validation
      const saveButton = screen.getByText('Lưu');
      fireEvent.click(saveButton);

      // Wait for validation to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should not save due to validation error
      expect(onSave).not.toHaveBeenCalled();
      // Should show the color validation error
      expect(screen.getByText('Màu sắc không hợp lệ')).toBeInTheDocument();
    });

    it('should show error for non-integer values in numeric fields', () => {
      render(<SettingsDialog {...defaultProps} />);

      const winScoreInput = screen.getByDisplayValue('21');
      fireEvent.change(winScoreInput, { target: { value: '21.5' } });

      expect(screen.getByText('Chỉ được nhập số nguyên')).toBeInTheDocument();
    });

    it('should show error for zero or negative values in numeric fields', () => {
      render(<SettingsDialog {...defaultProps} />);

      const winScoreInput = screen.getByDisplayValue('21');
      fireEvent.change(winScoreInput, { target: { value: '0' } });

      expect(screen.getByText('Giá trị phải lớn hơn 0')).toBeInTheDocument();
    });

    it('should show error for even numbers in winRounds field', () => {
      render(<SettingsDialog {...defaultProps} />);

      const winRoundsInput = screen.getByDisplayValue('3');
      fireEvent.change(winRoundsInput, { target: { value: '4' } });

      expect(
        screen.getByText('Số vòng để thắng phải là số lẻ')
      ).toBeInTheDocument();
    });
    it('should show validation errors when save button is clicked with form errors', async () => {
      render(<SettingsDialog {...defaultProps} />);

      const teamAInput = screen.getByDisplayValue('Team A');
      fireEvent.change(teamAInput, { target: { value: '' } });

      // Validation should trigger immediately on change, showing error
      expect(
        screen.getByText('Tên đội không được để trống')
      ).toBeInTheDocument();

      // Save button should remain enabled
      const saveButton = screen.getByText('Lưu');
      expect(saveButton).not.toBeDisabled();
    });

    it('should enable save button when form is valid', () => {
      render(<SettingsDialog {...defaultProps} />);

      const saveButton = screen.getByText('Lưu');
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

      render(<SettingsDialog {...invalidProps} />);

      const saveButton = screen.getByText('Lưu');
      fireEvent.click(saveButton);

      // Wait for validation to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should not call onSave due to validation errors
      expect(onSave).not.toHaveBeenCalled();

      // Should show error messages
      expect(
        screen.getByText('Tên đội không được để trống')
      ).toBeInTheDocument();
      expect(screen.getByText('Màu sắc không hợp lệ')).toBeInTheDocument();
      expect(
        screen.getByText('Số vòng để thắng phải là số lẻ')
      ).toBeInTheDocument();
    });
  });
});
