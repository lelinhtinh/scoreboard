import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuDropdown } from './MenuDropdown';
import type { GameConfig } from '../types/game';

// Mock the UI components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <div data-testid="dropdown-item" onClick={onClick} aria-disabled={disabled}>
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }) => <button {...props}>{children}</button>,
}));

vi.mock('lucide-react', () => ({
  Menu: () => <svg data-testid="menu-icon" />,
}));

const defaultConfig: GameConfig = {
  winScore: 21,
  maxScore: 30,
  minDiff: 2,
  winRounds: 3,
  scoreStep: 1,
};

const mockProps = {
  config: defaultConfig,
  lastRoundEnded: true,
  hasFinalWinner: false,
  onNextRound: vi.fn(),
  onReset: vi.fn(),
  onEditScore: vi.fn(),
  onSettings: vi.fn(),
};

describe('MenuDropdown', () => {
  it('should render menu button', () => {
    render(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('should show "Vòng mới" option when winRounds > 1', () => {
    render(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    expect(screen.getByText('Vòng mới')).toBeInTheDocument();
  });

  it('should not show "Vòng mới" option when winRounds = 1', () => {
    const singleRoundConfig = { ...defaultConfig, winRounds: 1 };
    render(<MenuDropdown {...mockProps} config={singleRoundConfig} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    expect(screen.queryByText('Vòng mới')).not.toBeInTheDocument();
  });

  it('should disable "Vòng mới" when last round has not ended', () => {
    render(<MenuDropdown {...mockProps} lastRoundEnded={false} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const nextRoundButton = screen.getByText('Vòng mới');
    expect(nextRoundButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable "Vòng mới" when there is a final winner', () => {
    render(<MenuDropdown {...mockProps} hasFinalWinner={true} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const nextRoundButton = screen.getByText('Vòng mới');
    expect(nextRoundButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call onReset when "Trận mới" is clicked', () => {
    render(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const resetButton = screen.getByText('Trận mới');
    fireEvent.click(resetButton);

    expect(mockProps.onReset).toHaveBeenCalledOnce();
  });

  it('should call onEditScore when "Sửa kết quả" is clicked', () => {
    render(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const editButton = screen.getByText('Sửa kết quả');
    fireEvent.click(editButton);

    expect(mockProps.onEditScore).toHaveBeenCalledOnce();
  });

  it('should call onSettings when "Cấu hình" is clicked', () => {
    render(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const settingsButton = screen.getByText('Cấu hình');
    fireEvent.click(settingsButton);

    expect(mockProps.onSettings).toHaveBeenCalledOnce();
  });
});
