
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
      <Card className="p-4 bg-white/90 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-12 text-orange-700 border-orange-200 hover:bg-orange-50"
            onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
          >
            <Youtube className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.watchStretching')}</span>
            <span className="sm:hidden">Stretch</span>
          </Button>
          
          <Button 
            variant="outline"
            className="h-12 text-purple-700 border-purple-200 hover:bg-purple-50"
            onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.meditation')}</span>
            <span className="sm:hidden">Relax</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {!isWorkoutActive ? (
          <Button 
            onClick={onStartWorkout}
            disabled={!canStart}
            className="h-12 bg-fitness-gradient hover:opacity-90 text-white col-span-2 sm:col-span-1"
          >
            <Play className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.startWorkout')}</span>
            <span className="sm:hidden">Start</span>
          </Button>
        ) : (
          <Button 
            onClick={onPauseWorkout}
            variant="outline"
            className="h-12 col-span-2 sm:col-span-1"
          >
            <Pause className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.pauseWorkout')}</span>
            <span className="sm:hidden">Pause</span>
          </Button>
        )}

        <Button 
          onClick={onRestartWorkout}
          variant="outline"
          className="h-12"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.restart')}</span>
          <span className="sm:hidden">Reset</span>
        </Button>

        <Button 
          onClick={onShareProgress}
          variant="outline"
          className="h-12"
        >
          <Share2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.share')}</span>
          <span className="sm:hidden">Share</span>
        </Button>

        <Button 
          variant="outline"
          className="h-12"
          onClick={() => window.open('https://www.youtube.com/results?search_query=workout+tutorial', '_blank')}
        >
          <Youtube className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.tutorials')}</span>
          <span className="sm:hidden">Videos</span>
        </Button>
      </div>
    </Card>
  );
};
