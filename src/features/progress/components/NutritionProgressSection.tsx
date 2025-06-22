
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, PieChart } from "lucide-react";

const NutritionProgressSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5" />
          Nutrition Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Calories Today</span>
            <span className="font-semibold">0 / 2000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Meals Logged</span>
            <span className="font-semibold">0 today</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <PieChart className="h-4 w-4" />
            <span className="text-sm">Log meals to track your nutrition progress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionProgressSection;
