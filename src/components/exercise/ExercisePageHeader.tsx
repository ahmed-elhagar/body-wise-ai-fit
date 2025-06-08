
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Home, Building2, Sparkles, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExercisePageHeaderProps {
  title: string;
  workoutType: 'home' | 'gym';
  selectedDay: number;
  onRegenerateProgram?: () => void;
  onCustomizeProgram?: () => void;
  isGenerating?: boolean;
}

const ExercisePageHeader = ({
  title,
  workoutType,
  selectedDay,
  onRegenerateProgram,
  onCustomizeProgram,
  isGenerating = false
}: ExercisePageHeaderProps) => {
  const { t, isRTL } = useI18n();

  const getDayName = (dayNumber: number) => {
    const days = [
      t('common:monday') || 'Monday',
      t('common:tuesday') || 'Tuesday', 
      t('common:wednesday') || 'Wednesday',
      t('common:thursday') || 'Thursday',
      t('common:friday') || 'Friday',
      t('common:saturday') || 'Saturday',
      t('common:sunday') || 'Sunday'
    ];
    return days[dayNumber - 1] || `${t('exercise:day')} ${dayNumber}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline" className="bg-white">
                {workoutType === 'home' ? (
                  <>
                    <Home className="w-3 h-3 mr-1" />
                    {t('exercise:homeWorkout') || 'Home Workout'}
                  </>
                ) : (
                  <>
                    <Building2 className="w-3 h-3 mr-1" />
                    {t('exercise:gymWorkout') || 'Gym Workout'}
                  </>
                )}
              </Badge>
              
              <Badge variant="outline" className="bg-white">
                {getDayName(selectedDay)}
              </Badge>
            </div>
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {onCustomizeProgram && (
            <Button
              onClick={onCustomizeProgram}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('exercise:customize') || 'Customize'}
            </Button>
          )}
          
          {onRegenerateProgram && (
            <Button 
              variant="outline" 
              onClick={onRegenerateProgram}
              disabled={isGenerating}
              className="bg-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {t('exercise:regenerate') || 'Regenerate'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExercisePageHeader;
