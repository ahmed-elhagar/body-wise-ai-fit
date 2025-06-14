
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";

const NutritionHeatMap = () => {
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {String(tFoodTracker('nutritionTrends'))}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500 py-8">
          {String(tFoodTracker('comingSoon'))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionHeatMap;
