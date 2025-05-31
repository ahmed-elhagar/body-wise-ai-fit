
# FitFatta AI - Refactoring Rules & Guidelines

*Effective: 2025-05-31*

## 🎨 UI/Design Rules

### Color System
- ✅ **ALWAYS** use CSS custom properties: `hsl(var(--primary))`
- ❌ **NEVER** use inline hex colors: `#3b82f6`
- ✅ Use Tailwind color classes: `bg-primary`, `text-fitness-primary-500`
- ❌ Avoid hardcoded colors in style objects

### Component Standards
```typescript
// ✅ CORRECT: Use design tokens
<Card className="rounded-lg p-3 shadow-sm">

// ❌ WRONG: Hardcoded values
<div style={{ borderRadius: '8px', padding: '12px' }}>
```

### Button Variants
- Primary actions: `variant="default"`
- Secondary actions: `variant="outline"`
- Destructive actions: `variant="destructive"`
- Ghost buttons: `variant="ghost"`

### Spacing Scale
- Use Tailwind spacing: `p-3`, `mb-4`, `gap-6`
- Consistent card padding: `p-6` for content cards
- Consistent margins: `mb-4` between sections

## 🌍 Internationalization Rules

### String Management
```typescript
// ✅ CORRECT: Use translation keys
const { t } = useI18n();
<h1>{t('dashboard:welcomeMessage')}</h1>

// ❌ WRONG: Hardcoded strings
<h1>Welcome to FitFatta</h1>
```

### Translation Structure
- Feature-based namespaces: `mealPlan:generateButton`
- Nested keys for related content: `profile.form.firstName`
- Consistent key naming: camelCase

### Missing Translation Handling
```typescript
// ✅ CORRECT: Fallback pattern
const safeTranslate = (key: string, fallback: string) => {
  const translation = t(key);
  return translation === key ? fallback : translation;
};
```

### Pre-commit Requirements
- Run `npm run i18n:extract` before commits
- Verify all new strings have translations
- Test in both EN and AR locales

## 🔄 RTL/LTR Layout Rules

### CSS Logical Properties
```css
/* ✅ CORRECT: Logical properties */
margin-inline-start: 1rem;
padding-inline: 1rem;
border-inline-end: 1px solid;

/* ❌ WRONG: Physical properties */
margin-left: 1rem;
padding-left: 1rem;
border-right: 1px solid;
```

### Component RTL Support
```typescript
// ✅ CORRECT: RTL-aware components
const { isRTL } = useI18n();
<div className={cn(
  "flex items-center gap-3",
  isRTL && "flex-row-reverse"
)}>
```

### Testing Requirements
- Visual testing in both EN (LTR) and AR (RTL)
- Verify text alignment and icon positioning
- Check sidebar and modal positioning

## 🏗️ Modularization Rules

### Component Size Limits
- **Maximum 200 lines** per component file
- **Maximum 50 lines** per function
- Extract sub-components when approaching limits

### File Organization
```
components/
├── feature-name/
│   ├── FeatureMain.tsx      # Main component
│   ├── FeatureCard.tsx      # Sub-components
│   ├── FeatureDialog.tsx
│   └── hooks/               # Feature-specific hooks
│       └── useFeature.ts
```

### Cross-Feature Communication
```typescript
// ✅ CORRECT: Use shared hooks
const { data } = useMealPlan();

// ❌ WRONG: Direct component imports
import { MealPlanData } from '../meal-plan/MealPlanComponent';
```

### Shared Logic Rules
- Business logic: Extract to `/hooks/`
- Utilities: Place in `/utils/`
- Types: Define in `/types/`
- No direct cross-imports between feature folders

## 🧪 Testing Requirements

### Component Testing
```typescript
// ✅ REQUIRED: Test public API
describe('MealCard', () => {
  it('displays meal information correctly', () => {
    render(<MealCard meal={mockMeal} />);
    expect(screen.getByText(mockMeal.name)).toBeInTheDocument();
  });
});
```

### E2E Testing
- Critical paths must have Playwright coverage
- Authentication flows
- AI generation workflows
- Payment processing

### Coverage Requirements
- Minimum 70% line coverage for new components
- 90% coverage for utility functions
- All custom hooks must have tests

## ⚡ Performance Rules

### Bundle Size Limits
- **First load**: ≤ 2MB gzipped
- **Route chunks**: ≤ 500KB each
- Run `vite build --analyze` before major releases

### Optimization Guidelines
```typescript
// ✅ CORRECT: Lazy loading
const MealPlan = lazy(() => import('./pages/MealPlan'));

// ✅ CORRECT: Memoization for expensive operations
const expensiveCalculation = useMemo(() => 
  calculateNutrition(meals), [meals]
);
```

### Image Optimization
- Use WebP format when possible
- Implement lazy loading for non-critical images
- Compress images to ≤ 200KB

## 🚦 CI/CD Gates

### Pre-merge Requirements
1. All tests pass: `npm run test`
2. No TypeScript errors: `npm run type-check`
3. Linting passes: `npm run lint`
4. Build succeeds: `npm run build`
5. E2E tests pass: `npm run test:e2e`

### Commit Guidelines
```
feat(meal-plan): add AI recipe generation
fix(sidebar): resolve RTL layout overlapping
docs(readme): update installation instructions
refactor(profile): extract form components
```

### Breaking Changes
- Increment major version
- Update CHANGELOG.md
- Notify team in #engineering channel

## 🗄️ Database Rules

### Schema Changes
- **ALWAYS** use Supabase migrations: `/supabase/migrations/`
- **NEVER** modify schema directly in SQL editor
- Include rollback instructions in migration comments

### RLS Policies
```sql
-- ✅ CORRECT: Specific, secure policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- ❌ WRONG: Overly broad permissions
CREATE POLICY "Allow all" ON profiles FOR ALL USING (true);
```

### Query Optimization
- Use indexes for frequently queried columns
- Limit result sets with pagination
- Avoid N+1 queries with proper joins

## 📏 Code Quality Gates

### TypeScript Rules
- Strict mode enabled
- No `any` types without justification
- All props interfaces exported
- Use discriminated unions for complex state

### Error Handling
```typescript
// ✅ CORRECT: Consistent error patterns
try {
  await generateMealPlan();
  toast.success(t('common:success'));
} catch (error) {
  console.error('Meal plan generation failed:', error);
  toast.error(t('common:error'));
}
```

### Security Guidelines
- Validate all user inputs
- Sanitize data before database operations
- Use RLS policies for data access control
- Never expose API keys in client code

## 🔧 Refactoring Triggers

### When to Refactor
- Component exceeds 200 lines
- Function exceeds 50 lines
- Cyclomatic complexity > 10
- Code duplication across 3+ files

### Refactoring Process
1. Write tests for existing behavior
2. Extract smaller components/functions
3. Verify tests still pass
4. Update documentation
5. Create PR with clear description

## 📋 Review Checklist

Before merging any PR, verify:
- [ ] All strings use i18n translations
- [ ] RTL layout tested and working
- [ ] Component size within limits
- [ ] Tests added for new functionality
- [ ] Bundle size impact assessed
- [ ] Database changes use migrations
- [ ] Error handling implemented
- [ ] Performance impact considered

## 🚨 Emergency Protocols

### Production Issues
1. Immediate rollback if breaking
2. Hotfix branch from last stable
3. Minimal changes to fix issue
4. Full regression testing post-fix

### Breaking Changes
1. Create feature flag for gradual rollout
2. Maintain backward compatibility for 1 release
3. Clear migration guide for users
4. Monitor error rates closely

---

**Remember**: These rules exist to prevent the pain points we've experienced. Following them religiously will save hours of debugging and maintain our code quality as we scale.
