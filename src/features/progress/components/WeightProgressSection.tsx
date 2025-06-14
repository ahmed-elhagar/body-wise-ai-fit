
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Scale, TrendingUp, Calendar, Target } from "lucide-react";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";

export const WeightProgressSection = () => {
  const { entries, isLoading, error } = useWeightTracking();
  const { profile } = useProfile();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-red-600" />
            Weight Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading weight data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWeight = entries?.[0]?.weight || profile?.weight || 0;
  const goalWeight = profile?.goal_weight || 0;
  const startingWeight = entries?.[entries.length - 1]?.weight || currentWeight;
  
  const weightLoss = startingWeight - currentWeight;
  const totalWeightToLose = startingWeight - goalWeight;
  const progressPercentage = totalWeightToLose > 0 ? Math.min((weightLoss / totalWeightToLose) * 100, 100) : 0;

  const recentEntries = entries?.slice(0, 7) || [];
  const weeklyTrend = recentEntries.length >= 2 ? 
    recentEntries[0].weight - recentEntries[recentEntries.length - 1].weight : 0;

  return (
    <div className="space-y-6">
      {/* Weight Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Current Weight</p>
                <p className="text-2xl font-bold text-blue-900">
                  {currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : 'Not set'}
                </p>
                <p className="text-xs text-blue-600 mt-1">Latest entry</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Goal Weight</p>
                <p className="text-2xl font-bold text-green-900">
                  {goalWeight > 0 ? `${goalWeight.toFixed(1)} kg` : 'Not set'}
                </p>
                <p className="text-xs text-green-600 mt-1">Target</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Weight Lost</p>
                <p className="text-2xl font-bold text-purple-900">
                  {weightLoss > 0 ? `${weightLoss.toFixed(1)} kg` : '0 kg'}
                </p>
                <p className="text-xs text-purple-600 mt-1">Total progress</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Weekly Trend</p>
                <p className="text-2xl font-bold text-orange-900">
                  {weeklyTrend !== 0 ? `${weeklyTrend > 0 ? '+' : ''}${weeklyTrend.toFixed(1)} kg` : '0 kg'}
                </p>
                <p className="text-xs text-orange-600 mt-1">Last 7 days</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      {goalWeight > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Weight Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to Goal</span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}% complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Starting: {startingWeight.toFixed(1)} kg</span>
                <span>Goal: {goalWeight.toFixed(1)} kg</span>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {goalWeight - currentWeight > 0 
                    ? `${(goalWeight - currentWeight).toFixed(1)} kg remaining`
                    : 'Goal achieved! 🎉'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recent Weight Entries ({recentEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Scale className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{entry.weight.toFixed(1)} kg</p>
                      <p className="text-xs text-gray-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      Latest
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {recentEntries.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Weight Entries</h3>
            <p className="text-gray-600 mb-4">Start tracking your weight to see progress insights.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
