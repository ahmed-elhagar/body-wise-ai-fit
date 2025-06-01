import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useI18n } from "@/hooks/useI18n";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Share2, 
  Timer, 
  Youtube, 
  BookOpen 
} from 'lucide-react';

interface ExerciseQuickActionsProps {
  isWorkoutActive: boolean;
  isPaused: boolean;
  totalTime: string;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onResumeWorkout: () => void;
  onRestartWorkout: () => void;
  onShareProgress: () => void;
  canStart: boolean;
  isRestDay?: boolean;
}

export const ExerciseQuickActions = ({
  isWorkoutActive,
  isPaused,
  totalTime,
  onStartWorkout,
  onPauseWorkout,
  onResumeWorkout,
  onRestartWorkout,
  onShareProgress,
  canStart,
  isRestDay = false
}: ExerciseQuickActionsProps) => {
  const { t } = useI18n();

  if (isRestDay) {
    return (
      <Card className="card-enhanced card-padding">
        <div className="text-center content-spacing">
          <h3 className="text-h4 text-fitness-orange-800">
            {t('exercise.restDayActivities')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-fitness-orange-300 text-fitness-orange-700 hover:bg-fitness-orange-50 hover:border-fitness-orange-400 font-semibold"
              onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              {t('exercise.stretchingVideos')}
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-fitness-secondary-300 text-fitness-secondary-700 hover:bg-fitness-secondary-50 hover:border-fitness-secondary-400 font-semibold"
              onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {t('exercise.meditation')}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-enhanced card-padding">
      <div className="content-spacing">
        {/* Enhanced Timer Display */}
        {isWorkoutActive && (
          <div className="text-center bg-white/80 rounded-2xl card-padding border border-fitness-neutral-200/50">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-xl flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="text-h2 font-bold bg-gradient-to-r from-fitness-primary-500 to-fitness-secondary-500 bg-clip-text text-transparent">{totalTime}</span>
              {isPaused && (
                <span className="text-sm text-fitness-orange-600 font-bold bg-fitness-orange-100 px-3 py-1 rounded-lg">
                  ({t('exercise.pause')})
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isWorkoutActive ? (
            <Button 
              onClick={onStartWorkout}
              disabled={!canStart}
              variant="success"
              size="lg"
              className="font-bold px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              {t('exercise.startWorkout')}
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button 
                  onClick={onPauseWorkout}
                  variant="orange"
                  size="lg"
                  className="font-semibold"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  {t('exercise.pause')}
                </Button>
              ) : (
                <Button 
                  onClick={onResumeWorkout}
                  variant="success"
                  size="lg"
                  className="font-bold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t('exercise.resume')}
                </Button>
              )}
            </>
          )}

          <Button 
            onClick={onRestartWorkout}
            variant="outline"
            size="lg"
            className="font-semibold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('exercise.reset')}
          </Button>

          <Button 
            onClick={onShareProgress}
            variant="info"
            size="lg"
            className="font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('exercise.share')}
          </Button>

          <Button 
            variant="secondary"
            size="lg"
            className="font-semibold"
            onClick={() => window.open('https://www.youtube.com/results?search_query=workout+tutorial', '_blank')}
          >
            <Youtube className="w-4 h-4 mr-2" />
            {t('exercise.tutorials')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
