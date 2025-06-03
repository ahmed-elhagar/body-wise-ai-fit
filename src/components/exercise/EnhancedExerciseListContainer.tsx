
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseCardEnhanced } from "./ExerciseCardEnhanced";
import { RestDayCard } from "./RestDayCard";

interface EnhancedExerciseListContainerProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

export const EnhancedExerciseListContainer = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: EnhancedExerciseListContainerProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card className="p-8 bg-white shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">{t('exercise.loadingExercises')}</p>
        </div>
      </Card>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-12 bg-white shadow-lg text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {t('exercise.noExercises')}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          {t('exercise.noExercisesMessage')}
        </p>
      </Card>
    );
  }

  const completedCount = exercises.filter(ex => ex.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Today's Workout
            </h2>
            <p className="text-gray-600">
              Complete exercises in order for the best results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className="bg-blue-50 border-blue-200 text-blue-700 font-semibold px-4 py-2"
            >
              {completedCount}/{exercises.length} Complete
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-gray-50 border-gray-200 text-gray-700 font-medium px-4 py-2"
            >
              {exercises.length} Exercises
            </Badge>
          </div>
        </div>
      </Card>
      
      {/* Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCardEnhanced
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
          />
        ))}
      </div>
    </div>
  );
};
