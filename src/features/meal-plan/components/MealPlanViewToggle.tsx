
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Grid } from 'lucide-react';

interface MealPlanViewToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const MealPlanViewToggle = ({
  viewMode,
  onViewModeChange
}: MealPlanViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Button
        variant={viewMode === 'daily' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className={`h-8 px-3 text-xs ${
          viewMode === 'daily' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Calendar className="w-3 h-3 mr-1" />
        Daily
      </Button>
      <Button
        variant={viewMode === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className={`h-8 px-3 text-xs ${
          viewMode === 'weekly' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid className="w-3 h-3 mr-1" />
        Weekly
      </Button>
    </div>
  );
};
