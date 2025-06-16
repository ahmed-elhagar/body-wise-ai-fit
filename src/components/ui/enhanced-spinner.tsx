
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const variantClasses = {
  default: 'text-fitness-neutral-600',
  primary: 'text-fitness-primary-500',
  secondary: 'text-fitness-secondary-500'
};

const EnhancedSpinner: React.FC<EnhancedSpinnerProps> = ({
  size = 'md',
  variant = 'default', 
  className,
  text
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <span className={cn(
          "text-sm font-medium",
          variantClasses[variant]
        )}>
          {text}
        </span>
      )}
    </div>
  );
};

export default EnhancedSpinner;
