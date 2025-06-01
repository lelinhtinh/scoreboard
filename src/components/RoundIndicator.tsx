import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { TeamConfig, GameConfig, Round } from '../types/game';
import { checkRoundResult } from '../utils/gameLogic';

interface RoundIndicatorProps {
  config: GameConfig;
  rounds: Round[];
  teams: TeamConfig[];
}

export function RoundIndicator({ config, rounds, teams }: RoundIndicatorProps) {
  if (config.winRounds <= 1) return null;

  return (
    <div className="absolute left-1/2 top-8 -translate-x-1/2 flex gap-2 z-10">
      {Array.from({ length: config.winRounds }).map((_, i) => {
        let bg = '#fff';
        let className =
          'w-5 h-5 rounded-full border border-white block cursor-pointer';
        let popoverContent = null;
        const r = rounds[i] || { a: 0, b: 0, hasEnded: false };
        const res = checkRoundResult(r.a, r.b, config);

        if (r.hasEnded) {
          if (res === 0 || res === 1) {
            // Team won
            popoverContent = (
              <span className="text-lg font-bold">
                <span style={{ color: teams[0].color }}>{r.a}</span>
                <span className="mx-1 text-gray-500">:</span>
                <span style={{ color: teams[1].color }}>{r.b}</span>
              </span>
            );
            bg = teams[res].color;
          } else if (res === null && r.a === r.b) {
            // Tie round
            className += ' bg-gray-300';
            bg = '#d1d5db'; // gray-300 color value
            popoverContent = (
              <span className="text-lg font-bold">
                <span style={{ color: teams[0].color }}>{r.a}</span>
                <span className="mx-1 text-gray-500">:</span>
                <span style={{ color: teams[1].color }}>{r.b}</span>
              </span>
            );
          }
        }

        return (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <span
                data-testid={`round-indicator-${i}`}
                className={className}
                style={{ background: bg, boxShadow: '0 0 0 2px #fff' }}
                tabIndex={0}
              />
            </PopoverTrigger>
            {popoverContent && (
              <PopoverContent
                side="top"
                align="center"
                className="p-1 text-center min-w-0 w-auto max-w-[80px]"
              >
                {popoverContent}
              </PopoverContent>
            )}
          </Popover>
        );
      })}
    </div>
  );
}
