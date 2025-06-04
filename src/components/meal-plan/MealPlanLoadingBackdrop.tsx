
import React from "react";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
  type?: 'meal-plan' | 'general';
  // Add context to prevent showing during admin actions
  allowedContexts?: string[];
}

const MealPlanLoadingBackdrop = React.memo<MealPlanLoadingBackdropProps>(({ 
  isLoading, 
  message = "Processing your meal plan...",
  type = 'meal-plan',
  allowedContexts = ['meal-plan', 'ai-generation']
}) => {
  if (!isLoading) return null;

  // Check if we're in an admin context and should not show this loader
  const currentPath = window.location.pathname;
  if (currentPath.includes('/admin')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl p-8 max-w-md mx-4">
        <EnhancedPageLoading
          isLoading={isLoading}
          type={type}
          title="Creating Your Meal Plan"
          description={message}
          timeout={10000}
        />
      </div>
    </div>
  );
});

MealPlanLoadingBackdrop.displayName = 'MealPlanLoadingBackdrop';

export default MealPlanLoadingBackdrop;
