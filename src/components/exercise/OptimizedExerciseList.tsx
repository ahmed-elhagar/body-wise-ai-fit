
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Check, Clock, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Exercise } from "@/types/exercise";

interface OptimizedExerciseListProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  workoutType: "home" | "gym";
  onExerciseStart: (exerciseId: string) => void;
  onExerciseComplete: (exerciseId: string) => void;
}

const OptimizedExerciseList = ({
  exercises,
  currentExerciseIndex,
  workoutType,
  onExerciseStart,
  onExerciseComplete
}: OptimizedExerciseListProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {exercises.map((exercise, index) => {
        const isActive = index === currentExerciseIndex;
        const isCompleted = index < currentExerciseIndex;

        return (
          <Card key={exercise.id} className={`transition-all ${
            isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 
            isCompleted ? 'bg-green-50 border-green-200' : ''
          }`}>
            <CardContent className="p-6">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {exercise.name || `Exercise ${index + 1}`}
                  </h3>
                  
                  <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Badge variant="secondary">
                      {exercise.muscle_groups?.join(', ') || 'Full Body'}
                    </Badge>
                    <Badge variant="outline">
                      {workoutType === 'home' ? t('exercise:homeWorkout') || 'Home' : t('exercise:gymWorkout') || 'Gym'}
                    </Badge>
                  </div>

                  <div className={`flex items-center gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-4 h-4" />
                      <span>{exercise.rest_seconds || '30'} {t('common:seconds') || 'sec'}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Target className="w-4 h-4" />
                      <span>{exercise.sets || 3} {t('exercise:sets') || 'sets'}</span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {isCompleted ? (
                    <Button variant="outline" disabled className="bg-green-100">
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => onExerciseStart(exercise.id)}
                        disabled={!isActive}
                        variant={isActive ? "default" : "outline"}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {t('exercise:start') || 'Start'}
                      </Button>
                      {isActive && (
                        <Button
                          onClick={() => onExerciseComplete(exercise.id)}
                          variant="outline"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {t('exercise:complete') || 'Complete'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OptimizedExerciseList;
