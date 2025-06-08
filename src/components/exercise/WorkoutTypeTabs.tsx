
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Building2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface WorkoutTypeTabsProps {
  workoutType: 'home' | 'gym';
  onWorkoutTypeChange: (type: 'home' | 'gym') => void;
}

export const WorkoutTypeTabs = ({ workoutType, onWorkoutTypeChange }: WorkoutTypeTabsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Tabs value={workoutType} onValueChange={(value) => onWorkoutTypeChange(value as 'home' | 'gym')}>
      <TabsList className={`grid w-full grid-cols-2 ${isRTL ? 'rtl' : 'ltr'}`}>
        <TabsTrigger value="home" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Home className="w-4 h-4" />
          {t('exercise:home') || 'Home'}
        </TabsTrigger>
        <TabsTrigger value="gym" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Building2 className="w-4 h-4" />
          {t('exercise:gym') || 'Gym'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default WorkoutTypeTabs;
