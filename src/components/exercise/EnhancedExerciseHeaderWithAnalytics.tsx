
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, TrendingUp, Flame } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ExerciseAnalytics {
  totalWorkouts: number;
  averageDuration: number;
  caloriesBurned: number;
  progressPercentage: number;
}

interface EnhancedExerciseHeaderWithAnalyticsProps {
  analytics: ExerciseAnalytics;
  currentDay: number;
  workoutType: "home" | "gym";
}

export const EnhancedExerciseHeaderWithAnalytics = ({ 
  analytics, 
  currentDay, 
  workoutType 
}: EnhancedExerciseHeaderWithAnalyticsProps) => {
  const { isRTL } = useI18n();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardContent className="p-6">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'text-right' : ''}`}>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-800">{analytics.totalWorkouts}</div>
            <div className="text-sm text-blue-600">Total Workouts</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-800">{analytics.averageDuration}m</div>
            <div className="text-sm text-green-600">Avg Duration</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-800">{analytics.caloriesBurned}</div>
            <div className="text-sm text-orange-600">Calories Burned</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-800">{analytics.progressPercentage}%</div>
            <div className="text-sm text-purple-600">Progress</div>
          </div>
        </div>
        
        <div className={`mt-4 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Badge className="bg-blue-100 text-blue-800">Day {currentDay}</Badge>
          <Badge className={workoutType === 'gym' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}>
            {workoutType === 'gym' ? 'Gym' : 'Home'} Workout
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
