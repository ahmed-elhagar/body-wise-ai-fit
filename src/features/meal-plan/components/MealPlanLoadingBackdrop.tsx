
import React from "react";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
  type?: 'meal-plan' | 'general';
  allowedContexts?: string[];
}

const MealPlanLoadingBackdrop = React.memo<MealPlanLoadingBackdropProps>(({ 
  isLoading, 
  message = "Processing your meal plan...",
  type = 'meal-plan',
  allowedContexts = ['meal-plan', 'ai-generation']
}) => {
  // Remove this component's loading display to avoid duplication
  // The UnifiedAILoadingDialog should handle all AI loading states
  return null;
});

MealPlanLoadingBackdrop.displayName = 'MealPlanLoadingBackdrop';

export default MealPlanLoadingBackdrop;
