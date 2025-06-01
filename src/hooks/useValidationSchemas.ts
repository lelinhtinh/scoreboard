import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export function useValidationSchemas() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      teamName: z
        .string()
        .min(1, t('validation.teamNameEmpty'))
        .max(50, t('validation.teamNameTooLong'))
        .refine(
          (name) => name.trim().length > 0,
          t('validation.teamNameWhitespace')
        ),

      color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, t('validation.invalidColor')),

      positiveInteger: z
        .number()
        .min(1, t('validation.valueGreaterThanZero'))
        .int(t('validation.integerOnly'))
        .positive(t('validation.positiveOnly')),

      winRounds: z
        .number()
        .min(1, t('validation.valueGreaterThanZero'))
        .int(t('validation.integerOnly'))
        .positive(t('validation.positiveOnly'))
        .refine((value) => value % 2 === 1, t('validation.oddRoundsOnly')),
    }),
    [t]
  );
}
