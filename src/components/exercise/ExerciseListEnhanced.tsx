
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
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
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="lg:col-span-3">
        <div className="text-center py-12">
          <div className="w-10 h-10 animate-spin border-4 border-health-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-health-text-secondary text-lg font-medium">{t('exercise.loadingExercises')}</p>
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
        <Card className="p-12 bg-white border border-health-border shadow-sm text-center rounded-2xl">
          <div className="w-16 h-16 bg-health-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-health-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-health-text-primary mb-2">
            {t('exercise.noExercisesToday')}
          </h3>
          <p className="text-health-text-secondary">
            {t('exercise.selectDifferentDay')}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-health-text-primary">
          {t('exercise.todaysWorkout')}
        </h2>
        <Badge variant="outline" className="bg-health-primary text-white border-health-primary px-3 py-1">
          {exercises.length} {exercises.length === 1 ? t('exercise.exercise') : t('exercise.exercises')}
        </Badge>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCardEnhanced
            key={exercise.id || index}
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
