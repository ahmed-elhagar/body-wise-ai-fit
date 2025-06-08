
import React, { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';
import ActiveExerciseTracker from './ActiveExerciseTracker';
import OptimizedExerciseList from './OptimizedExerciseList';
import CustomExerciseDialog from './CustomExerciseDialog';

interface ExerciseListEnhancedProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  workoutType: 'home' | 'gym';
  isRestDay?: boolean;
}

const ExerciseListEnhanced = ({
  exercises,
  onExerciseComplete,
  onExerciseProgressUpdate,
  workoutType,
  isRestDay = false
}: ExerciseListEnhancedProps) => {
  const { t, isRTL } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  const handleExerciseStart = (exerciseId: string) => {
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    if (index !== -1) {
      setCurrentExerciseIndex(index);
      setIsWorkoutActive(true);
    }
  };

  const handleExerciseComplete = (exerciseId: string) => {
    onExerciseComplete(exerciseId);
    
    // Move to next exercise if exists
    const currentIndex = exercises.findIndex(ex => ex.id === exerciseId);
    if (currentIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentIndex + 1);
    } else {
      setIsWorkoutActive(false);
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {isWorkoutActive && !isRestDay && (
        <ActiveExerciseTracker
          exercise={exercises[currentExerciseIndex]}
          onComplete={() => handleExerciseComplete(exercises[currentExerciseIndex].id)}
          onNext={() => {
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
            }
          }}
          onPrevious={() => {
            if (currentExerciseIndex > 0) {
              setCurrentExerciseIndex(currentExerciseIndex - 1);
            }
          }}
        />
      )}
      
      <OptimizedExerciseList
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        workoutType={workoutType}
        onExerciseStart={handleExerciseStart}
        onExerciseComplete={handleExerciseComplete}
      />

      <CustomExerciseDialog
        open={showCustomDialog}
        onOpenChange={setShowCustomDialog}
        workoutType={workoutType}
        onExerciseAdded={(exercise) => {
          console.log('Custom exercise added:', exercise);
          setShowCustomDialog(false);
        }}
      />
    </div>
  );
};

export default ExerciseListEnhanced;
