
# Component Development Guidelines

## 📏 Component Size Limits
- **Maximum 200 lines** per component file
- **Maximum 50 lines** per function
- **Extract sub-components** when approaching limits

## 🎯 Component Structure

### Standard Component Template
```tsx
// Component imports
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Type definitions
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Main component
const Component = ({ title, onAction }: ComponentProps) => {
  // State and hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // Event handlers
  const handleAction = () => {
    setIsLoading(true);
    onAction();
  };
  
  // Render
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <Button onClick={handleAction} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Action'}
      </Button>
    </div>
  );
};

export default Component;
```

## 🏗️ File Organization

### Feature-Based Structure
```
features/
├── meal-plan/
│   ├── components/
│   │   ├── MealPlanCard.tsx
│   │   ├── MealPlanForm.tsx
│   │   └── index.ts (barrel exports)
│   ├── hooks/
│   │   └── useMealPlan.ts
│   └── types/
│       └── meal-plan.types.ts
```

### Naming Conventions
- **Components**: PascalCase (`MealPlanCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useMealPlan.ts`)
- **Types**: kebab-case with .types suffix (`meal-plan.types.ts`)
- **Utils**: camelCase (`formatDate.ts`)

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```tsx
// ✅ Good: Semantic, readable classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// ❌ Avoid: Too many utility classes
<div className="flex flex-row items-center justify-between p-4 px-6 py-4 bg-white bg-opacity-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
```

### Component Variants
```tsx
// Use cn() utility for conditional classes
const buttonVariants = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-gray-800",
  danger: "bg-red-500 text-white"
};

<Button className={cn(buttonVariants.primary, isDisabled && "opacity-50")} />
```

## 🌍 Internationalization

### Text Content
```tsx
// ✅ Always use translation keys
const { t } = useI18n();
<h1>{t('dashboard.welcome')}</h1>

// ❌ Never hardcode strings
<h1>Welcome to Dashboard</h1>
```

### RTL Support
```tsx
// Use logical properties and RTL-aware classes
const { isRTL } = useI18n();
<div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
```

## 🔄 State Management

### Local State
```tsx
// Simple component state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### Server State
```tsx
// Use React Query for server data
const { data, isLoading, error } = useQuery({
  queryKey: ['meal-plan', userId],
  queryFn: () => fetchMealPlan(userId)
});
```

### Form State
```tsx
// Use React Hook Form for complex forms
const { register, handleSubmit, formState: { errors } } = useForm();
```

## 🚨 Error Handling

### Standard Error Pattern
```tsx
const Component = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleAction = async () => {
    try {
      setError(null);
      await performAction();
      toast.success(t('common.success'));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };
  
  return (
    <div>
      {error && <ErrorAlert message={error} />}
      {/* Component content */}
    </div>
  );
};
```

## 📱 Responsive Design

### Mobile-First Approach
```tsx
// Start with mobile, scale up
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

### Touch-Friendly Interfaces
```tsx
// Ensure adequate touch targets (44px minimum)
<Button className="min-h-[44px] min-w-[44px] p-3">
```

## ⚡ Performance Guidelines

### Memoization
```tsx
// Expensive calculations
const expensiveValue = useMemo(() => 
  calculateNutrition(meals), [meals]
);

// Callback functions
const handleClick = useCallback(() => {
  onAction(id);
}, [onAction, id]);
```

### Lazy Loading
```tsx
// Component lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Image lazy loading
<img loading="lazy" src={imageSrc} alt="Description" />
```

## 🧪 Testing Guidelines

### Component Testing
```tsx
describe('MealCard', () => {
  it('displays meal information correctly', () => {
    render(<MealCard meal={mockMeal} />);
    expect(screen.getByText(mockMeal.name)).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const onClick = jest.fn();
    render(<MealCard meal={mockMeal} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(mockMeal.id);
  });
});
```

## 📋 Code Review Checklist

### Before Submitting PR
- [ ] Component under 200 lines
- [ ] All strings use i18n
- [ ] Error handling implemented
- [ ] Responsive design tested
- [ ] TypeScript strict compliance
- [ ] Performance considerations addressed
- [ ] Tests written for critical functionality

### During Review
- [ ] Component purpose is clear
- [ ] Props are properly typed
- [ ] State management is appropriate
- [ ] Accessibility considerations
- [ ] Code is readable and maintainable

---
*Keep components small, focused, and maintainable*
