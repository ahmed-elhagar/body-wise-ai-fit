
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface MobileOptimizedHeaderProps {
  onAddFood: () => void;
}

const MobileOptimizedHeader = ({ onAddFood }: MobileOptimizedHeaderProps) => {
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {String(tFoodTracker('todaysIntake'))}
          </h2>
          <Button onClick={onAddFood} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {String(tFoodTracker('addFood'))}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedHeader;
