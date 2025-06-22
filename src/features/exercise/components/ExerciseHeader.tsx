import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Shuffle, 
  Loader2,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  Dumbbell,
  Home,
  Building
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import type { ExerciseProgram, Exercise } from '../types';

interface ExerciseHeaderProps {
  activeTab: 'overview' | 'workout' | 'progress' | 'form-analysis' | 'recovery';
  currentWeekOffset: number;
  currentProgram?: ExerciseProgram;
  todaysExercises: Exercise[];
  selectedDayNumber: number;
  workoutType: "home" | "gym";
  creditsRemaining: number;
  isPro: boolean;
  hasProgram: boolean;
  onWeekOffsetChange: (offset: number) => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  onShowAIModal: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  activeTab,
  currentWeekOffset,
  currentProgram,
  todaysExercises,
  selectedDayNumber,
  workoutType,
  creditsRemaining,
  isPro,
  hasProgram,
  onWeekOffsetChange,
  onWorkoutTypeChange,
  onShowAIModal,
  onRegenerateProgram,
  isGenerating
}) => {
  const getWeekStartDate = (offset: number = 0) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    return addDays(startOfCurrentWeek, offset * 7);
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const weekStartDate = getWeekStartDate(currentWeekOffset);
  
  // Calculate exercise stats
  const completedExercises = todaysExercises.filter(exercise => exercise.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  
  // Calculate weekly stats
  const weeklyWorkouts = 4; // This should come from program data
  const completedWorkouts = 2; // This should be calculated from completed workouts
  const currentStreak = 7; // This should come from user data

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Exercise Program Overview';
      case 'workout': return 'Today\'s Workout';
      case 'progress': return 'Progress Tracking';
      case 'form-analysis': return 'Form Analysis';
      case 'recovery': return 'Recovery Metrics';
      default: return 'Exercise Program';
    }
  };

  const getWorkoutTypeIcon = () => {
    return workoutType === 'home' ? Home : Building;
  };

  const WorkoutTypeIcon = getWorkoutTypeIcon();

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {getTabTitle()}
          </h1>
          <div className="flex items-center space-x-3">
            <p className="text-gray-600">
              {formatWeekRange(weekStartDate)} • {currentProgram ? 'AI Generated Program' : 'No Program Available'}
            </p>
            <div className="flex items-center space-x-2">
              <WorkoutTypeIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 capitalize">{workoutType} Workout</span>
            </div>
          </div>
        </div>
        
        {/* Week Navigation & Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekOffsetChange(currentWeekOffset - 1)}
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
            onClick={() => onWeekOffsetChange(currentWeekOffset + 1)}
            className="border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 ml-4">
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
                    <Shuffle className="h-4 w-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onShowAIModal}
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
        </div>
      </div>

      {/* Stats Cards - Only show if we have program data */}
      {hasProgram && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700 text-xs">
                {progressPercentage > 50 ? '↗' : '→'}
              </Badge>
            </div>
            <div className="text-orange-900 font-bold text-lg">{completedExercises}/{totalExercises}</div>
            <div className="text-orange-700 text-sm">exercises today</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-100 text-green-700 text-xs">↗</Badge>
            </div>
            <div className="text-green-900 font-bold text-lg">{completedWorkouts}/{weeklyWorkouts}</div>
            <div className="text-green-700 text-sm">workouts this week</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                {progressPercentage > 75 ? '↗' : '→'}
              </Badge>
            </div>
            <div className="text-blue-900 font-bold text-lg">{Math.round(progressPercentage)}%</div>
            <div className="text-blue-700 text-sm">completion rate</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700 text-xs">🔥</Badge>
            </div>
            <div className="text-purple-900 font-bold text-lg">{currentStreak}</div>
            <div className="text-purple-700 text-sm">day streak</div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Dumbbell className="h-5 w-5 text-indigo-600" />
              <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                {workoutType === 'gym' ? '🏋️' : '🏠'}
              </Badge>
            </div>
            <div className="text-indigo-900 font-bold text-lg capitalize">{workoutType}</div>
            <div className="text-indigo-700 text-sm">workout type</div>
          </div>
        </div>
      )}
    </Card>
  );
}; 