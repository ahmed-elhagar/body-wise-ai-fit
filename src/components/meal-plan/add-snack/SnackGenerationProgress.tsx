
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SnackGenerationProgressProps {
  step: string;
}

export const SnackGenerationProgress = ({ step }: SnackGenerationProgressProps) => {
  const getStepMessage = (currentStep: string) => {
    switch (currentStep) {
      case 'analyzing':
        return 'Analyzing your preferences and dietary needs...';
      case 'creating':
        return 'Creating the perfect snack recipe...';
      case 'saving':
        return 'Saving snack to your meal plan...';
      default:
        return 'Processing...';
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div>
            <p className="font-medium text-blue-800">{getStepMessage(step)}</p>
            <p className="text-sm text-blue-600">This may take a few moments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
