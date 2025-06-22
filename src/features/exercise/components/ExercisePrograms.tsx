
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Target,
  Play,
  Sparkles,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { useExerciseProgram } from '../hooks/core/useExerciseProgram';
import { ExerciseOverview } from './ExerciseOverview';
import { ExerciseCard } from './ExerciseCard';
import { AIGenerationDialog } from './AIGenerationDialog';

export const ExercisePrograms: React.FC = () => {
  const {
    currentProgram,
    isLoading,
    error,
    generateProgram,
    isGenerating,
    updateExerciseCompletion,
    trackPerformance,
    exchangeExercise,
    recommendations,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    workoutType,
    hasProgram,
    onExerciseComplete,
    onExerciseProgressUpdate
  } = useExerciseProgram();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAIDialog, setShowAIDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Dumbbell className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Exercise Program
            </h3>
            <p className="text-red-700">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workout', label: 'Today\'s Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'recommendations', label: 'AI Tips', icon: Target }
  ];

  const handleExerciseComplete = (exerciseId: string, completed: boolean) => {
    updateExerciseCompletion(exerciseId, completed);
  };

  const handleTrackProgress = (exerciseId: string, sets: number, reps: string, weight?: number, notes?: string) => {
    trackPerformance(exerciseId, sets, reps, weight, notes);
  };

  const handleExerciseExchange = (exerciseId: string, reason: string) => {
    exchangeExercise(exerciseId, reason);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exercise Programs</h1>
          <p className="text-gray-600">
            AI-powered personalized workout plans
          </p>
        </div>
        
        {currentProgram && (
          <Button
            onClick={() => setShowAIDialog(true)}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Program
          </Button>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ExerciseOverview
            currentProgram={currentProgram}
            todaysExercises={todaysExercises}
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
            workoutType={workoutType}
            onGenerateProgram={() => setShowAIDialog(true)}
            onShowAIModal={() => setShowAIDialog(true)}
            onExerciseComplete={onExerciseComplete}
            onDaySelect={(dayNumber) => console.log('Day selected:', dayNumber)}
            hasProgram={hasProgram}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="workout" className="mt-6">
          <div className="space-y-6">
            {todaysExercises.length > 0 ? (
              <>
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Play className="w-5 h-5" />
                      Today's Workout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-blue-800 font-medium">
                          {completedExercises}/{totalExercises} exercises completed
                        </p>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {Math.round(progressPercentage)}% Complete
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  {todaysExercises.map(exercise => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onComplete={handleExerciseComplete}
                      onTrackProgress={handleTrackProgress}
                      onExchange={handleExerciseExchange}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="p-8 text-center">
                  <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Workout Today
                  </h3>
                  <p className="text-gray-600">
                    {currentProgram ? 'Today is a rest day!' : 'Generate a program to get started'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentProgram?.daily_workouts ? (
                  <div className="space-y-4">
                    {currentProgram.daily_workouts.map(workout => (
                      <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No progress data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations?.data?.recommendations ? (
                <div className="space-y-4">
                  {recommendations.data.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          rec.priority === 'high' ? 'bg-red-500' :
                          rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-purple-900 capitalize">
                            {rec.type.replace('_', ' ')}
                          </p>
                          <p className="text-purple-800 mt-1">
                            {rec.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Complete some workouts to get personalized AI recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Generation Dialog */}
      <AIGenerationDialog
        open={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        onGenerate={generateProgram}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ExercisePrograms;
