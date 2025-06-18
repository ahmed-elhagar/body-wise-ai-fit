
import React from "react";
import { Card } from "@/components/ui/card";
import { Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";
import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { Badge } from "@/components/ui/badge";
import { useOptimizedWeightChart } from "@/hooks/useOptimizedWeightChart";
import TimeRangeSelector from "./TimeRangeSelector";
import EmptyWeightChart from "./EmptyWeightChart";
import { WeightChart } from "@/features/weight-tracking/components/WeightChart";

interface OptimizedWeightChartProps {
  weightEntries: WeightEntry[];
}

const OptimizedWeightChart = React.memo<OptimizedWeightChartProps>(({ weightEntries }) => {
  const [timeRange, setTimeRange] = useState<30 | 90 | 180>(30);
  const { getWeightGoal } = useGoals();
  const { chartData, stats, hasData } = useOptimizedWeightChart(weightEntries, timeRange);
  
  const weightGoal = getWeightGoal();
  const goalWeight = weightGoal?.target_value;

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (stats.trend) {
      case 'up':
        return "text-green-600";
      case 'down':
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Convert chartData to format expected by WeightChart
  const weightChartData = chartData.map(point => ({
    date: point.date,
    weight: point.weight
  }));

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Weight Progress
            {goalWeight && (
              <Badge variant="outline" className="ml-2 text-xs">
                Goal: {goalWeight}kg
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-600">Track your weight journey over time</p>
        </div>
        
        <div className="flex items-center gap-4">
          <TimeRangeSelector 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange} 
          />
          
          {hasData && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {stats.trend === 'stable' ? 'Stable' : `${stats.trendPercentage}%`}
              </span>
            </div>
          )}
        </div>
      </div>

      {hasData ? (
        <>
          <WeightChart data={weightChartData} />
          
          {/* Statistics Summary */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Average</div>
              <div className="text-lg font-semibold text-blue-600">
                {stats.averageWeight}kg
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Highest</div>
              <div className="text-lg font-semibold text-green-600">
                {stats.highestWeight}kg
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Lowest</div>
              <div className="text-lg font-semibold text-orange-600">
                {stats.lowestWeight}kg
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Entries</div>
              <div className="text-lg font-semibold text-purple-600">
                {stats.totalEntries}
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyWeightChart />
      )}
    </Card>
  );
});

OptimizedWeightChart.displayName = 'OptimizedWeightChart';

export default OptimizedWeightChart;
