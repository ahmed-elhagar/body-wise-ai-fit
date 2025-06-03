
import React from "react";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
  type?: 'meal-plan' | 'recipe' | 'analysis' | 'general';
}

const MealPlanLoadingBackdrop = React.memo<MealPlanLoadingBackdropProps>(({ 
  isLoading, 
  message = "Processing your meal plan...",
  type = 'meal-plan'
}) => {
  if (!isLoading) return null;

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
