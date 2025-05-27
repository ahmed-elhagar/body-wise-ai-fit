
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Activity, Apple, Dumbbell, Droplets, Target, TrendingUp, Camera, Scale } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for demo
  const weightData = [
    { date: '2024-01-01', weight: 75 },
    { date: '2024-01-08', weight: 74.5 },
    { date: '2024-01-15', weight: 74.2 },
    { date: '2024-01-22', weight: 73.8 },
    { date: '2024-01-29', weight: 73.5 },
  ];

  const todayStats = {
    calories: { consumed: 1650, goal: 2000 },
    water: { consumed: 6, goal: 8 },
    exercise: { completed: 45, goal: 60 },
    steps: { taken: 8500, goal: 10000 }
  };

  const quickActions = [
    {
      title: "Meal Plan",
      subtitle: "View today's meals",
      icon: <Apple className="w-6 h-6" />,
      color: "bg-green-500",
      action: () => navigate('/meal-plan')
    },
    {
      title: "Exercise",
      subtitle: "Start workout",
      icon: <Dumbbell className="w-6 h-6" />,
      color: "bg-blue-500",
      action: () => navigate('/exercise')
    },
    {
      title: "Log Weight",
      subtitle: "Track progress",
      icon: <Scale className="w-6 h-6" />,
      color: "bg-purple-500",
      action: () => navigate('/weight-tracking')
    },
    {
      title: "Calorie Check",
      subtitle: "Scan food",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-orange-500",
      action: () => navigate('/calorie-checker')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Good Morning!</h1>
            <p className="text-gray-600">Ready to crush your goals today?</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile')}
            className="bg-white/80 backdrop-blur-sm"
          >
            Profile
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-2xl font-bold text-gray-800">
                  {todayStats.calories.consumed}
                </p>
                <p className="text-xs text-gray-500">of {todayStats.calories.goal}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Apple className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Progress 
              value={(todayStats.calories.consumed / todayStats.calories.goal) * 100} 
              className="mt-2"
            />
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Water</p>
                <p className="text-2xl font-bold text-gray-800">
                  {todayStats.water.consumed}
                </p>
                <p className="text-xs text-gray-500">of {todayStats.water.goal} glasses</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Progress 
              value={(todayStats.water.consumed / todayStats.water.goal) * 100} 
              className="mt-2"
            />
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exercise</p>
                <p className="text-2xl font-bold text-gray-800">
                  {todayStats.exercise.completed}
                </p>
                <p className="text-xs text-gray-500">of {todayStats.exercise.goal} min</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <Progress 
              value={(todayStats.exercise.completed / todayStats.exercise.goal) * 100} 
              className="mt-2"
            />
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Steps</p>
                <p className="text-2xl font-bold text-gray-800">
                  {todayStats.steps.taken.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">of {todayStats.steps.goal.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <Progress 
              value={(todayStats.steps.taken / todayStats.steps.goal) * 100} 
              className="mt-2"
            />
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weight Progress Chart */}
          <Card className="lg:col-span-2 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Weight Progress</h3>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">-1.5 kg</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={action.action}
                  className="w-full justify-start p-4 h-auto hover:bg-gray-50"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{action.title}</div>
                    <div className="text-sm text-gray-600">{action.subtitle}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Today's Highlights */}
        <Card className="mt-6 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Insights</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Nutrition</span>
              </div>
              <p className="text-sm text-green-700">
                Great job staying under your calorie goal! Consider adding more protein to your lunch.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Exercise</span>
              </div>
              <p className="text-sm text-blue-700">
                You're 15 minutes away from your exercise goal. A quick walk would complete it!
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Progress</span>
              </div>
              <p className="text-sm text-purple-700">
                You're on track to reach your monthly weight goal. Keep up the consistency!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
