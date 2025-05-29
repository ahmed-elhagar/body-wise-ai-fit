
import { useState } from "react";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useAIExercise } from "@/hooks/useAIExercise";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import { useDailyWorkouts } from "@/hooks/useDailyWorkouts";
import { toast } from "sonner";
import { ExerciseHeader } from "@/components/exercise/ExerciseHeader";
import { WorkoutSummaryCard } from "@/components/exercise/WorkoutSummaryCard";
import { ExerciseList } from "@/components/exercise/ExerciseList";
import { WeeklyProgramOverview } from "@/components/exercise/WeeklyProgramOverview";
import { ExerciseProgramSelector } from "@/components/exercise/ExerciseProgramSelector";
import { WorkoutTypeToggle } from "@/components/exercise/WorkoutTypeToggle";

const Exercise = () => {
  const { programs, isLoading } = useExercisePrograms();
  const { generateExerciseProgram, isGenerating } = useAIExercise();
  const { isGeneratingContent, hasExistingContent } = useInitialAIGeneration();
  const [selectedDay, setSelectedDay] = useState(1);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  
  // Get the current week's program (most recent)
  const currentProgram = programs?.[0];
  const { workouts, exercises, isLoading: workoutsLoading } = useDailyWorkouts(currentProgram?.id, selectedDay, workoutType);

  const handleGenerateProgram = (preferences: any) => {
    generateExerciseProgram(preferences);
    toast.success(`Generating your personalized ${preferences.workoutType} exercise program...`);
  };

  // Show loading screen only if data is being loaded AND we're not sure about existing content
  if (isLoading && hasExistingContent === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your exercise program...</p>
        </div>
      </div>
    );
  }

  // Show generation screen only if actively generating
  if (isGeneratingContent && hasExistingContent === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized exercise program...</p>
        </div>
      </div>
    );
  }

  const currentWorkout = workouts?.[0];
  const completedExercises = exercises?.filter(ex => ex.completed)?.length || 0;
  const totalExercises = exercises?.length || 0;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <ExerciseHeader 
          currentProgram={currentProgram}
          onGenerateProgram={() => {}} // We'll handle this in the selector now
          isGenerating={isGenerating}
        />

        {currentProgram && workouts ? (
          <div className="space-y-6">
            <WorkoutTypeToggle 
              workoutType={workoutType}
              onWorkoutTypeChange={setWorkoutType}
            />
            
            <div className="grid lg:grid-cols-4 gap-6">
              <WorkoutSummaryCard
                currentWorkout={currentWorkout}
                currentProgram={currentProgram}
                completedExercises={completedExercises}
                totalExercises={totalExercises}
                progressPercentage={progressPercentage}
                workoutType={workoutType}
              />

              <ExerciseList 
                exercises={exercises}
                workoutsLoading={workoutsLoading}
              />
            </div>
          </div>
        ) : (
          <ExerciseProgramSelector 
            onGenerateProgram={handleGenerateProgram}
            isGenerating={isGenerating}
          />
        )}

        <WeeklyProgramOverview
          currentProgram={currentProgram}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          workoutType={workoutType}
        />
      </div>
    </div>
  );
};

export default Exercise;
