import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import type { TeamConfig, GameConfig } from '../types/game';

interface ScoreboardProps {
  teams: TeamConfig[];
  lastRound: { a: number; b: number };
  config: GameConfig;
  winner: number | null;
  hasFinalWinner: boolean;
  finalWinner: number | null;
  canEditScore: boolean;
  onScoreChange: (team: 'a' | 'b', delta: number) => void;
  onTouchStart: (idx: number, e: React.TouchEvent) => void;
  onTouchEnd: (idx: number, e: React.TouchEvent) => void;
}

export function Scoreboard({
  teams,
  lastRound,
  config,
  winner,
  hasFinalWinner,
  finalWinner,
  canEditScore,
  onScoreChange,
  onTouchStart,
  onTouchEnd,
}: ScoreboardProps) {
  return (
    <>
      {teams.map((team, idx) => (
        <div
          key={team.name}
          className="flex-1 flex flex-col items-center justify-center p-4 gap-4 select-none cursor-pointer"
          style={{ background: team.color + '22' }}
          onClick={() => {
            if (canEditScore) {
              onScoreChange(idx === 0 ? 'a' : 'b', config.scoreStep);
            }
          }}
          onTouchStart={(e) => onTouchStart(idx, e)}
          onTouchEnd={(e) => onTouchEnd(idx, e)}
        >
          <div className="relative flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: team.color }}>
              {team.name}
            </span>
            {(winner === idx ||
              (hasFinalWinner && finalWinner === idx) ||
              (config.winRounds === 1 && winner === idx)) && (
              <span
                className="absolute -top-3 -left-2"
                style={{ transform: 'rotate(-45deg)' }}
              >
                <Crown className="text-yellow-500 w-6 h-6" />
              </span>
            )}
          </div>{' '}
          <div
            className="font-extrabold select-none mb-2"
            style={{
              color: team.color,
              fontSize: 'min(20vw, 16vh)',
              lineHeight: 1,
              letterSpacing: '-0.05em',
              maxWidth: '2.2em',
              textAlign: 'center',
            }}
          >
            {lastRound[idx === 0 ? 'a' : 'b']}
          </div>
          <Button
            variant="ghost"
            disabled={!canEditScore}
            onClick={(e) => {
              e.stopPropagation();
              if (canEditScore) {
                onScoreChange(idx === 0 ? 'a' : 'b', -config.scoreStep);
              }
            }}
            className="mt-2"
          >
            -
          </Button>
        </div>
      ))}
    </>
  );
}
