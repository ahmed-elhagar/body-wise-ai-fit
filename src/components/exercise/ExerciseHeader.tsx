
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ExerciseHeaderProps {
  programName?: string;
  currentWeek?: number;
  currentDay?: number;
  workoutType?: 'home' | 'gym';
  difficultyLevel?: string;
  estimatedDuration?: number;
  completedWorkouts?: number;
  totalWorkouts?: number;
  isActive?: boolean;
  onStartWorkout?: () => void;
  onPauseWorkout?: () => void;
  onResetWorkout?: () => void;
  onSettings?: () => void;
  compact?: boolean;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  programName = "Workout Program",
  currentWeek = 1,
  currentDay = 1,
  workoutType = 'home',
  difficultyLevel = 'intermediate',
  estimatedDuration = 45,
  completedWorkouts = 0,
  totalWorkouts = 7,
  isActive = false,
  onStartWorkout,
  onPauseWorkout,
  onResetWorkout,
  onSettings,
  compact = false
}) => {
  const { t, isRTL } = useLanguage();

  const progressPercentage = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  if (compact) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {t(`exercise.workoutType.${workoutType}`)}
            </Badge>
            <span className="font-medium text-gray-800">
              {programName}
            </span>
          </div>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {onStartWorkout && !isActive && (
              <Button size="sm" onClick={onStartWorkout}>
                <Play className="w-4 h-4 mr-1" />
                {t('exercise.startWorkout')}
              </Button>
            )}
            {onPauseWorkout && isActive && (
              <Button size="sm" variant="outline" onClick={onPauseWorkout}>
                <Pause className="w-4 h-4 mr-1" />
                {t('exercise.pauseWorkout')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
        {/* Program Info */}
        <div className="flex-1">
          <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h1 className="text-2xl font-bold text-gray-900">{programName}</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {t(`exercise.workoutType.${workoutType}`)}
            </Badge>
            <Badge variant="outline">
              {t(`exercise.difficulty.${difficultyLevel}`)}
            </Badge>
          </div>
          
          <div className={`flex flex-wrap items-center gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span>{t('exercise.week')} {currentWeek} • {t('exercise.day')} {currentDay}</span>
            </div>
            
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-4 h-4" />
              <span>{estimatedDuration} {t('common.minutes')}</span>
            </div>
            
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4" />
              <span>{completedWorkouts}/{totalWorkouts} {t('exercise.workoutsCompleted')}</span>
            </div>
            
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4" />
              <span>{Math.round(progressPercentage)}% {t('common.complete')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {onSettings && (
            <Button variant="outline" size="sm" onClick={onSettings}>
              <Settings className="w-4 h-4" />
            </Button>
          )}
          
          {onResetWorkout && (
            <Button variant="outline" size="sm" onClick={onResetWorkout}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          
          {onStartWorkout && !isActive && (
            <Button onClick={onStartWorkout} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              {t('exercise.startWorkout')}
            </Button>
          )}
          
          {onPauseWorkout && isActive && (
            <Button variant="outline" onClick={onPauseWorkout}>
              <Pause className="w-4 h-4 mr-2" />
              {t('exercise.pauseWorkout')}
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      {totalWorkouts > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{t('exercise.overallProgress')}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExerciseHeader;
