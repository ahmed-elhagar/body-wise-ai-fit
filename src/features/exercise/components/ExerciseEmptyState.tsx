
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ExerciseEmptyState = () => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('exercise.noExercisesToday', 'No Exercises Today')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('exercise.noExercisesDescription', 'There are no exercises scheduled for today.')}
          </p>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('exercise.addCustomExercise', 'Add Custom Exercise')}
        </Button>
      </div>
    </Card>
  );
};
