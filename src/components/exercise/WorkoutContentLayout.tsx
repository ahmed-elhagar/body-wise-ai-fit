
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { OptimizedExerciseList } from './OptimizedExerciseList';

interface WorkoutContentLayoutProps {
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  currentProgram: any;
  selectedDayNumber: number;
  currentWeekOffset: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

export const WorkoutContentLayout = ({
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  currentProgram,
  selectedDayNumber,
  currentWeekOffset,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: WorkoutContentLayoutProps) => {
  const { t } = useI18n();

  return (
    <div className="lg:col-span-3 space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{currentProgram?.name || 'Workout'}</h3>
            <p className="text-sm text-gray-600">Day {selectedDayNumber}</p>
          </div>
          <Badge variant="outline" className="bg-white/80">
            Week {currentWeekOffset + 1} of 4
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-fitness-primary" />
            <span className="text-sm text-gray-600">
              {todaysExercises.length * 5} {t('exercise.minutes')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-fitness-primary" />
            <span className="text-sm text-gray-600">
              {todaysExercises.length * 50} {t('exercise.calories')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-fitness-primary" />
            <span className="text-sm text-gray-600">
              Full Body
            </span>
          </div>
        </div>
      </Card>
      
      <OptimizedExerciseList
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        isRestDay={isRestDay}
      />
    </div>
  );
};
