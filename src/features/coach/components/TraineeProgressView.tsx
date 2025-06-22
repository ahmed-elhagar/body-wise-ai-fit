import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Target, Calendar, Dumbbell } from "lucide-react";
import { useTraineeData } from "../hooks/useTraineeData";

interface TraineeProgressViewProps {
  traineeId: string;
  traineeName: string;
  traineeProfile: any;
  onBack: () => void;
}

export const TraineeProgressView = ({ 
  traineeId, 
  traineeName, 
  traineeProfile, 
  onBack 
}: TraineeProgressViewProps) => {
  const { 
    mealPlans, 
    exercisePrograms, 
    weightEntries, 
    goals,
    isLoading 
  } = useTraineeData(traineeId);

  const profileCompletion = traineeProfile?.profile_completion_score || 0;
  const aiGenerationsRemaining = traineeProfile?.ai_generations_remaining || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">{traineeName} - Progress Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fitness Goal: {traineeProfile?.fitness_goal || 'Not specified'}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Profile Completion</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={profileCompletion} className="flex-1" />
                  <span className="text-sm font-semibold">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Exercise Programs</p>
                <p className="text-lg font-semibold">{exercisePrograms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Meal Plans</p>
                <p className="text-lg font-semibold">{mealPlans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">AI Generations Left</p>
                <p className="text-lg font-semibold">{aiGenerationsRemaining}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weightEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center">
                    <span className="text-sm">Weight Entry</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">{entry.weight} kg</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {weightEntries.length === 0 && (
                  <p className="text-sm text-gray-500">No weight entries yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exercisePrograms.map((program) => (
                  <div key={program.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{program.program_name}</p>
                      <p className="text-sm text-gray-600">
                        {program.difficulty_level} • {program.workout_type}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Week {program.current_week}
                    </Badge>
                  </div>
                ))}
                {exercisePrograms.length === 0 && (
                  <p className="text-sm text-gray-500">No exercise programs yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meal Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mealPlans.map((plan) => (
                  <div key={plan.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        Week of {new Date(plan.week_start_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {plan.total_calories} calories • {plan.total_protein}g protein
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
                {mealPlans.length === 0 && (
                  <p className="text-sm text-gray-500">No meal plans yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    )}
                    {goal.target_value && (
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={((goal.current_value || 0) / goal.target_value) * 100} 
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500">
                          {goal.current_value || 0}/{goal.target_value} {goal.target_unit}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {goals.length === 0 && (
                  <p className="text-sm text-gray-500">No goals set yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
