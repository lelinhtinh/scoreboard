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
import { useState, useCallback, memo } from 'react';
import { z } from 'zod';

// Zod validation schemas
const validationSchemas = {
  teamName: z
    .string()
    .min(1, 'Tên đội không được để trống')
    .max(50, 'Tên đội không được vượt quá 50 ký tự')
    .refine(
      (name) => name.trim().length > 0,
      'Tên đội không được chỉ chứa khoảng trắng'
    ),

  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu sắc không hợp lệ'),

  positiveInteger: z
    .number()
    .min(1, 'Giá trị phải lớn hơn 0')
    .int('Chỉ được nhập số nguyên')
    .positive('Chỉ được nhập số dương'),

  winRounds: z
    .number()
    .min(1, 'Số vòng phải lớn hơn 0')
    .int('Chỉ được nhập số nguyên')
    .positive('Chỉ được nhập số dương')
    .refine((value) => value % 2 === 1, 'Số vòng để thắng phải là số lẻ'),
} as const;

// Types for errors and field configurations
type ErrorState = Record<string, string | null>;
type ConfigField = keyof GameConfig;

// Configuration for form fields
const configFields = [
  { key: 'winScore' as const, label: 'Số điểm để thắng', hasStep: true },
  { key: 'maxScore' as const, label: 'Số điểm tối đa', hasStep: true },
  { key: 'minDiff' as const, label: 'Số điểm cách biệt', hasStep: true },
  { key: 'winRounds' as const, label: 'Số vòng để thắng', hasStep: false },
  { key: 'scoreStep' as const, label: 'Số điểm tăng mỗi lần', hasStep: true },
] as const;

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

// Utility function for validation
const validateField = (
  schema: z.ZodSchema<unknown>,
  value: unknown
): string | null => {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Dữ liệu không hợp lệ';
    }
    return 'Lỗi xác thực';
  }
};

// Get validation schema for config field
const getConfigSchema = (field: ConfigField) => {
  return field === 'winRounds'
    ? validationSchemas.winRounds
    : validationSchemas.positiveInteger;
};

// Memoized team field component
const TeamField = memo(
  ({
    team,
    idx,
    errors,
    onTeamChange,
  }: {
    team: TeamConfig;
    idx: number;
    errors: ErrorState;
    onTeamChange: (idx: number, field: keyof TeamConfig, value: string) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <Label className="w-16">Tên đội</Label>
        <Input
          value={team.name}
          onChange={(e) => onTeamChange(idx, 'name', e.target.value)}
          className={errors[`teamName-${idx}`] ? 'border-red-500' : ''}
          aria-invalid={!!errors[`teamName-${idx}`]}
        />
        <Label className="w-16">Màu</Label>
        <Input
          type="color"
          value={team.color}
          onChange={(e) => onTeamChange(idx, 'color', e.target.value)}
          className={`w-10 h-10 p-0 border-none bg-transparent ${
            errors[`teamColor-${idx}`] ? 'border-red-500' : ''
          }`}
          aria-invalid={!!errors[`teamColor-${idx}`]}
        />
      </div>
      {errors[`teamName-${idx}`] && (
        <p className="text-red-500 text-sm ml-20" role="alert">
          {errors[`teamName-${idx}`]}
        </p>
      )}
      {errors[`teamColor-${idx}`] && (
        <p className="text-red-500 text-sm ml-20" role="alert">
          {errors[`teamColor-${idx}`]}
        </p>
      )}
    </div>
  )
);

TeamField.displayName = 'TeamField';

// Memoized config field component
const ConfigFieldComponent = memo(
  ({
    field,
    label,
    hasStep,
    value,
    errors,
    onConfigChange,
  }: {
    field: ConfigField;
    label: string;
    hasStep: boolean;
    value: number;
    errors: ErrorState;
    onConfigChange: (field: ConfigField, value: string) => void;
  }) => (
    <div className="space-y-1">
      <div className="flex gap-2 items-center">
        <Label className="w-40">{label}</Label>
        <Input
          type="number"
          min={1}
          step={hasStep ? 1 : undefined}
          value={value}
          onChange={(e) => onConfigChange(field, e.target.value)}
          className={errors[field] ? 'border-red-500' : ''}
          aria-invalid={!!errors[field]}
        />
      </div>
      {errors[field] && (
        <p className="text-red-500 text-sm ml-40" role="alert">
          {errors[field]}
        </p>
      )}
    </div>
  )
);

ConfigFieldComponent.displayName = 'ConfigFieldComponent';

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
  const [errors, setErrors] = useState<ErrorState>({});

  const handleTeamChange = useCallback(
    (idx: number, field: keyof TeamConfig, value: string) => {
      onTeamChange(idx, field, value);

      // Validate team field using Zod
      let error: string | null = null;
      if (field === 'name') {
        error = validateField(validationSchemas.teamName, value);
        setErrors((prev) => ({ ...prev, [`teamName-${idx}`]: error }));
      } else if (field === 'color') {
        error = validateField(validationSchemas.color, value);
        setErrors((prev) => ({ ...prev, [`teamColor-${idx}`]: error }));
      }
    },
    [onTeamChange]
  );

  const handleConfigChange = useCallback(
    (field: ConfigField, value: string) => {
      onConfigChange(field, value);

      // Validate config field using Zod
      const numValue = Number(value);
      const schema = getConfigSchema(field);
      const error = validateField(schema, numValue);

      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [onConfigChange]
  );

  const handleSave = useCallback(() => {
    // Validate all fields before saving
    const newErrors: ErrorState = {};

    // Validate teams
    tempTeams.forEach((team, idx) => {
      const nameError = validateField(validationSchemas.teamName, team.name);
      if (nameError) newErrors[`teamName-${idx}`] = nameError;

      const colorError = validateField(validationSchemas.color, team.color);
      if (colorError) newErrors[`teamColor-${idx}`] = colorError;
    });

    // Validate config
    Object.entries(tempConfig).forEach(([key, value]) => {
      const field = key as ConfigField;
      const schema = getConfigSchema(field);
      const error = validateField(schema, Number(value));

      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    // Only save if no errors
    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (!hasErrors) {
      onSave();
    }
  }, [tempTeams, tempConfig, onSave]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cài đặt trận đấu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Team Configuration */}
          {tempTeams.map((team, idx) => (
            <TeamField
              key={idx}
              team={team}
              idx={idx}
              errors={errors}
              onTeamChange={handleTeamChange}
            />
          ))}

          {/* Game Configuration */}
          {configFields.map(({ key, label, hasStep }) => (
            <ConfigFieldComponent
              key={key}
              field={key}
              label={label}
              hasStep={hasStep}
              value={tempConfig[key]}
              errors={errors}
              onConfigChange={handleConfigChange}
            />
          ))}
        </div>

        <DialogFooter>
          <Button onClick={onReset} variant="outline">
            Đặt lại
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
