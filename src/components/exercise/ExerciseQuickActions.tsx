
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
      <Card className="p-4 bg-white border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Rest Day Activities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-11 text-orange-700 border-orange-200 hover:bg-orange-50"
            onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
          >
            <Youtube className="w-4 h-4 mr-2" />
            Stretching Videos
          </Button>
          
          <Button 
            variant="outline"
            className="h-11 text-purple-700 border-purple-200 hover:bg-purple-50"
            onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Meditation
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white border-gray-200 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Workout Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {!isWorkoutActive ? (
          <Button 
            onClick={onStartWorkout}
            disabled={!canStart}
            className="h-11 bg-fitness-gradient hover:opacity-90 text-white col-span-2 sm:col-span-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Workout
          </Button>
        ) : (
          <Button 
            onClick={onPauseWorkout}
            variant="outline"
            className="h-11 col-span-2 sm:col-span-1 border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}

        <Button 
          onClick={onRestartWorkout}
          variant="outline"
          className="h-11 border-gray-200 hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <Button 
          onClick={onShareProgress}
          variant="outline"
          className="h-11 border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        <Button 
          variant="outline"
          className="h-11 border-red-200 text-red-700 hover:bg-red-50"
          onClick={() => window.open('https://www.youtube.com/results?search_query=workout+tutorial', '_blank')}
        >
          <Youtube className="w-4 h-4 mr-2" />
          Tutorials
        </Button>
      </div>
    </Card>
  );
};
