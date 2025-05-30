
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Calendar, Clock, Target, Sparkles, Home, Building2 } from "lucide-react";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import { useLanguage } from "@/contexts/LanguageContext";
import ExerciseProgramWeekNavigation from "@/components/exercise/ExerciseProgramWeekNavigation";
import ExerciseProgramDaySelector from "@/components/exercise/ExerciseProgramDaySelector";
import ExerciseProgramLoadingState from "@/components/exercise/ExerciseProgramLoadingState";
import ExerciseProgramEmptyState from "@/components/exercise/ExerciseProgramEmptyState";
import ExerciseProgramStatsCard from "@/components/exercise/ExerciseProgramStatsCard";
import ExerciseProgramDayContent from "@/components/exercise/ExerciseProgramDayContent";
import ExerciseProgramAIDialog from "@/components/exercise/ExerciseProgramAIDialog";

const Exercise = () => {
  const { t } = useLanguage();
  const exerciseState = useExerciseProgramPage();

  if (exerciseState.isLoading) {
    return <ExerciseProgramLoadingState />;
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Dumbbell className="h-8 w-8 text-fitness-primary" />
                {t('exercise.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {exerciseState.currentDate.toLocaleDateString()} • Week {exerciseState.currentWeekOffset + 1}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Workout Type Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  onClick={() => exerciseState.setWorkoutType("home")}
                  variant={exerciseState.workoutType === "home" ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <Button
                  onClick={() => exerciseState.setWorkoutType("gym")}
                  variant={exerciseState.workoutType === "gym" ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Gym
                </Button>
              </div>

              {exerciseState.currentProgram && (
                <Button
                  onClick={exerciseState.handleRegenerateProgram}
                  disabled={exerciseState.isGenerating}
                  variant="outline"
                  size="sm"
                >
                  Regenerate
                </Button>
              )}
              
              <Button
                onClick={() => exerciseState.setShowAIDialog(true)}
                disabled={exerciseState.isGenerating}
                className="flex items-center gap-2 bg-fitness-gradient text-white"
              >
                <Sparkles className="h-4 w-4" />
                {exerciseState.isGenerating ? 'Generating...' : 'Generate AI Program'}
              </Button>
            </div>
          </div>

          {/* Week Navigation */}
          <ExerciseProgramWeekNavigation
            currentWeekOffset={exerciseState.currentWeekOffset}
            onPreviousWeek={() => exerciseState.setCurrentWeekOffset(exerciseState.currentWeekOffset - 1)}
            onNextWeek={() => exerciseState.setCurrentWeekOffset(exerciseState.currentWeekOffset + 1)}
            onCurrentWeek={() => exerciseState.setCurrentWeekOffset(0)}
            weekStartDate={exerciseState.weekStartDate}
          />

          {/* Day Selector */}
          <ExerciseProgramDaySelector
            selectedDay={exerciseState.selectedDayNumber}
            onDaySelect={exerciseState.setSelectedDayNumber}
            weekStartDate={exerciseState.weekStartDate}
          />

          {exerciseState.currentProgram ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-1 space-y-4">
                <ExerciseProgramStatsCard
                  completedExercises={exerciseState.completedExercises}
                  totalExercises={exerciseState.totalExercises}
                  progressPercentage={exerciseState.progressPercentage}
                  isRestDay={exerciseState.isRestDay}
                  selectedDay={exerciseState.selectedDayNumber}
                />

                {/* Program Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Program Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Program Type</span>
                      <Badge variant="secondary" className="capitalize">
                        {exerciseState.workoutType}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Goal</span>
                      <span className="font-medium capitalize">
                        {exerciseState.currentProgram.goal_type?.replace('_', ' ') || 'General Fitness'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Level</span>
                      <span className="font-medium capitalize">
                        {exerciseState.currentProgram.fitness_level || 'Beginner'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Workouts</span>
                      <span className="font-medium">
                        {exerciseState.currentProgram.daily_workouts?.filter(w => !w.is_rest_day).length || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <ExerciseProgramDayContent
                  selectedDay={exerciseState.selectedDayNumber}
                  todaysWorkouts={exerciseState.todaysWorkouts}
                  todaysExercises={exerciseState.todaysExercises}
                  isRestDay={exerciseState.isRestDay}
                  onExerciseComplete={exerciseState.handleExerciseComplete}
                  onExerciseProgressUpdate={exerciseState.handleExerciseProgressUpdate}
                  weekStartDate={exerciseState.weekStartDate}
                />
              </div>
            </div>
          ) : (
            <ExerciseProgramEmptyState
              workoutType={exerciseState.workoutType}
              onGenerateClick={() => exerciseState.setShowAIDialog(true)}
            />
          )}

          {/* AI Dialog */}
          <ExerciseProgramAIDialog
            open={exerciseState.showAIDialog}
            onOpenChange={exerciseState.setShowAIDialog}
            preferences={exerciseState.aiPreferences}
            onPreferencesChange={exerciseState.setAiPreferences}
            onGenerate={exerciseState.handleGenerateAIProgram}
            isGenerating={exerciseState.isGenerating}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Exercise;
