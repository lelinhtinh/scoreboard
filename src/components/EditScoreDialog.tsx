import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa kết quả các vòng</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {Array.from({ length: config.winRounds }).map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="w-10">Vòng {i + 1}</span>
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
                style={{ color: teams[0].color, width: 60 }}
              />
              <span className="mx-1 text-gray-500">:</span>
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
                style={{ color: teams[1].color, width: 60 }}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Hủy
          </Button>
          <Button onClick={onSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
