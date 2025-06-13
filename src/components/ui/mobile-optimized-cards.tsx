
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverAnimation } from './smooth-animations';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  onTap?: () => void;
  variant?: 'default' | 'highlighted' | 'compact';
  className?: string;
  children?: React.ReactNode;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  badge,
  actions,
  onTap,
  variant = 'default',
  className,
  children
}) => {
  const isClickable = !!onTap;
  
  const variantClasses = {
    default: 'p-4',
    highlighted: 'p-4 ring-2 ring-primary-500 ring-opacity-20 bg-primary-50',
    compact: 'p-3'
  };

  const CardWrapper = isClickable ? 'button' : 'div';

  return (
    <HoverAnimation animation="lift" intensity="subtle">
      <Card className={cn(
        'w-full transition-all duration-200',
        variantClasses[variant],
        isClickable && 'cursor-pointer active:scale-[0.98]',
        className
      )}>
        <CardWrapper
          {...(isClickable && { onClick: onTap })}
          className={cn(
            'w-full text-left',
            isClickable && 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {icon && (
                <div className="flex-shrink-0 mt-0.5">
                  {icon}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900 truncate">
                    {title}
                  </h3>
                  {badge}
                </div>
                
                {subtitle && (
                  <p className="text-sm text-neutral-600 mb-1">
                    {subtitle}
                  </p>
                )}
                
                {description && (
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {description}
                  </p>
                )}
                
                {children}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              {actions}
              {isClickable && (
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              )}
            </div>
          </div>
        </CardWrapper>
      </Card>
    </HoverAnimation>
  );
};

interface ProgressCardProps {
  title: string;
  progress: number;
  total?: number;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  progress,
  total,
  unit = '',
  color = 'primary',
  icon,
  description,
  className
}) => {
  const percentage = total ? (progress / total) * 100 : progress;
  
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-500',
    success: 'text-success-600 bg-success-500',
    warning: 'text-warning-600 bg-warning-500',
    error: 'text-error-600 bg-error-500'
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-neutral-900">{title}</h3>
        </div>
        <span className={cn('text-sm font-bold', colorClasses[color].split(' ')[0])}>
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color].split(' ')[1]
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-neutral-600">
          {progress}{unit} {total && `of ${total}${unit}`}
        </span>
        {description && (
          <span className="text-neutral-500">{description}</span>
        )}
      </div>
    </Card>
  );
};

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  icon,
  color = 'neutral',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const valueSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    error: 'text-error-600 bg-error-50',
    neutral: 'text-neutral-600 bg-neutral-50'
  };

  return (
    <Card className={cn(sizeClasses[size], className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">
            {label}
          </p>
          <p className={cn(
            'font-bold text-neutral-900',
            valueSizeClasses[size]
          )}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                change.type === 'increase' 
                  ? 'text-success-700 bg-success-100' 
                  : 'text-error-700 bg-error-100'
              )}>
                {change.type === 'increase' ? '+' : ''}{change.value}%
              </span>
              {change.period && (
                <span className="text-xs text-neutral-500">
                  {change.period}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-2 rounded-lg',
            colorClasses[color]
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

interface ActionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  buttonText: string;
  onAction: () => void;
  variant?: 'default' | 'primary' | 'success';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onAction,
  variant = 'default',
  disabled = false,
  loading = false,
  className
}) => {
  const variantClasses = {
    default: 'border-neutral-200',
    primary: 'border-primary-200 bg-primary-50',
    success: 'border-success-200 bg-success-50'
  };

  const buttonVariantClasses = {
    default: 'bg-neutral-900 hover:bg-neutral-800 text-white',
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    success: 'bg-success-500 hover:bg-success-600 text-white'
  };

  return (
    <Card className={cn(
      'p-4 border-2',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 bg-white rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-neutral-600 mb-3">
              {description}
            </p>
          )}
          <Button
            onClick={onAction}
            disabled={disabled || loading}
            className={cn(
              'w-full sm:w-auto',
              buttonVariantClasses[variant]
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
