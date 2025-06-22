
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Dumbbell,
  Home,
  Building,
  Sparkles,
  Loader2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  Target,
  Coins,
  Crown,
  RefreshCw
} from 'lucide-react';
import { useExerciseProgram } from '../hooks/core/useExerciseProgram';
import { useWorkoutSession } from '../hooks/core/useWorkoutSession';
import { EnhancedAIGenerationDialog } from './ai/EnhancedAIGenerationDialog';
import { ExerciseCard } from './ExerciseCard';
import { format, addDays } from 'date-fns';

export const ExercisePageRevamped: React.FC = () => {
  const {
    currentProgram,
    isLoading,
    error,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType,
    weekStartDate,
    isRestDay,
    hasProgram,
    isPro,
    profile,
    creditsRemaining,
    isGenerating,
    onGenerateAIProgram,
    onRegenerateProgram,
    onExerciseComplete,
    onExerciseProgressUpdate,
    onExerciseExchange
  } = useExerciseProgram();

  const {
    workoutTimer,
    isTimerRunning,
    onStartWorkout,
    onPauseWorkout,
    onCompleteWorkout
  } = useWorkoutSession();

  const [showAIDialog, setShowAIDialog] = useState(false);

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber - 1] || 'Day';
  };

  const handleWorkoutTypeChange = async (newType: "home" | "gym") => {
    setWorkoutType(newType);
    // If there's a current program with different type, it will automatically refetch
  };

  const handleResetWeek = async () => {
    if (hasProgram && currentProgram) {
      try {
        await onRegenerateProgram();
      } catch (error) {
        console.error('Reset failed:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Error Loading Exercise Program
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Enhanced Page Header */}
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Title Section */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Exercise Programs</h1>
                  <p className="text-gray-600">AI-powered personalized workout plans</p>
                </div>
              </div>
              
              {/* Week Navigation */}
              <div className="flex items-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                  className="border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {formatWeekRange(weekStartDate)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentWeekOffset === 0 ? 'Current Week' : 
                     currentWeekOffset > 0 ? `Week +${currentWeekOffset}` : 
                     `Week ${currentWeekOffset}`}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                  className="border-gray-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Credits & Actions Section */}
            <div className="flex flex-col items-end gap-4">
              
              {/* Credits/Membership Status */}
              <div className="flex items-center gap-3">
                {isPro ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2">
                    <Crown className="w-4 h-4 mr-2" />
                    Pro Member
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-300 text-orange-700 px-4 py-2">
                    <Coins className="w-4 h-4 mr-2" />
                    {creditsRemaining} Credits
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {hasProgram && (
                  <>
                    <Button 
                      onClick={onRegenerateProgram}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                      className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleResetWeek}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Week
                    </Button>
                  </>
                )}
                
                <Button 
                  onClick={() => setShowAIDialog(true)}
                  disabled={!isPro && creditsRemaining <= 0}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {hasProgram ? 'New Program' : 'Generate Program'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Home/Gym Selector */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => handleWorkoutTypeChange('home')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-medium ${
                  workoutType === 'home'
                    ? 'bg-white text-gray-900 shadow-md ring-2 ring-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home Workout</span>
              </button>
              <button
                onClick={() => handleWorkoutTypeChange('gym')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-medium ${
                  workoutType === 'gym'
                    ? 'bg-white text-gray-900 shadow-md ring-2 ring-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Building className="h-5 w-5" />
                <span>Gym Workout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Credits Warning */}
        {!isPro && creditsRemaining <= 2 && (
          <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
            <Coins className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <span className="font-semibold">Only {creditsRemaining} AI credits remaining</span>
              {creditsRemaining <= 2 && (
                <span className="ml-2">• Consider upgrading to Pro for unlimited AI generations</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {!hasProgram ? (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No Exercise Program Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Get started with a personalized AI-generated exercise program tailored to your goals and fitness level.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm text-gray-500">
                  Selected: <span className="font-medium capitalize">{workoutType} Workout</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowAIDialog(true)}
                disabled={isGenerating || (!isPro && creditsRemaining <= 0)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Program
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar - Week Overview */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    Week Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                    const dayWorkout = currentProgram?.daily_workouts?.find(w => w.day_number === dayNum);
                    const hasExercises = dayWorkout?.exercises && dayWorkout.exercises.length > 0;
                    const isSelected = selectedDayNumber === dayNum;
                    const isToday = dayNum === new Date().getDay() || (new Date().getDay() === 0 && dayNum === 7);
                    
                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDayNumber(dayNum)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105' 
                            : isToday
                            ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200 hover:bg-indigo-100'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{getDayName(dayNum)}</div>
                            <div className={`text-sm ${isSelected ? 'text-white/80' : 'opacity-75'}`}>
                              {hasExercises ? 
                                `${dayWorkout.exercises.length} exercises` : 
                                'Rest day'
                              }
                            </div>
                          </div>
                          {hasExercises && dayWorkout.completed && (
                            <CheckCircle2 className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-green-500'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Program Details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Program Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Program:</span>
                        <span className="font-medium text-gray-900">{currentProgram?.program_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {currentProgram?.workout_type}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Difficulty:</span>
                        <Badge variant="outline" className="text-xs">
                          {currentProgram?.difficulty_level}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Week:</span>
                        <span className="font-medium text-gray-900">{currentProgram?.current_week}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Today's Workout */}
            <div className="lg:col-span-3">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-6 w-6 text-indigo-600" />
                      {getDayName(selectedDayNumber)}'s Workout
                    </CardTitle>
                    
                    {!isRestDay && (
                      <div className="flex items-center gap-3">
                        {workoutTimer > 0 && (
                          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{formatTime(workoutTimer)}</span>
                          </Badge>
                        )}
                        <Button
                          onClick={isTimerRunning ? onPauseWorkout : onStartWorkout}
                          size="sm"
                          variant={isTimerRunning ? "destructive" : "default"}
                          className="font-medium"
                        >
                          {isTimerRunning ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Workout
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {isRestDay ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                      </div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-3">Rest Day</h4>
                      <p className="text-gray-600 text-lg">
                        Take a well-deserved break and let your muscles recover!
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Progress Section */}
                      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">Daily Progress</span>
                          <span className="text-sm text-gray-600 font-medium">
                            {completedExercises}/{totalExercises} exercises completed
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-3 bg-white shadow-inner" />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>0%</span>
                          <span>{Math.round(progressPercentage)}%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Exercises List */}
                      <div className="space-y-6">
                        {todaysExercises.map((exercise, index) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onComplete={onExerciseComplete}
                            onTrackProgress={onExerciseProgressUpdate}
                            onExchange={onExerciseExchange}
                          />
                        ))}
                      </div>

                      {/* Completion Celebration */}
                      {completedExercises === totalExercises && totalExercises > 0 && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-900 mb-2">
                              Workout Complete! 🎉
                            </h3>
                            <p className="text-green-700 mb-4">
                              Amazing work! You've completed all exercises for today.
                            </p>
                            <Button 
                              onClick={onCompleteWorkout}
                              className="bg-green-600 hover:bg-green-700 text-white px-6"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Finish Workout Session
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* AI Generation Dialog */}
        <EnhancedAIGenerationDialog
          open={showAIDialog}
          onClose={() => setShowAIDialog(false)}
          onGenerate={async (preferences) => {
            setShowAIDialog(false);
            await onGenerateAIProgram({
              ...preferences,
              workoutType // Ensure we use the current workout type
            });
          }}
          currentWorkoutType={workoutType}
          creditsRemaining={creditsRemaining}
          isPro={isPro}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default ExercisePageRevamped;
