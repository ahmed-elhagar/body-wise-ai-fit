
import React from "react";
import { cn } from "@/lib/utils";
import EnhancedLoadingIndicator, { LoadingType } from "./enhanced-loading-indicator";

interface PageLoadingOverlayProps {
  isLoading: boolean;
  type?: LoadingType;
  message?: string;
  description?: string;
  className?: string;
  blur?: boolean;
}

const PageLoadingOverlay: React.FC<PageLoadingOverlayProps> = ({
  isLoading,
  type = 'general',
  message,
  description,
  className,
  blur = true
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      blur ? "bg-black/60 backdrop-blur-sm" : "bg-black/40",
      className
    )}>
      <div className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl p-8 max-w-md mx-4">
        <EnhancedLoadingIndicator
          status="loading"
          type={type}
          message={message}
          description={description}
          size="lg"
          variant="card"
          showSteps={true}
        />
      </div>
    </div>
  );
};

export default PageLoadingOverlay;
