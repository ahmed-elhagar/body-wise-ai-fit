
# FitFatta Component Library Documentation

## Overview
This document provides a comprehensive guide to all reusable components in the FitFatta application, organized by feature area.

## Base UI Components (Shadcn/UI)

### Button Components
- `Button` - Primary action button with variants
- `ProMemberBadge` - Premium membership indicator
- `Badge` - Status and category indicators

### Form Components
- `Input` - Text input with validation
- `Select` - Dropdown selection
- `Checkbox` - Boolean input
- `RadioGroup` - Single selection from options
- `Slider` - Range value selection
- `Switch` - Toggle control

### Layout Components
- `Card` - Content container with shadow
- `Tabs` - Tabbed content organization
- `Dialog` - Modal popup container
- `Sidebar` - Navigation sidebar
- `Accordion` - Collapsible content sections

### Data Display
- `Table` - Structured data display
- `Avatar` - User profile image
- `Progress` - Progress bar indicator
- `Tooltip` - Contextual information
- `Alert` - Important messages

## Application-Specific Components

### Dashboard Components

#### `DashboardWelcomeHeader`
**Purpose**: Main dashboard greeting and quick actions
**Props**:
```typescript
interface DashboardWelcomeHeaderProps {
  userName: string;
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}
```
**Usage**: Displays personalized welcome message with navigation shortcuts

#### `EnhancedStatsGrid`
**Purpose**: Key metrics display with visual indicators
**Features**:
- Responsive grid layout
- Animated counters
- Color-coded status indicators
- Click-to-navigate functionality

#### `InteractiveProgressChart`
**Purpose**: Multi-metric data visualization
**Features**:
- Chart type switching (line, bar, area)
- Time range selection (week, month, year)
- Real-time data updates
- Export functionality

#### `WeightTrackingWidget`
**Purpose**: Weight progress monitoring
**Features**:
- Weight entry form
- Historical trend chart
- Goal progress indicator
- BMI calculation

#### `GoalProgressWidget`
**Purpose**: Goal achievement tracking
**Features**:
- Multiple goal support
- Progress visualization
- Milestone celebrations
- Achievement badges

### Meal Plan Components

#### `MealCard`
**Purpose**: Individual meal display with actions
**Props**:
```typescript
interface MealCardProps {
  meal: Meal;
  onExchange: (meal: Meal) => void;
  onViewRecipe: (meal: Meal) => void;
  onAddToShoppingList: (meal: Meal) => void;
}
```
**Features**:
- Meal image display
- Nutrition information
- Action buttons (exchange, recipe, add to list)
- Loading states

#### `MealPlanAIDialog`
**Purpose**: AI meal plan generation interface
**Features**:
- Step-by-step generation process
- Progress indicators
- Preference selection
- Error handling with retry

#### `MealExchangeDialog`
**Purpose**: Meal substitution system
**Features**:
- Alternative meal suggestions
- Nutrition comparison
- Dietary restriction filtering
- Quick selection

#### `ShoppingListDialog`
**Purpose**: Grocery list management
**Features**:
- Ingredient aggregation
- Quantity calculations
- Category organization
- Export options

### Exercise Components

#### `ExerciseCard`
**Purpose**: Individual exercise display
**Props**:
```typescript
interface ExerciseCardProps {
  exercise: Exercise;
  onStartWorkout: (exercise: Exercise) => void;
  onViewInstructions: (exercise: Exercise) => void;
  onMarkComplete: (exercise: Exercise) => void;
}
```
**Features**:
- Exercise demonstration
- Difficulty indicators
- Progress tracking
- Video integration

#### `WorkoutSession`
**Purpose**: Active workout tracking
**Features**:
- Real-time timer
- Set and rep tracking
- Rest period management
- Progress saving

#### `ExerciseProgressTracker`
**Purpose**: Performance monitoring
**Features**:
- Personal record tracking
- Progress charts
- Achievement badges
- Comparison analytics

### Profile Components

#### `ProfileCompletionBanner`
**Purpose**: Onboarding progress indicator
**Features**:
- Completion percentage
- Missing field highlights
- Quick completion actions
- Dismissible when complete

#### `BasicInfoCard`
**Purpose**: Personal information management
**Features**:
- Editable form fields
- Validation messages
- Image upload
- Save/cancel actions

#### `HealthGoalsCard`
**Purpose**: Fitness goal configuration
**Features**:
- Goal type selection
- Target value inputs
- Timeline setting
- Progress tracking

### Chat Components

#### `AIChatInterface`
**Purpose**: AI assistant conversation
**Features**:
- Message history
- Typing indicators
- Quick reply suggestions
- Context awareness

#### `ChatMessage`
**Purpose**: Individual message display
**Props**:
```typescript
interface ChatMessageProps {
  message: ChatMessage;
  isUser: boolean;
  timestamp: Date;
  onReact?: (reaction: string) => void;
}
```
**Features**:
- Message formatting
- Timestamp display
- Reaction buttons
- Copy functionality

### Admin Components

#### `UsersTable`
**Purpose**: User management interface
**Features**:
- Searchable user list
- Role management
- Status indicators
- Bulk actions

#### `AnalyticsTab`
**Purpose**: System analytics dashboard
**Features**:
- Usage metrics
- Performance charts
- Export capabilities
- Real-time updates

### Coach Components

#### `TraineesTab`
**Purpose**: Trainee management interface
**Features**:
- Trainee overview cards
- Progress monitoring
- Communication tools
- Task assignment

#### `CoachTasksPanel`
**Purpose**: Task management system
**Features**:
- Task creation
- Priority indicators
- Due date tracking
- Completion status

## Loading Components

### `SimpleLoadingIndicator`
**Purpose**: Basic loading feedback
**Props**:
```typescript
interface SimpleLoadingIndicatorProps {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

### `EnhancedPageLoading`
**Purpose**: Full-page loading with progress
**Features**:
- Estimated time display
- Step-by-step progress
- Cancellation option
- Motivation messages

### `UnifiedAILoadingDialog`
**Purpose**: AI operation progress tracking
**Features**:
- Multi-step progress
- Current operation display
- Time estimation
- Error recovery

## Error Components

### `ErrorBoundary`
**Purpose**: Component error catching
**Features**:
- Error display
- Retry functionality
- Error reporting
- Graceful fallback

### `ErrorFallback`
**Purpose**: Custom error display
**Props**:
```typescript
interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}
```

## Navigation Components

### `AppSidebar`
**Purpose**: Main navigation sidebar
**Features**:
- Collapsible design
- Active state indicators
- Role-based menu items
- Search functionality

### `SidebarMainNavigation`
**Purpose**: Primary navigation menu
**Features**:
- Icon-based navigation
- RTL support
- Tooltip integration
- Active state tracking

## Form Components

### `TagsAutocomplete`
**Purpose**: Multi-select tag input
**Features**:
- Autocomplete suggestions
- Custom tag creation
- Validation support
- Accessibility features

### `HealthConditionsAutocomplete`
**Purpose**: Medical condition selection
**Features**:
- Medical term suggestions
- Multiple selections
- Clear descriptions
- Safety warnings

## Utility Components

### `LanguageToggle`
**Purpose**: Language switching interface
**Features**:
- Current language display
- Smooth transitions
- RTL layout switching
- Loading states

### `ProtectedRoute`
**Purpose**: Route access control
**Props**:
```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireRole?: string | string[];
  redirectTo?: string;
}
```

## Component Usage Guidelines

### Best Practices
1. **Props Interface**: Always define TypeScript interfaces for props
2. **Default Props**: Provide sensible defaults for optional props
3. **Error Handling**: Include error states and loading states
4. **Accessibility**: Implement ARIA labels and keyboard navigation
5. **Responsive Design**: Ensure mobile-first responsive behavior

### Styling Guidelines
1. **Tailwind Classes**: Use utility classes for styling
2. **Design System**: Follow established color and spacing tokens
3. **RTL Support**: Include RTL-aware styling
4. **Dark Mode**: Prepare for future dark mode support

### Performance Considerations
1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Implement code splitting where appropriate
3. **Virtual Scrolling**: Use for large lists
4. **Image Optimization**: Implement lazy loading for images

This component library documentation ensures consistent usage and development patterns across the FitFatta application.
