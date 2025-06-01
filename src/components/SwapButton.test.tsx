import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwapButton } from './SwapButton';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowDownUp: () => <svg data-testid="arrow-down-up-icon" />,
  ArrowLeftRight: () => <svg data-testid="arrow-left-right-icon" />,
}));

// Mock UI button
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }) => <button {...props}>{children}</button>,
}));

describe('SwapButton', () => {
  it('should render swap button', () => {
    const mockOnSwap = vi.fn();
    render(<SwapButton onSwap={mockOnSwap} />);

    const swapButton = screen.getByRole('button');
    expect(swapButton).toBeInTheDocument();
  });

  it('should call onSwap when clicked', () => {
    const mockOnSwap = vi.fn();
    render(<SwapButton onSwap={mockOnSwap} />);

    const swapButton = screen.getByRole('button');
    fireEvent.click(swapButton);

    expect(mockOnSwap).toHaveBeenCalledOnce();
  });
  it('should show appropriate icon for current orientation', () => {
    const mockOnSwap = vi.fn();
    render(<SwapButton onSwap={mockOnSwap} />);

    // Should show one of the icons based on orientation
    // In testing environment, typically landscape (width > height)
    const icons = screen.queryAllByTestId(/arrow-(down-up|left-right)-icon/);
    expect(icons).toHaveLength(1);
  });
});
