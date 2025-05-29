
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Share2, BookOpen, Youtube, Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-sm">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-orange-800">
            {t('exercise.restDayActivities') || 'Rest Day Activities'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-10 text-orange-700 border-orange-300 hover:bg-orange-100"
              onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
            >
              <Youtube className="w-4 h-4 mr-2" />
              {t('exercise.stretchingVideos') || 'Stretching Videos'}
            </Button>
            
            <Button 
              variant="outline"
              className="h-10 text-purple-700 border-purple-300 hover:bg-purple-100"
              onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {t('exercise.meditation') || 'Meditation'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm sticky top-4 z-10">
      <div className="space-y-4">
        {/* Timer Display */}
        {isWorkoutActive && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-800">{totalTime}</span>
              {isPaused && <span className="text-sm text-orange-600 font-medium">(Paused)</span>}
            </div>
          </div>
        )}
        
        {/* Main Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {!isWorkoutActive ? (
            <Button 
              onClick={onStartWorkout}
              disabled={!canStart}
              className="h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Workout
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button 
                  onClick={onPauseWorkout}
                  variant="outline"
                  className="h-12 border-orange-300 text-orange-700 hover:bg-orange-100 px-6"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button 
                  onClick={onResumeWorkout}
                  className="h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </Button>
              )}
            </>
          )}

          <Button 
            onClick={onRestartWorkout}
            variant="outline"
            className="h-12 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button 
            onClick={onShareProgress}
            variant="outline"
            className="h-12 border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button 
            variant="outline"
            className="h-12 border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => window.open('https://www.youtube.com/results?search_query=workout+tutorial', '_blank')}
          >
            <Youtube className="w-4 h-4 mr-2" />
            Tutorials
          </Button>
        </div>
      </div>
    </Card>
  );
};
