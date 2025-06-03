
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { CompactWorkoutControl } from "./CompactWorkoutControl";
import { RestDayCard } from "./RestDayCard";
import { useState } from "react";

interface EnhancedExerciseListContainerProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

export const EnhancedExerciseListContainer = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: EnhancedExerciseListContainerProps) => {
  const { t } = useLanguage();
  const [sessionActive, setSessionActive] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-8 bg-white shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
            <div className="w-8 h-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Exercises</h3>
            <p className="text-gray-600">Preparing your personalized workout...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isRestDay) {
    return (
      <div className="space-y-6">
        <CompactWorkoutControl
          exercises={[]}
          isRestDay={true}
          onSessionStart={() => {}}
          onSessionPause={() => {}}
          onSessionEnd={() => {}}
          onSessionReset={() => {}}
        />
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-12 bg-white shadow-lg text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {t('exercise.noExercises') || 'No Exercises Available'}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          {t('exercise.noExercisesMessage') || 'No exercises are scheduled for this day. Check back later or generate a new program.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Session Control */}
      <CompactWorkoutControl
        exercises={exercises}
        isRestDay={false}
        onSessionStart={() => setSessionActive(true)}
        onSessionPause={() => {}}
        onSessionEnd={() => setSessionActive(false)}
        onSessionReset={() => setSessionActive(false)}
      />
      
      {/* Interactive Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <InteractiveExerciseCard
            key={exercise.id}
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
