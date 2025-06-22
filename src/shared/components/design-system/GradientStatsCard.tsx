/**
 * Gradient Stats Card Component
 * 
 * Consistent stats display with gradient backgrounds and animations.
 * Used across all features for displaying key metrics.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export interface GradientStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: 'orange' | 'green' | 'blue' | 'purple' | 'primary';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  suffix?: string;
  prefix?: string;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GradientStatsCard: React.FC<GradientStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
  suffix = '',
  prefix = '',
  loading = false,
  onClick,
  className = '',
  size = 'md',
}) => {
  const { gradients } = useTheme();

  const sizeConfig = {
    sm: {
      card: 'p-4',
      icon: 'h-6 w-6',
      value: 'text-xl',
      title: 'text-xs',
      trend: 'text-xs',
    },
    md: {
      card: 'p-6',
      icon: 'h-8 w-8',
      value: 'text-2xl',
      title: 'text-sm',
      trend: 'text-sm',
    },
    lg: {
      card: 'p-8',
      icon: 'h-10 w-10',
      value: 'text-3xl',
      title: 'text-base',
      trend: 'text-base',
    },
  };

  const config = sizeConfig[size];

  const gradientMap = {
    orange: gradients.orange,
    green: gradients.green,
    blue: gradients.blue,
    purple: gradients.purple,
    primary: gradients.primary,
  };

  const colorMap = {
    orange: {
      icon: 'text-orange-500',
      value: 'text-orange-700',
      title: 'text-orange-600',
      border: 'border-orange-200',
    },
    green: {
      icon: 'text-green-500',
      value: 'text-green-700',
      title: 'text-green-600',
      border: 'border-green-200',
    },
    blue: {
      icon: 'text-blue-500',
      value: 'text-blue-700',
      title: 'text-blue-600',
      border: 'border-blue-200',
    },
    purple: {
      icon: 'text-purple-500',
      value: 'text-purple-700',
      title: 'text-purple-600',
      border: 'border-purple-200',
    },
    primary: {
      icon: 'text-brand-primary-500',
      value: 'text-brand-primary-700',
      title: 'text-brand-primary-600',
      border: 'border-brand-primary-200',
    },
  };

  const colors = colorMap[gradient];

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className={`${config.card} bg-gradient-to-br ${gradientMap[gradient]} ${colors.border} shadow-md ${className}`}>
        <CardContent className="p-0">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className={`${config.icon} bg-gray-300 rounded`}></div>
            </div>
            <div className={`h-6 bg-gray-300 rounded w-3/4`}></div>
            <div className={`h-4 bg-gray-300 rounded w-1/2`}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`
        ${config.card} 
        bg-gradient-to-br ${gradientMap[gradient]} 
        ${colors.border} 
        shadow-md 
        hover:shadow-lg 
        transition-all 
        duration-200 
        ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col space-y-3">
          {/* Header with Icon */}
          <div className="flex items-center justify-between">
            <Icon className={`${config.icon} ${colors.icon}`} />
            {trend && (
              <div className={`flex items-center space-x-1 ${config.trend} ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="font-medium">
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>

          {/* Value */}
          <div className={`${config.value} font-bold ${colors.value} leading-none`}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </div>

          {/* Title */}
          <p className={`${config.title} ${colors.title} font-medium`}>
            {title}
          </p>

          {/* Trend Label */}
          {trend?.label && (
            <p className={`text-xs ${getTrendColor()} opacity-75`}>
              {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Pre-configured stats cards for common use cases
export const CaloriesStatsCard: React.FC<Omit<GradientStatsCardProps, 'icon' | 'gradient'>> = (props) => {
  const Flame = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Flame })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <GradientStatsCard
        icon={Flame}
        gradient="orange"
        suffix=" kcal"
        {...props}
      />
    </React.Suspense>
  );
};

export const WeightStatsCard: React.FC<Omit<GradientStatsCardProps, 'icon' | 'gradient'>> = (props) => {
  const Scale = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Scale })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <GradientStatsCard
        icon={Scale}
        gradient="blue"
        suffix=" kg"
        {...props}
      />
    </React.Suspense>
  );
};

export const WorkoutStatsCard: React.FC<Omit<GradientStatsCardProps, 'icon' | 'gradient'>> = (props) => {
  const Dumbbell = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Dumbbell })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <GradientStatsCard
        icon={Dumbbell}
        gradient="green"
        {...props}
      />
    </React.Suspense>
  );
};

export const GoalStatsCard: React.FC<Omit<GradientStatsCardProps, 'icon' | 'gradient'>> = (props) => {
  const Target = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Target })));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <GradientStatsCard
        icon={Target}
        gradient="purple"
        {...props}
      />
    </React.Suspense>
  );
};

// Stats Grid Component for organized display
export interface StatsGridProps {
  cards: React.ReactNode[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  cards,
  columns = 4,
  gap = 'md',
  className = '',
}) => {
  const gapMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${columnMap[columns]} ${gapMap[gap]} ${className}`}>
      {cards}
    </div>
  );
};
