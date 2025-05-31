
import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";
import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { Badge } from "@/components/ui/badge";
import TimeRangeSelector from "./TimeRangeSelector";
import TrendIndicator from "./TrendIndicator";
import ChartLegend from "./ChartLegend";
import DataSummary from "./DataSummary";
import EmptyWeightChart from "./EmptyWeightChart";
import WeightChart from "./WeightChart";
import { useWeightChartData } from "./useWeightChartData";

interface WeightProgressChartProps {
  weightEntries: WeightEntry[];
}

const WeightProgressChart = ({ weightEntries }: WeightProgressChartProps) => {
  const [timeRange, setTimeRange] = useState<30 | 90 | 180>(30);
  const { getWeightGoal } = useGoals();
  
  const chartData = useWeightChartData(weightEntries, timeRange);
  const weightGoal = getWeightGoal();
  const goalWeight = weightGoal?.target_value;

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
          <TrendIndicator chartData={chartData} />
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <WeightChart chartData={chartData} goalWeight={goalWeight} />
          <ChartLegend chartData={chartData} goalWeight={goalWeight} />
          <DataSummary chartData={chartData} timeRange={timeRange} />
        </>
      ) : (
        <EmptyWeightChart />
      )}
    </Card>
  );
};

export default WeightProgressChart;
