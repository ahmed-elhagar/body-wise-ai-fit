
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
    <div className={`flex gap-1 bg-gray-100 p-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className={`flex items-center gap-2 px-4 py-2 h-9 text-sm font-medium transition-all ${
          viewMode === 'daily' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        <span className="hidden md:inline">{t('mealPlan.dailyView') || 'Daily'}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className={`flex items-center gap-2 px-4 py-2 h-9 text-sm font-medium transition-all ${
          viewMode === 'weekly' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden md:inline">{t('mealPlan.weeklyView') || 'Weekly'}</span>
      </Button>
    </div>
  );
};
