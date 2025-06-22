import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Dumbbell, 
  Target, 
  Timer, 
  Award, 
  Plus, 
  Sparkles, 
  Loader2,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import type { ExerciseProgram, Exercise } from '../types';

interface ExerciseOverviewProps {
  currentProgram?: ExerciseProgram;
  todaysExercises: Exercise[];
  selectedDayNumber: number;
  currentWeekOffset: number;
  weekStartDate: Date;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
  onDaySelect: (dayNumber: number) => void;
  onExerciseComplete: (exerciseId: string) => void;
  onShowAIModal: () => void;
  hasProgram: boolean;
  isGenerating: boolean;
}

export const ExerciseOverview: React.FC<ExerciseOverviewProps> = ({
  currentProgram,
  todaysExercises,
  selectedDayNumber,
  currentWeekOffset,
  weekStartDate,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutType,
  onDaySelect,
  onShowAIModal,
  hasProgram,
  isGenerating
}) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Group exercises by type for today
  const exercisesByType = {
    warmup: todaysExercises.filter(ex => ex.category === 'warmup'),
    strength: todaysExercises.filter(ex => ex.category === 'strength' || ex.category === 'main'),
    cardio: todaysExercises.filter(ex => ex.category === 'cardio'),
    cooldown: todaysExercises.filter(ex => ex.category === 'cooldown' || ex.category === 'stretching')
  };

  const exerciseTypeConfig = [
    { 
      id: 'warmup', 
      name: 'Warm-up', 
      icon: Zap, 
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      exercises: exercisesByType.warmup
    },
    { 
      id: 'strength', 
      name: 'Strength', 
      icon: Dumbbell, 
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      exercises: exercisesByType.strength
    },
    { 
      id: 'cardio', 
      name: 'Cardio', 
      icon: Activity, 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      exercises: exercisesByType.cardio
    },
    { 
      id: 'cooldown', 
      name: 'Cool-down', 
      icon: Target, 
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      exercises: exercisesByType.cooldown
    }
  ];

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const dayDate = addDays(weekStartDate, index);
            const isCurrentDay = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            // Get exercises for this day
            const dayWorkout = currentProgram?.daily_workouts?.find(
              workout => workout.day_number === dayNumber
            );
            const dayExercises = dayWorkout?.exercises || [];
            const dayCompletedExercises = dayExercises.filter(ex => ex.completed);
            
            return (
              <button
                key={day}
                onClick={() => onDaySelect(dayNumber)}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-transparent'
                    : isCurrentDay
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-xs font-medium mb-1">{day}</div>
                <div className="text-xl font-bold mb-2">{format(dayDate, 'd')}</div>
                {dayExercises.length > 0 ? (
                  <div className="text-xs">
                    {dayCompletedExercises.length}/{dayExercises.length} exercises
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Rest</div>
                )}
                {isCurrentDay && !isSelected && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-2"></div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Today's Workout Preview */}
      {hasProgram ? (
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-indigo-600" />
            Today's Workout Preview
          </h3>
          
          {todaysExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exerciseTypeConfig.map((exerciseType) => (
                <div key={exerciseType.id} className={`${exerciseType.bgColor} ${exerciseType.borderColor} border rounded-xl p-4`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${exerciseType.color}`}>
                      <exerciseType.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${exerciseType.textColor}`}>{exerciseType.name}</h4>
                      <p className="text-xs text-gray-600">{exerciseType.exercises.length} exercises</p>
                    </div>
                  </div>
                  <Progress 
                    value={exerciseType.exercises.length > 0 ? Math.round((exerciseType.exercises.filter(ex => ex.completed).length / exerciseType.exercises.length) * 100) : 0} 
                    className="h-2"
                  />
                  
                  {/* Exercise Preview */}
                  {exerciseType.exercises.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {exerciseType.exercises.slice(0, 2).map((exercise) => (
                        <div key={exercise.id} className="text-xs text-gray-600 truncate">
                          • {exercise.name}
                        </div>
                      ))}
                      {exerciseType.exercises.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{exerciseType.exercises.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Rest Day</h4>
              <p className="text-gray-600 mb-4">
                Take time to recover and prepare for tomorrow's workout.
              </p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" size="sm" className="border-gray-300">
                  Light Activity
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300">
                  Stretching
                </Button>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          {todaysExercises.length > 0 && (
            <div className="mt-6 flex justify-center space-x-3">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <Activity className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
              <Button variant="outline" className="border-gray-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Exercise Program Available</h3>
            <p className="text-gray-600 mb-6">
              Use the "Generate AI Program" button in the header to create your personalized workout plan.
            </p>
            
            {/* Quick Start Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-gray-300">
                <Target className="h-4 w-4 mr-2" />
                Quick Workout
              </Button>
              <Button variant="outline" className="border-gray-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                Browse Exercises
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}; 