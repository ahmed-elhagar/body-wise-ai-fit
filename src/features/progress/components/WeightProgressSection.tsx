
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  ArrowRight,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useGoals } from "@/hooks/useGoals";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const WeightProgressSection = () => {
  const navigate = useNavigate();
  const { weightEntries, addWeightEntry } = useWeightTracking();
  const { getWeightGoal } = useGoals();
  
  const weightGoal = getWeightGoal();
  const currentWeight = weightEntries?.[0]?.weight || 0;
  const targetWeight = weightGoal?.target_value || 0;
  const previousWeight = weightEntries?.[1]?.weight || currentWeight;
  
  const weightChange = currentWeight - previousWeight;
  const progressToGoal = targetWeight > 0 ? 
    Math.abs((currentWeight - targetWeight) / (previousWeight - targetWeight)) * 100 : 0;

  // Prepare chart data
  const chartData = weightEntries?.slice(0, 10).reverse().map(entry => ({
    date: new Date(entry.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    target: targetWeight
  })) || [];

  const getTrendIcon = () => {
    if (weightChange > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (weightChange < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Target className="w-4 h-4 text-yellow-500" />;
  };

  const getTrendColor = () => {
    if (weightChange > 0) return "text-red-600 bg-red-50";
    if (weightChange < 0) return "text-green-600 bg-green-50";
    return "text-yellow-600 bg-yellow-50";
  };

  return (
    <div className="space-y-6">
      {/* Weight Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Scale className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {currentWeight || '--'}kg
            </div>
            <div className="text-sm text-blue-600">Current Weight</div>
            {weightEntries?.length > 0 && (
              <div className="text-xs text-blue-500 mt-2">
                Last updated: {new Date(weightEntries[0].recorded_at).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {targetWeight || '--'}kg
            </div>
            <div className="text-sm text-purple-600">Target Weight</div>
            {weightGoal && (
              <div className="text-xs text-purple-500 mt-2">
                Goal deadline: {new Date(weightGoal.target_date).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br border-2 ${getTrendColor()}`}>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              {getTrendIcon()}
            </div>
            <div className={`text-3xl font-bold mb-1 ${weightChange > 0 ? 'text-red-900' : weightChange < 0 ? 'text-green-900' : 'text-yellow-900'}`}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
            </div>
            <div className={`text-sm ${weightChange > 0 ? 'text-red-600' : weightChange < 0 ? 'text-green-600' : 'text-yellow-600'}`}>
              Change This Week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Weight Progress Chart
              </CardTitle>
              <Badge variant="outline">
                Last {chartData.length} entries
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value}kg`,
                      name === 'weight' ? 'Actual Weight' : 'Target Weight'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#3b82f6' }}
                    activeDot={{ r: 7 }}
                  />
                  {targetWeight > 0 && (
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 0 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Progress */}
      {weightGoal && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Target className="w-5 h-5" />
              Weight Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-green-700 font-medium">Progress to Goal</span>
              <Badge className="bg-green-600 text-white">
                {Math.round(progressToGoal)}%
              </Badge>
            </div>
            <Progress value={Math.min(progressToGoal, 100)} className="h-3" />
            <div className="text-sm text-green-600">
              {Math.abs(currentWeight - targetWeight).toFixed(1)}kg remaining to reach your goal
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/weight-tracker')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Weight
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/goals')}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <Target className="w-4 h-4 mr-2" />
          Set Weight Goal
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/progress/weight-history')}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          View History
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
