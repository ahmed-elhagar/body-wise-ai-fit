
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Grid3X3 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ViewModeToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex gap-1 bg-gray-100 p-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant={viewMode === 'daily' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className={`flex items-center gap-2 text-xs px-3 py-1 h-7 ${
          viewMode === 'daily' 
            ? 'bg-white shadow-sm text-blue-600' 
            : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        <Calendar className="w-3 h-3" />
        {t('mealPlan.dailyView') || 'Daily'}
      </Button>
      <Button
        variant={viewMode === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className={`flex items-center gap-2 text-xs px-3 py-1 h-7 ${
          viewMode === 'weekly' 
            ? 'bg-white shadow-sm text-blue-600' 
            : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        <Grid3X3 className="w-3 h-3" />
        {t('mealPlan.weeklyView') || 'Weekly'}
      </Button>
    </div>
  );
};
