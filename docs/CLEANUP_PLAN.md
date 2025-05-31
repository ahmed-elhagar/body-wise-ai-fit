
# FitFatta AI - Cleanup & Hardening Roadmap

*Generated: 2025-05-31*

## Overview

This roadmap addresses critical issues identified in the current state analysis and aligns the codebase with our refactor rules. The plan is divided into three phases based on priority and impact.

## 🚨 Phase 1: Critical Fixes (Estimated: 3-4 weeks)

### Database & Security
- **P1-DB-001**: Fix missing RLS policies for data visibility
  - **Owner**: DBA
  - **Files**: All tables in Supabase
  - **Effort**: 2 days
  - **Acceptance**: All tables have proper SELECT/INSERT/UPDATE/DELETE policies

- **P1-DB-002**: Create security definer functions to prevent RLS recursion
  - **Owner**: DBA
  - **Files**: New SQL functions
  - **Effort**: 1 day
  - **Acceptance**: No infinite recursion errors in policies

### UI Layout & Critical Bugs
- **P1-UI-001**: Fix sidebar overlapping content issue
  - **Owner**: Frontend Dev
  - **Files**: `src/components/Layout.tsx`, `src/components/AppSidebar.tsx`
  - **Effort**: 1 day
  - **Acceptance**: Sidebar properly positioned, content not hidden

- **P1-UI-002**: Refactor AppSidebar.tsx (315 lines → <200 lines)
  - **Owner**: Frontend Dev
  - **Files**: `src/components/AppSidebar.tsx` → multiple components
  - **Effort**: 3 days
  - **Acceptance**: Max 200 lines per component, same functionality

- **P1-UI-003**: Fix RTL layout positioning bugs
  - **Owner**: Frontend Dev
  - **Files**: `src/components/AppSidebar.tsx`, `src/index.css`
  - **Effort**: 2 days
  - **Acceptance**: Perfect RTL positioning in AR locale

### Internationalization
- **P1-I18N-001**: Replace all hardcoded strings with translation keys
  - **Owner**: Frontend Dev
  - **Files**: Exercise dialogs, error messages, toast notifications
  - **Effort**: 4 days
  - **Acceptance**: No hardcoded strings, all use t() function

- **P1-I18N-002**: Add missing translation keys for loading states
  - **Owner**: Frontend Dev
  - **Files**: All components with loading states
  - **Effort**: 2 days
  - **Acceptance**: All loading text uses translation keys

### Large Component Refactoring
- **P1-MOD-001**: Refactor CompactSettingsForm.tsx (285 lines → <200 lines)
  - **Owner**: Frontend Dev
  - **Files**: `src/components/profile/enhanced/CompactSettingsForm.tsx`
  - **Effort**: 2 days
  - **Acceptance**: Extract sub-components, maintain functionality

## ⚡ Phase 2: Performance & Structure (Estimated: 2-3 weeks)

### Bundle Optimization
- **P2-PERF-001**: Implement code splitting for large routes
  - **Owner**: Frontend Dev
  - **Files**: Route components, lazy loading setup
  - **Effort**: 3 days
  - **Acceptance**: First load ≤ 2MB gzipped

- **P2-PERF-002**: Optimize component re-renders in meal plan
  - **Owner**: Frontend Dev
  - **Files**: Meal plan components
  - **Effort**: 2 days
  - **Acceptance**: Reduced unnecessary re-renders by 50%

- **P2-PERF-003**: Implement image lazy loading
  - **Owner**: Frontend Dev
  - **Files**: All image components
  - **Effort**: 1 day
  - **Acceptance**: Non-critical images load lazily

### Testing Infrastructure
- **P2-TEST-001**: Add unit tests for critical hooks
  - **Owner**: Frontend Dev
  - **Files**: All custom hooks in `/src/hooks/`
  - **Effort**: 5 days
  - **Acceptance**: 70% coverage for utility functions

- **P2-TEST-002**: Expand E2E test coverage
  - **Owner**: QA/Frontend Dev
  - **Files**: Playwright tests
  - **Effort**: 4 days
  - **Acceptance**: Critical user flows covered

### Modularization
- **P2-MOD-001**: Extract shared business logic to hooks
  - **Owner**: Frontend Dev
  - **Files**: Cross-feature shared logic
  - **Effort**: 3 days
  - **Acceptance**: No direct cross-imports between features

- **P2-MOD-002**: Standardize error handling patterns
  - **Owner**: Frontend Dev
  - **Files**: All error handling code
  - **Effort**: 2 days
  - **Acceptance**: Consistent error handling across app

### UI Consistency
- **P2-UI-001**: Standardize color usage (remove hardcoded colors)
  - **Owner**: Frontend Dev
  - **Files**: All components with hardcoded colors
  - **Effort**: 2 days
  - **Acceptance**: Only CSS custom properties used

- **P2-UI-002**: Implement consistent spacing scale
  - **Owner**: Frontend Dev
  - **Files**: Components with custom spacing
  - **Effort**: 1 day
  - **Acceptance**: Only Tailwind spacing classes used

## 🎯 Phase 3: Polish & Tech Debt (Estimated: 1-2 weeks)

### Advanced Features
- **P3-FEAT-001**: Enhance admin panel capabilities
  - **Owner**: Frontend Dev
  - **Files**: Admin components
  - **Effort**: 3 days
  - **Acceptance**: Feature-complete admin experience

- **P3-FEAT-002**: Implement progressive loading strategies
  - **Owner**: Frontend Dev
  - **Files**: Data loading components
  - **Effort**: 2 days
  - **Acceptance**: Smooth loading experiences

### Documentation & Developer Experience
- **P3-DOC-001**: Add comprehensive component documentation
  - **Owner**: Frontend Dev
  - **Files**: All major components
  - **Effort**: 2 days
  - **Acceptance**: JSDoc comments for all public APIs

- **P3-DOC-002**: Create component usage examples
  - **Owner**: Frontend Dev
  - **Files**: Documentation files
  - **Effort**: 1 day
  - **Acceptance**: Usage examples for complex components

### Analytics & Monitoring
- **P3-ANALYTICS-001**: Enhance PostHog event tracking
  - **Owner**: Frontend Dev
  - **Files**: Analytics integration
  - **Effort**: 2 days
  - **Acceptance**: Comprehensive user journey tracking

## Dead Code Elimination Targets

Based on static analysis, the following files/patterns should be reviewed for removal:
- Unused import statements across components
- Deprecated utility functions
- Commented-out code blocks
- Unused CSS classes in Tailwind
- Obsolete component variants

## Success Criteria

### Phase 1 Complete When:
- [ ] All RLS policies implemented and working
- [ ] Sidebar layout issues completely resolved
- [ ] No hardcoded strings remain in codebase
- [ ] All large components under 200 lines
- [ ] RTL layout works perfectly

### Phase 2 Complete When:
- [ ] Bundle size under 2MB gzipped
- [ ] 70% test coverage achieved
- [ ] No cross-feature direct imports
- [ ] Consistent error handling patterns
- [ ] Only design tokens used for styling

### Phase 3 Complete When:
- [ ] All components documented
- [ ] Progressive loading implemented
- [ ] Enhanced analytics tracking
- [ ] Zero dead code remaining
- [ ] Performance benchmarks met

## Risk Mitigation

### High-Risk Tasks
- **Database RLS Changes**: Test thoroughly in staging first
- **Sidebar Refactoring**: Maintain exact functionality during split
- **I18n Updates**: Ensure no translation keys are broken

### Rollback Plans
- Each phase should be deployable independently
- Feature flags for new functionality
- Database migrations should be reversible
- Component refactors should maintain public APIs

## Timeline Overview

```
Week 1-2:   Phase 1 Database & Critical UI fixes
Week 3-4:   Phase 1 I18n & Component refactoring
Week 5-6:   Phase 2 Performance & Testing
Week 7:     Phase 2 Modularization & UI consistency
Week 8-9:   Phase 3 Polish & documentation
```

## Resource Requirements

- **Frontend Developer**: Full-time for 8-9 weeks
- **DBA**: Part-time for 1 week (Phase 1)
- **QA Engineer**: Part-time for 2 weeks (Phase 2)
- **Design Review**: Ad-hoc for UI consistency validation

---

**Remember**: Each task completion should include updating the relevant documentation and running the full test suite before marking as complete.
