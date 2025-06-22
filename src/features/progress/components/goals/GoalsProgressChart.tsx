
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

export const GoalsProgressChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Goals Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Weight Loss</span>
              <span className="text-sm text-gray-500">70%</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Workout Consistency</span>
              <span className="text-sm text-gray-500">45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
