
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { MealTypeSection } from "./daily-view";
import { DailyNutritionSummary } from "./daily-view";
import { EmptyDailyState } from "./daily-view";
import { format } from "date-fns";
import type { DailyMeal } from "../types";

interface DayOverviewProps {
  date: Date;
  meals: DailyMeal[];
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index: number) => void;
  targetCalories?: number;
}

const DayOverview = ({
  date,
  meals,
  onShowRecipe,
  onExchangeMeal,
  targetCalories
}: DayOverviewProps) => {
  const { tFrom } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  if (!meals || meals.length === 0) {
    return <EmptyDailyState date={date} />;
  }

  const formattedDate = format(date, 'EEEE, MMMM d');

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </CardTitle>
        <Badge variant="secondary">
          {meals.length} {String(tMealPlan('meals'))}
        </Badge>
      </CardHeader>
      <CardContent className="pl-2 pr-2 pt-0">
        <div className="grid gap-4" data-testid="today-meals">
          <DailyNutritionSummary meals={meals} targetCalories={targetCalories} />
          <MealTypeSection
            mealType="breakfast"
            meals={meals}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
          <MealTypeSection
            mealType="lunch"
            meals={meals}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
          <MealTypeSection
            mealType="dinner"
            meals={meals}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
          <MealTypeSection
            mealType="snack"
            meals={meals}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DayOverview;
