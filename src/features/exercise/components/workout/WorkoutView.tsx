import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Dumbbell, 
  Play, 
  Pause, 
  Plus,
  Timer,
  Target,
  Award,
  Flame
} from 'lucide-react';
import { format } from 'date-fns';
import GradientCard from '@/shared/components/design-system/GradientCard';
import { ActionButton } from '@/shared/components/design-system/ActionButton';
import { Exercise, ExerciseProgram } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { WorkoutCalendar } from './WorkoutCalendar';
import { WorkoutTypeSelector } from '../shared/WorkoutTypeSelector';

interface WorkoutViewProps {
  currentProgram?: ExerciseProgram;
  todaysExercises: Exercise[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  workoutType: string;
  setWorkoutType: (type: string) => void;
  workoutTimer: number;
  isTimerRunning: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  hasProgram?: boolean;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  workoutType,
  setWorkoutType,
  workoutTimer,
  isTimerRunning,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onStartWorkout,
  onPauseWorkout,
  hasProgram = false
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const workoutStats = [
    {
      title: "Today's Progress",
      value: `${completedExercises}/${totalExercises}`,
      subtitle: "Exercises completed",
      icon: <Target className="h-5 w-5" />,
      color: "primary" as const
    },
    {
      title: "Workout Time",
      value: formatTime(workoutTimer),
      subtitle: "Minutes active",
      icon: <Timer className="h-5 w-5" />,
      color: "secondary" as const
    },
    {
      title: "Weekly Goal",
      value: "4/5",
      subtitle: "Workouts this week",
      icon: <Award className="h-5 w-5" />,
      color: "accent" as const
    },
    {
      title: "Streak",
      value: "12",
      subtitle: "Days active",
      icon: <Flame className="h-5 w-5" />,
      color: "success" as const
    }
  ];

  const renderWorkoutHeader = () => (
    <div className="p-6 mb-6 rounded-xl border bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 border-brand-primary-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-neutral-900">
            {isRestDay ? 'Rest Day' : 'Today\'s Workout'}
          </h2>
          <p className="text-neutral-600">
            {currentProgram?.program_name || 'Custom Workout'} • {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={isTimerRunning ? "destructive" : "default"}
            onClick={isTimerRunning ? onPauseWorkout : onStartWorkout}
          >
            {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isTimerRunning ? 'Pause' : 'Start'} Workout
          </Button>
        </div>
      </div>

      {!isRestDay && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {workoutStats.map((stat, index) => (
            <div 
              key={index} 
              className="rounded-lg p-4 border bg-white border-neutral-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-neutral-500">
                  {stat.icon}
                </div>
                <Badge className="bg-neutral-100 text-neutral-600">
                  ↗
                </Badge>
              </div>
              <div className="font-semibold text-lg text-neutral-900">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600">
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRestDay = () => (
    <div className="p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Rest Day</h3>
      <p className="text-neutral-600 mb-4">
        Recovery is just as important as training. Take time to rest and recharge.
      </p>
      <div className="flex justify-center space-x-3">
        <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
          Light Activity
        </Button>
        <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
          Stretching
        </Button>
      </div>
    </div>
  );

  const renderEmptyWorkout = () => (
    <div className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Dumbbell className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Exercises Scheduled</h3>
      <p className="text-neutral-600 mb-4">
        {hasProgram 
          ? "No exercises scheduled for today. Check other days or create a new program."
          : "Generate a personalized workout with our AI trainer."
        }
      </p>
      <div className="flex justify-center space-x-3">
        <Button className="bg-blue-600 hover:bg-blue-700">
          {hasProgram ? 'View Other Days' : 'Generate Workout'}
        </Button>
        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>
    </div>
  );

  const renderExerciseList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900">
          Today's Exercises ({completedExercises}/{totalExercises})
        </h3>
        <div className="flex items-center space-x-3">
          <Progress value={progressPercentage} className="w-32" />
          <span className="text-sm font-medium text-neutral-600">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {todaysExercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onComplete={onExerciseComplete}
            onProgressUpdate={onExerciseProgressUpdate}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderWorkoutHeader()}
      
      <WorkoutCalendar
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
      />
      
      <WorkoutTypeSelector
        workoutType={workoutType}
        setWorkoutType={setWorkoutType}
      />
      
      {isRestDay ? renderRestDay() : todaysExercises.length === 0 ? renderEmptyWorkout() : renderExerciseList()}
    </div>
  );
}; 