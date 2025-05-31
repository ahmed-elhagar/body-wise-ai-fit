
# FitFatta AI - Current Project State

*Generated: 2025-05-31*

## 1. File & Folder Tree

```
/src
├── components/           # UI Components (200+ files)
│   ├── ui/              # Shadcn/UI base components
│   ├── auth/            # Authentication forms & flows
│   ├── dashboard/       # Dashboard widgets & stats
│   ├── meal-plan/       # Meal planning components
│   ├── exercise/        # Exercise program components
│   ├── profile/         # User profile management
│   ├── food-tracker/    # Food consumption tracking
│   ├── admin/           # Admin panel components
│   └── AppSidebar.tsx   # Main navigation sidebar (315 lines - NEEDS REFACTOR)
├── hooks/               # Custom React hooks
├── pages/               # Page components (routing)
├── contexts/            # React contexts (Auth, Language)
├── i18n/               # Internationalization
│   ├── config.ts       # i18next configuration
│   └── locales/        # Translation files (en/ar)
├── integrations/       # External service integrations
│   └── supabase/       # Database client & types
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Core libraries & configurations
```

## 2. Database Schema (Supabase)

### Core Tables
- **profiles** - User profiles with fitness data, preferences
- **weekly_meal_plans** - AI-generated meal plans by week
- **daily_meals** - Individual meals with nutrition data
- **weekly_exercise_programs** - AI-generated exercise programs
- **daily_workouts** - Individual workout sessions
- **exercises** - Exercise details with sets/reps
- **food_items** - Food database with nutrition facts
- **food_consumption_log** - User food intake tracking
- **user_goals** - Fitness goals and progress tracking
- **weight_entries** - Body weight tracking
- **subscriptions** - Pro subscription management
- **ai_generation_logs** - AI usage tracking and limits

### Key Functions
- `check_and_use_ai_generation()` - Credit system management
- `calculate_profile_completion_score()` - Profile progress tracking
- `search_food_items()` - Food database search with similarity
- `get_current_exercise_program()` - Active program retrieval

### RLS Policies
⚠️ **CRITICAL ISSUE**: Most tables have RLS enabled but NO policies defined, causing data visibility issues.

## 3. Feature Inventory

| Route | Status | Key Components | Notes |
|-------|--------|----------------|-------|
| `/` | ✅ Complete | Index, Landing | Authentication redirect |
| `/auth` | ✅ Complete | AuthForm, AuthHeader | Email/password login |
| `/dashboard` | ✅ Complete | DashboardStats, QuickActions | Main hub |
| `/meal-plan` | ✅ Complete | MealPlanPage, AIDialog | AI generation working |
| `/exercise` | ✅ Complete | ExerciseProgramPage | AI generation working |
| `/food-tracker` | ✅ Complete | FoodTracker, PhotoAnalyzer | AI food analysis |
| `/profile` | 🟡 Partial | ProfileTabs, HealthAssessment | Completion tracking |
| `/goals` | 🟡 Partial | GoalCards, ProgressBadges | Basic functionality |
| `/admin` | ✅ Complete | AdminDashboard, UsersTable | Role-based access |
| `/pro` | 🟡 Partial | Subscription, Stripe | Payment integration |

## 4. i18n Coverage

### Namespaces
- **common** (90%) - Basic app strings
- **navigation** (95%) - Menu items, routes
- **dashboard** (85%) - Dashboard content
- **mealPlan** (80%) - Meal planning features
- **exercise** (75%) - Exercise content
- **profile** (70%) - Profile forms

### Missing Keys
⚠️ Several components use hardcoded strings instead of translations:
- Exercise exchange dialogs
- Error messages in hooks
- Toast notifications
- Loading states

## 5. Styling Sources

### Theme System
- **CSS Variables** - HSL color tokens in `:root`
- **Tailwind Config** - Custom color extensions, fitness theme
- **Component Variants** - CVA for button/card states
- **RTL Support** - Arabic font (Cairo), direction utilities

### Color Tokens
```css
--primary: 222.2 47.4% 11.2%
--fitness-primary-500: #3b82f6 (Blue)
--sidebar-background: Dynamic light/dark
```

### Issues
- Some components use hardcoded colors
- Inconsistent spacing (mix of Tailwind classes and custom values)
- RTL layout gaps in sidebar positioning

## 6. Known Pain Points

### Critical Issues
1. **Sidebar Layout** - Overlapping content, RTL positioning bugs
2. **RLS Policies** - Missing policies causing data access issues
3. **Bundle Size** - Large component files (AppSidebar: 315 lines)
4. **i18n Gaps** - Hardcoded strings breaking translations

### Technical Debt
- Tightly coupled meal plan logic
- Large, monolithic components
- Inconsistent error handling
- Missing test coverage for critical paths

### Performance Issues
- Large initial bundle size
- Inefficient re-renders in meal plan components
- Unoptimized image loading

## 7. Pipeline Overview

### Build & Deploy
- **Vite** - Development server and build tool
- **PWA Plugin** - Service worker and caching
- **Bundle Splitting** - Manual chunks for optimization

### Testing
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing (limited coverage)

### Integrations
- **Supabase** - Database, auth, edge functions
- **PostHog** - Analytics and feature flags
- **Stripe** - Payment processing
- **OpenAI** - AI meal/exercise generation

### CI/CD
- **GitHub Actions** - Automated testing
- **Lovable Platform** - Deployment pipeline

## 8. Immediate Action Items

### High Priority
1. Fix RLS policies for data visibility
2. Refactor AppSidebar.tsx (315 lines → multiple components)
3. Add missing i18n keys for all hardcoded strings
4. Resolve sidebar layout overlapping issues

### Medium Priority
1. Add comprehensive test coverage
2. Optimize bundle size and performance
3. Standardize error handling patterns
4. Improve RTL layout consistency

### Low Priority
1. Enhance admin panel features
2. Add more comprehensive analytics
3. Implement progressive loading strategies
