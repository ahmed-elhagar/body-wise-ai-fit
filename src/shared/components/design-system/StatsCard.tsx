import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import GradientCard from './GradientCard';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'soft';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'soft',
  className,
  size = 'md'
}) => {
  const valueSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const iconSize = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <GradientCard
      variant={variant}
      className={cn(
        'hover-lift press-effect cursor-pointer',
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && (
              <Icon className={cn(
                iconSize[size],
                variant === 'soft' ? 'text-brand-600' : 'text-current'
              )} />
            )}
            <p className={cn(
              'font-medium',
              variant === 'soft' ? 'text-gray-600' : 'text-current opacity-90',
              size === 'sm' ? 'text-sm' : 'text-base'
            )}>
              {title}
            </p>
          </div>
          
          <div className={cn(
            'font-bold mb-1',
            valueSize[size],
            variant === 'soft' ? 'text-gray-900' : 'text-current'
          )}>
            {value}
          </div>
          
          {subtitle && (
            <p className={cn(
              variant === 'soft' ? 'text-gray-500' : 'text-current opacity-75',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        
        {trend && (
          <div className={cn(
            'text-right',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            <div className={cn(
              'font-semibold',
              trend.isPositive !== false ? 'text-emerald-500' : 'text-red-500',
              variant !== 'soft' && 'text-current opacity-90'
            )}>
              {trend.isPositive !== false ? '+' : ''}{trend.value}%
            </div>
            <div className={cn(
              variant === 'soft' ? 'text-gray-500' : 'text-current opacity-75'
            )}>
              {trend.label}
            </div>
          </div>
        )}
      </div>
    </GradientCard>
  );
};

export default StatsCard; 