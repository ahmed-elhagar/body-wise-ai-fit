
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Scale, Target, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from "react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";

const WeightTracking = () => {
  const navigate = useNavigate();
  const [newWeight, setNewWeight] = useState("");
  const { weightEntries, addWeightEntry, isAdding } = useWeightTracking();
  const { profile } = useProfile();

  // Process weight entries for charts
  const weightData = weightEntries.map(entry => ({
    date: entry.recorded_at,
    weight: parseFloat(entry.weight.toString()),
    target: profile?.weight ? parseFloat(profile.weight.toString()) - 5 : 70
  }));

  // Calculate monthly progress
  const monthlyProgress = weightEntries.reduce((acc: any[], entry, index) => {
    if (index === 0) return acc;
    
    const currentMonth = new Date(entry.recorded_at).toLocaleDateString('en-US', { month: 'short' });
    const prevWeight = weightEntries[index - 1] ? parseFloat(weightEntries[index - 1].weight.toString()) : 0;
    const currentWeight = parseFloat(entry.weight.toString());
    const loss = prevWeight - currentWeight;
    
    const existingMonth = acc.find(item => item.month === currentMonth);
    if (existingMonth) {
      existingMonth.loss += loss;
    } else {
      acc.push({ month: currentMonth, loss: Math.max(0, loss) });
    }
    
    return acc;
  }, []).slice(-5);

  const currentWeight = weightEntries.length > 0 ? parseFloat(weightEntries[0].weight.toString()) : profile?.weight || 0;
  const startWeight = weightEntries.length > 0 ? parseFloat(weightEntries[weightEntries.length - 1].weight.toString()) : currentWeight;
  const targetWeight = profile?.weight ? parseFloat(profile.weight.toString()) - 5 : 70;
  const weightLoss = startWeight - currentWeight;
  const weightToGo = currentWeight - targetWeight;

  const handleAddWeight = () => {
    if (newWeight && parseFloat(newWeight) > 0) {
      addWeightEntry({
        weight: parseFloat(newWeight),
        recorded_at: new Date().toISOString()
      });
      setNewWeight("");
    }
  };

  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return '0.0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Weight Tracking</h1>
              <p className="text-gray-600">Monitor your progress and stay on track</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Weight</h3>
                <Scale className="w-5 h-5 text-fitness-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">{currentWeight.toFixed(1)} kg</p>
              {weightLoss > 0 && (
                <div className="flex items-center text-green-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="text-sm">-{weightLoss.toFixed(1)} kg total</span>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Target Weight</h3>
                <Target className="w-5 h-5 text-fitness-secondary" />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">{targetWeight.toFixed(1)} kg</p>
              {weightToGo > 0 && (
                <div className="flex items-center text-blue-600">
                  <span className="text-sm">{weightToGo.toFixed(1)} kg to go</span>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Log New Weight</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Enter your weight"
                    step="0.1"
                  />
                </div>
                <Button 
                  onClick={handleAddWeight}
                  disabled={isAdding || !newWeight}
                  className="w-full bg-fitness-gradient hover:opacity-90 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {isAdding ? 'Adding...' : 'Log Today\'s Weight'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Weight Progress Chart */}
            {weightData.length > 0 ? (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Weight Progress</h3>
                    <p className="text-sm text-gray-600">Your weight journey</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-fitness-primary rounded-full"></div>
                      <span className="text-sm text-gray-600">Actual Weight</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-fitness-secondary rounded-full"></div>
                      <span className="text-sm text-gray-600">Target Weight</span>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData.slice().reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value, name) => [
                          `${formatTooltipValue(value)} kg`,
                          name === 'weight' ? 'Actual Weight' : 'Target Weight'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="text-center py-12">
                  <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Weight Data Yet</h3>
                  <p className="text-gray-500">Start logging your weight to see your progress chart</p>
                </div>
              </Card>
            )}

            {/* Monthly Progress */}
            {monthlyProgress.length > 0 && (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Monthly Progress</h3>
                    <p className="text-sm text-gray-600">Weight loss per month</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Progress Tracking</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${formatTooltipValue(value)} kg`, 'Weight Loss']}
                      />
                      <Bar 
                        dataKey="loss" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Insights */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Insights</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Total Entries</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    You have logged {weightEntries.length} weight entries. Keep tracking consistently!
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Weight Change</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {weightLoss > 0 ? `Great job! You've lost ${weightLoss.toFixed(1)} kg` : 'Start your weight loss journey today!'}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Goal Progress</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {weightToGo > 0 ? `${weightToGo.toFixed(1)} kg remaining to reach your goal` : 'Congratulations! Goal achieved!'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightTracking;
