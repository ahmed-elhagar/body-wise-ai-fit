
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { TodaysWorkoutCard } from "./TodaysWorkoutCard";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseCompactNavigation } from "./ExerciseCompactNavigation";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building2 } from "lucide-react";

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
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Workout Type Tabs - Start immediately */}
      <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm h-12 sm:h-14">
          <TabsTrigger 
            value="home" 
            className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white text-sm sm:text-base font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Home Workout</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger 
            value="gym" 
            className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white text-sm sm:text-base font-medium"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Gym Workout</span>
            <span className="sm:hidden">Gym</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-4 sm:mt-6">
          {currentProgram && currentProgram.workout_type === "home" ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Compact Navigation combining week and day selection */}
              <ExerciseCompactNavigation
                currentWeekOffset={currentWeekOffset}
                setCurrentWeekOffset={setCurrentWeekOffset}
                weekStartDate={weekStartDate}
                selectedDayNumber={selectedDayNumber}
                setSelectedDayNumber={setSelectedDayNumber}
                currentProgram={currentProgram}
                workoutType="home"
              />

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
            <div className="space-y-4 sm:space-y-6">
              {/* Compact Navigation combining week and day selection */}
              <ExerciseCompactNavigation
                currentWeekOffset={currentWeekOffset}
                setCurrentWeekOffset={setCurrentWeekOffset}
                weekStartDate={weekStartDate}
                selectedDayNumber={selectedDayNumber}
                setSelectedDayNumber={setSelectedDayNumber}
                currentProgram={currentProgram}
                workoutType="gym"
              />

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
