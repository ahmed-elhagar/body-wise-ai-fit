
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Grid3X3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanViewToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const MealPlanViewToggle = ({ viewMode, onViewModeChange }: MealPlanViewToggleProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-1 bg-white border border-gray-200 shadow-sm">
      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant={viewMode === 'daily' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('daily')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            viewMode === 'daily'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {t('mealPlan.dailyView') || 'Daily'}
        </Button>
        <Button
          variant={viewMode === 'weekly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('weekly')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            viewMode === 'weekly'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          {t('mealPlan.weeklyView') || 'Weekly'}
        </Button>
      </div>
    </Card>
  );
};
