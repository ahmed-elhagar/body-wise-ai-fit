# FitFatta Localization Guide

## Overview
FitFatta supports full internationalization (i18n) with English and Arabic languages, including complete RTL (Right-to-Left) layout support.

## Supported Languages
- **English (en)** - Default language, LTR layout
- **Arabic (ar)** - RTL layout with Cairo font family

## Architecture

### Core System
- **Framework**: React i18next
- **Configuration**: `src/i18n/config.ts`
- **Main Hook**: `src/hooks/useI18n.ts`
- **Language Toggle**: `src/components/LanguageToggle.tsx`

### Translation Structure
```
src/contexts/translations/
├── en/                    # English translations
│   ├── index.ts          # Main export
│   ├── common.ts         # Common UI elements
│   ├── navigation.ts     # Navigation items
│   ├── dashboard.ts      # Dashboard content
│   ├── mealPlan.ts       # Meal planning
│   ├── exercise.ts       # Exercise content
│   ├── profile.ts        # User profile
│   └── admin.ts          # Admin panel
└── ar/                   # Arabic translations
    ├── index.ts          # Main export (mirrors English)
    ├── common.ts         # Common UI elements
    ├── navigation.ts     # Navigation items
    ├── dashboard.ts      # Dashboard content
    ├── mealPlan.ts       # Meal planning
    ├── exercise.ts       # Exercise content
    ├── profile.ts        # User profile
    └── admin.ts          # Admin panel
```

## Usage

### Basic Translation
```typescript
import { useI18n } from '@/hooks/useI18n';

const MyComponent = () => {
  const { t, isRTL } = useI18n();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      {t('common:save')}
    </div>
  );
};
```

### Namespaced Translation
```typescript
const { tFrom } = useI18n();
const tDashboard = tFrom('dashboard');

// Usage: tDashboard('title') -> dashboard:title
```

### RTL Layout Support
```typescript
const { isRTL } = useI18n();

return (
  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
    <span className={isRTL ? 'font-arabic' : ''}>
      {content}
    </span>
  </div>
);
```

## RTL Implementation

### CSS Classes
- `.font-arabic` - Applied automatically for Arabic text
- `[dir="rtl"]` - Automatic direction attribute
- Logical properties used throughout (margin-inline-start, etc.)

### Component Patterns
All components support RTL through:
1. Conditional class application based on `isRTL`
2. Flexbox direction reversal
3. Icon and spacing adjustments
4. Text alignment changes

## Adding New Translations

### 1. Add to English files
```typescript
// src/contexts/translations/en/newFeature.ts
export const newFeature = {
  title: "New Feature",
  description: "Feature description",
  actions: {
    save: "Save",
    cancel: "Cancel"
  }
} as const;
```

### 2. Add to Arabic files
```typescript
// src/contexts/translations/ar/newFeature.ts
export const newFeature = {
  title: "ميزة جديدة",
  description: "وصف الميزة",
  actions: {
    save: "حفظ",
    cancel: "إلغاء"
  }
} as const;
```

### 3. Export in index files
```typescript
// Both en/index.ts and ar/index.ts
import { newFeature } from './newFeature';

export const translations = {
  // ... existing
  newFeature
} as const;
```

## Best Practices

### Translation Keys
- Use descriptive, hierarchical keys
- Group related translations in objects
- Keep consistent structure between languages

### RTL Considerations
- Always test both languages
- Use logical CSS properties
- Consider text length differences
- Test icon positioning and spacing

### Performance
- Translations are loaded on demand
- Namespaces prevent loading unnecessary translations
- Language changes trigger page reload for consistency

## Troubleshooting

### Language Not Changing
1. Check console for errors
2. Verify localStorage is working
3. Ensure translation files are properly exported
4. Check i18n configuration

### RTL Layout Issues
1. Verify `[dir="rtl"]` attribute is set
2. Check CSS logical properties usage
3. Test flex direction reversals
4. Validate Arabic font loading

### Missing Translations
1. Check translation key exists in both languages
2. Verify namespace is loaded
3. Check for typos in key names
4. Ensure proper export structure

## Current Translation Coverage
- ✅ Navigation & UI Elements
- ✅ Dashboard & Analytics
- ✅ Meal Planning System
- ✅ Exercise Programs
- ✅ User Profile & Settings
- ✅ Admin Panel
- ✅ Authentication Forms
- ✅ Error Messages & Loading States

All major features have comprehensive Arabic translations with proper RTL layout support.
