
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target } from "lucide-react";

const FitnessProgressSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Fitness Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Workouts Completed</span>
            <span className="font-semibold">0 this week</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Exercise Minutes</span>
            <span className="font-semibold">0 min</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Target className="h-4 w-4" />
            <span className="text-sm">Complete your first workout to see progress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FitnessProgressSection;
