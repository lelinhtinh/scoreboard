import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import type { GameConfig } from '../types/game';

interface MenuDropdownProps {
  config: GameConfig;
  lastRoundEnded: boolean;
  hasFinalWinner: boolean;
  onNextRound: () => void;
  onReset: () => void;
  onEditScore: () => void;
  onSettings: () => void;
}

export function MenuDropdown({
  config,
  lastRoundEnded,
  hasFinalWinner,
  onNextRound,
  onReset,
  onEditScore,
  onSettings,
}: MenuDropdownProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Menu">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {config.winRounds > 1 && (
            <DropdownMenuItem
              onClick={onNextRound}
              disabled={!lastRoundEnded || hasFinalWinner}
            >
              Vòng mới
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onReset}>Trận mới</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEditScore}>Sửa kết quả</DropdownMenuItem>
          <DropdownMenuItem onClick={onSettings}>Cấu hình</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
