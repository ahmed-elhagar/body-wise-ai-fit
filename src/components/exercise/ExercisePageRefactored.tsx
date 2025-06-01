
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Target, 
  PlayCircle,
  CheckCircle,
  Clock,
  Flame
} from "lucide-react";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import { format, addDays } from "date-fns";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";
import { EmptyExerciseState } from "./EmptyExerciseState";

const ExercisePageRefactored = () => {
  const {
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType,
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    currentProgram,
    isLoading,
    isGenerating,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    weekStartDate,
    handleGenerateAIProgram,
    handleExerciseComplete
  } = useOptimizedExerciseProgramPage();

  const selectedDate = useMemo(() => {
    return addDays(weekStartDate, selectedDayNumber - 1);
  }, [weekStartDate, selectedDayNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-primary-50 via-blue-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <EnhancedLoadingIndicator
            status="loading"
            type="general"
            message="Loading Your Exercise Program"
            description="Preparing your personalized workout journey..."
            size="lg"
            variant="card"
            showSteps={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Enhanced Hero Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-fitness-primary/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
          <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-fitness-primary/30 to-purple-400/30 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-3xl translate-y-24 -translate-x-24" />
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-fitness-gradient rounded-2xl flex items-center justify-center shadow-xl">
                      <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fitness-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Exercise Program
                      </h1>
                      <p className="text-lg text-gray-600 font-medium">
                        AI-Powered Personalized Workouts
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-fitness-gradient text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </Badge>
                    <Badge variant="outline" className="bg-white/80 border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium">
                      <Target className="w-4 h-4 mr-2" />
                      Day {selectedDayNumber} of 7
                    </Badge>
                    {totalExercises > 0 && (
                      <Badge variant="outline" className="bg-white/80 border-green-300 text-green-700 px-4 py-2 text-sm font-medium">
                        <Flame className="w-4 h-4 mr-2" />
                        {totalExercises} exercises
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {!currentProgram ? (
          <EmptyExerciseState
            onGenerateProgram={() => handleGenerateAIProgram(aiPreferences)}
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
            showAIDialog={showAIDialog}
            setShowAIDialog={setShowAIDialog}
            aiPreferences={aiPreferences}
            setAiPreferences={setAiPreferences}
            isGenerating={isGenerating}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Stats Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Daily Progress Card */}
              <Card className="bg-gradient-to-br from-white to-fitness-primary-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-fitness-gradient rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Daily Progress</h3>
                      <p className="text-sm text-gray-600">Workout completion</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Exercise Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-gray-700">Exercises</span>
                      <span className="text-lg font-bold bg-fitness-gradient bg-clip-text text-transparent">
                        {completedExercises} / {totalExercises}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 bg-gray-200" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progressPercentage}% complete</span>
                      <span>{totalExercises - completedExercises} remaining</span>
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* Enhanced Week Navigation */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-fitness-primary" />
                      <h2 className="text-xl font-bold text-gray-800">
                        Week of {format(weekStartDate, 'MMMM d, yyyy')}
                      </h2>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                        variant="outline"
                        size="sm"
                        className="px-4"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentWeekOffset(0)}
                        variant={currentWeekOffset === 0 ? "default" : "outline"}
                        size="sm"
                        className="px-4"
                      >
                        Current
                      </Button>
                      <Button
                        onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                        variant="outline"
                        size="sm"
                        className="px-4"
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Day Selector */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const dayNumber = i + 1;
                      const dayDate = addDays(weekStartDate, i);
                      const isSelected = selectedDayNumber === dayNumber;
                      const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                      
                      return (
                        <Button
                          key={dayNumber}
                          onClick={() => setSelectedDayNumber(dayNumber)}
                          variant={isSelected ? "default" : "outline"}
                          className={`p-4 h-auto flex flex-col items-center gap-2 transition-all duration-300 ${
                            isSelected 
                              ? 'bg-fitness-gradient text-white shadow-lg scale-105' 
                              : 'bg-white hover:bg-gray-50'
                          } ${isToday ? 'ring-2 ring-fitness-primary ring-offset-2' : ''}`}
                        >
                          <span className="text-xs font-medium opacity-75">
                            {format(dayDate, 'EEE')}
                          </span>
                          <span className="text-lg font-bold">
                            {format(dayDate, 'd')}
                          </span>
                          {isToday && (
                            <div className="w-2 h-2 bg-fitness-primary rounded-full" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Exercises Display */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-6 h-6 text-fitness-primary" />
                      <h2 className="text-xl font-bold text-gray-800">
                        {format(selectedDate, 'EEEE')} Workout
                      </h2>
                    </div>
                    <Badge className="bg-fitness-gradient text-white px-4 py-2">
                      {todaysExercises?.length || 0} exercises
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isRestDay ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Rest Day</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Take this time to recover and prepare for tomorrow's workout.
                      </p>
                    </div>
                  ) : todaysExercises?.length > 0 ? (
                    <div className="grid gap-4">
                      {todaysExercises.map((exercise, index) => (
                        <Card key={`${exercise.id}-${index}`} className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`w-3 h-3 rounded-full ${exercise.completed ? 'bg-green-500' : 'bg-fitness-primary'}`} />
                                  <h4 className="font-bold text-lg text-gray-800">{exercise.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {exercise.category || 'Exercise'}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                    <div className="text-lg font-bold text-blue-600">{exercise.sets || 3}</div>
                                    <div className="text-xs text-blue-500">sets</div>
                                  </div>
                                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">{exercise.reps || '10-12'}</div>
                                    <div className="text-xs text-green-500">reps</div>
                                  </div>
                                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                    <div className="text-lg font-bold text-purple-600">{exercise.duration || '45s'}</div>
                                    <div className="text-xs text-purple-500">duration</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  onClick={() => handleExerciseComplete(exercise.id)}
                                  size="sm"
                                  variant={exercise.completed ? "outline" : "default"}
                                  className={exercise.completed ? "bg-green-50 text-green-700 border-green-200" : "bg-fitness-gradient"}
                                >
                                  {exercise.completed ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Completed
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="w-4 h-4 mr-2" />
                                      Start
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Dumbbell className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">No exercises planned for this day</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExercisePageRefactored;
