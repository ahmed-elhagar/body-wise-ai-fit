
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const colors = {
    primary: isDark ? '#8B5CF6' : '#6366F1',
    secondary: isDark ? '#EC4899' : '#F59E0B',
    background: isDark ? '#111827' : '#FFFFFF',
    text: isDark ? '#F9FAFB' : '#111827'
  };

  const classes = {
    primaryBg: isDark ? 'bg-gray-800' : 'bg-white',
    secondaryBg: isDark ? 'bg-gray-700' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200'
  };

  // Add gradient system for design system compliance
  const gradients = {
    primary: 'from-brand-primary-50 to-brand-secondary-50',
    stats: {
      orange: 'from-orange-50 to-amber-50',
      green: 'from-green-50 to-emerald-50',
      blue: 'from-blue-50 to-indigo-50',
      purple: 'from-purple-50 to-pink-50'
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Available themes for theme selector
  const availableThemes = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'system', name: 'System' }
  ];

  const currentThemeName = availableThemes.find(t => t.id === theme)?.name || 'Light';

  return {
    theme,
    isDark,
    colors,
    classes,
    gradients,
    toggleTheme,
    setThemeMode,
    availableThemes,
    currentThemeName
  };
};
