
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Heart, 
  Coins, 
  Crown, 
  Dumbbell,
  Home,
  Building,
  Sparkles,
  Loader2,
  Play,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Pause
} from 'lucide-react';
import { useExerciseProgram } from '../hooks/core/useExerciseProgram';
import { useWorkoutSession } from '../hooks/core/useWorkoutSession';
import { EnhancedAIGenerationDialog } from './ai/EnhancedAIGenerationDialog';
import { ExerciseCard } from './ExerciseCard';
import { format, addDays, startOfWeek } from 'date-fns';

export const ExercisePage: React.FC = () => {
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

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Exercise Programs"
          description="AI-powered personalized workout plans"
          icon={<Dumbbell className="w-8 h-8 text-indigo-600" />}
        />
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Exercise Programs"
          description="AI-powered personalized workout plans"
          icon={<Dumbbell className="w-8 h-8 text-indigo-600" />}
        />
        <Card className="bg-red-50 border-red-200">
          <div className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Dumbbell className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Exercise Program
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Exercise Programs"
        description="AI-powered personalized workout plans"
        icon={<Dumbbell className="w-8 h-8 text-indigo-600" />}
      />

      {/* Status Alerts */}
      {!isPro && (
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
          <Coins className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <span className="font-semibold">{creditsRemaining} AI credits remaining</span>
            {creditsRemaining <= 2 && (
              <span className="ml-2">• Consider upgrading to Pro for unlimited AI generations</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {isPro && (
        <Alert className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 mb-6">
          <Crown className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <span className="font-semibold">Pro Member</span> • Unlimited AI generations and premium features
          </AlertDescription>
        </Alert>
      )}

      {/* Week Navigation & Controls */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {formatWeekRange(weekStartDate)}
              </h3>
              <p className="text-sm text-gray-600">
                {currentWeekOffset === 0 ? 'Current Week' : 
                 currentWeekOffset > 0 ? `Week +${currentWeekOffset}` : 
                 `Week ${currentWeekOffset}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasProgram && (
              <Button 
                onClick={onRegenerateProgram}
                disabled={isGenerating}
                variant="outline"
                size="sm"
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
            )}
            
            <Button 
              onClick={() => setShowAIDialog(true)}
              disabled={!isPro && creditsRemaining <= 0}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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

        {/* Home/Gym Switcher */}
        <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setWorkoutType('home')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              workoutType === 'home'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="font-medium">Home Workout</span>
          </button>
          <button
            onClick={() => setWorkoutType('gym')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              workoutType === 'gym'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="h-4 w-4" />
            <span className="font-medium">Gym Workout</span>
          </button>
        </div>
      </Card>

      {!hasProgram ? (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Exercise Program Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started with a personalized AI-generated exercise program tailored to your goals and fitness level.
            </p>
            <Button 
              onClick={() => setShowAIDialog(true)}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Program
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Week Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                Week Overview
              </h3>
              
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                  const dayWorkout = currentProgram?.daily_workouts?.find(w => w.day_number === dayNum);
                  const hasExercises = dayWorkout?.exercises && dayWorkout.exercises.length > 0;
                  const isSelected = selectedDayNumber === dayNum;
                  const isToday = dayNum === new Date().getDay() || (new Date().getDay() === 0 && dayNum === 7);
                  
                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDayNumber(dayNum)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : isToday
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{getDayName(dayNum)}</div>
                          <div className="text-sm opacity-75">
                            {hasExercises ? 
                              `${dayWorkout.exercises.length} exercises` : 
                              'Rest day'
                            }
                          </div>
                        </div>
                        {hasExercises && dayWorkout.completed && (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Program Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Program Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Program:</span>
                    <span className="font-medium">{currentProgram?.program_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge variant="outline" className="text-xs">
                      {currentProgram?.difficulty_level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{currentProgram?.workout_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Week:</span>
                    <span className="font-medium">{currentProgram?.current_week}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Today's Workout */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 text-indigo-600 mr-2" />
                  {getDayName(selectedDayNumber)}'s Workout
                </h3>
                
                {!isRestDay && (
                  <div className="flex items-center space-x-2">
                    {workoutTimer > 0 && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(workoutTimer)}</span>
                      </Badge>
                    )}
                    <Button
                      onClick={isTimerRunning ? onPauseWorkout : onStartWorkout}
                      size="sm"
                      variant={isTimerRunning ? "destructive" : "default"}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {isRestDay ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Rest Day</h4>
                  <p className="text-gray-600">
                    Take a well-deserved break and let your muscles recover!
                  </p>
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {completedExercises}/{totalExercises} exercises
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Exercise List */}
                  <div className="space-y-4">
                    {todaysExercises.map((exercise, index) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onComplete={onExerciseComplete}
                        onTrackProgress={(exerciseId, sets, reps, weight, notes) => 
                          onExerciseProgressUpdate(exerciseId, sets, reps, notes, weight)
                        }
                        onExchange={onExerciseExchange}
                      />
                    ))}
                  </div>

                  {completedExercises === totalExercises && totalExercises > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">
                          Workout Complete! Great job!
                        </span>
                      </div>
                      <Button 
                        onClick={onCompleteWorkout}
                        className="mt-2 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Finish Workout
                      </Button>
                    </div>
                  )}
                </>
              )}
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
          await onGenerateAIProgram(preferences);
        }}
        currentWorkoutType={workoutType}
        creditsRemaining={creditsRemaining}
        isPro={isPro}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ExercisePage;
