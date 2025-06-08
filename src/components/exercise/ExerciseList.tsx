
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Timer } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  instructions?: string;
  completed?: boolean;
  rest_seconds?: number;
  muscle_groups?: string[];
}

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseComplete?: (id: string) => void;
}

const ExerciseList = ({ exercises, onExerciseComplete }: ExerciseListProps) => {
  const { t, isRTL } = useI18n();

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">{t('exercise:noExercisesToday') || 'No exercises scheduled for today'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className={`transition-all duration-200 ${
          exercise.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
        }`}>
          <CardContent className="p-6">
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {index + 1}
                  </Badge>
                  <h3 className="font-bold text-lg">{exercise.name}</h3>
                </div>
                
                <div className={`flex items-center gap-6 text-sm text-gray-600 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span><strong>{exercise.sets}</strong> {t('exercise:sets') || 'sets'}</span>
                  <span><strong>{exercise.reps}</strong> {t('exercise:reps') || 'reps'}</span>
                  {exercise.rest_seconds && (
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Timer className="w-3 h-3" />
                      <span>{exercise.rest_seconds}s {t('exercise:rest') || 'rest'}</span>
                    </div>
                  )}
                </div>

                {exercise.muscle_groups && (
                  <div className={`flex gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {exercise.muscle_groups.map((group, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                )}

                {exercise.instructions && (
                  <p className="text-sm text-gray-600 leading-relaxed">{exercise.instructions}</p>
                )}
              </div>
              
              {exercise.completed && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('exercise:completed') || 'Completed'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExerciseList;
