import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { AdvancedWorkoutSession } from "./AdvancedWorkoutSession";
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
        <RestDayCard />
        <AdvancedWorkoutSession
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

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalDuration = exercises.reduce((total, ex) => total + (ex.rest_seconds || 60), 0);
  const estimatedTime = Math.ceil((exercises.length * 3 + totalDuration / 60) / 60); // Rough estimation

  return (
    <div className="space-y-6">
      {/* Enhanced Session Control */}
      <AdvancedWorkoutSession
        exercises={exercises}
        isRestDay={false}
        onSessionStart={() => setSessionActive(true)}
        onSessionPause={() => {}}
        onSessionEnd={() => setSessionActive(false)}
        onSessionReset={() => setSessionActive(false)}
      />

      {/* Workout Overview */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              Today's Workout
            </h2>
            <p className="text-gray-600">
              Complete exercises in order for optimal results
            </p>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 font-semibold px-4 py-2"
              >
                <Target className="w-4 h-4 mr-2" />
                {completedCount}/{exercises.length} Complete
              </Badge>
              
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-700 font-medium px-4 py-2"
              >
                <Clock className="w-4 h-4 mr-2" />
                ~{estimatedTime}h workout
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Progress</span>
          <span>{Math.round(exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0)}%</span>
        </div>
      </Card>
      
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

      {/* Completion Celebration */}
      {completedCount === exercises.length && exercises.length > 0 && (
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-center shadow-lg">
          <div className="space-y-4">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Workout Complete!
              </h3>
              <p className="text-green-600 text-lg">
                Amazing job! You've completed all {exercises.length} exercises.
              </p>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Badge className="bg-green-500 text-white text-lg px-6 py-2">
                💪 Strength +1
              </Badge>
              <Badge className="bg-blue-500 text-white text-lg px-6 py-2">
                🏆 Consistency +1
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
