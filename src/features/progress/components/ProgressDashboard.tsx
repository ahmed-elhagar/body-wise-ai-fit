
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, TrendingUp } from "lucide-react";
import WeightProgressSection from './WeightProgressSection';
import FitnessProgressSection from './FitnessProgressSection';
import GoalsProgressSection from './GoalsProgressSection';
import NutritionProgressSection from './NutritionProgressSection';
import AchievementsSection from './AchievementsSection';

const ProgressDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Progress Dashboard</h1>
          <p className="text-gray-600">Track your fitness journey and achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeightProgressSection />
        <FitnessProgressSection />
        <GoalsProgressSection />
        <NutritionProgressSection />
      </div>

      <div className="mt-6">
        <AchievementsSection />
      </div>
    </div>
  );
};

export default ProgressDashboard;
