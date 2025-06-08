
# FitFatta Technical Implementation Guide

## Architecture Overview

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** for consistent component library
- **React Router** for client-side routing
- **TanStack Query** for server state management

### Backend Infrastructure
- **Supabase** for database, authentication, and real-time features
- **Edge Functions** for AI integrations and serverless logic
- **Row Level Security (RLS)** for data protection
- **PostgreSQL** with optimized indexing

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Shadcn)
│   ├── meal-plan/       # Meal planning specific components
│   ├── exercise/        # Exercise program components
│   ├── dashboard/       # Dashboard widgets and layouts
│   ├── profile/         # User profile management
│   ├── admin/           # Admin panel components
│   ├── coach/           # Coach management system
│   ├── chat/            # AI chat interface
│   ├── food-tracker/    # Food logging components
│   └── goals/           # Goal management components
├── hooks/               # Custom React hooks for business logic
├── pages/               # Route components and page layouts
├── contexts/            # React contexts and global state
│   └── translations/    # i18n translation files
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
└── integrations/        # External service integrations
```

## State Management Strategy

### Server State (TanStack Query)
- **Caching Strategy**: Aggressive caching with smart invalidation
- **Background Refetching**: Automatic data freshness
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Centralized error management

```typescript
// Example: Meal plan data fetching
const { data: mealPlan, isLoading, refetch } = useQuery({
  queryKey: ['mealPlan', weekOffset],
  queryFn: () => fetchMealPlan(weekOffset),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Client State (React Context + useState)
- **Authentication State**: User session and profile
- **UI State**: Modal states, loading indicators
- **Language State**: i18n preferences and RTL settings

## Component Architecture

### Design Principles
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Flexible component relationships
- **Props Interface**: Clear TypeScript interfaces for all props
- **Error Boundaries**: Graceful error handling at component level

### Component Size Guidelines
- **Maximum 300 lines** per component file
- **Automatic refactoring** when components exceed limits
- **Hook extraction** for complex business logic
- **Sub-component creation** for large UI sections

### Example Component Structure
```typescript
interface ComponentProps {
  // Clear prop definitions
}

const Component = ({ ...props }: ComponentProps) => {
  // Custom hooks for business logic
  const { data, actions } = useCustomHook();
  
  // Event handlers
  const handleAction = () => { /* ... */ };
  
  // Render with clear structure
  return (
    <div className="responsive-container">
      {/* Component content */}
    </div>
  );
};
```

## Internationalization Implementation

### Translation System Architecture
```
contexts/translations/
├── en/                  # English translations
│   ├── index.ts        # Main export
│   ├── common.ts       # Common UI elements
│   ├── navigation.ts   # Navigation items
│   ├── dashboard.ts    # Dashboard content
│   ├── mealPlan.ts     # Meal planning
│   ├── exercise.ts     # Exercise content
│   ├── profile.ts      # User profile
│   └── admin.ts        # Admin panel
└── ar/                 # Arabic translations (mirrors English)
```

### RTL Implementation
- **CSS Logical Properties**: `margin-inline-start` instead of `margin-left`
- **Flexbox Direction**: Conditional `flex-row-reverse` for RTL
- **Icon Mirroring**: Automatic icon direction adjustment
- **Font Loading**: Cairo font for Arabic text

```typescript
// RTL-aware component example
const Component = () => {
  const { isRTL } = useI18n();
  
  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <span className={isRTL ? 'font-arabic' : ''}>
        {content}
      </span>
    </div>
  );
};
```

## AI Integration Architecture

### Unified AI Loading System
- **Centralized Loading Dialog**: `UnifiedAILoadingDialog`
- **Step-by-step Progress**: Visual feedback for long operations
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Credit Management**: Usage tracking and limits

### AI Operation Pattern
```typescript
const useAIOperation = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const executeAI = async (params) => {
    setIsGenerating(true);
    try {
      // Step-by-step AI operation with progress updates
      const result = await aiService.generate(params, {
        onProgress: (step) => setCurrentStep(step)
      });
      return result;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { executeAI, isGenerating, currentStep };
};
```

## Performance Optimization

### Code Splitting
- **Lazy Loading**: Route-level code splitting
- **Component Lazy Loading**: Heavy components loaded on demand
- **Bundle Analysis**: Regular bundle size monitoring

### Data Optimization
- **Query Optimization**: Efficient database queries
- **Caching Strategy**: Multi-level caching (browser, query, server)
- **Image Optimization**: WebP format and responsive images
- **Pagination**: Virtual scrolling for large lists

### Memory Management
- **Cleanup Patterns**: Proper useEffect cleanup
- **Memoization**: React.memo for expensive components
- **Query Invalidation**: Smart cache invalidation

## Error Handling Strategy

### Error Boundaries
```typescript
class ComponentErrorBoundary extends Component {
  // Catch and handle component errors
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    console.error('Component error:', error, errorInfo);
  }
}
```

### API Error Handling
- **Centralized Error Handling**: Consistent error responses
- **User-friendly Messages**: Translated error messages
- **Retry Mechanisms**: Automatic retries for transient errors
- **Fallback States**: Graceful degradation

## Security Implementation

### Authentication Flow
- **JWT Tokens**: Secure session management
- **Role-based Access**: Route and component protection
- **Session Persistence**: Secure local storage
- **Auto-logout**: Session timeout handling

### Data Validation
- **Input Sanitization**: XSS prevention
- **Type Validation**: Runtime type checking
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: API abuse prevention

## Testing Strategy

### Unit Testing
- **Hook Testing**: Custom hook behavior validation
- **Component Testing**: React Testing Library
- **Utility Testing**: Pure function testing

### Integration Testing
- **API Integration**: Service layer testing
- **User Flow Testing**: E2E scenarios
- **Error Scenario Testing**: Error handling validation

### Performance Testing
- **Load Testing**: Component rendering performance
- **Memory Leak Testing**: Memory usage monitoring
- **Bundle Size Testing**: Build output analysis

## Deployment Architecture

### Build Process
- **TypeScript Compilation**: Type checking and compilation
- **Asset Optimization**: Image and CSS optimization
- **Bundle Generation**: Optimized production builds
- **Environment Configuration**: Multi-environment support

### Hosting Infrastructure
- **Static Hosting**: Fast CDN delivery
- **Edge Functions**: Serverless API endpoints
- **Database Hosting**: Managed PostgreSQL
- **Monitoring**: Real-time performance tracking

## Development Workflow

### Code Quality
- **ESLint + Prettier**: Code formatting and linting
- **TypeScript Strict Mode**: Maximum type safety
- **Git Hooks**: Pre-commit validation
- **Code Reviews**: Mandatory review process

### Development Tools
- **Hot Reloading**: Fast development feedback
- **DevTools Integration**: React and Query DevTools
- **Debug Logging**: Comprehensive logging system
- **Error Tracking**: Production error monitoring

This technical implementation guide provides the foundation for understanding, maintaining, and extending the FitFatta platform.
