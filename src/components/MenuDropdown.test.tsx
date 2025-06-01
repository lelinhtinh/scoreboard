import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithI18n } from '../test/i18n-test-utils';
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
  Languages: () => <svg data-testid="languages-icon" />,
  ChevronDownIcon: () => <svg data-testid="chevron-down-icon" />,
  ChevronUpIcon: () => <svg data-testid="chevron-up-icon" />,
  CheckIcon: () => <svg data-testid="check-icon" />,
}));

// Mock the LanguageSelector component
vi.mock('../LanguageSelector', () => ({
  LanguageSelector: () => (
    <div data-testid="language-selector">Language Selector</div>
  ),
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
    renderWithI18n(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    expect(menuButton).toBeInTheDocument();
  });
  it('should show "New Round" option when winRounds > 1', () => {
    renderWithI18n(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    expect(screen.getByText('New Round')).toBeInTheDocument();
  });

  it('should not show "New Round" option when winRounds = 1', () => {
    const singleRoundConfig = { ...defaultConfig, winRounds: 1 };
    renderWithI18n(<MenuDropdown {...mockProps} config={singleRoundConfig} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    expect(screen.queryByText('New Round')).not.toBeInTheDocument();
  });

  it('should disable "New Round" when last round has not ended', () => {
    renderWithI18n(<MenuDropdown {...mockProps} lastRoundEnded={false} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const nextRoundButton = screen.getByText('New Round');
    expect(nextRoundButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable "New Round" when there is a final winner', () => {
    renderWithI18n(<MenuDropdown {...mockProps} hasFinalWinner={true} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const nextRoundButton = screen.getByText('New Round');
    expect(nextRoundButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call onReset when "New Match" is clicked', () => {
    renderWithI18n(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const resetButton = screen.getByText('New Match');
    fireEvent.click(resetButton);

    expect(mockProps.onReset).toHaveBeenCalledOnce();
  });

  it('should call onEditScore when "Edit Score" is clicked', () => {
    renderWithI18n(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const editButton = screen.getByText('Edit Score');
    fireEvent.click(editButton);

    expect(mockProps.onEditScore).toHaveBeenCalledOnce();
  });

  it('should call onSettings when "Settings" is clicked', () => {
    renderWithI18n(<MenuDropdown {...mockProps} />);

    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    expect(mockProps.onSettings).toHaveBeenCalledOnce();
  });
});
