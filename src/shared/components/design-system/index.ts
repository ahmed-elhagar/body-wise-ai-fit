
/**
 * Design System Components Export
 * 
 * Centralized export of all design system components for easy importing
 */

// Core Layout Components
export { FeatureLayout, useFeatureLayout } from './FeatureLayout';
export type { FeatureLayoutProps, TabItem } from './FeatureLayout';

// Loading Components
export { 
  UniversalLoadingState,
  MealPlanLoadingState,
  ExerciseLoadingState,
  FoodTrackerLoadingState,
  ProgressLoadingState,
  DashboardLoadingState
} from './UniversalLoadingState';
export type { UniversalLoadingStateProps } from './UniversalLoadingState';

// Navigation Components
export { TabButton, TabGroup, MobileTabButton } from './TabButton';
export type { TabButtonProps, TabGroupProps } from './TabButton';

// Stats Components - Export default imports properly
export { default as GradientStatsCard } from './GradientStatsCard';
export type { GradientStatsCardProps } from './GradientStatsCard';

// Header Components
export { 
  FeatureHeader,
  WeekNavigationHeader,
  BreadcrumbHeader
} from './FeatureHeader';
export type { 
  FeatureHeaderProps,
  WeekNavigationHeaderProps,
  BreadcrumbHeaderProps
} from './FeatureHeader';

// Action Components
export { 
  ActionButton,
  GenerateButton,
  SaveButton,
  AddButton,
  EditButton,
  DeleteButton,
  RefreshButton,
  ActionButtonGroup,
  FloatingActionButton
} from './ActionButton';
export type { 
  ActionButtonProps,
  ActionButtonGroupProps,
  FloatingActionButtonProps
} from './ActionButton';

// Theme Components - Export default imports properly
export { default as ThemeSelector } from './ThemeSelector';

// Demo Component - Export default import properly
export { default as DesignSystemDemo } from './DesignSystemDemo';
