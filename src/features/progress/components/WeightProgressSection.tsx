
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Weight } from "lucide-react";

const WeightProgressSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Weight className="h-5 w-5" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Weight</span>
            <span className="font-semibold">-- kg</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Goal Weight</span>
            <span className="font-semibold">-- kg</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Track your progress by logging daily weights</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightProgressSection;
