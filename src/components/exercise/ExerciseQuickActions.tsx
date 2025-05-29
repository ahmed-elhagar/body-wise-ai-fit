
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Share2, BookOpen, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseQuickActionsProps {
  isWorkoutActive: boolean;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onRestartWorkout: () => void;
  onShareProgress: () => void;
  canStart: boolean;
  isRestDay?: boolean;
}

export const ExerciseQuickActions = ({
  isWorkoutActive,
  onStartWorkout,
  onPauseWorkout,
  onRestartWorkout,
  onShareProgress,
  canStart,
  isRestDay = false
}: ExerciseQuickActionsProps) => {
  const { t } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-sm">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">
            {t('exercise.restDayActivities') || 'Rest Day Activities'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-12 text-orange-700 border-orange-300 hover:bg-orange-100 transition-colors"
              onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              {t('exercise.stretchingVideos') || 'Stretching Videos'}
            </Button>
            
            <Button 
              variant="outline"
              className="h-12 text-purple-700 border-purple-300 hover:bg-purple-100 transition-colors"
              onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {t('exercise.meditation') || 'Meditation'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          {t('exercise.workoutActions') || 'Workout Controls'}
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {!isWorkoutActive ? (
            <Button 
              onClick={onStartWorkout}
              disabled={!canStart}
              className="h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium col-span-2 lg:col-span-1 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              {t('exercise.startWorkout') || 'Start Workout'}
            </Button>
          ) : (
            <Button 
              onClick={onPauseWorkout}
              variant="outline"
              className="h-12 col-span-2 lg:col-span-1 border-orange-300 text-orange-700 hover:bg-orange-100 transition-all duration-200"
            >
              <Pause className="w-5 h-5 mr-2" />
              {t('exercise.pauseWorkout') || 'Pause'}
            </Button>
          )}

          <Button 
            onClick={onRestartWorkout}
            variant="outline"
            className="h-12 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t('exercise.resetWorkout') || 'Reset'}
          </Button>

          <Button 
            onClick={onShareProgress}
            variant="outline"
            className="h-12 border-blue-300 text-blue-700 hover:bg-blue-100 transition-all duration-200"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {t('exercise.shareProgress') || 'Share'}
          </Button>

          <Button 
            variant="outline"
            className="h-12 border-red-300 text-red-700 hover:bg-red-100 transition-all duration-200"
            onClick={() => window.open('https://www.youtube.com/results?search_query=workout+tutorial', '_blank')}
          >
            <Youtube className="w-5 h-5 mr-2" />
            {t('exercise.tutorials') || 'Tutorials'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
