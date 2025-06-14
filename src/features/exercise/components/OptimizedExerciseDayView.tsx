
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Target, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OptimizedExerciseDayViewProps {
  currentWorkout: any;
  exercises: any[];
  selectedDay: number;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
  isLoading: boolean;
}

export const OptimizedExerciseDayView = ({ 
  currentWorkout, 
  exercises, 
  selectedDay, 
  onStartWorkout, 
  onCompleteWorkout, 
  isLoading 
}: OptimizedExerciseDayViewProps) => {
  const { t } = useLanguage();

  if (!currentWorkout) {
    return (
      <Card className="p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {t('No workout scheduled')}
        </h3>
        <p className="text-gray-500">
          {t('This day has no exercises scheduled.')}
        </p>
      </Card>
    );
  }

  if (currentWorkout.is_rest_day) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t('Rest Day')}
        </h3>
        <p className="text-gray-600">
          {t('Take time to recover and prepare for tomorrow\'s workout!')}
        </p>
      </Card>
    );
  }

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">{currentWorkout.workout_name || `Day ${selectedDay} Workout`}</h3>
          <p className="text-gray-600">{totalCount} exercises • {currentWorkout.estimated_duration || '45'} min</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {completedCount}/{totalCount}
          </Badge>
          
          <Button 
            onClick={completedCount === totalCount ? onCompleteWorkout : onStartWorkout}
            disabled={isLoading}
            className={completedCount === totalCount ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Play className="w-4 h-4 mr-2" />
            {completedCount === totalCount ? t('Complete Workout') : t('Start Workout')}
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className={`p-4 rounded-lg border ${
              exercise.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                exercise.completed 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {exercise.completed ? '✓' : index + 1}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{exercise.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{exercise.sets || 3} sets</span>
                  <span>{exercise.reps || '10'} reps</span>
                  {exercise.rest_seconds && (
                    <span>{exercise.rest_seconds}s rest</span>
                  )}
                </div>
              </div>
              
              <Dumbbell className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OptimizedExerciseDayView;
