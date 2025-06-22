/**
 * Centralized Design Configuration
 * 
 * This file contains all design-related configurations that can be easily
 * modified to change the overall look and feel of the application.
 */

// Brand Colors Configuration
export const brandColors = {
  // Primary brand colors (indigo/purple theme)
  primary: {
    50: 'rgb(238, 242, 255)',   // brand-50
    100: 'rgb(224, 231, 255)',  // brand-100
    200: 'rgb(199, 210, 254)',  // brand-200
    300: 'rgb(165, 180, 252)',  // brand-300
    400: 'rgb(129, 140, 248)',  // brand-400
    500: 'rgb(99, 102, 241)',   // brand-500
    600: 'rgb(79, 70, 229)',    // brand-600
    700: 'rgb(67, 56, 202)',    // brand-700
    800: 'rgb(55, 48, 163)',    // brand-800
    900: 'rgb(49, 46, 129)',    // brand-900
  },
  
  // Secondary colors for accents
  secondary: {
    50: 'rgb(250, 245, 255)',   // purple-50
    100: 'rgb(243, 232, 255)',  // purple-100
    200: 'rgb(233, 213, 255)',  // purple-200
    300: 'rgb(196, 181, 253)',  // purple-300
    400: 'rgb(167, 139, 250)',  // purple-400
    500: 'rgb(139, 92, 246)',   // purple-500
    600: 'rgb(124, 58, 237)',   // purple-600
    700: 'rgb(109, 40, 217)',   // purple-700
    800: 'rgb(91, 33, 182)',    // purple-800
    900: 'rgb(76, 29, 149)',    // purple-900
  },

  // Semantic colors
  success: {
    50: 'rgb(240, 253, 244)',   // green-50
    100: 'rgb(220, 252, 231)',  // green-100
    500: 'rgb(34, 197, 94)',    // green-500
    600: 'rgb(22, 163, 74)',    // green-600
    700: 'rgb(21, 128, 61)',    // green-700
  },
  
  warning: {
    50: 'rgb(255, 251, 235)',   // yellow-50
    100: 'rgb(254, 243, 199)',  // yellow-100
    500: 'rgb(245, 158, 11)',   // yellow-500
    600: 'rgb(217, 119, 6)',    // yellow-600
  },
  
  error: {
    50: 'rgb(254, 242, 242)',   // red-50
    100: 'rgb(254, 226, 226)',  // red-100
    500: 'rgb(239, 68, 68)',    // red-500
    600: 'rgb(220, 38, 38)',    // red-600
  },
  
  info: {
    50: 'rgb(239, 246, 255)',   // blue-50
    100: 'rgb(219, 234, 254)',  // blue-100
    500: 'rgb(59, 130, 246)',   // blue-500
    600: 'rgb(37, 99, 235)',    // blue-600
  },

  // Neutral colors
  neutral: {
    50: 'rgb(249, 250, 251)',   // gray-50
    100: 'rgb(243, 244, 246)',  // gray-100
    200: 'rgb(229, 231, 235)',  // gray-200
    300: 'rgb(209, 213, 219)',  // gray-300
    400: 'rgb(156, 163, 175)',  // gray-400
    500: 'rgb(107, 114, 128)',  // gray-500
    600: 'rgb(75, 85, 99)',     // gray-600
    700: 'rgb(55, 65, 81)',     // gray-700
    800: 'rgb(31, 41, 55)',     // gray-800
    900: 'rgb(17, 24, 39)',     // gray-900
  }
};

// Gradient Configurations
export const gradients = {
  primary: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(139, 92, 246) 100%)',
  secondary: 'linear-gradient(135deg, rgb(139, 92, 246) 0%, rgb(168, 85, 247) 100%)',
  success: 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)',
  warning: 'linear-gradient(135deg, rgb(245, 158, 11) 0%, rgb(217, 119, 6) 100%)',
  info: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)',
  background: 'linear-gradient(135deg, rgb(238, 242, 255) 0%, rgb(224, 231, 255) 50%, rgb(199, 210, 254) 100%)',
  card: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(249, 250, 251) 100%)',
  cardHover: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(243, 244, 246) 100%)',
};

// Shadow Configurations
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  brand: '0 10px 25px -5px rgb(99 102 241 / 0.25), 0 8px 10px -6px rgb(99 102 241 / 0.1)',
  brandHover: '0 20px 35px -5px rgb(99 102 241 / 0.35), 0 12px 15px -6px rgb(99 102 241 / 0.15)',
};

// Border Radius Configurations
export const borderRadius = {
  sm: '0.125rem',    // 2px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
};

// Spacing Configurations
export const spacing = {
  xs: '0.5rem',      // 8px
  sm: '0.75rem',     // 12px
  md: '1rem',        // 16px
  lg: '1.5rem',      // 24px
  xl: '2rem',        // 32px
  '2xl': '3rem',     // 48px
  '3xl': '4rem',     // 64px
  '4xl': '6rem',     // 96px
};

// Typography Configurations
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Animation Configurations
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Component-specific configurations
export const components = {
  card: {
    padding: '1.5rem',
    borderRadius: '1rem',
    shadow: shadows.md,
    hoverShadow: shadows.lg,
    background: 'rgb(255, 255, 255)',
    border: `1px solid ${brandColors.neutral[200]}`,
  },
  
  button: {
    primary: {
      background: gradients.primary,
      color: 'white',
      hoverTransform: 'translateY(-1px)',
      shadow: shadows.brand,
      hoverShadow: shadows.brandHover,
    },
    secondary: {
      background: 'white',
      color: brandColors.primary[600],
      border: `1px solid ${brandColors.primary[200]}`,
      hoverBackground: brandColors.primary[50],
    },
  },
  
  // Exercise-specific component styles
  exercise: {
    // Calendar day styles
    calendarDay: {
      base: {
        background: brandColors.neutral[50],
        color: brandColors.neutral[600],
        hoverBackground: brandColors.neutral[100],
        border: `1px solid ${brandColors.neutral[200]}`,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      active: {
        background: gradients.primary,
        color: 'white',
        shadow: shadows.brand,
        border: `1px solid ${brandColors.primary[500]}`,
        transform: 'translateY(-1px)',
      },
      current: {
        background: brandColors.primary[50],
        color: brandColors.primary[700],
        border: `2px solid ${brandColors.primary[300]}`,
        fontWeight: typography.fontWeight.semibold,
      },
      hasExercises: {
        indicator: brandColors.primary[500],
        activeIndicator: 'white',
        currentIndicator: brandColors.primary[600],
      }
    },
    
    // Tab styles
    tabs: {
      base: {
        background: brandColors.neutral[50],
        color: brandColors.neutral[600],
        border: `1px solid ${brandColors.neutral[200]}`,
        borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
        padding: `${spacing.sm} ${spacing.lg}`,
        transition: 'all 200ms ease-in-out',
      },
      active: {
        background: 'white',
        color: brandColors.primary[700],
        border: `1px solid ${brandColors.primary[300]}`,
        borderBottom: '1px solid white',
        shadow: shadows.sm,
        fontWeight: typography.fontWeight.semibold,
        transform: 'translateY(-1px)',
      },
      hover: {
        background: brandColors.neutral[100],
        color: brandColors.neutral[700],
      }
    },
    
    // Exercise card styles
    exerciseCard: {
      base: {
        background: 'white',
        border: `1px solid ${brandColors.neutral[200]}`,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        shadow: shadows.sm,
        hoverShadow: shadows.md,
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      completed: {
        background: gradients.success,
        border: `1px solid ${brandColors.success[500]}`,
        color: 'white',
      },
      active: {
        background: brandColors.primary[50],
        border: `2px solid ${brandColors.primary[400]}`,
        shadow: shadows.brand,
      }
    }
  },
  
  statsCard: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    shadow: shadows.md,
    hoverShadow: shadows.lg,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  input: {
    borderRadius: borderRadius.lg,
    border: `1px solid ${brandColors.neutral[300]}`,
    focusBorder: `1px solid ${brandColors.primary[500]}`,
    focusRing: `0 0 0 3px ${brandColors.primary[100]}`,
  },
};

// Layout Configurations
export const layout = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '7xl': '1600px',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  container: {
    padding: {
      mobile: spacing.md,
      tablet: spacing.lg,
      desktop: spacing.xl,
    },
  },
};

// Theme variants for easy switching
export const themeVariants = {
  default: {
    name: 'Default',
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    background: gradients.background,
  },
  
  // Future theme variants can be added here
  // dark: { ... },
  // ocean: { ... },
  // forest: { ... },
};

// Export current active theme
export const currentTheme = themeVariants.default;

// Utility functions for theme access
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = { brandColors, gradients, shadows };
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return null;
  }
  
  return value;
};

export const getComponentStyle = (component: string, variant?: string) => {
  const baseStyle = components[component as keyof typeof components];
  if (!baseStyle) return null;
  
  if (variant && typeof baseStyle === 'object' && variant in baseStyle) {
    return { ...baseStyle, ...(baseStyle as any)[variant] };
  }
  
  return baseStyle;
}; 