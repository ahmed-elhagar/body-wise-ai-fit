
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Fade in animation hook
export const useFadeIn = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    className: cn(
      'transition-all duration-500 ease-out',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    ),
    isVisible
  };
};

// Staggered animation for lists
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  className
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <StaggeredItem key={index} delay={index * staggerDelay}>
          {child}
        </StaggeredItem>
      ))}
    </div>
  );
};

const StaggeredItem: React.FC<{ children: React.ReactNode; delay: number }> = ({
  children,
  delay
}) => {
  const { className } = useFadeIn(delay);
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Slide transition component
interface SlideTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  isVisible: boolean;
  duration?: number;
  className?: string;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  direction = 'up',
  isVisible,
  duration = 300,
  className
}) => {
  const getTransformClasses = () => {
    const transforms = {
      left: isVisible ? 'translate-x-0' : '-translate-x-full',
      right: isVisible ? 'translate-x-0' : 'translate-x-full',
      up: isVisible ? 'translate-y-0' : 'translate-y-full',
      down: isVisible ? 'translate-y-0' : '-translate-y-full'
    };
    
    return transforms[direction];
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        `duration-${duration}`,
        getTransformClasses(),
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

// Scale animation component
interface ScaleAnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  scale?: number;
  duration?: number;
  className?: string;
}

export const ScaleAnimation: React.FC<ScaleAnimationProps> = ({
  children,
  isVisible,
  scale = 0.95,
  duration = 200,
  className
}) => {
  return (
    <div
      className={cn(
        'transition-all ease-out',
        `duration-${duration}`,
        isVisible ? 'scale-100 opacity-100' : `scale-${Math.round(scale * 100)} opacity-0`,
        className
      )}
    >
      {children}
    </div>
  );
};

// Hover animation wrapper
interface HoverAnimationProps {
  children: React.ReactNode;
  animation?: 'scale' | 'lift' | 'glow' | 'rotate';
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  animation = 'scale',
  intensity = 'normal',
  className
}) => {
  const getAnimationClasses = () => {
    const intensityMap = {
      subtle: { scale: '105', lift: '1', glow: '0.1', rotate: '1' },
      normal: { scale: '110', lift: '2', glow: '0.15', rotate: '3' },
      strong: { scale: '115', lift: '4', glow: '0.2', rotate: '6' }
    };
    
    const values = intensityMap[intensity];
    
    const animations = {
      scale: `hover:scale-${values.scale}`,
      lift: `hover:-translate-y-${values.lift} hover:shadow-lg`,
      glow: `hover:shadow-lg hover:shadow-primary-500/20`,
      rotate: `hover:rotate-${values.rotate}`
    };
    
    return animations[animation];
  };

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out cursor-pointer',
        getAnimationClasses(),
        className
      )}
    >
      {children}
    </div>
  );
};

// Loading skeleton with animation
interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

export const AnimatedSkeleton: React.FC<SkeletonProps> = ({
  className,
  lines = 1,
  height = 'h-4',
  width = 'w-full'
}) => {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] rounded',
          height,
          width,
          className
        )}
        style={{
          animation: 'shimmer 1.5s ease-in-out infinite'
        }}
      />
    );
  }

  return (
    <div className={cn('space-y-3 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] rounded',
            height,
            index === lines - 1 ? 'w-3/4' : width
          )}
          style={{
            animation: `shimmer 1.5s ease-in-out infinite ${index * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

// Pulse animation for important elements
interface PulseProps {
  children: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

export const PulseAnimation: React.FC<PulseProps> = ({
  children,
  color = 'primary',
  intensity = 'normal',
  className
}) => {
  const colorClasses = {
    primary: 'shadow-primary-500/50',
    success: 'shadow-success-500/50',
    warning: 'shadow-warning-500/50',
    error: 'shadow-error-500/50'
  };

  const intensityClasses = {
    subtle: 'animate-pulse',
    normal: 'animate-pulse shadow-lg',
    strong: 'animate-pulse shadow-xl'
  };

  return (
    <div
      className={cn(
        intensityClasses[intensity],
        colorClasses[color],
        className
      )}
    >
      {children}
    </div>
  );
};
