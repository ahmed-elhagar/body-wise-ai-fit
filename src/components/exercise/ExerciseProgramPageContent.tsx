
import { TodaysWorkoutCard } from "./TodaysWorkoutCard";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseEnhancedNavigation } from "./ExerciseEnhancedNavigation";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  currentProgram: ExerciseProgram | null;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  todaysWorkouts: any[];
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: ExercisePreferences;
  setAiPreferences: (prefs: ExercisePreferences) => void;
  handleGenerateAIProgram: (preferences: ExercisePreferences) => void;
  handleRegenerateProgram: () => void;
  handleExerciseComplete: (exerciseId: string) => void;
  handleExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isGenerating: boolean;
  refetch: () => void;
  isRestDay?: boolean;
}

export const ExerciseProgramPageContent = ({
  currentDate,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  currentProgram,
  workoutType,
  setWorkoutType,
  todaysWorkouts,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  handleGenerateAIProgram,
  handleRegenerateProgram,
  handleExerciseComplete,
  handleExerciseProgressUpdate,
  isGenerating,
  refetch,
  isRestDay
}: ExerciseProgramPageContentProps) => {
  const { t } = useLanguage();

  // Check if current week has data for the selected workout type
  const hasDataForCurrentWeek = currentProgram && currentProgram.workout_type === workoutType;

  const handleGenerateForCurrentWeek = () => {
    const preferences = {
      ...aiPreferences,
      workoutType: workoutType
    };
    handleGenerateAIProgram(preferences);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Navigation - Week and Day Selection */}
      <ExerciseEnhancedNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        workoutType={workoutType}
        hasDataForCurrentWeek={!!hasDataForCurrentWeek}
        onGenerateForWeek={handleGenerateForCurrentWeek}
      />

      {/* Workout Type Tabs */}
      <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm h-12 sm:h-14">
          <TabsTrigger 
            value="home" 
            className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white text-sm sm:text-base font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.homeWorkout')}</span>
            <span className="sm:hidden">{t('exercise.home')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="gym" 
            className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white text-sm sm:text-base font-medium"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.gymWorkout')}</span>
            <span className="sm:hidden">{t('exercise.gym')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-4 sm:mt-6">
          {currentProgram && currentProgram.workout_type === "home" ? (
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
              <TodaysWorkoutCard
                todaysWorkouts={todaysWorkouts}
                currentProgram={currentProgram}
                completedExercises={completedExercises}
                totalExercises={totalExercises}
                progressPercentage={progressPercentage}
                workoutType="home"
                selectedDay={selectedDayNumber}
                isRestDay={isRestDay}
              />

              <ExerciseListEnhanced 
                exercises={todaysExercises}
                isLoading={false}
                onExerciseComplete={handleExerciseComplete}
                onExerciseProgressUpdate={handleExerciseProgressUpdate}
                isRestDay={isRestDay}
              />
            </div>
          ) : (
            <ExerciseProgramSelector 
              onGenerateProgram={(prefs) => handleGenerateAIProgram({...prefs, workoutType: "home"})}
              isGenerating={isGenerating}
              workoutType="home"
            />
          )}
        </TabsContent>

        <TabsContent value="gym" className="mt-4 sm:mt-6">
          {currentProgram && currentProgram.workout_type === "gym" ? (
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
              <TodaysWorkoutCard
                todaysWorkouts={todaysWorkouts}
                currentProgram={currentProgram}
                completedExercises={completedExercises}
                totalExercises={totalExercises}
                progressPercentage={progressPercentage}
                workoutType="gym"
                selectedDay={selectedDayNumber}
                isRestDay={isRestDay}
              />

              <ExerciseListEnhanced 
                exercises={todaysExercises}
                isLoading={false}
                onExerciseComplete={handleExerciseComplete}
                onExerciseProgressUpdate={handleExerciseProgressUpdate}
                isRestDay={isRestDay}
              />
            </div>
          ) : (
            <ExerciseProgramSelector 
              onGenerateProgram={(prefs) => handleGenerateAIProgram({...prefs, workoutType: "gym"})}
              isGenerating={isGenerating}
              workoutType="gym"
            />
          )}
        </TabsContent>
      </Tabs>

      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={handleGenerateAIProgram}
        isGenerating={isGenerating}
      />
    </div>
  );
};
