
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

const ModernProgressTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Track Your Journey</h3>
          <p className="text-gray-500">Your progress data will appear here once you start logging activities.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernProgressTracker;
