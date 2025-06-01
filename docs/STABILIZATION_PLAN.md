
# 🔧 Project Stabilization Plan

## 📋 Current Status Summary
- **Build Status**: ❌ Failing with 20+ TypeScript errors
- **Core Features**: ⚠️ Partially functional but unstable
- **Root Cause**: Over-refactoring and missing foundation files

## 🎯 Stabilization Goals
1. ✅ Fix all TypeScript compilation errors
2. ✅ Consolidate duplicate type definitions
3. ✅ Restore missing core functionality
4. ✅ Align with React Query v5 standards
5. ✅ Remove dead code and duplicates

---

## 📝 Phase 1: Foundation Repair (Critical)

### 1.1 Missing Context & Core Files
**Priority**: 🔴 CRITICAL
- **Issue**: `@/contexts/LanguageContext` missing but referenced in 5+ files
- **Solution**: Create minimal LanguageContext or replace with existing `useI18n` hook
- **Files Affected**: 
  - `src/pages/Chat.tsx`
  - `src/pages/FoodTracker.tsx`
  - `src/pages/Progress.tsx`
  - `src/pages/WeightTracking.tsx`
  - `src/utils/exerciseTranslationUtils.ts`

### 1.2 Missing Component Exports
**Priority**: 🔴 CRITICAL
- **Issue**: Components without default exports
- **Files to Fix**:
  - `src/components/dashboard/HeaderDropdowns.tsx` - add default export
  - `src/components/progress/AchievementBadges.tsx` - add default export

---

## 📝 Phase 2: Type System Consolidation

### 2.1 Meal Type Conflicts
**Priority**: 🟠 HIGH
- **Issue**: Multiple `Meal` type definitions causing conflicts
- **Current Conflicts**:
  - `src/types/meal.ts` vs inline definitions
  - `id` property: optional vs required
  - `image` property: optional vs required
- **Solution**: 
  1. Consolidate to single `Meal` interface in `src/types/meal.ts`
  2. Make `id` required with fallback generation
  3. Make `image` optional with fallback to `image_url`

### 2.2 Hook Return Type Standardization
**Priority**: 🟠 HIGH
- **Issue**: Hooks returning different structures than expected
- **Hooks to Standardize**:
  - `useAchievements` - should return `{ earnedAchievements, checkAchievements }`
  - `useMealPlanState` - should return structured data, not raw `UseQueryResult`
  - `useExerciseProgramQuery` - missing `isRestDay` and `weekStartDate` properties

---

## 📝 Phase 3: Database Query Alignment

### 3.1 Non-existent Table References
**Priority**: 🟠 HIGH
- **Issue**: Queries to tables that don't exist in Supabase schema
- **Invalid Table References**:
  - `exercise_programs` → should use `weekly_exercise_programs`
  - `workouts` → should use `daily_workouts`
  - `meals` → should use `daily_meals`
- **Files to Update**:
  - `src/hooks/useExerciseProgramQuery.ts`
  - Related exercise hooks

### 3.2 Query Parameter Mismatches
**Priority**: 🟡 MEDIUM
- **Issue**: Functions expecting different parameter types
- **Examples**:
  - `useMealPlanData('1')` expects string but hook expects number
  - `useExerciseProgramQuery(selectedDay, workoutType)` - incorrect parameters

---

## 📝 Phase 4: React Query v5 Migration

### 4.1 Property Name Updates
**Priority**: 🟡 MEDIUM
- **Issue**: Using deprecated `isLoading` instead of `isPending`
- **Files to Update**:
  - `src/hooks/useMealRecipe.ts`
  - `src/hooks/useExerciseExchange.ts`
  - All mutation hooks

### 4.2 Query Invalidation Syntax
**Priority**: 🟡 MEDIUM
- **Issue**: Incorrect `invalidateQueries` syntax
- **Current**: `queryClient.invalidateQueries(['weekly-meal-plan'])`
- **Correct**: `queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] })`

---

## 📝 Phase 5: Component Props Alignment

### 5.1 Missing Required Props
**Priority**: 🟡 MEDIUM
- **InteractiveProgressChart**: Missing `data` prop
- **ProgressAnalytics**: Expects different props structure
- **TrendAnalysis**: Missing `data` and `title` props

### 5.2 Component Import/Export Fixes
**Priority**: 🟡 MEDIUM
- Fix import statements for components with missing exports
- Ensure consistent export patterns across components

---

## 📝 Phase 6: Dead Code Removal

### 6.1 Unused Imports & Files
**Priority**: 🟢 LOW
- Remove unused import statements
- Identify and remove unused component files
- Clean up commented-out code

### 6.2 Duplicate Functionality
**Priority**: 🟢 LOW
- Consolidate duplicate utility functions
- Remove redundant hook implementations
- Merge similar components

---

## 🗂️ Implementation Order

### Step 1: Critical Foundation (Must Do First)
1. Create/fix LanguageContext or replace with useI18n
2. Add missing default exports
3. Fix Meal type conflicts

### Step 2: Database & Hooks (Core Functionality)
1. Update table references in hooks
2. Align hook return types
3. Fix React Query v5 issues

### Step 3: Component Integration (UI Stability)
1. Fix component prop mismatches
2. Restore missing component functionality
3. Test core user flows

### Step 4: Cleanup (Polish)
1. Remove dead code
2. Consolidate duplicates
3. Final testing

---

## 🧪 Testing Strategy

### Before Each Phase:
- ✅ Document current broken functionality
- ✅ Create backup of working features

### After Each Phase:
- ✅ Verify TypeScript compilation
- ✅ Test affected user flows
- ✅ Ensure no regressions

### Final Verification:
- ✅ Full build passes
- ✅ Core features (auth, dashboard, meal planning) work
- ✅ No console errors
- ✅ Performance check

---

## 📊 Success Criteria

### Technical Metrics:
- ✅ Zero TypeScript compilation errors
- ✅ Zero console errors on page load
- ✅ All hooks return expected data structures
- ✅ All components render without crashes

### Functional Metrics:
- ✅ User can log in/out
- ✅ Dashboard displays correctly
- ✅ Meal planning features work
- ✅ Exercise program features work
- ✅ Progress tracking displays data

### Code Quality Metrics:
- ✅ No duplicate type definitions
- ✅ Consistent import/export patterns
- ✅ No unused imports or files
- ✅ Clear component hierarchy

---

## 🚨 Risk Mitigation

### High-Risk Areas:
1. **Authentication**: Don't touch auth-related code
2. **Database Schema**: No schema changes during stabilization
3. **Core UI Components**: Minimal changes to proven components

### Rollback Plan:
- Keep current working features documented
- Test each phase incrementally
- Have clear revert strategy for each step

---

## 📋 Next Steps

1. **Review this plan** with the team
2. **Approve the implementation order**
3. **Start with Phase 1** only after approval
4. **Complete each phase fully** before moving to next
5. **Test thoroughly** at each step

This plan prioritizes stability over new features and ensures we don't lose existing functionality while fixing the current issues.
