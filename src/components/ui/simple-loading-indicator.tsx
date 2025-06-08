
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleLoadingIndicatorProps {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SimpleLoadingIndicator: React.FC<SimpleLoadingIndicatorProps> = ({
  message = "Loading...",
  description,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <Loader2 className={cn("animate-spin text-violet-600", sizeClasses[size])} />
      {message && (
        <p className="mt-2 text-sm font-medium text-gray-700">{message}</p>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-500 text-center">{description}</p>
      )}
    </div>
  );
};

export default SimpleLoadingIndicator;
