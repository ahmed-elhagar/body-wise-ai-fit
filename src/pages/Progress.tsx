import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp } from "lucide-react";
import { useMealPlanState } from '@/features/meal-plan/hooks';

const Progress = () => {
  const {
    currentWeekPlan,
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    weekStartDate,
    selectedDayNumber
  } = useMealPlanState();

  const getDayName = (dayNumber: number) => {
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + dayOffset);
    return date;
  };

  const progressPercentage = Math.min(100, (totalCalories / targetDayCalories) * 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const proteinProgress = Math.min(100, (totalProtein / proteinTarget) * 100);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-semibold">
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Calories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalCalories}</div>
                    <div className="text-sm text-gray-500">
                      {remainingCalories} remaining of {targetDayCalories}
                    </div>
                    <Progress value={progressPercentage} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Protein
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalProtein}g</div>
                    <div className="text-sm text-gray-500">
                      Target: {proteinTarget}g
                    </div>
                    <Progress value={proteinProgress} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Meals Planned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{dailyMeals?.length || 0}</div>
                    <div className="text-sm text-gray-500">
                      {dailyMeals?.length >= 3 ? 'Complete' : 'In Progress'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Daily Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
                    <div className="text-sm text-gray-500">
                      {progressPercentage >= 80 ? 'On Track' : 'Need More'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Progress;
