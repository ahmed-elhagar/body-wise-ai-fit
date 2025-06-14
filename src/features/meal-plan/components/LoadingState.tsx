
import React from 'react';
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const LoadingState = () => {
  const { tFrom } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </Card>

      {/* Navigation Skeleton */}
      <Card className="p-4 bg-white border border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </Card>

      {/* Content Loading */}
      <Card className="p-8 text-center bg-white border border-gray-200/50 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {String(tMealPlan('loadingMealPlan'))}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          {String(tMealPlan('preparingMeals'))}
        </p>

        {/* Progress Steps */}
        <div className="space-y-2 max-w-xs mx-auto">
          {[
            String(tMealPlan('fetchingData')),
            String(tMealPlan('calculatingNutrition')),
            String(tMealPlan('organizingMeals'))
          ].map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;
