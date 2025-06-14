
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ChefHat } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const { tFrom, isRTL } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <Card className="p-8 text-center bg-white border border-red-200/50 shadow-sm">
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        
        {/* Error Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {String(tMealPlan('errorLoadingMeals'))}
        </h3>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-2">
          {String(tMealPlan('errorTryAgain'))}
        </p>
        
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6 border border-red-200">
            {error.message}
          </p>
        )}
        
        {/* Action Buttons */}
        <div className={`flex gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button 
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {String(tMealPlan('retry'))}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <ChefHat className="w-4 h-4 mr-2" />
            {String(tMealPlan('refreshPage'))}
          </Button>
        </div>
        
        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          {String(tMealPlan('persistentIssues'))}
        </p>
      </div>
    </Card>
  );
};

export default ErrorState;
