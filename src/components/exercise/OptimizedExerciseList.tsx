
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';

interface OptimizedExerciseListProps {
  exercises: Exercise[];
  onExerciseStart: (exerciseId: string) => void;
  onExerciseComplete: (exerciseId: string) => void;
}

const OptimizedExerciseList = ({ 
  exercises, 
  onExerciseStart, 
  onExerciseComplete 
}: OptimizedExerciseListProps) => {
  const { t, isRTL } = useI18n();

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {t('exercise:noExercises') || 'No exercises available'}
            </h3>
            <p className="text-gray-500">
              {t('exercise:generateProgram') || 'Generate an exercise program to get started'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => {
        // Safely access exercise properties with fallbacks
        const exerciseName = exercise.name || exercise.exercise_name || 'Unknown Exercise';
        const exerciseInstructions = exercise.instructions || 'No instructions available';
        const exerciseSets = exercise.sets || 3;
        const exerciseReps = exercise.reps || 12;
        const targetMuscles = exercise.target_muscles || exercise.muscle_group || [];
        
        return (
          <Card key={exercise.id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Exercise Index */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>

              {/* Exercise Details */}
              <div className="flex-1 min-w-0">
                <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {exerciseName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {exerciseInstructions}
                    </p>
                  </div>
                </div>

                {/* Exercise Specs */}
                <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {exerciseSets} sets × {exerciseReps} reps
                  </Badge>
                  
                  {Array.isArray(targetMuscles) && targetMuscles.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {targetMuscles.slice(0, 2).join(', ')}
                      {targetMuscles.length > 2 && ` +${targetMuscles.length - 2}`}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button 
                    onClick={() => onExerciseStart(exercise.id)}
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {t('exercise:start') || 'Start'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default OptimizedExerciseList;
