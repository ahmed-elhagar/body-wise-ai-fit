
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  placeholder = 'blur',
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-fitness-neutral-100 flex items-center justify-center text-fitness-neutral-400",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 bg-fitness-neutral-100 animate-pulse",
            placeholder === 'blur' && "backdrop-blur-sm"
          )}
          style={{ width, height }}
        />
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;
