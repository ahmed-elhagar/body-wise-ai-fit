
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

interface MealPlanLoadingBackdropProps {
  isGenerating: boolean;
  message?: string;
  description?: string;
}

const MealPlanLoadingBackdrop = ({ 
  isGenerating, 
  message = "Generating AI meal plan...",
  description = "Please wait while we create your personalized meal plan"
}: MealPlanLoadingBackdropProps) => {
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-96 mx-4">
        <CardContent className="p-6">
          <EnhancedLoadingIndicator
            status="loading"
            type="meal-plan"
            message={message}
            description={description}
            variant="card"
            size="lg"
            showSteps={true}
            customSteps={[
              "Analyzing your preferences",
              "Calculating nutritional requirements", 
              "Generating meal suggestions",
              "Optimizing meal plan"
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlanLoadingBackdrop;
