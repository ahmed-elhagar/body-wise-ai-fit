
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import InteractiveExerciseCard from "./InteractiveExerciseCard";
import { DailyWorkout, Exercise } from "@/types/exercise";

interface OptimizedExerciseDayViewProps {
  dailyWorkout: DailyWorkout | null;
  selectedDay: number;
  onExerciseStart: (exerciseId: string) => void;
  onExerciseComplete: (exerciseId: string) => void;
  workoutType: "home" | "gym";
}

const OptimizedExerciseDayView = ({
  dailyWorkout,
  selectedDay,
  onExerciseStart,
  onExerciseComplete,
  workoutType
}: OptimizedExerciseDayViewProps) => {
  const { t, isRTL } = useI18n();

  // Handle rest day
  if (!dailyWorkout || dailyWorkout.is_rest_day) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {t('exercise:restDay') || 'Rest Day'}
            </h3>
            <p className="text-green-700 mb-4">
              {t('exercise:restDayDescription') || 'Take this day to recover and let your muscles rebuild stronger.'}
            </p>
            <div className="flex justify-center gap-4 text-sm text-green-600">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{t('exercise:recovery') || 'Recovery'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{t('exercise:lightActivity') || 'Light activity only'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {dailyWorkout.workout_name || `Day ${selectedDay} Workout`}
              </h2>
              <p className="text-gray-600">
                {workoutType === 'home' ? t('exercise:homeWorkout') : t('exercise:gymWorkout')} • 
                {dailyWorkout.estimated_duration || 45} {t('exercise:minutes')}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {dailyWorkout.exercises?.map((exercise: Exercise) => (
          <InteractiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={() => onExerciseStart(exercise.id)}
            onComplete={() => onExerciseComplete(exercise.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimizedExerciseDayView;
