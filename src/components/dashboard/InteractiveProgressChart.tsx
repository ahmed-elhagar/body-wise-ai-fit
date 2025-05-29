
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Activity, Scale, Flame } from "lucide-react";
import { useState } from "react";

const InteractiveProgressChart = () => {
  const [activeChart, setActiveChart] = useState<'weight' | 'calories' | 'workouts'>('weight');

  // Mock data - in real app, this would come from user's actual data
  const weightData = [
    { date: '2024-01-01', value: 75, target: 70 },
    { date: '2024-01-08', value: 74.5, target: 70 },
    { date: '2024-01-15', value: 74.2, target: 70 },
    { date: '2024-01-22', value: 73.8, target: 70 },
    { date: '2024-01-29', value: 73.2, target: 70 },
    { date: '2024-02-05', value: 72.8, target: 70 },
    { date: '2024-02-12', value: 72.5, target: 70 },
  ];

  const calorieData = [
    { date: '2024-02-06', consumed: 2100, target: 2200, burned: 2350 },
    { date: '2024-02-07', consumed: 1950, target: 2200, burned: 2100 },
    { date: '2024-02-08', consumed: 2250, target: 2200, burned: 2400 },
    { date: '2024-02-09', consumed: 2050, target: 2200, burned: 2200 },
    { date: '2024-02-10', consumed: 1900, target: 2200, burned: 2150 },
    { date: '2024-02-11', consumed: 2150, target: 2200, burned: 2300 },
    { date: '2024-02-12', consumed: 1847, target: 2200, burned: 2180 },
  ];

  const workoutData = [
    { date: '2024-02-06', duration: 45, calories: 320 },
    { date: '2024-02-07', duration: 0, calories: 0 },
    { date: '2024-02-08', duration: 60, calories: 450 },
    { date: '2024-02-09', duration: 30, calories: 210 },
    { date: '2024-02-10', duration: 50, calories: 380 },
    { date: '2024-02-11', duration: 0, calories: 0 },
    { date: '2024-02-12', duration: 40, calories: 290 },
  ];

  const chartConfig = {
    weight: {
      title: 'Weight Progress',
      icon: Scale,
      color: '#3b82f6',
      data: weightData,
      dataKey: 'value',
      targetKey: 'target'
    },
    calories: {
      title: 'Calorie Tracking',
      icon: Flame,
      color: '#f97316',
      data: calorieData,
      dataKey: 'consumed',
      targetKey: 'target'
    },
    workouts: {
      title: 'Workout Duration',
      icon: Activity,
      color: '#8b5cf6',
      data: workoutData,
      dataKey: 'duration',
      targetKey: null
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'value') return [`${value} kg`, 'Weight'];
    if (name === 'target') return [`${value} kg`, 'Target'];
    if (name === 'consumed') return [`${value} kcal`, 'Consumed'];
    if (name === 'burned') return [`${value} kcal`, 'Burned'];
    if (name === 'duration') return [`${value} min`, 'Duration'];
    return [value, name];
  };

  const currentConfig = chartConfig[activeChart];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <currentConfig.icon className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-800">{currentConfig.title}</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Last 7 days
          </Badge>
        </div>

        <div className="flex gap-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={activeChart === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart(key as any)}
              className="text-xs"
            >
              <config.icon className="w-3 h-3 mr-1" />
              {config.title.split(' ')[0]}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'weight' && (
            <LineChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={['dataMin - 2', 'dataMax + 1']}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(value) => formatDate(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentConfig.color, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          )}

          {activeChart === 'calories' && (
            <AreaChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(value) => formatDate(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="consumed" 
                stackId="1"
                stroke={currentConfig.color}
                fill={currentConfig.color}
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="burned" 
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          )}

          {activeChart === 'workouts' && (
            <BarChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(value) => formatDate(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="duration" 
                fill={currentConfig.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        {activeChart === 'weight' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Current Weight</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-red-600 rounded" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-gray-600">Target Weight</span>
            </div>
          </>
        )}
        {activeChart === 'calories' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Calories Consumed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Calories Burned</span>
            </div>
          </>
        )}
        {activeChart === 'workouts' && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Workout Duration (minutes)</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InteractiveProgressChart;
