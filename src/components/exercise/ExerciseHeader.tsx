
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Home, Building2, Calendar, Sparkles } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseHeaderProps {
  title: string;
  workoutType: 'home' | 'gym';
  currentWeek?: number;
  totalWeeks?: number;
  onRegenerateProgram?: () => void;
  onCustomizeProgram?: () => void;
}

const ExerciseHeader = ({
  title,
  workoutType,
  currentWeek = 1,
  totalWeeks = 4,
  onRegenerateProgram,
  onCustomizeProgram
}: ExerciseHeaderProps) => {
  const { t, isRTL } = useI18n();

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
                <Calendar className="w-3 h-3 mr-1" />
                {t('exercise:week')} {currentWeek} {t('common:of')} {totalWeeks}
              </Badge>
            </div>
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {onCustomizeProgram && (
            <Button
              onClick={onCustomizeProgram}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('exercise:customize') || 'Customize'}
            </Button>
          )}
          
          {onRegenerateProgram && (
            <Button variant="outline" onClick={onRegenerateProgram} className="bg-white">
              <Dumbbell className="w-4 h-4 mr-2" />
              {t('exercise:regenerate') || 'Regenerate'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExerciseHeader;
