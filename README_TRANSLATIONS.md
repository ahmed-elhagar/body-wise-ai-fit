
# FitFatta Translation System Documentation

## **Current Status: Phase 1 Complete ✅**

### **Centralized Translation Architecture**

Our translation system is built on **i18next** with the following structure:

#### **Core Files:**
- `src/i18n/config.ts` - Main i18next configuration with RTL support
- `src/hooks/useI18n.ts` - Primary translation hook (USE THIS)
- `src/utils/translations.ts` - Helper utilities and namespace shortcuts
- `public/locales/[lang]/[namespace].json` - Translation files

#### **Supported Languages:**
- **English (en)** - Default/fallback language  
- **Arabic (ar)** - RTL support with Arabic fonts

---

## **🔧 How to Use Translations**

### **1. Primary Hook (ALWAYS USE THIS):**
```typescript
import { useI18n } from '@/hooks/useI18n';

const MyComponent = () => {
  const { t, isRTL, language } = useI18n();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h1>{t('common:welcome')}</h1>
      <p>{t('dashboard:trackProgress')}</p>
    </div>
  );
};
```

### **2. Translation Namespaces:**
```typescript
// Core namespaces (Phase 1 ✅)
t('common:save')           // Basic UI elements
t('navigation:dashboard')  // Navigation items  
t('dashboard:welcome')     // Dashboard specific
t('mealPlan:generateAIMealPlan') // Meal plan features

// Future namespaces (Phase 2-5)
t('exercise:startWorkout')
t('profile:editProfile')
t('goals:setGoal')
t('progress:weeklyStats')
```

---

## **📁 Translation Files Structure**

```
public/locales/
├── en/
│   ├── common.json      ✅ Basic UI elements
│   ├── navigation.json  ✅ Menu & navigation
│   ├── dashboard.json   ✅ Dashboard content
│   └── mealPlan.json    ✅ Meal planning
└── ar/
    ├── common.json      ✅ Arabic translations
    ├── navigation.json  ✅ Arabic navigation
    ├── dashboard.json   ✅ Arabic dashboard
    └── mealPlan.json    ✅ Arabic meal plan
```

---

## **🌍 RTL (Arabic) Support**

### **Automatic RTL Detection:**
- Direction applied to `<html dir="rtl|ltr">`
- Arabic fonts loaded via CSS classes
- Layout adjustments handled automatically

### **RTL-Aware Components:**
```typescript
const { isRTL } = useI18n();

// Flex direction
<div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>

// Text alignment  
<p className={isRTL ? 'text-right' : 'text-left'}>

// Spacing
<div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
```

---

## **📋 Phase Implementation Plan**

### **Phase 1: Core Dashboard & Navigation ✅**
- [x] Dashboard header and greetings
- [x] Navigation menu items
- [x] Common UI elements (buttons, labels)
- [x] Basic meal plan interface
- [x] Date/time formats
- [x] Quick actions

### **Phase 2: Complete Meal Planning 🔄**
- [ ] Recipe details and instructions
- [ ] Shopping lists and ingredients
- [ ] Meal exchange dialogs
- [ ] Nutrition analysis components

### **Phase 3: Exercise & Workouts**
- [ ] Exercise names and descriptions
- [ ] Workout session interface
- [ ] Progress tracking
- [ ] Timer and stopwatch

### **Phase 4: User Profile & Settings**
- [ ] Profile editing forms
- [ ] Settings and preferences
- [ ] Account management
- [ ] Privacy and security

### **Phase 5: Advanced Features**
- [ ] AI chat interface
- [ ] Coach panel
- [ ] Analytics and reports
- [ ] Notifications

---

## **🚫 Deprecated (DO NOT USE)**

- `LanguageContext` (deleted) ❌
- `useLanguage()` hook (deleted) ❌
- `translationUtils.ts` (deleted) ❌
- Any direct React Context usage ❌

---

## **⚡ Quick Migration Guide**

### **Old Pattern:**
```typescript
// ❌ DON'T USE - DELETED
import { useLanguage } from '@/contexts/LanguageContext';
const { t } = useLanguage();
```

### **New Pattern:**
```typescript
// ✅ USE THIS
import { useI18n } from '@/hooks/useI18n';
const { t } = useI18n();
```

---

## **🔍 Translation Key Naming Convention**

### **Namespace Structure:**
- **common:** Universal UI elements (save, cancel, loading, etc.)
- **navigation:** Menu items and routing  
- **dashboard:** Dashboard-specific content
- **mealPlan:** Meal planning features
- **exercise:** Workout and fitness content
- **profile:** User account and settings
- **goals:** Goal setting and tracking
- **progress:** Analytics and progress reports

### **Key Naming:**
```json
{
  "camelCase": "For simple keys",
  "nestedObject": {
    "feature": "For grouped functionality",
    "dialog": {
      "title": "For complex components"
    }
  }
}
```

---

## **🏗️ Adding New Translations**

### **1. Add to English file first:**
```json
// public/locales/en/[namespace].json
{
  "newFeature": "New Feature Text",
  "complexDialog": {
    "title": "Dialog Title",
    "subtitle": "Dialog Subtitle"
  }
}
```

### **2. Add Arabic translation:**
```json
// public/locales/ar/[namespace].json  
{
  "newFeature": "نص الميزة الجديدة",
  "complexDialog": {
    "title": "عنوان النافذة",
    "subtitle": "العنوان الفرعي"
  }
}
```

### **3. Use in component:**
```typescript
const { t } = useI18n();
<h1>{t('namespace:newFeature')}</h1>
<Dialog title={t('namespace:complexDialog.title')} />
```

---

## **📊 Current Translation Coverage**

| Component Category | Status | Coverage |
|-------------------|--------|----------|
| Dashboard | ✅ Complete | 100% |
| Navigation | ✅ Complete | 100% |
| Common UI | ✅ Complete | 100% |
| Meal Plan (Basic) | ✅ Complete | 80% |
| Exercise | 🔄 In Progress | 0% |
| Profile | ⏳ Pending | 0% |
| Goals | ⏳ Pending | 0% |
| Progress | ⏳ Pending | 0% |

**Overall Progress: Phase 1 Complete (25% of total)**

---

## **🐛 Troubleshooting**

### **Common Issues:**

1. **Missing translation keys:** Check console for warnings
2. **RTL layout broken:** Ensure `isRTL` checks in components
3. **Arabic fonts not loading:** Verify CSS classes applied
4. **Context errors:** Make sure using `useI18n` not old `useLanguage`

### **Debug Mode:**
```typescript
// Enable i18next debug mode in development
const { i18n } = useI18n();
console.log('Current language:', i18n.language);
console.log('Available namespaces:', i18n.options.ns);
```

---

## **✅ Next Steps**

1. **Continue Phase 2:** Complete meal planning translations
2. **Test RTL layouts:** Verify all components work in Arabic
3. **Add missing namespaces:** Exercise, profile, goals, progress
4. **Performance optimization:** Lazy load translation files
5. **Translation validation:** Add missing key detection in CI/CD

**Updated:** December 2024 | **Version:** 2.0 | **Status:** Phase 1 Complete
