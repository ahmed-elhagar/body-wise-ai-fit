
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
    <div className="flex gap-1">
      <Button
        variant={viewMode === 'daily' ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className="h-10 px-3"
      >
        <CalendarDays className="w-4 h-4 mr-2" />
        <span>{t('mealPlan.dailyView') || 'Daily'}</span>
      </Button>
      <Button
        variant={viewMode === 'weekly' ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className="h-10 px-3"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        <span>{t('mealPlan.weeklyView') || 'Weekly'}</span>
      </Button>
    </div>
  );
};
