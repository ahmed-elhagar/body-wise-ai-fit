
# FitFatta AI - Development Standards & Best Practices

## 🎯 Code Quality Philosophy
"Write code that tells a story, performs beautifully, and scales effortlessly."

---

## 1. COMPONENT ARCHITECTURE

### Component Size Limits
```typescript
// ✅ GOOD: Focused, single-responsibility component
const MealCard = ({ meal, onSelect }) => {
  // Maximum 150 lines including imports and exports
  // Single responsibility: Display meal information
};

// ❌ BAD: Oversized component handling multiple concerns
const MealPlanPage = () => {
  // 500+ lines handling: API calls, state management, 
  // multiple dialogs, navigation, etc.
};
```

### Component Composition Pattern
```typescript
// ✅ PREFERRED: Compose larger features from smaller components
const MealPlanContainer = () => (
  <div>
    <MealPlanHeader />
    <MealPlanNavigation />
    <MealPlanContent />
    <MealPlanActions />
  </div>
);

// Each child component handles one specific concern
```

### Hook Organization
```typescript
// ✅ GOOD: Custom hooks for business logic
const useMealPlanState = () => {
  // Handle all meal plan state logic
  // Return clean interface for components
};

// ✅ GOOD: Feature-specific hooks
const useMealPlanActions = () => {
  // Handle all meal plan actions
  // Generate, exchange, save, etc.
};
```

---

## 2. FILE STRUCTURE STANDARDS

### Feature-Based Organization (MANDATORY)
```
src/features/[feature-name]/
├── components/           # Feature-specific components
│   ├── ComponentName.tsx
│   └── index.ts         # Barrel exports (REQUIRED)
├── hooks/               # Feature-specific hooks
│   ├── useFeatureHook.ts
│   └── index.ts         # Barrel exports (REQUIRED)
├── services/            # API and business logic
├── types/               # TypeScript types
├── utils/               # Feature utilities
└── index.ts             # Main feature exports (REQUIRED)
```

### Import Rules (STRICTLY ENFORCED)
```typescript
// ✅ CORRECT: Use barrel exports
import { MealPlanContainer } from "@/features/meal-plan";
import { ExerciseProgram } from "@/features/exercise";

// ❌ FORBIDDEN: Direct component imports
import { MealPlanContainer } from "@/features/meal-plan/components/MealPlanContainer";

// ❌ FORBIDDEN: Cross-feature direct imports
import { useExerciseData } from "@/features/exercise/hooks/useExerciseData";
```

### Component Naming Convention
```typescript
// ✅ CORRECT: PascalCase with descriptive names
export const EnhancedMealCard = () => {};
export const MealPlanGenerationDialog = () => {};

// ❌ WRONG: Vague or inconsistent naming
export const Card = () => {};
export const dialog = () => {};
export const mealStuff = () => {};
```

---

## 3. TYPESCRIPT STANDARDS

### Strict Type Safety
```typescript
// ✅ REQUIRED: Strict typing, no 'any'
interface MealPlan {
  id: string;
  weekStartDate: Date;
  meals: Meal[];
  totalCalories: number;
}

// ✅ GOOD: Discriminated unions for state
type MealPlanState = 
  | { status: 'loading' }
  | { status: 'success'; data: MealPlan }
  | { status: 'error'; error: string };

// ❌ FORBIDDEN: Using 'any'
const processData = (data: any) => {
  // Never use 'any' type
};
```

### Interface Design
```typescript
// ✅ GOOD: Clear, specific interfaces
interface MealCardProps {
  meal: Meal;
  onSelect: (mealId: string) => void;
  onExchange: (mealId: string) => void;
  isSelected?: boolean;
  showNutrition?: boolean;
}

// ❌ BAD: Vague or overly generic
interface Props {
  data: any;
  callback: Function;
}
```

---

## 4. STATE MANAGEMENT PATTERNS

### React Query for Server State
```typescript
// ✅ CORRECT: Use React Query for all server operations
const useMealPlanData = (weekOffset: number) => {
  return useQuery({
    queryKey: ['mealPlan', weekOffset],
    queryFn: () => fetchMealPlan(weekOffset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Local State Guidelines
```typescript
// ✅ GOOD: Local state for UI concerns only
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

// ❌ BAD: Duplicating server state locally
const [mealPlan, setMealPlan] = useState(null); // Use React Query instead
```

### Custom Hooks for Complex Logic
```typescript
// ✅ REQUIRED: Extract complex logic to hooks
const useMealPlanNavigation = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);
  
  const navigateToWeek = useCallback((offset: number) => {
    setWeekOffset(offset);
    setSelectedDay(1); // Reset day when changing week
  }, []);
  
  return {
    weekOffset,
    selectedDay,
    navigateToWeek,
    selectDay: setSelectedDay,
  };
};
```

---

## 5. PERFORMANCE STANDARDS

### Component Optimization
```typescript
// ✅ REQUIRED: Memo for expensive components
export const MealCard = memo(({ meal, onSelect }) => {
  // Component implementation
});

// ✅ REQUIRED: useCallback for stable references
const handleMealSelect = useCallback((mealId: string) => {
  onMealSelect(mealId);
}, [onMealSelect]);

// ✅ REQUIRED: useMemo for expensive calculations
const nutritionSummary = useMemo(() => {
  return calculateNutritionSummary(meals);
}, [meals]);
```

### Bundle Size Management
```typescript
// ✅ GOOD: Lazy loading for routes
const MealPlan = lazy(() => import('@/pages/MealPlan'));

// ✅ GOOD: Dynamic imports for heavy libraries
const importChart = () => import('recharts');
```

---

## 6. ERROR HANDLING STANDARDS

### Error Boundaries
```typescript
// ✅ REQUIRED: Error boundaries for feature sections
const MealPlanErrorBoundary = ({ children }) => (
  <ErrorBoundary
    fallback={<MealPlanErrorFallback />}
    onError={(error) => logError('MealPlan', error)}
  >
    {children}
  </ErrorBoundary>
);
```

### API Error Handling
```typescript
// ✅ REQUIRED: Consistent error handling
const useMealPlanMutation = () => {
  return useMutation({
    mutationFn: generateMealPlan,
    onError: (error) => {
      logError('MealPlan Generation', error);
      toast.error(t('errors.mealPlanGeneration'));
    },
  });
};
```

---

## 7. INTERNATIONALIZATION STANDARDS

### Translation Keys
```typescript
// ✅ REQUIRED: Descriptive translation keys
t('mealPlan.generation.inProgress')
t('exercise.program.created.success')
t('profile.completion.step.basicInfo')

// ❌ FORBIDDEN: Generic keys
t('loading')
t('error')
t('success')
```

### RTL Support
```typescript
// ✅ REQUIRED: RTL-aware styling
const { isRTL } = useI18n();

const containerClass = clsx(
  'flex items-center',
  isRTL ? 'space-x-reverse' : 'space-x-4'
);
```

---

## 8. TESTING STANDARDS

### Component Testing
```typescript
// ✅ REQUIRED: Test critical user interactions
describe('MealCard', () => {
  it('should call onSelect when card is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<MealCard meal={mockMeal} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockMeal.id);
  });
});
```

### Hook Testing
```typescript
// ✅ REQUIRED: Test custom hooks
describe('useMealPlanState', () => {
  it('should update week offset correctly', () => {
    const { result } = renderHook(() => useMealPlanState());
    
    act(() => {
      result.current.navigateToWeek(1);
    });
    
    expect(result.current.weekOffset).toBe(1);
  });
});
```

---

## 9. DOCUMENTATION STANDARDS

### Component Documentation
```typescript
/**
 * MealCard displays a single meal with nutrition information and actions
 * 
 * @param meal - The meal object containing name, calories, and nutrition
 * @param onSelect - Callback fired when meal is selected
 * @param onExchange - Callback fired when exchange button is clicked
 * @param isSelected - Whether this meal is currently selected
 * @param showNutrition - Whether to display detailed nutrition info
 */
export const MealCard = ({
  meal,
  onSelect,
  onExchange,
  isSelected = false,
  showNutrition = true,
}: MealCardProps) => {
  // Implementation
};
```

### README Requirements
```markdown
# Feature Name

## Overview
Brief description of what this feature does

## Components
- ComponentName: Description
- AnotherComponent: Description

## Hooks
- useFeatureHook: Description
- useAnotherHook: Description

## Usage Example
```typescript
import { FeatureContainer } from '@/features/feature-name';

const App = () => <FeatureContainer />;
```

---

## 10. CODE REVIEW CHECKLIST

### Before Submitting PR
- [ ] Component is under 200 lines
- [ ] All strings are translated
- [ ] TypeScript strict mode passes
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Performance optimizations applied
- [ ] Tests written for critical paths
- [ ] Documentation updated

### During Review
- [ ] Code follows naming conventions
- [ ] Proper feature organization
- [ ] No direct cross-feature imports
- [ ] Appropriate abstractions used
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified

---

## AUTOMATION & ENFORCEMENT

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### ESLint Rules
```json
{
  "rules": {
    "@typescript-eslint/no-any": "error",
    "max-lines": ["error", 200],
    "complexity": ["error", 10],
    "import/no-relative-parent-imports": "error"
  }
}
```

Following these standards ensures consistent, maintainable, and scalable code across the entire FitFatta platform.
