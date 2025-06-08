
# FitFatta Design System

## Color Palette

### Primary Colors
```css
/* Health Theme Colors */
--health-primary: #10b981;      /* Emerald 500 - Primary green */
--health-secondary: #059669;    /* Emerald 600 - Darker green */
--health-accent: #6ee7b7;       /* Emerald 300 - Light accent */

/* Background Colors */
--health-bg-primary: #ffffff;   /* Pure white */
--health-bg-secondary: #f9fafb; /* Gray 50 */
--health-bg-accent: #ecfdf5;    /* Emerald 50 */

/* Text Colors */
--health-text-primary: #111827;   /* Gray 900 */
--health-text-secondary: #6b7280; /* Gray 500 */
--health-text-muted: #9ca3af;     /* Gray 400 */
```

### Semantic Colors
```css
/* Status Colors */
--success: #10b981;    /* Emerald 500 */
--warning: #f59e0b;    /* Amber 500 */
--error: #ef4444;      /* Red 500 */
--info: #3b82f6;       /* Blue 500 */

/* Progress Colors */
--progress-complete: #10b981;  /* Green */
--progress-partial: #f59e0b;   /* Amber */
--progress-empty: #e5e7eb;     /* Gray 200 */
```

### Meal Type Colors
```css
/* Meal Category Colors */
--breakfast: #fbbf24;    /* Amber 400 */
--lunch: #fb923c;       /* Orange 400 */
--dinner: #f87171;      /* Red 400 */
--snack: #a78bfa;       /* Violet 400 */

/* Nutrition Colors */
--protein: #10b981;     /* Green - Protein */
--carbs: #3b82f6;       /* Blue - Carbohydrates */
--fat: #f59e0b;         /* Amber - Fats */
--fiber: #8b5cf6;       /* Purple - Fiber */
```

## Typography

### Font Families
```css
/* Primary Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Arabic Font Support */
font-family: 'Noto Sans Arabic', 'Tahoma', 'Arial Unicode MS', sans-serif;
```

### Font Sizes & Line Heights
```css
/* Heading Scales */
--text-4xl: 2.25rem;   /* 36px - Main headings */
--text-3xl: 1.875rem;  /* 30px - Section headings */
--text-2xl: 1.5rem;    /* 24px - Subsection headings */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-lg: 1.125rem;   /* 18px - Large body text */

/* Body Text */
--text-base: 1rem;     /* 16px - Regular body text */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Captions */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing System

### Spacing Scale (Tailwind-based)
```css
/* Spacing Units */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Component Spacing
```css
/* Common Patterns */
--card-padding: 1.5rem;        /* 24px */
--button-padding-x: 1rem;      /* 16px */
--button-padding-y: 0.5rem;    /* 8px */
--input-padding: 0.75rem;      /* 12px */
--section-margin: 2rem;        /* 32px */
```

## Border Radius

### Radius Scale
```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Modal corners */
--radius-full: 9999px;  /* Full rounded */
```

## Shadows

### Shadow Definitions
```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Colored Shadows */
--shadow-green: 0 4px 14px 0 rgb(16 185 129 / 0.15);
--shadow-blue: 0 4px 14px 0 rgb(59 130 246 / 0.15);
```

## Component Patterns

### Button Variants
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--health-primary), var(--health-secondary));
  color: white;
  border-radius: var(--radius-lg);
  padding: var(--button-padding-y) var(--button-padding-x);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-green);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--health-primary);
  border: 1px solid var(--health-primary);
  border-radius: var(--radius-lg);
}

/* Outline Button */
.btn-outline {
  background: transparent;
  border: 1px solid var(--health-text-muted);
  color: var(--health-text-primary);
}
```

### Card Styles
```css
/* Standard Card */
.card {
  background: var(--health-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid #e5e7eb;
  padding: var(--card-padding);
}

/* Elevated Card */
.card-elevated {
  background: var(--health-bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  border: none;
}

/* Meal Card */
.meal-card {
  background: var(--health-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.meal-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Input Styles
```css
/* Standard Input */
.input {
  border: 1px solid #d1d5db;
  border-radius: var(--radius-lg);
  padding: var(--input-padding);
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: var(--health-primary);
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.1);
}
```

## Animation & Transitions

### Transition Durations
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Progress Ring Animation */
@keyframes progressRing {
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: calc(283 - (283 * var(--progress)) / 100); }
}
```

## RTL (Right-to-Left) Support

### RTL-Specific Adjustments
```css
/* Direction-aware spacing */
[dir="rtl"] .mr-4 { margin-right: 0; margin-left: 1rem; }
[dir="rtl"] .ml-4 { margin-left: 0; margin-right: 1rem; }

/* Icon positioning */
[dir="rtl"] .icon-left { transform: scaleX(-1); }
[dir="rtl"] .icon-right { order: -1; }

/* Text alignment */
[dir="rtl"] .text-left { text-align: right; }
[dir="rtl"] .text-right { text-align: left; }
```

## Responsive Breakpoints

### Breakpoint System
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

### Responsive Patterns
```css
/* Mobile-first grid */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Component Library (React Native Adaptations)

### Native Component Mapping
```typescript
// Color system for React Native
export const colors = {
  primary: '#10b981',
  secondary: '#059669',
  background: '#ffffff',
  surface: '#f9fafb',
  text: '#111827',
  textSecondary: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Typography scale
export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '600', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## Icon System

### Icon Library
- **Web:** Lucide React icons
- **Mobile:** React Native Vector Icons (with Lucide compatibility)

### Common Icons
```typescript
// Core app icons
export const icons = {
  home: 'home',
  mealPlan: 'utensils',
  exercise: 'dumbbell',
  profile: 'user',
  calendar: 'calendar',
  clock: 'clock',
  heart: 'heart',
  star: 'star',
  check: 'check',
  plus: 'plus',
  settings: 'settings',
  logout: 'log-out',
};
```

## Accessibility

### Color Contrast Requirements
- **AA Standard:** 4.5:1 for normal text
- **AAA Standard:** 7:1 for normal text
- **Large Text:** 3:1 minimum ratio

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--health-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support
- Semantic HTML elements
- ARIA labels for interactive elements
- Alt text for images
- Proper heading hierarchy
