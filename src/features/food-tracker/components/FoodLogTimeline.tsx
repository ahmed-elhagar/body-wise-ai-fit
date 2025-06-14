
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";

const FoodLogTimeline = () => {
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-gray-500">
          {String(tFoodTracker('noMealsToday'))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodLogTimeline;
