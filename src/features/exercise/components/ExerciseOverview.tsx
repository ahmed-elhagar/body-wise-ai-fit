
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  Target, 
  TrendingUp,
  CheckCircle2,
  Play,
  Sparkles 
} from 'lucide-react';
import { format } from 'date-fns';
import { ExerciseProgram, DailyWorkout } from '../types';

interface ExerciseOverviewProps {
  currentProgram: ExerciseProgram | null;
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  onGenerateProgram: () => void;
  isGenerating: boolean;
}

export const ExerciseOverview: React.FC<ExerciseOverviewProps> = ({
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  onGenerateProgram,
  isGenerating
}) => {
  const todaysWorkout = currentProgram?.daily_workouts?.find(
    workout => workout.day_number === new Date().getDay() || 1
  );

  if (!currentProgram) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
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
              onClick={onGenerateProgram}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Program
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Program Overview */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">
                {currentProgram.program_name}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Week {currentProgram.current_week}
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              {currentProgram.difficulty_level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Started</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(currentProgram.week_start_date), 'MMM d')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900 capitalize">
                {currentProgram.workout_type}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Workouts</p>
              <p className="font-semibold text-gray-900">
                {currentProgram.daily_workouts?.length || 0}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Calories</p>
              <p className="font-semibold text-gray-900">
                {currentProgram.total_estimated_calories || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Workout */}
      {todaysWorkout && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Play className="w-5 h-5" />
              Today's Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {todaysWorkout.workout_name}
                </h3>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {todaysWorkout.estimated_duration} min
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>
                  {todaysWorkout.muscle_groups?.join(', ') || 'Full Body'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {completedExercises}/{totalExercises} exercises
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {todaysWorkout.completed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Workout Completed!</span>
                </div>
              ) : (
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {currentProgram.daily_workouts?.map((workout, index) => (
              <div
                key={workout.id}
                className={`p-3 rounded-lg text-center ${
                  workout.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseOverview;
