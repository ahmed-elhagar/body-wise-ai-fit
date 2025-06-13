
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExerciseEmptyStateProps {
  onGenerateProgram: () => void;
  workoutType: "home" | "gym";
  dailyWorkoutId?: string;
}

export const ExerciseEmptyState = ({ 
  onGenerateProgram, 
  workoutType,
  dailyWorkoutId 
}: ExerciseEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center">
      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t('No exercises for today')}
      </h3>
      <p className="text-gray-600 mb-4">
        {t('Check back later or generate a new workout program')}
      </p>
      
      <div className="space-y-3">
        <Button
          onClick={onGenerateProgram}
          className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white"
        >
          {t('Generate New Program')}
        </Button>
        
        {dailyWorkoutId && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('Add Custom Exercise')}
          </Button>
        )}
      </div>
    </Card>
  );
};
