import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../i18n/locales/en.json';

// Create a test instance of i18next
export const testI18n = i18n.createInstance();

testI18n.use(initReactI18next).init({
  lng: 'en', // Force English for tests
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      translation: en,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

// Custom render function that wraps components with I18nextProvider
export function renderWithI18n(ui: React.ReactElement, options = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}
