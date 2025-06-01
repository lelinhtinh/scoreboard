import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import type { TeamConfig, GameConfig } from '../types/game';

interface EditScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editScores: { a: number; b: number }[];
  config: GameConfig;
  teams: TeamConfig[];
  onScoreChange: (scores: { a: number; b: number }[]) => void;
  onSave: () => void;
}

export function EditScoreDialog({
  open,
  onOpenChange,
  editScores,
  config,
  teams,
  onScoreChange,
  onSave,
}: EditScoreDialogProps) {
  const { t } = useTranslation();

  const setEditScores = (
    updater: React.SetStateAction<{ a: number; b: number }[]>
  ) => {
    if (typeof updater === 'function') {
      onScoreChange(updater(editScores));
    } else {
      onScoreChange(updater);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('editScores.title')}</DialogTitle>
          <DialogDescription>{t('editScores.description')}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
          {/* Team names header - only show if multiple rounds */}
          {config.winRounds > 1 && (
            <div className="flex gap-2 items-center justify-center text-sm font-medium">
              <span
                className="w-16 text-center"
                style={{ color: teams[0].color }}
              >
                {teams[0].name}
              </span>
              <span className="w-8"></span>
              <span
                className="w-16 text-center"
                style={{ color: teams[1].color }}
              >
                {teams[1].name}
              </span>
            </div>
          )}

          {Array.from({ length: config.winRounds }).map((_, i) => (
            <div key={i} className="space-y-2">
              {/* Round label - only show if multiple rounds */}
              {config.winRounds > 1 && (
                <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                  {t('editScores.round', { number: i + 1 })}
                </div>
              )}

              {/* Score inputs */}
              <div className="flex gap-2 items-center justify-center">
                {config.winRounds === 1 && (
                  <span
                    className="text-xs font-medium w-14 text-center"
                    style={{ color: teams[0].color }}
                  >
                    {teams[0].name}
                  </span>
                )}
                <Input
                  type="number"
                  min={0}
                  value={editScores[i]?.a ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditScores((scores) =>
                      scores.map((s, idx) => (idx === i ? { ...s, a: val } : s))
                    );
                  }}
                  className="w-14 h-8 text-center text-sm"
                  style={{ color: teams[0].color }}
                />
                <span className="text-lg font-bold text-gray-500">:</span>
                <Input
                  type="number"
                  min={0}
                  value={editScores[i]?.b ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditScores((scores) =>
                      scores.map((s, idx) => (idx === i ? { ...s, b: val } : s))
                    );
                  }}
                  className="w-14 h-8 text-center text-sm"
                  style={{ color: teams[1].color }}
                />
                {config.winRounds === 1 && (
                  <span
                    className="text-xs font-medium w-14 text-center"
                    style={{ color: teams[1].color }}
                  >
                    {teams[1].name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-shrink-0 mt-3 pt-3 border-t">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="text-sm h-8"
          >
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave} className="text-sm h-8">
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
