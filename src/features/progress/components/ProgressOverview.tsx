
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Scale, Calendar } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

export const ProgressOverview = () => {
  const { profile } = useProfile();
  const { goals } = useGoals();
  const { entries: weightEntries } = useWeightTracking();

  // Calculate overall progress metrics
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const goalsProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  // Weight progress
  const currentWeight = weightEntries?.[0]?.weight || profile?.weight || 0;
  const weightEntryCount = weightEntries?.length || 0;

  const progressMetrics = [
    {
      title: 'Goals Completion',
      value: `${completedGoals}/${totalGoals}`,
      progress: goalsProgress,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Weight Tracking',
      value: `${currentWeight.toFixed(1)} kg`,
      progress: Math.min((weightEntryCount / 30) * 100, 100),
      icon: Scale,
      color: 'green'
    },
    {
      title: 'Consistency',
      value: '85%',
      progress: 85,
      icon: Calendar,
      color: 'purple'
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progressMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 text-${metric.color}-600`} />
                    <span className="font-medium text-gray-700">{metric.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {metric.value}
                  </span>
                </div>
                <Progress value={metric.progress} className="h-2" />
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {Math.round(metric.progress)}% complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
