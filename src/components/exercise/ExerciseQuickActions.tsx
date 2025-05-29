
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
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-lg rounded-2xl">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-orange-800">
            {t('exercise.restDayActivities')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-12 text-orange-700 border-2 border-orange-300 hover:bg-orange-100 hover:border-orange-400 font-semibold rounded-xl"
              onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              {t('exercise.stretchingVideos')}
            </Button>
            
            <Button 
              variant="outline"
              className="h-12 text-purple-700 border-2 border-purple-300 hover:bg-purple-100 hover:border-purple-400 font-semibold rounded-xl"
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
    <Card className="p-6 bg-gradient-to-br from-health-primary/5 to-health-secondary/5 border-2 border-health-border shadow-lg rounded-2xl backdrop-blur-sm">
      <div className="space-y-6">
        {/* Enhanced Timer Display */}
        {isWorkoutActive && (
          <div className="text-center bg-white/80 rounded-2xl p-4 border border-health-border/30">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-health-primary to-health-secondary rounded-xl flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent">{totalTime}</span>
              {isPaused && (
                <span className="text-sm text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-lg">
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
                  variant="outline"
                  size="lg"
                  className="border-2 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 font-semibold"
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
            variant="outline"
            size="lg"
            className="border-2 border-health-primary/30 text-health-primary hover:bg-health-primary/10 hover:border-health-primary/50 font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('exercise.share')}
          </Button>

          <Button 
            variant="accent"
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
