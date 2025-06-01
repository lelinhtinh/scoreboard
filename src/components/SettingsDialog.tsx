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
import { Label } from '@/components/ui/label';
import type { TeamConfig, GameConfig } from '../types/game';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidationSchemas } from '../hooks/useValidationSchemas';
import { z } from 'zod';

// Types for errors and field configurations
type ErrorState = Record<string, string | null>;
type ConfigField = keyof GameConfig;

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
  const { t } = useTranslation();
  const validationSchemas = useValidationSchemas();
  const [errors, setErrors] = useState<ErrorState>({});

  // Configuration for form fields with translations
  const configFields = useMemo(
    () => [
      {
        key: 'winScore' as const,
        label: t('settings.winScore'),
        hasStep: true,
      },
      {
        key: 'maxScore' as const,
        label: t('settings.maxScore'),
        hasStep: true,
      },
      { key: 'minDiff' as const, label: t('settings.minDiff'), hasStep: true },
      {
        key: 'winRounds' as const,
        label: t('settings.winRounds'),
        hasStep: false,
      },
      {
        key: 'scoreStep' as const,
        label: t('settings.scoreStep'),
        hasStep: true,
      },
    ],
    [t]
  );

  // Validation utility function
  const validateField = useCallback(
    (schema: z.ZodSchema<unknown>, value: unknown): string | null => {
      try {
        schema.parse(value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.issues[0]?.message || t('validation.invalidData');
        }
        return t('validation.validationError');
      }
    },
    [t]
  );

  // Get validation schema for config field
  const getConfigSchema = useCallback(
    (field: ConfigField) => {
      return field === 'winRounds'
        ? validationSchemas.winRounds
        : validationSchemas.positiveInteger;
    },
    [validationSchemas]
  );

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
    [
      onTeamChange,
      validateField,
      validationSchemas.teamName,
      validationSchemas.color,
    ]
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
    [onConfigChange, getConfigSchema, validateField]
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
  }, [
    tempTeams,
    tempConfig,
    onSave,
    validateField,
    validationSchemas.teamName,
    validationSchemas.color,
    getConfigSchema,
  ]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        {' '}
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>{t('settings.description')}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
          {' '}
          {/* Team Configuration */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b pb-1">
              {t('settings.teams')}
            </h3>
            {tempTeams.map((team, idx) => (
              <div
                key={idx}
                className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t('settings.team', { number: idx + 1 })}
                </div>

                {/* Team name row */}
                <div className="flex gap-2 items-center">
                  <Label className="text-xs w-12 flex-shrink-0">
                    {t('settings.name')}
                  </Label>
                  <Input
                    value={team.name}
                    onChange={(e) =>
                      handleTeamChange(idx, 'name', e.target.value)
                    }
                    className={`text-sm h-8 ${
                      errors[`teamName-${idx}`] ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors[`teamName-${idx}`]}
                  />
                  <Label className="text-xs w-8 flex-shrink-0">
                    {t('settings.color')}
                  </Label>
                  <Input
                    type="color"
                    value={team.color}
                    onChange={(e) =>
                      handleTeamChange(idx, 'color', e.target.value)
                    }
                    className={`w-8 h-8 p-0 border-none bg-transparent flex-shrink-0 ${
                      errors[`teamColor-${idx}`] ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors[`teamColor-${idx}`]}
                  />
                </div>

                {/* Error messages */}
                {errors[`teamName-${idx}`] && (
                  <p className="text-red-500 text-xs ml-14" role="alert">
                    {errors[`teamName-${idx}`]}
                  </p>
                )}
                {errors[`teamColor-${idx}`] && (
                  <p className="text-red-500 text-xs ml-14" role="alert">
                    {errors[`teamColor-${idx}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* Game Configuration */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b pb-1">
              {t('settings.gameConfig')}
            </h3>
            <div className="space-y-3">
              {configFields.map(({ key, label, hasStep }) => (
                <div key={key} className="space-y-1">
                  <div className="flex gap-2 items-center">
                    <Label className="text-xs flex-1 min-w-0">{label}</Label>
                    <Input
                      type="number"
                      min={1}
                      step={hasStep ? 1 : undefined}
                      value={tempConfig[key]}
                      onChange={(e) => handleConfigChange(key, e.target.value)}
                      className={`text-sm h-8 w-20 flex-shrink-0 ${
                        errors[key] ? 'border-red-500' : ''
                      }`}
                      aria-invalid={!!errors[key]}
                    />
                  </div>
                  {errors[key] && (
                    <p className="text-red-500 text-xs" role="alert">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>{' '}
        </div>
        <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t">
          <Button onClick={onReset} variant="outline" className="text-sm h-8">
            {t('settings.reset')}
          </Button>
          <Button onClick={handleSave} className="text-sm h-8">
            {t('settings.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
