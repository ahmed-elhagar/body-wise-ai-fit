
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Dumbbell, Target, TrendingUp } from 'lucide-react';

interface ExerciseProgram {
  id: string;
  program_name: string;
  difficulty_level: string;
  workout_type: string;
  status: string;
  week_start_date: string;
  current_week: number;
  total_estimated_calories: number;
  daily_workouts: Array<{
    id: string;
    day_number: number;
    workout_name: string;
    completed: boolean;
    estimated_duration: number;
    estimated_calories: number;
  }>;
}

interface ExerciseContainerProps {
  program?: ExerciseProgram;
  onGenerateProgram: () => void;
  onWorkoutTypeChange: (type: string) => void;
  isGenerating: boolean;
}

export const ExerciseContainer = ({ 
  program, 
  onGenerateProgram, 
  onWorkoutTypeChange,
  isGenerating 
}: ExerciseContainerProps) => {
  const [workoutType, setWorkoutType] = useState<'home' | 'gym'>('home');

  const handleWorkoutTypeChange = (type: 'home' | 'gym') => {
    setWorkoutType(type);
    onWorkoutTypeChange(type);
  };

  if (!program) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Exercise Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Exercise Program</h3>
            <p className="text-gray-600 mb-4">
              Generate a personalized exercise program to get started.
            </p>
            <div className="flex gap-2 justify-center mb-4">
              <Button
                variant={workoutType === 'home' ? 'default' : 'outline'}
                onClick={() => handleWorkoutTypeChange('home')}
              >
                Home Workout
              </Button>
              <Button
                variant={workoutType === 'gym' ? 'default' : 'outline'}
                onClick={() => handleWorkoutTypeChange('gym')}
              >
                Gym Workout
              </Button>
            </div>
            <Button onClick={onGenerateProgram} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Program'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedWorkouts = program.daily_workouts.filter(w => w.completed).length;
  const totalWorkouts = program.daily_workouts.length;
  const progressPercentage = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Program Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                {program.program_name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{program.difficulty_level}</Badge>
                <Badge variant="outline">{program.workout_type}</Badge>
                <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                  {program.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Week {program.current_week}</p>
              <p className="text-sm text-gray-600">
                Started: {new Date(program.week_start_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                <p className="text-sm text-gray-600">Progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{completedWorkouts}/{totalWorkouts}</p>
                <p className="text-sm text-gray-600">Workouts Done</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{program.total_estimated_calories}</p>
                <p className="text-sm text-gray-600">Est. Calories</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Workouts */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">This Week's Workouts</h3>
        {program.daily_workouts.map((workout) => (
          <Card key={workout.id} className={workout.completed ? 'opacity-75' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Day {workout.day_number}: {workout.workout_name}</h4>
                  <p className="text-sm text-gray-600">
                    {workout.estimated_duration} min • {workout.estimated_calories} calories
                  </p>
                </div>
                <Badge variant={workout.completed ? 'default' : 'outline'}>
                  {workout.completed ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
