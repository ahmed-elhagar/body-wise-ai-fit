
import { Plus, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseEmptyStateProps {
  dailyWorkoutId?: string;
  onAddCustomExercise: () => void;
}

export const ExerciseEmptyState = ({ dailyWorkoutId, onAddCustomExercise }: ExerciseEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Dumbbell className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {t('exercise.empty.title', 'No Exercises for Today')}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {t('exercise.empty.description', 'There are no exercises scheduled for today. You can add custom exercises to your workout.')}
      </p>
      
      {dailyWorkoutId && (
        <Button onClick={onAddCustomExercise} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('exercise.empty.addCustom', 'Add Custom Exercise')}
        </Button>
      )}
    </Card>
  );
};
