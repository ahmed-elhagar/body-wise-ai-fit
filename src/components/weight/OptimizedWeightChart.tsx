
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOptimizedWeightChart } from "@/hooks/useOptimizedWeightChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const OptimizedWeightChart = () => {
  const { chartData, stats, isLoading, hasData } = useOptimizedWeightChart();

  if (isLoading) {
    return <div className="p-4">Loading weight data...</div>;
  }

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No weight data available. Start tracking your weight to see progress!</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Weight Progress
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon()}
            <span className={
              stats.trend === 'increasing' ? 'text-red-500' : 
              stats.trend === 'decreasing' ? 'text-green-500' : 'text-gray-500'
            }>
              {Math.abs(stats.change).toFixed(1)}kg
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Current</p>
            <p className="font-semibold">{stats.current.toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average</p>
            <p className="font-semibold">{stats.average.toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Entries</p>
            <p className="font-semibold">{stats.totalEntries}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
