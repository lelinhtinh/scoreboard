import type { TeamConfig, GameConfig } from '../types/game';
import { useTranslation } from 'react-i18next';

interface WinMessageProps {
  showRoundWin: boolean;
  roundWinner: number | null;
  hasFinalWinner: boolean;
  winner: number | null;
  finalWinner: number | null;
  teams: TeamConfig[];
  config: GameConfig;
  currentRound: number;
}

export function WinMessage({
  showRoundWin,
  roundWinner,
  hasFinalWinner,
  winner,
  finalWinner,
  teams,
  config,
  currentRound,
}: WinMessageProps) {
  const { t } = useTranslation();

  const messageStyle = {
    zIndex: 20,
    alignItems: window.innerWidth > window.innerHeight ? 'flex-end' : 'center',
    justifyContent: 'center',
    paddingBottom: window.innerWidth > window.innerHeight ? '10vh' : 0,
  } as const;
  // Hiển thị thông báo thắng vòng
  if (showRoundWin && roundWinner !== null && !hasFinalWinner) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
        style={messageStyle}
      >
        <div className="bg-white/90 dark:bg-black/80 rounded-xl px-8 py-6 shadow-xl text-center">
          {config.winRounds > 1
            ? t('winMessage.roundWin', {
                team: teams[roundWinner].name,
                round: currentRound,
              })
            : t('winMessage.finalWin', { team: teams[roundWinner].name })}
        </div>
      </div>
    );
  }
  // Hiển thị thông báo thắng cuối cùng (chỉ khi không hiển thị thông báo thắng vòng)
  if (!showRoundWin && (winner !== null || hasFinalWinner)) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
        style={messageStyle}
      >
        <div className="bg-white/90 dark:bg-black/80 rounded-xl px-8 py-6 shadow-xl text-center">
          {hasFinalWinner || config.winRounds === 1
            ? t('winMessage.finalWin', {
                team: teams[finalWinner ?? winner ?? 0].name,
              })
            : null}
        </div>
      </div>
    );
  }

  return null;
}
