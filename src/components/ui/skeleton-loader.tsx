
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const baseClasses = "bg-fitness-neutral-200";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md"
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: ""
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      aria-hidden="true"
    />
  );
};

// Predefined skeleton components for common use cases
export const TextSkeleton = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i}
        variant="text" 
        className={cn(
          "w-full h-4",
          i === lines - 1 && "w-3/4" // Last line shorter
        )}
      />
    ))}
  </div>
);

export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("p-4 space-y-3", className)}>
    <Skeleton className="h-6 w-1/3" />
    <TextSkeleton lines={2} />
    <Skeleton className="h-8 w-24" />
  </div>
);

export const AvatarSkeleton = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  };
  
  return <Skeleton variant="circular" className={sizeClasses[size]} />;
};

export default Skeleton;
