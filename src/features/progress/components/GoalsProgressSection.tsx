
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";

const GoalsProgressSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Goals</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed Goals</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Set your first goal to start tracking progress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgressSection;
