
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyNutritionChartProps {
  totalCalories: number;
  targetDayCalories: number;
  totalProtein: number;
}

export const WeeklyNutritionChart = ({ totalCalories, targetDayCalories, totalProtein }: WeeklyNutritionChartProps) => {
  // Prepare weekly chart data (using today's data repeated for demo)
  const chartData = Array.from({ length: 7 }, (_, index) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
    calories: index === new Date().getDay() ? totalCalories : Math.round(totalCalories * (0.8 + Math.random() * 0.4)),
    target: targetDayCalories,
    protein: index === new Date().getDay() ? totalProtein : Math.round(totalProtein * (0.8 + Math.random() * 0.4))
  }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Weekly Nutrition Tracking
          </CardTitle>
          <Badge variant="outline">
            Last 7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'protein' ? `${value}g` : `${value} cal`,
                  name === 'calories' ? 'Calories' : name === 'target' ? 'Target' : 'Protein'
                ]}
              />
              <Bar dataKey="calories" fill="#10b981" name="calories" />
              <Bar dataKey="target" fill="#f59e0b" name="target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
