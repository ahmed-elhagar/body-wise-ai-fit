
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
  CheckCircle2
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
    onExerciseProgressUpdate
  } = useExerciseProgram();

  const {
    workoutTimer,
    isTimerRunning,
    onStartWorkout,
    onPauseWorkout,
    onCompleteWorkout
  } = useWorkoutSession();

  const [activeView, setActiveView] = useState<'overview' | 'workout' | 'progress'>('overview');
  const [showAIDialog, setShowAIDialog] = useState(false);

  const viewTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'workout', label: 'Today\'s Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
    <div className="p-6">
      <PageHeader
        title="Exercise Programs"
        description="AI-powered personalized workout plans"
        icon={<Dumbbell className="w-8 h-8 text-indigo-600" />}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 px-3 font-medium">
            {formatWeekRange(weekStartDate)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {hasProgram ? (
            <Button 
              onClick={onRegenerateProgram}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          ) : (
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
                  Generate Program
                </>
              )}
            </Button>
          )}
        </div>
      </PageHeader>

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

      {/* Workout Type Selector - Single Instance */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Dumbbell className="h-4 w-4 mr-2 text-indigo-600" />
          Workout Environment
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { 
              value: 'home' as const, 
              label: 'Home Workout', 
              icon: Home, 
              description: 'Bodyweight & minimal equipment',
              gradient: 'from-green-400 to-emerald-500'
            },
            { 
              value: 'gym' as const, 
              label: 'Gym Workout', 
              icon: Building, 
              description: 'Full equipment access',
              gradient: 'from-blue-400 to-indigo-500'
            }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setWorkoutType(option.value)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                workoutType === option.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${option.gradient}`}>
                  <option.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">{option.label}</span>
                  {workoutType === option.value && (
                    <Badge className="ml-2 bg-indigo-100 text-indigo-700">Active</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* View Tabs */}
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-1">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Content Area */}
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
        <>
          {/* Program Overview */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {currentProgram?.program_name}
                      </h2>
                      <p className="text-gray-600">Week {currentProgram?.current_week}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {currentProgram?.difficulty_level}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600">Started</p>
                      <p className="font-semibold text-gray-900">
                        {currentProgram && format(new Date(currentProgram.week_start_date), 'MMM d')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {currentProgram?.workout_type}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-sm text-gray-600">Workouts</p>
                      <p className="font-semibold text-gray-900">
                        {currentProgram?.daily_workouts?.length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-600">Calories</p>
                      <p className="font-semibold text-gray-900">
                        {currentProgram?.total_estimated_calories || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Weekly Progress */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    Weekly Progress
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {currentProgram?.daily_workouts?.map((workout, index) => (
                      <div
                        key={workout.id}
                        className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                          workout.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedDayNumber(workout.day_number)}
                      >
                        <div className="text-xs font-medium mb-1">
                          Day {workout.day_number}
                        </div>
                        {workout.completed ? (
                          <CheckCircle2 className="w-4 h-4 mx-auto" />
                        ) : (
                          <div className="w-4 h-4 mx-auto rounded-full border-2 border-current" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Today's Workout */}
          {activeView === 'workout' && (
            <div className="space-y-6">
              {isRestDay ? (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Rest Day</h3>
                    <p className="text-gray-600">Take a well-deserved break and let your muscles recover!</p>
                  </div>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Today's Workout
                        </h3>
                        <div className="flex items-center gap-2">
                          {workoutTimer > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(workoutTimer)}
                            </Badge>
                          )}
                          <Button
                            onClick={isTimerRunning ? onPauseWorkout : onStartWorkout}
                            size="sm"
                            variant={isTimerRunning ? "destructive" : "default"}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {isTimerRunning ? 'Pause' : 'Start'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">{completedExercises}/{totalExercises} exercises</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    {todaysExercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onComplete={onExerciseComplete}
                        onTrackProgress={onExerciseProgressUpdate}
                        onExchange={(exerciseId, reason) => console.log('Exchange:', exerciseId, reason)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Progress View */}
          {activeView === 'progress' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  Workout History
                </h3>
                {currentProgram?.daily_workouts?.map(workout => (
                  <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        workout.completed ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        {workout.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {workout.day_number}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {workout.workout_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Day {workout.day_number} • {workout.estimated_duration} min
                        </p>
                      </div>
                    </div>
                    <Badge className={
                      workout.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }>
                      {workout.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Enhanced AI Generation Dialog */}
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
