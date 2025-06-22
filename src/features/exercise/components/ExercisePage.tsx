
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dumbbell,
  Home,
  Building,
  Sparkles,
  Loader2,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Target,
  Coins,
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useExerciseProgram } from '../hooks/core/useExerciseProgram';
import { useWorkoutSession } from '../hooks/core/useWorkoutSession';
import { EnhancedAIGenerationDialog } from './ai/EnhancedAIGenerationDialog';
import { SmartExerciseCard } from './SmartExerciseCard';
import { format, addDays } from 'date-fns';

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
  const [exchangingExerciseId, setExchangingExerciseId] = useState<string | null>(null);

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
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayNumber - 1] || 'Day';
  };

  const handleExerciseExchange = async (exerciseId: string, reason: string) => {
    setExchangingExerciseId(exerciseId);
    try {
      await onExerciseExchange(exerciseId, reason);
    } finally {
      setExchangingExerciseId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="lg:col-span-3 h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exercise Programs</h1>
            <p className="text-blue-100 text-lg">AI-powered personalized workouts</p>
          </div>

          <div className="flex items-center gap-4">
            {isPro ? (
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Crown className="w-4 h-4 mr-2" />
                Pro Member
              </Badge>
            ) : (
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Coins className="w-4 h-4 mr-2" />
                {creditsRemaining} Credits
              </Badge>
            )}

            {hasProgram ? (
              <Button 
                onClick={onRegenerateProgram}
                disabled={isGenerating}
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    New Program
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => setShowAIDialog(true)}
                disabled={!isPro && creditsRemaining <= 0}
                className="bg-white text-blue-600 hover:bg-gray-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Program
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-auto">
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="home" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80">
                <Home className="h-4 w-4 mr-2" />
                Home
              </TabsTrigger>
              <TabsTrigger value="gym" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80">
                <Building className="h-4 w-4 mr-2" />
                Gym
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {hasProgram && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center px-4">
                <div className="font-medium text-sm">
                  {formatWeekRange(weekStartDate)}
                </div>
                <div className="text-xs text-white/70">
                  {currentWeekOffset === 0 ? 'Current Week' : 
                   currentWeekOffset > 0 ? `Week +${currentWeekOffset}` : 
                   `Week ${currentWeekOffset}`}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="text-white hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Credits Warning */}
      {!isPro && creditsRemaining <= 2 && (
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <Coins className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <span className="font-semibold">Only {creditsRemaining} AI credits remaining</span>
            {creditsRemaining <= 2 && (
              <span className="ml-2">• Consider upgrading to Pro for unlimited AI generations</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={workoutType} className="w-full">
        <TabsContent value={workoutType} className="mt-0">
          {!hasProgram ? (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
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
                <Button 
                  onClick={() => setShowAIDialog(true)}
                  disabled={isGenerating || (!isPro && creditsRemaining <= 0)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Week Overview
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                              : isToday
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{getDayName(dayNum)}</div>
                              <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                {hasExercises ? 
                                  `${dayWorkout.exercises.length} exercises` : 
                                  'Rest day'
                                }
                              </div>
                            </div>
                            {hasExercises && dayWorkout.completed && (
                              <CheckCircle2 className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-green-500'}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        {getDayName(selectedDayNumber)}'s Workout
                      </CardTitle>
                      
                      {!isRestDay && (
                        <div className="flex items-center gap-3">
                          {workoutTimer > 0 && (
                            <Badge variant="outline" className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="font-mono">{formatTime(workoutTimer)}</span>
                            </Badge>
                          )}
                          <Button
                            onClick={isTimerRunning ? onPauseWorkout : onStartWorkout}
                            size="sm"
                            variant={isTimerRunning ? "destructive" : "default"}
                          >
                            {isTimerRunning ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
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
                        {/* Progress */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                            <span className="text-sm text-gray-600">
                              {completedExercises}/{totalExercises} completed
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>

                        {/* Exercises */}
                        <div className="space-y-4">
                          {todaysExercises.map((exercise) => (
                            <SmartExerciseCard
                              key={exercise.id}
                              exercise={exercise}
                              onComplete={onExerciseComplete}
                              onTrackProgress={onExerciseProgressUpdate}
                              onExchange={handleExerciseExchange}
                              isExchanging={exchangingExerciseId === exercise.id}
                            />
                          ))}
                        </div>

                        {/* Completion */}
                        {completedExercises === totalExercises && totalExercises > 0 && (
                          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-green-900 mb-2">
                                Workout Complete! 🎉
                              </h3>
                              <p className="text-green-700 mb-4">
                                Great work! You've completed all exercises for today.
                              </p>
                              <Button 
                                onClick={onCompleteWorkout}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Finish Session
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
        </TabsContent>
      </Tabs>

      {/* AI Generation Dialog */}
      <EnhancedAIGenerationDialog
        open={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        onGenerate={async (preferences) => {
          setShowAIDialog(false);
          await onGenerateAIProgram({
            ...preferences,
            workoutType
          });
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
