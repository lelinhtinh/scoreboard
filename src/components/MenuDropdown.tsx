import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GameConfig } from '../types/game';
import { LanguageSelector } from './LanguageSelector';

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
  const { t } = useTranslation();

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
              {t('menu.newRound')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onReset}>
            {t('menu.newMatch')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEditScore}>
            {t('menu.editScore')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettings}>
            {t('menu.settings')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <LanguageSelector />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
