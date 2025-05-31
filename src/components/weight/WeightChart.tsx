
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useWeightChartData } from "./useWeightChartData";
import TimeRangeSelector from "./TimeRangeSelector";
import DataSummary from "./DataSummary";
import ChartLegend from "./ChartLegend";
import TrendIndicator from "./TrendIndicator";
import EmptyWeightChart from "./EmptyWeightChart";

const WeightChart = () => {
  const [timeRange, setTimeRange] = useState<30 | 90 | 180>(30);
  const { weightEntries, isLoading } = useWeightTracking();
  const chartData = useWeightChartData(weightEntries, timeRange);

  if (isLoading) {
    return (
      <Card className="card-enhanced">
        <CardHeader className="card-padding">
          <CardTitle className="text-h4">Weight Progress</CardTitle>
        </CardHeader>
        <CardContent className="card-padding">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-fitness-neutral-200 rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="card-enhanced">
        <CardHeader className="card-padding">
          <CardTitle className="text-h4">Weight Progress</CardTitle>
        </CardHeader>
        <CardContent className="card-padding">
          <EmptyWeightChart />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-enhanced">
      <CardHeader className="card-padding">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-h4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-fitness-primary-500 to-fitness-accent-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Weight Progress
            </CardTitle>
            <TrendIndicator chartData={chartData} />
          </div>
          <TimeRangeSelector timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        </div>
      </CardHeader>
      
      <CardContent className="card-padding pt-0">
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--fitness-neutral-200))" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="hsl(var(--fitness-neutral-500))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--fitness-neutral-500))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--fitness-primary-500))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--fitness-primary-500))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: 'hsl(var(--fitness-primary-600))' }}
                name="Weight (kg)"
              />
              
              {chartData.some(d => d.bodyFat !== null) && (
                <Line 
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="hsl(var(--fitness-orange-500))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--fitness-orange-500))', strokeWidth: 2, r: 4 }}
                  name="Body Fat %"
                />
              )}
              
              {chartData.some(d => d.muscleMass !== null) && (
                <Line 
                  type="monotone" 
                  dataKey="muscleMass" 
                  stroke="hsl(var(--success-500))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success-500))', strokeWidth: 2, r: 4 }}
                  name="Muscle Mass (kg)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ChartLegend chartData={chartData} />
        <DataSummary chartData={chartData} timeRange={timeRange} />
      </CardContent>
    </Card>
  );
};

export default WeightChart;
