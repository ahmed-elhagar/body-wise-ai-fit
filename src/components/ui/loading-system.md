
# Centralized Loading System Documentation

## Overview
The FitFatta app uses a centralized loading system with two main components:
- `LoadingIndicator`: Basic loading states with variants
- `AILoadingDialog`: Advanced loading with progress and steps for AI operations

## Components

### LoadingIndicator
Basic loading component with multiple variants and status support.

```jsx
import LoadingIndicator from "@/components/ui/loading-indicator";

<LoadingIndicator
  status="loading" // 'idle' | 'loading' | 'success' | 'error'
  message="Loading..."
  description="Please wait"
  variant="card" // 'default' | 'card' | 'overlay' | 'inline'
  size="md" // 'sm' | 'md' | 'lg'
/>
```

### AILoadingDialog
Advanced loading dialog for AI operations with progress and steps.

```jsx
import AILoadingDialog from "@/components/ui/ai-loading-dialog";

<AILoadingDialog
  open={true}
  status="loading"
  title="AI Processing"
  message="Generating..."
  steps={[
    { id: "step1", label: "Analyzing", status: "completed" },
    { id: "step2", label: "Processing", status: "active" },
    { id: "step3", label: "Finalizing", status: "pending" }
  ]}
  progress={65}
  allowClose={false}
/>
```

## Hooks

### useLoadingState
Hook for managing loading states in components.

```jsx
import { useLoadingState } from "@/components/ui/loading-indicator";

const { status, message, startLoading, setSuccess, setError, reset } = useLoadingState();
```

### useAILoadingState
Advanced hook for AI operations with steps and progress.

```jsx
import useAILoadingState from "@/hooks/useAILoadingState";

const { status, progress, steps, startLoading, nextStep, setSuccess } = useAILoadingState(initialSteps);
```

## Usage Examples

### Simple Loading
```jsx
const [isLoading, setIsLoading] = useState(false);

{isLoading && (
  <LoadingIndicator
    status="loading"
    message="Loading data..."
    variant="card"
  />
)}
```

### AI Operation Loading
```jsx
const { status, progress, steps, startLoading, setSuccess } = useAILoadingState(aiSteps);

<AILoadingDialog
  open={status === 'loading'}
  status={status}
  title="AI Processing"
  steps={steps}
  progress={progress}
/>
```

## Migration Guide

### From Custom Loaders
Replace custom loading components with centralized ones:

Before:
```jsx
<div className="loading-spinner">
  <Loader2 className="animate-spin" />
  <p>Loading...</p>
</div>
```

After:
```jsx
<LoadingIndicator
  status="loading"
  message="Loading..."
  variant="default"
/>
```

### From Skeleton Loaders
Keep skeleton loaders for layout placeholders, use LoadingIndicator for data loading:

```jsx
// Layout skeleton
<Skeleton className="h-32 w-full" />

// Data loading
<LoadingIndicator status="loading" message="Loading data..." />
```

## Accessibility
- ARIA attributes included (`aria-live`, `aria-busy`)
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Best Practices
1. Use `LoadingIndicator` for simple loading states
2. Use `AILoadingDialog` for complex AI operations
3. Always provide meaningful messages
4. Use appropriate variants based on context
5. Handle error states properly
6. Maintain consistent loading behavior across the app
