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
  Coins, 
  Crown, 
  Dumbbell,
  Home,
  Building,
  Loader2
} from 'lucide-react';
import { ExerciseHeader } from './ExerciseHeader';
import { ExerciseOverview } from './ExerciseOverview';
import { WorkoutView } from './workout/WorkoutView';
import { ProgressTracker } from './progress/ProgressTracker';
import { FormAnalysis } from './ai/FormAnalysis';
import { RecoveryMetrics } from './recovery/RecoveryMetrics';
import { EnhancedAIGenerationDialog } from './ai/EnhancedAIGenerationDialog';
import { LoadingState } from './loading/LoadingState';
import type { ExerciseProgram, Exercise } from '../types';

interface ExerciseLayoutProps {
  isLoading: boolean;
  currentProgram?: ExerciseProgram;
  todaysExercises: Exercise[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDayNumber: number;
  currentWeekOffset: number;
  weekStartDate: Date;
  workoutType: "home" | "gym";
  workoutTimer: number;
  isTimerRunning: boolean;
  creditsRemaining: number;
  isPro: boolean;
  profile: any;
  hasProgram: boolean;
  isGenerating: boolean;
  onDaySelect: (dayNumber: number) => void;
  onWeekOffsetChange: (offset: number) => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onShowAIModal: () => void;
  onRegenerateProgram: () => void;
}

export const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
  isLoading,
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  currentWeekOffset,
  weekStartDate,
  workoutType,
  workoutTimer,
  isTimerRunning,
  creditsRemaining,
  isPro,
  profile,
  hasProgram,
  isGenerating,
  onDaySelect,
  onWeekOffsetChange,
  onWorkoutTypeChange,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onStartWorkout,
  onPauseWorkout,
  onShowAIModal,
  onRegenerateProgram
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'progress' | 'form-analysis' | 'recovery'>('overview');
  const [showAIDialog, setShowAIDialog] = useState(false);

  const sideMenuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'workout', label: 'Today\'s Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'form-analysis', label: 'Form Analysis', icon: Target },
    { id: 'recovery', label: 'Recovery', icon: Heart }
  ];

  const workoutTypeOptions = [
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
  ];

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
        <ExerciseHeader
          activeTab={activeTab}
          currentWeekOffset={currentWeekOffset}
          currentProgram={currentProgram}
          todaysExercises={todaysExercises}
          selectedDayNumber={selectedDayNumber}
          workoutType={workoutType}
          creditsRemaining={creditsRemaining}
          isPro={isPro}
          hasProgram={hasProgram}
          onWeekOffsetChange={onWeekOffsetChange}
          onWorkoutTypeChange={onWorkoutTypeChange}
          onShowAIModal={onShowAIModal}
          onRegenerateProgram={onRegenerateProgram}
          isGenerating={isGenerating}
        />

        {/* Inline Loading State - Replace content area only */}
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="p-6">
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

      {/* Workout Type Selector */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Dumbbell className="h-4 w-4 mr-2 text-indigo-600" />
          Workout Environment
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {workoutTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onWorkoutTypeChange(option.value)}
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

      {/* Header */}
      <ExerciseHeader
        activeTab={activeTab}
        currentWeekOffset={currentWeekOffset}
        currentProgram={currentProgram}
        todaysExercises={todaysExercises}
        selectedDayNumber={selectedDayNumber}
        workoutType={workoutType}
        creditsRemaining={creditsRemaining}
        isPro={isPro}
        hasProgram={hasProgram}
        onWeekOffsetChange={onWeekOffsetChange}
        onWorkoutTypeChange={onWorkoutTypeChange}
        onShowAIModal={() => setShowAIDialog(true)}
        onRegenerateProgram={onRegenerateProgram}
        isGenerating={isGenerating}
      />

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
          onDaySelect={onDaySelect}
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
          setSelectedDayNumber={onDaySelect}
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={onWeekOffsetChange}
          weekStartDate={weekStartDate}
          workoutType={workoutType}
          setWorkoutType={onWorkoutTypeChange}
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
          activeExerciseId={null}
        />
      )}

      {activeTab === 'recovery' && (
        <RecoveryMetrics />
      )}

      {/* Enhanced AI Generation Dialog */}
      <EnhancedAIGenerationDialog
        open={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        onGenerate={async (preferences) => {
          // Handle generation logic here
          setShowAIDialog(false);
          onShowAIModal();
        }}
        currentWorkoutType={workoutType}
        creditsRemaining={creditsRemaining}
        isPro={isPro}
        isGenerating={isGenerating}
      />
    </div>
  );
}; 