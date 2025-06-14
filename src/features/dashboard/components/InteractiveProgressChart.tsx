
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Calendar, Activity, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from "react-router-dom";

type ChartType = 'weight' | 'calories' | 'workouts';

// Mock data generation functions
const generateWeightData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString(),
      value: 70 + Math.random() * 2 - 1,
      target: 68
    });
  }
  return data;
};

const generateCalorieData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString(),
      consumed: 1800 + Math.random() * 400,
      target: 2000,
      burned: 300 + Math.random() * 200
    });
  }
  return data;
};

const generateWorkoutData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString(),
      duration: Math.random() > 0.3 ? 30 + Math.random() * 60 : 0,
      calories: Math.random() > 0.3 ? 200 + Math.random() * 300 : 0
    });
  }
  return data;
};

const InteractiveProgressChart = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState<ChartType>('weight');

  const weightData = generateWeightData();
  const calorieData = generateCalorieData();
  const workoutData = generateWorkoutData();

  const getChartData = () => {
    switch (activeChart) {
      case 'weight': return weightData;
      case 'calories': return calorieData;
      case 'workouts': return workoutData;
      default: return weightData;
    }
  };

  const getChartTitle = () => {
    switch (activeChart) {
      case 'weight': return t('Weight Progress');
      case 'calories': return t('Calorie Tracking');
      case 'workouts': return t('Workout Activity');
      default: return t('Progress');
    }
  };

  const renderChart = () => {
    const data = getChartData();
    
    switch (activeChart) {
      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  `${value}kg`,
                  name === 'value' ? 'Weight' : 'Target'
                ]}
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'calories':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  `${value} cal`,
                  name === 'consumed' ? 'Consumed' : name === 'target' ? 'Target' : 'Burned'
                ]}
              />
              <Bar dataKey="consumed" fill="#10b981" />
              <Bar dataKey="target" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'workouts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  name === 'duration' ? `${value} min` : `${value} cal`,
                  name === 'duration' ? 'Duration' : 'Calories Burned'
                ]}
              />
              <Bar dataKey="duration" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getInsightText = () => {
    const data = getChartData();
    if (data.length < 2) return t('Add more data for insights');
    
    switch (activeChart) {
      case 'weight':
        const weightChange = data[data.length - 1].value - data[0].value;
        return weightChange > 0 
          ? t(`+${weightChange.toFixed(1)}kg change`) 
          : t(`${weightChange.toFixed(1)}kg change`);
      
      case 'calories':
        const avgConsumed = data.reduce((sum, d) => sum + d.consumed, 0) / data.length;
        return t(`Avg: ${Math.round(avgConsumed)} cal/day`);
      
      case 'workouts':
        const totalWorkouts = data.filter(d => d.duration > 0).length;
        return t(`${totalWorkouts} active days`);
      
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {getChartTitle()}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/progress/analytics')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            {t('View Details')}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={activeChart === 'weight' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('weight')}
            className="flex-1"
          >
            {t('Weight')}
          </Button>
          <Button
            variant={activeChart === 'calories' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('calories')}
            className="flex-1"
          >
            {t('Calories')}
          </Button>
          <Button
            variant={activeChart === 'workouts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('workouts')}
            className="flex-1"
          >
            {t('Workouts')}
          </Button>
        </div>

        <div className="h-[200px]">
          {renderChart()}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('Last 7 days')}</span>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            {getInsightText()}
          </Badge>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/progress/weight')}
            className="flex-1 text-xs"
          >
            <Activity className="w-3 h-3 mr-1" />
            {t('Log Weight')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/progress/goals')}
            className="flex-1 text-xs"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {t('Set Goals')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveProgressChart;
