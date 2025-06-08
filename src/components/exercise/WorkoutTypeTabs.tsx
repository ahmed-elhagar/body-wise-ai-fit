
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutContentLayout } from "./WorkoutContentLayout";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface WorkoutTypeTabsProps {
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  currentProgram: ExerciseProgram | null;
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  selectedDayNumber: number;
  currentWeekOffset: number;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onGenerateAIProgram: (preferences: ExercisePreferences) => void;
  isGenerating: boolean;
  isRestDay?: boolean;
}

export const WorkoutTypeTabs = ({
  workoutType,
  setWorkoutType,
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  selectedDayNumber,
  currentWeekOffset,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onGenerateAIProgram,
  isGenerating,
  isRestDay
}: WorkoutTypeTabsProps) => {
  const { t } = useLanguage();

  const renderTabContent = (type: "home" | "gym") => {
    const hasValidProgram = currentProgram && currentProgram.workout_type === type;

    if (hasValidProgram) {
      return (
        <WorkoutContentLayout
          todaysExercises={todaysExercises}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          currentProgram={currentProgram}
          selectedDayNumber={selectedDayNumber}
          currentWeekOffset={currentWeekOffset}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isRestDay}
        />
      );
    }

    return (
      <ExerciseProgramSelector 
        onGenerateProgram={(prefs) => onGenerateAIProgram({...prefs, workoutType: type})}
        isGenerating={isGenerating}
        workoutType={type}
      />
    );
  };

  return (
    <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white h-14 border border-health-border rounded-xl shadow-sm p-1">
        <TabsTrigger 
          value="home" 
          className="data-[state=active]:bg-health-primary data-[state=active]:text-white data-[state=active]:shadow-md text-health-text-secondary font-medium rounded-lg transition-all duration-200 h-11"
        >
          <Home className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.homeWorkout')}</span>
          <span className="sm:hidden">{t('exercise.home')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="gym" 
          className="data-[state=active]:bg-health-primary data-[state=active]:text-white data-[state=active]:shadow-md text-health-text-secondary font-medium rounded-lg transition-all duration-200 h-11"
        >
          <Building2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.gymWorkout')}</span>
          <span className="sm:hidden">{t('exercise.gym')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="mt-6">
        {renderTabContent("home")}
      </TabsContent>

      <TabsContent value="gym" className="mt-6">
        {renderTabContent("gym")}
      </TabsContent>
    </Tabs>
  );
};
