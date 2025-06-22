import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Heart, 
  Dumbbell,
  BarChart3,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Home,
  Building
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ExerciseOverview } from './ExerciseOverview';
import { WorkoutView } from './workout/WorkoutView';
import { ProgressTracker } from './progress/ProgressTracker';
import { FormAnalysis } from './ai/FormAnalysis';
import { RecoveryMetrics } from './recovery/RecoveryMetrics';
import { EnhancedAIGenerationDialog } from './ai/EnhancedAIGenerationDialog';
import { LoadingState } from './loading/LoadingState';
import { useExerciseProgram } from '../hooks/core/useExerciseProgram';
import { useWorkoutSession } from '../hooks/core/useWorkoutSession';

export const ExerciseContainer: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'progress' | 'form-analysis' | 'recovery'>('overview');
  const [showAIDialog, setShowAIDialog] = useState(false);

  // Use consolidated hooks
  const {
    currentProgram,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    isLoading,
    error,
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    weekStartDate,
    workoutType,
    setWorkoutType,
    onGenerateAIProgram,
    onRegenerateProgram,
    creditsRemaining,
    isPro,
    profile,
    hasProgram,
    isGenerating
  } = useExerciseProgram();

  const {
    activeExerciseId,
    workoutTimer,
    isTimerRunning,
    onExerciseComplete,
    onExerciseProgressUpdate,
    onStartWorkout,
    onPauseWorkout,
    onCompleteWorkout
  } = useWorkoutSession();

  const sideMenuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workout', label: 'Today\'s Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'form-analysis', label: 'Form Analysis', icon: Target },
    { id: 'recovery', label: 'Recovery', icon: Heart }
  ];

  const getWeekStartDate = (offset: number = 0) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    return addDays(startOfCurrentWeek, offset * 7);
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const weekStartDateFormatted = getWeekStartDate(currentWeekOffset);

  const handleGenerateAI = async (preferences: any) => {
    await onGenerateAIProgram(preferences);
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        {/* Tab Navigation - Keep visible during loading */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-1">
            {sideMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Header - Keep visible during loading */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Exercise Program</h1>
              <div className="flex items-center space-x-3">
                <p className="text-gray-600">
                  {formatWeekRange(weekStartDateFormatted)} • Loading...
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-gray-300">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 px-3 font-medium">Week Current</span>
              <Button variant="outline" size="sm" disabled className="border-gray-300">
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button disabled className="bg-gradient-to-r from-indigo-600 to-purple-600 ml-4">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-1">
          {sideMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Exercise Program</h1>
            <div className="flex items-center space-x-3">
              <p className="text-gray-600">
                {formatWeekRange(weekStartDateFormatted)} • {currentProgram ? 'AI Generated Program' : 'No Program Available'}
              </p>
              <div className="flex items-center space-x-2">
                {workoutType === 'home' ? <Home className="h-4 w-4 text-gray-500" /> : <Building className="h-4 w-4 text-gray-500" />}
                <span className="text-sm text-gray-600 capitalize">{workoutType} Workout</span>
              </div>
            </div>
          </div>
          
          {/* Week Navigation & Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              className="border-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 px-3 font-medium">
              Week {currentWeekOffset === 0 ? 'Current' : currentWeekOffset > 0 ? `+${currentWeekOffset}` : currentWeekOffset}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              className="border-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Single Action Button */}
            <div className="ml-4">
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
                      Regenerate Program
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
                      Generate AI Program
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Only show if we have program data */}
        {hasProgram && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700 text-xs">Today</Badge>
              </div>
              <div className="text-blue-900 font-bold text-lg">{completedExercises}/{totalExercises}</div>
              <div className="text-blue-700 text-sm">exercises done</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700 text-xs">Progress</Badge>
              </div>
              <div className="text-green-900 font-bold text-lg">{Math.round(progressPercentage)}%</div>
              <div className="text-green-700 text-sm">completed</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Dumbbell className="h-5 w-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700 text-xs">Type</Badge>
              </div>
              <div className="text-purple-900 font-bold text-lg capitalize">{workoutType}</div>
              <div className="text-purple-700 text-sm">workout</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-5 w-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700 text-xs">Status</Badge>
              </div>
              <div className="text-orange-900 font-bold text-lg">{isRestDay ? 'Rest' : 'Active'}</div>
              <div className="text-orange-700 text-sm">day</div>
            </div>
          </div>
        )}
      </Card>

      {/* Content Area */}
      {activeTab === 'overview' && (
        <ExerciseOverview
          currentProgram={currentProgram}
          todaysExercises={todaysExercises}
          selectedDayNumber={selectedDayNumber}
          currentWeekOffset={currentWeekOffset}
          weekStartDate={weekStartDate}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          workoutType={workoutType}
          onDaySelect={setSelectedDayNumber}
          onExerciseComplete={onExerciseComplete}
          onShowAIModal={() => setShowAIDialog(true)}
          hasProgram={hasProgram}
          isGenerating={isGenerating}
        />
      )}

      {activeTab === 'workout' && (
        <WorkoutView
          currentProgram={currentProgram}
          todaysExercises={todaysExercises}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          isRestDay={isRestDay}
          selectedDayNumber={selectedDayNumber}
          setSelectedDayNumber={setSelectedDayNumber}
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={setCurrentWeekOffset}
          weekStartDate={weekStartDate}
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
          workoutTimer={workoutTimer}
          isTimerRunning={isTimerRunning}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          onStartWorkout={onStartWorkout}
          onPauseWorkout={onPauseWorkout}
          hasProgram={hasProgram}
        />
      )}

      {activeTab === 'progress' && (
        <ProgressTracker
          currentProgram={currentProgram}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          workoutTimer={workoutTimer}
        />
      )}

      {activeTab === 'form-analysis' && (
        <FormAnalysis
          todaysExercises={todaysExercises}
          activeExerciseId={activeExerciseId}
        />
      )}

      {activeTab === 'recovery' && (
        <RecoveryMetrics />
      )}

      {/* Enhanced AI Generation Dialog */}
      <EnhancedAIGenerationDialog
        open={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        onGenerate={handleGenerateAI}
        currentWorkoutType={workoutType}
        creditsRemaining={creditsRemaining}
        isPro={isPro}
        isGenerating={isGenerating}
      />
    </div>
  );
}; 
export default ExerciseContainer;
