/**
 * Centralized Theme Configuration for FitFatta
 * 
 * This file provides easy theme switching capability and centralized
 * management of all design tokens across the application.
 */

import { brandColors, gradients, shadows } from './design.config';

// Theme Definition Interface
export interface ThemeDefinition {
  name: string;
  primary: typeof brandColors.primary;
  secondary: typeof brandColors.secondary;
  gradients: {
    primary: string;
    background: string;
    stats: {
      orange: string;
      green: string;
      blue: string;
      purple: string;
    };
  };
  shadows: typeof shadows;
}

// Theme Variants Configuration
export const themeVariants: Record<string, ThemeDefinition> = {
  default: {
    name: 'FitFatta Default',
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    gradients: {
      primary: 'from-brand-primary-50 to-brand-secondary-50',
      background: 'from-brand-primary-50 via-white to-brand-secondary-50',
      stats: {
        orange: 'from-orange-50 to-amber-50',
        green: 'from-green-50 to-emerald-50',
        blue: 'from-blue-50 to-indigo-50',
        purple: 'from-purple-50 to-pink-50'
      }
    },
    shadows
  },
  
  ocean: {
    name: 'Ocean Blue',
    primary: {
      50: 'rgb(240, 249, 255)',   // blue-50
      100: 'rgb(224, 242, 254)',  // blue-100
      200: 'rgb(186, 230, 253)',  // blue-200
      300: 'rgb(125, 211, 252)',  // blue-300
      400: 'rgb(56, 189, 248)',   // blue-400
      500: 'rgb(14, 165, 233)',   // blue-500
      600: 'rgb(2, 132, 199)',    // blue-600
      700: 'rgb(3, 105, 161)',    // blue-700
      800: 'rgb(7, 89, 133)',     // blue-800
      900: 'rgb(12, 74, 110)',    // blue-900
    },
    secondary: {
      50: 'rgb(240, 253, 250)',   // emerald-50
      100: 'rgb(209, 250, 229)',  // emerald-100
      200: 'rgb(167, 243, 208)',  // emerald-200
      300: 'rgb(110, 231, 183)',  // emerald-300
      400: 'rgb(52, 211, 153)',   // emerald-400
      500: 'rgb(16, 185, 129)',   // emerald-500
      600: 'rgb(5, 150, 105)',    // emerald-600
      700: 'rgb(4, 120, 87)',     // emerald-700
      800: 'rgb(6, 95, 70)',      // emerald-800
      900: 'rgb(6, 78, 59)',      // emerald-900
    },
    gradients: {
      primary: 'from-blue-50 to-emerald-50',
      background: 'from-blue-50 via-cyan-50 to-emerald-50',
      stats: {
        orange: 'from-blue-50 to-cyan-50',
        green: 'from-emerald-50 to-teal-50',
        blue: 'from-blue-50 to-indigo-50',
        purple: 'from-cyan-50 to-blue-50'
      }
    },
    shadows
  },

  forest: {
    name: 'Forest Green',
    primary: {
      50: 'rgb(240, 253, 244)',   // green-50
      100: 'rgb(220, 252, 231)',  // green-100
      200: 'rgb(187, 247, 208)',  // green-200
      300: 'rgb(134, 239, 172)',  // green-300
      400: 'rgb(74, 222, 128)',   // green-400
      500: 'rgb(34, 197, 94)',    // green-500
      600: 'rgb(22, 163, 74)',    // green-600
      700: 'rgb(21, 128, 61)',    // green-700
      800: 'rgb(22, 101, 52)',    // green-800
      900: 'rgb(20, 83, 45)',     // green-900
    },
    secondary: {
      50: 'rgb(236, 253, 245)',   // emerald-50
      100: 'rgb(209, 250, 229)',  // emerald-100
      200: 'rgb(167, 243, 208)',  // emerald-200
      300: 'rgb(110, 231, 183)',  // emerald-300
      400: 'rgb(52, 211, 153)',   // emerald-400
      500: 'rgb(16, 185, 129)',   // emerald-500
      600: 'rgb(5, 150, 105)',    // emerald-600
      700: 'rgb(4, 120, 87)',     // emerald-700
      800: 'rgb(6, 95, 70)',      // emerald-800
      900: 'rgb(6, 78, 59)',      // emerald-900
    },
    gradients: {
      primary: 'from-green-50 to-emerald-50',
      background: 'from-green-50 via-emerald-50 to-teal-50',
      stats: {
        orange: 'from-green-50 to-lime-50',
        green: 'from-emerald-50 to-teal-50',
        blue: 'from-teal-50 to-cyan-50',
        purple: 'from-green-50 to-emerald-50'
      }
    },
    shadows
  },

  sunset: {
    name: 'Sunset Orange',
    primary: {
      50: 'rgb(255, 247, 237)',   // orange-50
      100: 'rgb(255, 237, 213)',  // orange-100
      200: 'rgb(254, 215, 170)',  // orange-200
      300: 'rgb(253, 186, 116)',  // orange-300
      400: 'rgb(251, 146, 60)',   // orange-400
      500: 'rgb(249, 115, 22)',   // orange-500
      600: 'rgb(234, 88, 12)',    // orange-600
      700: 'rgb(194, 65, 12)',    // orange-700
      800: 'rgb(154, 52, 18)',    // orange-800
      900: 'rgb(124, 45, 18)',    // orange-900
    },
    secondary: {
      50: 'rgb(254, 242, 242)',   // rose-50
      100: 'rgb(254, 226, 226)',  // rose-100
      200: 'rgb(254, 205, 211)',  // rose-200
      300: 'rgb(253, 164, 175)',  // rose-300
      400: 'rgb(251, 113, 133)',  // rose-400
      500: 'rgb(244, 63, 94)',    // rose-500
      600: 'rgb(225, 29, 72)',    // rose-600
      700: 'rgb(190, 18, 60)',    // rose-700
      800: 'rgb(159, 18, 57)',    // rose-800
      900: 'rgb(136, 19, 55)',    // rose-900
    },
    gradients: {
      primary: 'from-orange-50 to-rose-50',
      background: 'from-orange-50 via-amber-50 to-rose-50',
      stats: {
        orange: 'from-orange-50 to-amber-50',
        green: 'from-amber-50 to-yellow-50',
        blue: 'from-rose-50 to-pink-50',
        purple: 'from-pink-50 to-purple-50'
      }
    },
    shadows
  }
};

// Current Theme State
export let currentTheme: ThemeDefinition = themeVariants.default;

// Theme Management Functions
export const setCurrentTheme = (themeName: keyof typeof themeVariants) => {
  if (themeVariants[themeName]) {
    currentTheme = themeVariants[themeName];
    updateCSSVariables(currentTheme);
    
    // Store theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitfatta-theme', themeName);
    }
  }
};

export const getCurrentTheme = (): ThemeDefinition => currentTheme;

export const getAvailableThemes = () => {
  return Object.keys(themeVariants).map(key => ({
    key,
    name: themeVariants[key].name
  }));
};

// Initialize theme from localStorage
export const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('fitfatta-theme');
    if (savedTheme && themeVariants[savedTheme]) {
      setCurrentTheme(savedTheme as keyof typeof themeVariants);
    }
  }
};

// Update CSS Variables for theme switching
const updateCSSVariables = (theme: ThemeDefinition) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Update primary colors
  Object.entries(theme.primary).forEach(([key, value]) => {
    root.style.setProperty(`--brand-primary-${key}`, value);
  });
  
  // Update secondary colors
  Object.entries(theme.secondary).forEach(([key, value]) => {
    root.style.setProperty(`--brand-secondary-${key}`, value);
  });
  
  // Update gradient variables
  root.style.setProperty('--gradient-primary', theme.gradients.primary);
  root.style.setProperty('--gradient-background', theme.gradients.background);
  root.style.setProperty('--gradient-stats-orange', theme.gradients.stats.orange);
  root.style.setProperty('--gradient-stats-green', theme.gradients.stats.green);
  root.style.setProperty('--gradient-stats-blue', theme.gradients.stats.blue);
  root.style.setProperty('--gradient-stats-purple', theme.gradients.stats.purple);
};

// Utility functions for component usage
export const getThemeGradient = (type: 'primary' | 'background' | 'orange' | 'green' | 'blue' | 'purple') => {
  switch (type) {
    case 'primary':
      return currentTheme.gradients.primary;
    case 'background':
      return currentTheme.gradients.background;
    case 'orange':
      return currentTheme.gradients.stats.orange;
    case 'green':
      return currentTheme.gradients.stats.green;
    case 'blue':
      return currentTheme.gradients.stats.blue;
    case 'purple':
      return currentTheme.gradients.stats.purple;
    default:
      return currentTheme.gradients.primary;
  }
};

export const getThemeColor = (color: 'primary' | 'secondary', shade: keyof typeof brandColors.primary) => {
  return currentTheme[color][shade];
};

// CSS class generators for easy usage
export const themeClasses = {
  // Background gradients
  primaryBg: () => `bg-gradient-to-br ${currentTheme.gradients.primary}`,
  backgroundBg: () => `bg-gradient-to-br ${currentTheme.gradients.background}`,
  
  // Stats card gradients
  statsOrange: () => `bg-gradient-to-br ${currentTheme.gradients.stats.orange}`,
  statsGreen: () => `bg-gradient-to-br ${currentTheme.gradients.stats.green}`,
  statsBlue: () => `bg-gradient-to-br ${currentTheme.gradients.stats.blue}`,
  statsPurple: () => `bg-gradient-to-br ${currentTheme.gradients.stats.purple}`,
  
  // Button gradients
  primaryButton: () => `bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700`,
  secondaryButton: () => `bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 hover:from-brand-secondary-600 hover:to-brand-secondary-700`,
};

// Initialize theme on import
initializeTheme();
