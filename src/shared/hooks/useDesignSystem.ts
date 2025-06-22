
import { useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

export interface DesignSystemContext {
  theme: Theme;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  classes: {
    primaryBg: string;
    secondaryBg: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  currentThemeName: string;
  switchTheme: (theme: Theme) => void;
  getThemePreview: (themeName: string) => any;
  isLoading: boolean;
}

const themes = [
  { id: 'fitfatta', name: 'FitFatta', key: 'fitfatta' },
  { id: 'ocean', name: 'Ocean Blue', key: 'ocean' },
  { id: 'forest', name: 'Forest Green', key: 'forest' },
  { id: 'sunset', name: 'Sunset Orange', key: 'sunset' }
];

export const useDesignSystem = (): DesignSystemContext => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThemeName, setCurrentThemeName] = useState('fitfatta');

  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const colors = {
    primary: isDark ? '#3b82f6' : '#2563eb',
    secondary: isDark ? '#64748b' : '#475569',
    background: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f8fafc' : '#0f172a'
  };

  const classes = {
    primaryBg: isDark ? 'bg-blue-600' : 'bg-blue-700',
    secondaryBg: isDark ? 'bg-slate-700' : 'bg-slate-600',
    cardBg: isDark ? 'bg-slate-800' : 'bg-white',
    textPrimary: isDark ? 'text-slate-100' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-300' : 'text-slate-600',
    border: isDark ? 'border-slate-700' : 'border-slate-200'
  };

  const switchTheme = useCallback((newTheme: Theme) => {
    setIsLoading(true);
    setTimeout(() => {
      setTheme(newTheme);
      setIsLoading(false);
    }, 300);
  }, []);

  const getThemePreview = useCallback((themeName: string) => {
    const themeData = themes.find(t => t.key === themeName);
    return {
      name: themeData?.name || 'Unknown',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981'
      }
    };
  }, []);

  return {
    theme,
    isDark,
    colors,
    classes,
    currentThemeName,
    switchTheme,
    getThemePreview,
    isLoading
  };
};
