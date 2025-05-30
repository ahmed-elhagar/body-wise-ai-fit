
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RefreshCw, Sparkles, Calendar, Home, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { WeeklyExerciseNavigation } from "./WeeklyExerciseNavigation";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { format, addDays } from "date-fns";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  todaysWorkouts: any[];
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  handleGenerateAIProgram: (prefs: any) => void;
  handleRegenerateProgram: () => void;
  handleExerciseComplete: (exerciseId: string) => void;
  handleExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isGenerating: boolean;
  refetch: () => void;
  isRestDay: boolean;
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
  const navigate = useNavigate();
  const { t } = useLanguage();

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  console.log('🎯 ExerciseProgramPageContent - Debug Info:', {
    hasCurrentProgram: !!currentProgram,
    workoutType,
    selectedDayNumber,
    todaysWorkoutsCount: todaysWorkouts?.length || 0,
    todaysExercisesCount: todaysExercises?.length || 0,
    isRestDay,
    progressPercentage,
    isToday
  });

  if (!currentProgram) {
    return (
      <EmptyExerciseState
        onGenerateProgram={(prefs) => handleGenerateAIProgram(prefs)}
        workoutType={workoutType}
        setWorkoutType={setWorkoutType}
        showAIDialog={showAIDialog}
        setShowAIDialog={setShowAIDialog}
        aiPreferences={aiPreferences}
        setAiPreferences={setAiPreferences}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t('exercise.exerciseProgram') || 'Exercise Program'}
            </h1>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-gray-600">
                {currentProgram.program_name} - {currentProgram.difficulty_level}
              </p>
              <div className="flex items-center gap-1">
                {workoutType === "home" ? (
                  <Home className="w-4 h-4 text-health-primary" />
                ) : (
                  <Building2 className="w-4 h-4 text-health-primary" />
                )}
                <span className="text-sm text-health-primary font-medium">
                  {workoutType === "home" ? t('exercise.home') : t('exercise.gym')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowAIDialog(true)}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('exercise.customizeProgram') || 'Customize Program'}
          </Button>
          
          <Button 
            onClick={handleRegenerateProgram}
            disabled={isGenerating}
            variant="outline"
            className="bg-white/80"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('exercise.generateNew') || 'Generate New'}
          </Button>
        </div>
      </div>

      {/* Workout Type Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant={workoutType === "home" ? "default" : "outline"}
              onClick={() => setWorkoutType("home")}
              className={`${workoutType === "home" ? "bg-health-primary hover:bg-health-primary/90" : ""}`}
            >
              <Home className="w-4 h-4 mr-2" />
              {t('exercise.home')}
            </Button>
            <Button
              variant={workoutType === "gym" ? "default" : "outline"}
              onClick={() => setWorkoutType("gym")}
              className={`${workoutType === "gym" ? "bg-health-primary hover:bg-health-primary/90" : ""}`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              {t('exercise.gym')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Weekly Navigation */}
      <WeeklyExerciseNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
      />

      {/* Day Selector */}
      <ExerciseDaySelector
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        workoutType={workoutType}
      />

      {/* Progress Overview Card */}
      {!isRestDay && totalExercises > 0 && (
        <Card className="p-6 bg-gradient-to-r from-health-primary/5 to-health-secondary/5 border-health-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-health-primary">
                {todaysWorkouts[0]?.workout_name || t('exercise.todaysWorkout')}
              </div>
              <p className="text-health-text-secondary mt-1">
                {format(currentSelectedDate, 'EEEE, MMM d')}
                {isToday && (
                  <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-700">
                    {t('exercise.today') || 'Today'}
                  </Badge>
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-health-primary">
                {completedExercises}/{totalExercises}
              </div>
              <p className="text-health-text-secondary mt-1">
                {t('exercise.exercisesCompleted') || 'Exercises Completed'}
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-health-primary">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-health-text-secondary mt-1">
                {t('exercise.workoutProgress') || 'Workout Progress'}
              </p>
              <Progress value={progressPercentage} className="mt-2 h-2" />
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              disabled={progressPercentage >= 100}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {progressPercentage >= 100 
                ? (t('exercise.workoutCompleted') || 'Workout Completed!') 
                : (t('exercise.startWorkout') || 'Start Workout')
              }
            </Button>

            <Button
              variant="outline"
              onClick={() => {/* Handle reset */}}
              className="border-health-border hover:bg-health-soft"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('exercise.reset') || 'Reset'}
            </Button>
          </div>
        </Card>
      )}

      {/* Exercise List */}
      <ExerciseListEnhanced
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
        isRestDay={isRestDay}
      />

      {/* AI Dialog */}
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
