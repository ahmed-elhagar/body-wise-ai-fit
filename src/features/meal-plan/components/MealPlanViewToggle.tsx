
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface MealPlanViewToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const MealPlanViewToggle = ({ viewMode, onViewModeChange }: MealPlanViewToggleProps) => {
  const { tFrom, isRTL } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant={viewMode === 'daily' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className={`h-8 px-3 text-xs rounded-md transition-all duration-200 ${
          viewMode === 'daily' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Eye className="w-3 h-3 mr-1" />
        {String(tMealPlan('dailyView'))}
      </Button>
      
      <Button
        variant={viewMode === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className={`h-8 px-3 text-xs rounded-md transition-all duration-200 ${
          viewMode === 'weekly' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Calendar className="w-3 h-3 mr-1" />
        {String(tMealPlan('weeklyView'))}
      </Button>
    </div>
  );
};
