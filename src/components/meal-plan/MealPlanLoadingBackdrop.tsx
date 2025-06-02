
import React from "react";
import PageLoadingOverlay from "@/components/ui/page-loading-overlay";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
  type?: 'meal-plan' | 'recipe' | 'analysis' | 'general';
}

const MealPlanLoadingBackdrop = React.memo<MealPlanLoadingBackdropProps>(({ 
  isLoading, 
  message,
  type = 'meal-plan'
}) => {
  // Early return if not loading to avoid unnecessary renders
  if (!isLoading) return null;

  return (
    <PageLoadingOverlay
      isLoading={isLoading}
      type={type}
      message={message}
      description="Please wait while we process your request..."
    />
  );
});

MealPlanLoadingBackdrop.displayName = 'MealPlanLoadingBackdrop';

export default MealPlanLoadingBackdrop;
