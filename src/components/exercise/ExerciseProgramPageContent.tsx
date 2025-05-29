
import { ExerciseHeader } from "./ExerciseHeader";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { WeeklyExerciseNavigation } from "./WeeklyExerciseNavigation";
import { TodaysWorkoutCard } from "./TodaysWorkoutCard";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}: ExerciseProgramPageContentProps & { isRestDay?: boolean }) => {
  return (
    <div className="space-y-6">
      <ExerciseHeader 
        currentProgram={currentProgram}
        onGenerateProgram={handleRegenerateProgram}
        isGenerating={isGenerating}
        onShowAIDialog={() => setShowAIDialog(true)}
      />

      {/* Weekly Navigation */}
      <WeeklyExerciseNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
      />

      {/* Workout Type Tabs */}
      <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="home" className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white">
            🏠 Home Workout
          </TabsTrigger>
          <TabsTrigger value="gym" className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white">
            🏋️ Gym Workout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-6">
          {currentProgram && currentProgram.workout_type === "home" ? (
            <div className="space-y-6">
              <ExerciseDaySelector
                selectedDayNumber={selectedDayNumber}
                setSelectedDayNumber={setSelectedDayNumber}
                currentProgram={currentProgram}
                workoutType="home"
              />

              <div className="grid lg:grid-cols-4 gap-6">
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
            </div>
          ) : (
            <ExerciseProgramSelector 
              onGenerateProgram={(prefs) => handleGenerateAIProgram({...prefs, workoutType: "home"})}
              isGenerating={isGenerating}
              workoutType="home"
            />
          )}
        </TabsContent>

        <TabsContent value="gym" className="mt-6">
          {currentProgram && currentProgram.workout_type === "gym" ? (
            <div className="space-y-6">
              <ExerciseDaySelector
                selectedDayNumber={selectedDayNumber}
                setSelectedDayNumber={setSelectedDayNumber}
                currentProgram={currentProgram}
                workoutType="gym"
              />

              <div className="grid lg:grid-cols-4 gap-6">
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
