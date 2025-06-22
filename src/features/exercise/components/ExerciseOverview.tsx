
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp,
  Dumbbell,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { ExerciseProgram, Exercise } from '../types';

interface ExerciseOverviewProps {
  currentProgram?: ExerciseProgram;
  todaysExercises: Exercise[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
  onShowAIModal: () => void;
  onExerciseComplete: (exerciseId: string) => void;
  onDaySelect: (dayNumber: number) => void;
  hasProgram: boolean;
  isGenerating: boolean;
}

export const ExerciseOverview: React.FC<ExerciseOverviewProps> = ({
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutType,
  onShowAIModal,
  onExerciseComplete,
  onDaySelect,
  hasProgram,
  isGenerating
}) => {
  if (!hasProgram) {
    return (
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
            onClick={onShowAIModal}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Program
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Program Overview */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentProgram?.program_name}
              </h2>
              <p className="text-gray-600">Week {currentProgram?.current_week}</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              {currentProgram?.difficulty_level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Workout Progress</span>
              <span className="text-sm text-gray-600">{completedExercises}/{totalExercises} exercises</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {todaysExercises.length > 0 ? (
            <div className="space-y-2">
              {todaysExercises.slice(0, 3).map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{exercise.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">{exercise.sets} × {exercise.reps}</span>
                    {exercise.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onExerciseComplete(exercise.id)}
                        className="text-xs"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {todaysExercises.length > 3 && (
                <p className="text-xs text-gray-600 text-center">
                  +{todaysExercises.length - 3} more exercises
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">Rest day - no exercises scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

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
            {currentProgram?.daily_workouts?.map((workout, index) => (
              <button
                key={workout.id}
                onClick={() => onDaySelect(workout.day_number)}
                className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                  workout.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseOverview;
