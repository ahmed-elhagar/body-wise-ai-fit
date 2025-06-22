/**
 * Universal Loading State Component
 * 
 * Branded loading states with feature-specific icons.
 * Consistent across all features, optimized for performance.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/shared/hooks/useTheme';

export interface UniversalLoadingStateProps {
  icon: React.ComponentType<{ className?: string }>;
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UniversalLoadingState: React.FC<UniversalLoadingStateProps> = ({
  icon: Icon,
  message = 'Loading...',
  subMessage = 'Please wait...',
  size = 'md',
  className = '',
}) => {
  const { classes } = useTheme();

  const sizeConfig = {
    sm: {
      card: 'p-6',
      icon: 'h-8 w-8',
      spinner: 'h-4 w-4',
      title: 'text-base',
      subtitle: 'text-xs',
      spacing: 'space-y-3',
    },
    md: {
      card: 'p-8',
      icon: 'h-12 w-12',
      spinner: 'h-6 w-6',
      title: 'text-lg',
      subtitle: 'text-sm',
      spacing: 'space-y-4',
    },
    lg: {
      card: 'p-12',
      icon: 'h-16 w-16',
      spinner: 'h-8 w-8',
      title: 'text-xl',
      subtitle: 'text-base',
      spacing: 'space-y-6',
    },
  };

  const config = sizeConfig[size];

  return (
    <Card className={`${config.card} text-center ${classes.primaryBg} border-brand-neutral-200 shadow-brand ${className}`}>
      <div className={`flex flex-col items-center ${config.spacing}`}>
        {/* Icon with Spinner */}
        <div className="relative">
          <Icon className={`${config.icon} text-brand-primary-500`} />
          <Loader2 className={`${config.spinner} animate-spin text-brand-secondary-500 absolute -bottom-1 -right-1`} />
        </div>

        {/* Loading Messages */}
        <div className="space-y-2">
          <p className={`${config.title} font-medium text-brand-neutral-700`}>
            {message}
          </p>
          {subMessage && (
            <p className={`${config.subtitle} text-brand-neutral-500`}>
              {subMessage}
            </p>
          )}
        </div>

        {/* Loading Animation Bar */}
        <div className="w-full max-w-xs">
          <div className="h-1 bg-brand-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Specialized loading states for common features
export const MealPlanLoadingState: React.FC<Omit<UniversalLoadingStateProps, 'icon'>> = (props) => {
  const ChefHat = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.ChefHat })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UniversalLoadingState
        icon={ChefHat}
        message="Loading meal plans..."
        {...props}
      />
    </React.Suspense>
  );
};

export const ExerciseLoadingState: React.FC<Omit<UniversalLoadingStateProps, 'icon'>> = (props) => {
  const Dumbbell = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Dumbbell })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UniversalLoadingState
        icon={Dumbbell}
        message="Loading exercise program..."
        {...props}
      />
    </React.Suspense>
  );
};

export const FoodTrackerLoadingState: React.FC<Omit<UniversalLoadingStateProps, 'icon'>> = (props) => {
  const Apple = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Apple })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UniversalLoadingState
        icon={Apple}
        message="Loading food tracker..."
        {...props}
      />
    </React.Suspense>
  );
};

export const ProgressLoadingState: React.FC<Omit<UniversalLoadingStateProps, 'icon'>> = (props) => {
  const TrendingUp = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UniversalLoadingState
        icon={TrendingUp}
        message="Loading progress data..."
        {...props}
      />
    </React.Suspense>
  );
};

export const DashboardLoadingState: React.FC<Omit<UniversalLoadingStateProps, 'icon'>> = (props) => {
  const BarChart3 = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UniversalLoadingState
        icon={BarChart3}
        message="Loading dashboard..."
        {...props}
      />
    </React.Suspense>
  );
};
