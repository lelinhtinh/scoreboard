import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TeamConfig, GameConfig } from '../types/game';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tempTeams: TeamConfig[];
  tempConfig: GameConfig;
  onTeamChange: (idx: number, field: keyof TeamConfig, value: string) => void;
  onConfigChange: (field: keyof GameConfig, value: number | string) => void;
  onReset: () => void;
  onSave: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  tempTeams,
  tempConfig,
  onTeamChange,
  onConfigChange,
  onReset,
  onSave,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cài đặt trận đấu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {tempTeams.map((team, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Label className="w-16">Tên đội</Label>
              <Input
                value={team.name}
                onChange={(e) => onTeamChange(idx, 'name', e.target.value)}
              />
              <Label className="w-16">Màu</Label>
              <Input
                type="color"
                value={team.color}
                onChange={(e) => onTeamChange(idx, 'color', e.target.value)}
                className="w-10 h-10 p-0 border-none bg-transparent"
              />
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <Label className="w-40">Số điểm để thắng</Label>
            <Input
              type="number"
              min={1}
              value={tempConfig.winScore}
              onChange={(e) => onConfigChange('winScore', e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-40">Số điểm tối đa</Label>
            <Input
              type="number"
              min={1}
              value={tempConfig.maxScore}
              onChange={(e) => onConfigChange('maxScore', e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-40">Số điểm cách biệt</Label>
            <Input
              type="number"
              min={1}
              value={tempConfig.minDiff}
              onChange={(e) => onConfigChange('minDiff', e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-40">Số vòng để thắng</Label>
            <Input
              type="number"
              min={1}
              value={tempConfig.winRounds}
              onChange={(e) => onConfigChange('winRounds', e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-40">Số điểm tăng mỗi lần</Label>
            <Input
              type="number"
              min={1}
              value={tempConfig.scoreStep}
              onChange={(e) => onConfigChange('scoreStep', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onReset} variant="outline">
            Đặt lại
          </Button>
          <Button onClick={onSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
