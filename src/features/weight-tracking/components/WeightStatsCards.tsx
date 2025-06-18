
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";

interface WeightStatsCardsProps {
  weightEntries: WeightEntry[];
  currentWeight?: number;
  targetWeight?: number;
  weightChange?: number;
  timeframe?: string;
}

export const WeightStatsCards = ({ 
  weightEntries,
  currentWeight, 
  targetWeight, 
  weightChange,
  timeframe = "30 days"
}: WeightStatsCardsProps) => {
  // Calculate stats from entries if not provided
  const calculatedCurrentWeight = currentWeight || (weightEntries?.[0]?.weight || 0);
  const calculatedWeightChange = weightChange || (
    weightEntries?.length >= 2 ? 
    weightEntries[0].weight - weightEntries[1].weight : 0
  );

  const isPositiveChange = calculatedWeightChange > 0;
  const isNegativeChange = calculatedWeightChange < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="text-2xl font-bold">{calculatedCurrentWeight || '--'} kg</p>
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
                {calculatedWeightChange ? `${calculatedWeightChange > 0 ? '+' : ''}${calculatedWeightChange.toFixed(1)}` : '--'} kg
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
