import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

interface DataPoint {
  date: string;
  value: number;
}

interface TrendAnalysisProps {
  data: DataPoint[];
  title: string;
}

const TrendAnalysis = ({ data, title }: TrendAnalysisProps) => {
  const [period, setPeriod] = useState('30d');
  
  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = period === '7d' 
      ? subDays(now, 7) 
      : period === '30d' 
        ? subDays(now, 30) 
        : subMonths(now, 3);
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  }, [data, period]);
  
  const trend = useMemo(() => {
    if (filteredData.length < 2) {
      return { direction: 'stable', percentage: 0 };
    }
    
    const first = filteredData[0].value;
    const last = filteredData[filteredData.length - 1].value;
    const change = last - first;
    const percentage = first !== 0 ? Math.round((change / first) * 100) : 0;
    
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    };
  }, [filteredData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <div className="flex gap-2">
            <Badge variant={trend.direction === 'up' ? 'success' : trend.direction === 'down' ? 'destructive' : 'secondary'}>
              {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.percentage}%
            </Badge>
            <Badge variant="outline">
              {period}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setPeriod('7d')}
            className={`px-2 py-1 text-xs rounded ${period === '7d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            7D
          </button>
          <button 
            onClick={() => setPeriod('30d')}
            className={`px-2 py-1 text-xs rounded ${period === '30d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            30D
          </button>
          <button 
            onClick={() => setPeriod('90d')}
            className={`px-2 py-1 text-xs rounded ${period === '90d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            90D
          </button>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Value']}
                labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
