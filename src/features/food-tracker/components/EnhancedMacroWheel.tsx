
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";

const EnhancedMacroWheel = () => {
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {String(tFoodTracker('macronutrients'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{String(tFoodTracker('protein'))}</span>
            <span>0g / 150g</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{String(tFoodTracker('carbs'))}</span>
            <span>0g / 200g</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{String(tFoodTracker('fat'))}</span>
            <span>0g / 65g</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMacroWheel;
