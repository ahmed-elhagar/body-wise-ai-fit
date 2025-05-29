
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseCardEnhanced } from "./ExerciseCardEnhanced";
import { RestDayCard } from "./RestDayCard";

interface ExerciseListEnhancedProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

export const ExerciseListEnhanced = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: ExerciseListEnhancedProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="lg:col-span-3">
        <div className="text-center py-8">
          <div className="w-8 h-8 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">{t('exercise.loadingExercises') || 'Loading exercises...'}</p>
        </div>
      </div>
    );
  }

  // Rest Day Display
  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="lg:col-span-3">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
          <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('exercise.noExercises') || 'No Exercises for Today'}
          </h3>
          <p className="text-gray-600">
            {t('exercise.noExercisesMessage') || 'Generate an AI workout plan to get started'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('exercise.exerciseList') || 'Exercise List'}
        </h2>
        <Badge variant="outline" className="bg-white/80">
          {exercises.length} {t('exercise.exercises') || 'exercises'}
        </Badge>
      </div>
      
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
