
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface WeightStatsCardsProps {
  currentWeight?: number;
  targetWeight?: number;
  weightChange?: number;
  timeframe?: string;
}

export const WeightStatsCards = ({ 
  currentWeight, 
  targetWeight, 
  weightChange,
  timeframe = "30 days"
}: WeightStatsCardsProps) => {
  const isPositiveChange = (weightChange || 0) > 0;
  const isNegativeChange = (weightChange || 0) < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="text-2xl font-bold">{currentWeight || '--'} kg</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Target Weight</p>
            <p className="text-2xl font-bold">{targetWeight || '--'} kg</p>
          </div>
          <Target className="w-8 h-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Change ({timeframe})</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">
                {weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}` : '--'} kg
              </p>
              {isPositiveChange && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Up
                </Badge>
              )}
              {isNegativeChange && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Down
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
