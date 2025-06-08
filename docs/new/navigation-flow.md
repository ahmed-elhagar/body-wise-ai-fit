
# FitFatta Navigation Flow

## App Structure Overview

### Main Navigation (Sidebar)
```
FitFatta App
├── Dashboard (/)
├── Meal Plan (/meal-plan)
├── Exercise (/exercise)
├── Profile (/profile)
└── Admin (/admin) [admin users only]
```

## Route Structure

### 1. Authentication Routes
- `/auth` - Login/Signup page
- Redirects:
  - Authenticated users → Dashboard
  - Unauthenticated users → Auth page

### 2. Main Application Routes

#### Dashboard (`/`)
**Purpose:** Overview and quick actions
**Components:**
- `DashboardStats` - Key metrics display
- `RecentActivity` - Activity feed
- `QuickActions` - Fast access buttons
- `ProfileCompletionBanner` - Onboarding progress

**Navigation Options:**
- Quick access to meal plan generation
- Exercise program shortcuts
- Profile completion prompts

#### Meal Plan (`/meal-plan`)
**Purpose:** Meal planning and nutrition management
**Components:**
- `MealPlanContainer` - Main meal plan interface
- `WeeklyNavigation` - Week selection
- `DayTabs` - Day selection
- `MealCard` - Individual meal display

**Sub-actions:**
- Generate AI meal plan (modal)
- Exchange meals (modal)
- View recipes (modal)
- Shopping list (modal)
- Add custom snacks (modal)

#### Exercise (`/exercise`)
**Purpose:** Exercise program management and tracking
**Components:**
- `ExercisePageHeader` - Program info and controls
- `ExerciseListEnhanced` - Exercise list with progress
- `CompactProgressSidebar` - Progress overview
- `WorkoutTypeTabs` - Home/Gym toggle

**Sub-actions:**
- Generate AI program (modal)
- Exchange exercises (modal)
- Track exercise progress (inline)
- View exercise details (modal)

#### Profile (`/profile`)
**Purpose:** User profile and preferences management
**Components:**
- `ProfileForm` - Basic information
- `HealthAssessment` - Health data
- `PreferencesSettings` - App preferences
- `LifePhaseSettings` - Special conditions

**Sub-sections:**
- Basic Info (age, weight, height, gender)
- Health Assessment (activity level, goals)
- Dietary Preferences (restrictions, allergies)
- Life Phase (pregnancy, breastfeeding, fasting)

#### Admin (`/admin`) [Admin Only]
**Purpose:** System administration
**Components:**
- `UserManagement` - User roles and credits
- `AIModelsTab` - AI model configuration
- `SystemMetrics` - Usage analytics

## Modal/Dialog System

### Global Modals
- `UnifiedAILoadingDialog` - AI operation progress
- `MealRecipeDialog` - Recipe viewing
- `MealExchangeDialog` - Meal exchange options
- `ShoppingListDialog` - Shopping list generation
- `AddSnackDialog` - Custom snack addition

### Navigation States
```typescript
interface NavigationState {
  currentWeekOffset: number; // Week navigation
  selectedDayNumber: number; // Day selection (1-7)
  workoutType: "home" | "gym"; // Exercise context
  showDialogs: {
    aiGeneration: boolean;
    recipe: boolean;
    exchange: boolean;
    shoppingList: boolean;
    addSnack: boolean;
  };
}
```

## Mobile Navigation Considerations

### Bottom Tab Navigation (React Native)
```
├── Dashboard (Home Icon)
├── Meal Plan (Utensils Icon)
├── Exercise (Dumbbell Icon)
└── Profile (User Icon)
```

### Stack Navigation Structure
```
App Navigator
├── Auth Stack
│   └── Login/Signup Screen
└── Main Tab Navigator
    ├── Dashboard Stack
    │   └── Dashboard Screen
    ├── Meal Plan Stack
    │   ├── Meal Plan Screen
    │   └── Recipe Detail Screen
    ├── Exercise Stack
    │   ├── Exercise Program Screen
    │   └── Exercise Detail Screen
    └── Profile Stack
        ├── Profile Screen
        ├── Health Assessment Screen
        └── Preferences Screen
```

## Deep Linking Support

### Meal Plan Deep Links
- `/meal-plan?week=0` - Current week
- `/meal-plan?week=-1` - Previous week
- `/meal-plan?week=1&day=3` - Specific week and day

### Exercise Deep Links
- `/exercise?type=home` - Home workout view
- `/exercise?type=gym` - Gym workout view
- `/exercise?week=0&day=1` - Specific workout day

## Navigation Guards

### Authentication Guard
```typescript
// All routes except /auth require authentication
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" />;
  
  return children;
};
```

### Admin Guard
```typescript
// /admin routes require admin role
const RequireAdmin = ({ children }) => {
  const { user, profile } = useAuth();
  
  if (profile?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

## Navigation Context

### Global Navigation State
```typescript
interface NavigationContext {
  // Current route info
  currentRoute: string;
  
  // Week/day navigation
  weekOffset: number;
  selectedDay: number;
  
  // Workout context
  workoutType: "home" | "gym";
  
  // Actions
  navigateToWeek: (offset: number) => void;
  selectDay: (day: number) => void;
  toggleWorkoutType: () => void;
}
```

## Responsive Navigation

### Desktop (Sidebar)
- Always visible sidebar navigation
- Main content area with modals
- Right-side panels for additional info

### Tablet (Collapsible Sidebar)
- Hamburger menu for sidebar
- Full-screen modals
- Adaptive layout based on screen size

### Mobile (Bottom Tabs)
- Bottom tab navigation
- Full-screen modal presentations
- Swipe gestures for week/day navigation
