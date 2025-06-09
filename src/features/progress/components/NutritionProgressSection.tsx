
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Utensils, 
  Target, 
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMealPlanState } from "@/features/meal-plan/hooks";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const NutritionProgressSection = () => {
  const navigate = useNavigate();
  const { 
    currentWeekPlan, 
    totalCalories, 
    totalProtein, 
    targetDayCalories,
    dailyMeals 
  } = useMealPlanState();
  
  const { todayConsumption } = useFoodConsumption();

  // Calculate nutrition metrics
  const calorieProgress = targetDayCalories > 0 ? Math.min(100, (totalCalories / targetDayCalories) * 100) : 0;
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const proteinProgress = proteinTarget > 0 ? Math.min(100, (totalProtein / proteinTarget) * 100) : 0;
  const mealsPlanned = dailyMeals?.length || 0;
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);

  // Prepare weekly chart data (using today's data repeated for demo)
  const chartData = Array.from({ length: 7 }, (_, index) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
    calories: index === new Date().getDay() ? totalCalories : Math.round(totalCalories * (0.8 + Math.random() * 0.4)),
    target: targetDayCalories,
    protein: index === new Date().getDay() ? totalProtein : Math.round(totalProtein * (0.8 + Math.random() * 0.4))
  }));

  const nutritionStats = [
    {
      label: "Daily Calories",
      current: totalCalories,
      target: targetDayCalories,
      unit: "cal",
      progress: calorieProgress,
      icon: Utensils,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Protein Intake",
      current: totalProtein,
      target: proteinTarget,
      unit: "g",
      progress: proteinProgress,
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Meals Planned",
      current: mealsPlanned,
      target: 3,
      unit: "meals",
      progress: (mealsPlanned / 3) * 100,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Weekly Plan",
      current: currentWeekPlan ? 1 : 0,
      target: 1,
      unit: "plan",
      progress: currentWeekPlan ? 100 : 0,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Nutrition Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nutritionStats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <Card key={index} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-all duration-300`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {Math.round(stat.progress)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{stat.label}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{stat.current}</span>
                    <span className="text-sm text-gray-500">/ {stat.target} {stat.unit}</span>
                  </div>
                  <Progress value={stat.progress} className="h-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Nutrition Overview */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Utensils className="w-5 h-5" />
            Today's Nutrition Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-900 mb-1">{totalCalories}</div>
              <div className="text-sm text-green-600 mb-2">Calories Consumed</div>
              <Progress value={calorieProgress} className="h-2" />
              <div className="text-xs text-green-500 mt-1">
                {remainingCalories} remaining
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-900 mb-1">{totalProtein}g</div>
              <div className="text-sm text-green-600 mb-2">Protein Intake</div>
              <Progress value={proteinProgress} className="h-2" />
              <div className="text-xs text-green-500 mt-1">
                Target: {proteinTarget}g
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-900 mb-1">{mealsPlanned}</div>
              <div className="text-sm text-green-600 mb-2">Meals Planned</div>
              <Progress value={(mealsPlanned / 3) * 100} className="h-2" />
              <div className="text-xs text-green-500 mt-1">
                {3 - mealsPlanned} more to go
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Nutrition Chart */}
      {chartData.length > 0 && (
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
      )}

      {/* Meal Plan Status */}
      {currentWeekPlan && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              Current Meal Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">Plan Status</span>
              <Badge className="bg-blue-600 text-white">Active</Badge>
            </div>
            <div className="text-sm text-blue-600">
              You have an active meal plan with {currentWeekPlan.dailyMeals?.length || 0} meals planned
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/food-tracker')}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Track Food
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/meal-plan')}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <Calendar className="w-4 h-4 mr-2" />
          View Meal Plan
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/calorie-checker')}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <Zap className="w-4 h-4 mr-2" />
          Scan Food
        </Button>
      </div>
    </div>
  );
};
