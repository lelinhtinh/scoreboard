// Mock UI components for testing
import { forwardRef } from 'react';

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="dropdown-menu">{children}</div>
);

export const DropdownMenuTrigger = ({
  children,
}: {
  children: React.ReactNode;
}) => <div data-testid="dropdown-trigger">{children}</div>;

export const DropdownMenuContent = ({
  children,
}: {
  children: React.ReactNode;
}) => <div data-testid="dropdown-content">{children}</div>;

export const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <div data-testid="dropdown-item" onClick={onClick}>
    {children}
  </div>
);

export const DropdownMenuSeparator = () => (
  <div data-testid="dropdown-separator" />
);
