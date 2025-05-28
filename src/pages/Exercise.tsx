
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, Target, Youtube, Home, Dumbbell, Sparkles, CheckCircle } from "lucide-react";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useAIExercise } from "@/hooks/useAIExercise";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import { useDailyWorkouts } from "@/hooks/useDailyWorkouts";
import { useState } from "react";
import { toast } from "sonner";

const Exercise = () => {
  const navigate = useNavigate();
  const { programs, isLoading } = useExercisePrograms();
  const { generateExerciseProgram, isGenerating } = useAIExercise();
  const { isGeneratingContent, hasExistingContent } = useInitialAIGeneration();
  const [selectedDay, setSelectedDay] = useState(1);
  
  // Get the current week's program (most recent)
  const currentProgram = programs?.[0];
  const { workouts, exercises, isLoading: workoutsLoading } = useDailyWorkouts(currentProgram?.id, selectedDay);

  const handleGenerateProgram = () => {
    const preferences = {
      duration: "4",
      equipment: "Basic home equipment",
      workoutDays: "3-4 days per week",
      difficulty: "beginner"
    };
    
    generateExerciseProgram(preferences);
    toast.success("Generating your personalized exercise program...");
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

  const weekDays = [
    { day: 1, name: "Monday" },
    { day: 2, name: "Tuesday" },
    { day: 3, name: "Wednesday" },
    { day: 4, name: "Thursday" },
    { day: 5, name: "Friday" },
    { day: 6, name: "Saturday" },
    { day: 7, name: "Sunday" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Exercise Program</h1>
              <p className="text-gray-600">
                {currentProgram ? `${currentProgram.program_name} - ${currentProgram.difficulty_level}` : "Generate your workout plan"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerateProgram}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
            <Badge variant="outline" className="bg-white/80">
              <Home className="w-3 h-3 mr-1" />
              Home Workout
            </Badge>
          </div>
        </div>

        {currentProgram && workouts ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Workout Summary */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Workout</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">{currentWorkout?.workout_name || 'Rest Day'}</h4>
                  <p className="text-sm text-gray-600">{currentProgram.difficulty_level}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">{currentWorkout?.estimated_duration || 0} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calories</span>
                    <span className="text-sm font-medium">{currentWorkout?.estimated_calories || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Muscle Groups</span>
                    <span className="text-sm font-medium">{currentWorkout?.muscle_groups?.join(', ') || 'Full Body'}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">
                      {completedExercises}/{totalExercises}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {currentWorkout && (
                  <Button className="w-full bg-fitness-gradient hover:opacity-90 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    {progressPercentage > 0 ? 'Continue Workout' : 'Start Workout'}
                  </Button>
                )}
              </div>
            </Card>

            {/* Exercise List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Exercise List</h2>
                <Badge variant="outline" className="bg-white/80">
                  {exercises?.length || 0} exercises
                </Badge>
              </div>
              
              {workoutsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading exercises...</p>
                </div>
              ) : exercises && exercises.length > 0 ? (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <Card 
                      key={exercise.id} 
                      className={`p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        exercise.completed ? 'bg-green-50/80' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            exercise.completed 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {exercise.completed ? <CheckCircle className="w-5 h-5" /> : exercise.order_number || index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {exercise.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span>{exercise.sets} sets × {exercise.reps} reps</span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {exercise.rest_seconds}s rest
                              </span>
                              <span className="flex items-center">
                                <Target className="w-3 h-3 mr-1" />
                                {exercise.muscle_groups?.join(', ') || 'Full Body'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {exercise.equipment || 'Bodyweight'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {exercise.difficulty || 'Beginner'}
                              </Badge>
                            </div>
                            {exercise.instructions && (
                              <p className="text-sm text-gray-600 mt-2">{exercise.instructions}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {exercise.youtube_search_term && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/80"
                              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search_term)}`, '_blank')}
                            >
                              <Youtube className="w-4 h-4 mr-1" />
                              Tutorial
                            </Button>
                          )}
                          {!exercise.completed && (
                            <Button
                              size="sm"
                              className="bg-fitness-gradient hover:opacity-90 text-white"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
                  <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Exercises for Today</h3>
                  <p className="text-gray-600">This might be a rest day or select another day to see exercises</p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          // No programs state
          <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exercise Program Yet</h3>
            <p className="text-gray-600 mb-6">Generate your personalized AI exercise program to get started</p>
            <Button 
              onClick={handleGenerateProgram}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate AI Exercise Program'}
            </Button>
          </Card>
        )}

        {/* Weekly Program Overview */}
        {currentProgram && (
          <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Exercise Program</h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map((dayInfo) => (
                <div
                  key={dayInfo.day}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
                    selectedDay === dayInfo.day 
                      ? 'border-fitness-primary bg-fitness-primary/10' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDay(dayInfo.day)}
                >
                  <div className="text-center">
                    <p className="font-medium text-gray-800 mb-2">{dayInfo.name}</p>
                    <div className="flex items-center justify-center text-xs text-gray-600">
                      <Dumbbell className="w-3 h-3 mr-1" />
                      Day {dayInfo.day}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Exercise;
