
# FitFatta Centralized Loading System Guide

## Overview
The FitFatta app uses a comprehensive, centralized loading system that provides consistent, accessible, and visually appealing loading states across the entire application.

## Components

### 1. EnhancedLoadingIndicator
**Primary loading component with dynamic text cycling and type-specific configurations.**

```jsx
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

<EnhancedLoadingIndicator
  status="loading" // 'idle' | 'loading' | 'success' | 'error'
  type="meal-plan" // 'meal-plan' | 'exercise' | 'recipe' | 'analysis' | 'general'
  message="Custom message (optional)"
  description="Additional context"
  size="lg" // 'sm' | 'md' | 'lg'
  variant="card" // 'default' | 'card' | 'overlay' | 'inline'
  showSteps={true} // Enable step-by-step text cycling
  customSteps={['Step 1...', 'Step 2...']} // Override default steps
/>
```

### 2. AILoadingDialog
**Advanced loading dialog for AI operations with progress tracking.**

```jsx
import AILoadingDialog from "@/components/ui/ai-loading-dialog";

<AILoadingDialog
  open={true}
  status="loading"
  title="AI Processing"
  message="Current step message"
  description="Operation description"
  steps={[
    { id: "step1", label: "Analyzing", status: "completed" },
    { id: "step2", label: "Processing", status: "active" },
    { id: "step3", label: "Finalizing", status: "pending" }
  ]}
  progress={65} // 0-100
  allowClose={false}
/>
```

### 3. PageLoadingOverlay
**Full-page loading overlay for major operations.**

```jsx
import PageLoadingOverlay from "@/components/ui/page-loading-overlay";

<PageLoadingOverlay
  isLoading={true}
  type="meal-plan"
  message="Loading your data..."
  description="Please wait"
  blur={true} // Enable backdrop blur
/>
```

## Loading Types & Configurations

### Available Types
- **meal-plan**: Meal generation and planning operations
- **exercise**: Workout creation and fitness operations  
- **recipe**: Recipe generation and cooking instructions
- **analysis**: Data analysis and processing
- **general**: Default fallback for generic operations

### Type-Specific Features
Each type includes:
- **Custom icons**: Type-appropriate visual indicators
- **Dynamic text cycling**: Multi-step loading messages
- **Contextual success/error messages**: Type-specific feedback
- **Optimized timing**: Realistic step durations

## Usage Patterns

### 1. API Operations
```jsx
const [status, setStatus] = useState('idle');

const handleAPICall = async () => {
  setStatus('loading');
  try {
    await apiCall();
    setStatus('success');
  } catch (error) {
    setStatus('error');
  }
};

return (
  <EnhancedLoadingIndicator
    status={status}
    type="analysis"
    showSteps={true}
  />
);
```

### 2. AI Generation
```jsx
const [isGenerating, setIsGenerating] = useState(false);

return (
  <AILoadingDialog
    open={isGenerating}
    status="loading"
    title="Generating Meal Plan"
    type="meal-plan"
  />
);
```

### 3. Page-Level Loading
```jsx
const [isLoading, setIsLoading] = useState(true);

return (
  <>
    <PageLoadingOverlay
      isLoading={isLoading}
      type="exercise"
      message="Loading workout program..."
    />
    {/* Page content */}
  </>
);
```

## Accessibility Features

### ARIA Support
- `aria-live="polite"` for status announcements
- `aria-busy` for loading states
- `aria-label` for screen reader descriptions
- Semantic HTML structure

### Keyboard Navigation
- Focusable elements maintain proper tab order
- Skip links available for long operations
- ESC key support (where applicable)

### Visual Accessibility
- High contrast color schemes
- Clear loading indicators
- Consistent animation timing
- Reduced motion support

## Migration from Old Loaders

### Before (Custom Loader)
```jsx
<div className="loading-spinner">
  <Loader2 className="animate-spin" />
  <p>Loading...</p>
</div>
```

### After (Centralized System)
```jsx
<EnhancedLoadingIndicator
  status="loading"
  type="general"
  message="Loading..."
  variant="default"
/>
```

## Best Practices

### 1. Choose Appropriate Types
- Use `meal-plan` for food-related operations
- Use `exercise` for fitness-related operations
- Use `recipe` for cooking instructions
- Use `analysis` for data processing
- Use `general` as fallback

### 2. Provide Context
- Always include meaningful messages
- Add descriptions for complex operations
- Use `showSteps` for long-running processes

### 3. Handle States Properly
- Implement success states for user feedback
- Show error states with actionable messages
- Reset to idle state after operations

### 4. Performance Considerations
- Use `PageLoadingOverlay` sparingly
- Prefer inline variants for small operations
- Implement proper cleanup in useEffect

## Component Locations

### Updated Components
- `src/components/shopping-list/LoadingState.tsx`
- `src/components/meal-plan/MealPlanLoadingBackdrop.tsx`
- `src/components/exercise/ExerciseProgramLoadingStates.tsx`
- `src/components/add-snack/SnackGenerationProgress.tsx`
- `src/components/meal-recipe/RecipeGenerationCard.tsx`
- `src/components/add-snack/SnackGenerationSection.tsx`

### New Components
- `src/components/ui/enhanced-loading-indicator.tsx`
- `src/components/ui/page-loading-overlay.tsx`

## Future Enhancements
- Analytics integration for loading performance
- Customizable animation speeds
- Theme-aware color schemes
- Advanced progress tracking
- Offline state handling
