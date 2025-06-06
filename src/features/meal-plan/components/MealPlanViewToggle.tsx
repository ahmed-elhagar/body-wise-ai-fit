
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanViewToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const MealPlanViewToggle = ({ viewMode, onViewModeChange }: MealPlanViewToggleProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex gap-1 bg-white/80 border border-gray-200/50 shadow-sm rounded-lg p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          viewMode === 'daily' 
            ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        <span>{t('mealPlan.dailyView') || 'Daily'}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          viewMode === 'weekly' 
            ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>{t('mealPlan.weeklyView') || 'Weekly'}</span>
      </Button>
    </div>
  );
};
