/**
 * Universal Feature Header Component
 * 
 * Standardized header component used across all features.
 * Provides consistent title display and action button placement.
 */

import React from 'react';
import { useTheme } from '@/shared/hooks/useTheme';

export interface FeatureHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({
  title,
  subtitle,
  actions,
  isLoading = false,
  className = '',
  size = 'md',
}) => {
  const { colors } = useTheme();

  const sizeConfig = {
    sm: {
      title: 'text-xl',
      subtitle: 'text-sm',
      spacing: 'mb-4',
    },
    md: {
      title: 'text-2xl',
      subtitle: 'text-base',
      spacing: 'mb-6',
    },
    lg: {
      title: 'text-3xl',
      subtitle: 'text-lg',
      spacing: 'mb-8',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${config.spacing} ${className}`}>
      {/* Title Section */}
      <div className="flex-1 mb-4 sm:mb-0">
        <h1 className={`${config.title} font-bold text-brand-neutral-800 leading-tight`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`${config.subtitle} text-brand-neutral-600 mt-1`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions Section */}
      {actions && !isLoading && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center space-x-3">
          <div className="animate-pulse flex space-x-2">
            <div className="h-9 w-24 bg-brand-neutral-200 rounded"></div>
            <div className="h-9 w-32 bg-brand-neutral-200 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized header variants
export interface WeekNavigationHeaderProps extends FeatureHeaderProps {
  currentWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
  weekLabel?: string;
}

export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
  currentWeek,
  totalWeeks,
  onWeekChange,
  weekLabel = 'Week',
  ...headerProps
}) => {
  const ChevronLeft = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronLeft })));
  const ChevronRight = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })));

  const weekNavigation = (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
        disabled={currentWeek <= 1}
        className="p-2 rounded-lg bg-white/60 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <React.Suspense fallback={<div className="h-4 w-4" />}>
          <ChevronLeft className="h-4 w-4" />
        </React.Suspense>
      </button>
      
      <span className="px-3 py-1 bg-white/80 rounded-lg text-sm font-medium">
        {weekLabel} {currentWeek} of {totalWeeks}
      </span>
      
      <button
        onClick={() => onWeekChange(Math.min(totalWeeks, currentWeek + 1))}
        disabled={currentWeek >= totalWeeks}
        className="p-2 rounded-lg bg-white/60 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <React.Suspense fallback={<div className="h-4 w-4" />}>
          <ChevronRight className="h-4 w-4" />
        </React.Suspense>
      </button>
    </div>
  );

  return (
    <FeatureHeader
      {...headerProps}
      actions={
        <div className="flex items-center space-x-4">
          {weekNavigation}
          {headerProps.actions}
        </div>
      }
    />
  );
};

// Breadcrumb header variant
export interface BreadcrumbHeaderProps extends FeatureHeaderProps {
  breadcrumbs: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({
  breadcrumbs,
  ...headerProps
}) => {
  const ChevronRight = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })));

  const breadcrumbNav = (
    <nav className="flex items-center space-x-2 text-sm text-brand-neutral-600 mb-2">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <React.Suspense fallback={<div className="h-3 w-3" />}>
              <ChevronRight className="h-3 w-3" />
            </React.Suspense>
          )}
          {crumb.href || crumb.onClick ? (
            <button
              onClick={crumb.onClick}
              className="hover:text-brand-primary-600 transition-colors"
            >
              {crumb.label}
            </button>
          ) : (
            <span className={index === breadcrumbs.length - 1 ? 'text-brand-neutral-800 font-medium' : ''}>
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );

  return (
    <div>
      {breadcrumbNav}
      <FeatureHeader {...headerProps} />
    </div>
  );
};
