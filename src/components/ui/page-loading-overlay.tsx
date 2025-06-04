
import React from "react";
import { cn } from "@/lib/utils";
import EnhancedPageLoading from "./enhanced-page-loading";

interface PageLoadingOverlayProps {
  isLoading: boolean;
  type?: 'general' | 'meal-plan' | 'exercise' | 'dashboard' | 'profile';
  message?: string;
  description?: string;
  className?: string;
  blur?: boolean;
  context?: 'admin' | 'ai-generation' | 'page-load';
}

const PageLoadingOverlay: React.FC<PageLoadingOverlayProps> = ({
  isLoading,
  type = 'general',
  message,
  description,
  className,
  blur = true,
  context = 'page-load'
}) => {
  if (!isLoading) return null;

  // Don't show page loading overlay for admin actions or on admin pages
  const currentPath = window.location.pathname;
  if (context === 'admin' || currentPath.includes('/admin')) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      blur ? "bg-black/60 backdrop-blur-sm" : "bg-black/40",
      className
    )}>
      <EnhancedPageLoading
        isLoading={isLoading}
        type={type}
        title={message || "Loading"}
        description={description || "Please wait while we process your request..."}
        timeout={8000}
      />
    </div>
  );
};

export default PageLoadingOverlay;
