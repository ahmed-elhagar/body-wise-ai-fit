
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { WorkoutTypeToggle } from "./WorkoutTypeToggle";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";

interface ExercisePageContentProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
  currentProgram: any;
  selectedDayNumber: number;
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const ExercisePageContent = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  currentProgram,
  selectedDayNumber,
  workoutType,
  onWorkoutTypeChange
}: ExercisePageContentProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("exercises");

  return (
    <div className="space-y-6">
      {/* Workout Type Toggle */}
      <WorkoutTypeToggle 
        workoutType={workoutType}
        onWorkoutTypeChange={onWorkoutTypeChange}
      />

      {/* Program Selector */}
      <ExerciseProgramSelector 
        currentProgram={currentProgram}
        workoutType={workoutType}
      />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises">
            {t('exercise.exercises', 'Exercises')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {t('exercise.analytics', 'Analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-4">
          <ExerciseListEnhanced
            exercises={exercises}
            isLoading={isLoading}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            isRestDay={isRestDay}
            currentProgram={currentProgram}
            selectedDayNumber={selectedDayNumber}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('exercise.analyticsTitle', 'Exercise Analytics')}
            </h3>
            <p className="text-gray-600">
              {t('exercise.analyticsComingSoon', 'Analytics features coming soon!')}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
