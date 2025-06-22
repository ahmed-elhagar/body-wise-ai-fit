
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Activity,
  Scale,
  Utensils,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TraineeProgressProps {
  traineeId: string;
  traineeName: string;
  onBack: () => void;
}

const TraineeProgressTracking = ({ traineeId, traineeName, onBack }: TraineeProgressProps) => {
  // Mock progress data - in real app this would come from your backend
  const weightData = [
    { date: '2024-01-01', weight: 180 },
    { date: '2024-01-08', weight: 178 },
    { date: '2024-01-15', weight: 176 },
    { date: '2024-01-22', weight: 175 },
    { date: '2024-01-29', weight: 173 },
  ];

  const workoutData = [
    { week: 'Week 1', completed: 4, planned: 5 },
    { week: 'Week 2', completed: 5, planned: 5 },
    { week: 'Week 3', completed: 3, planned: 5 },
    { week: 'Week 4', completed: 4, planned: 5 },
  ];

  const nutritionData = [
    { day: 'Mon', calories: 2100, target: 2200 },
    { day: 'Tue', calories: 2050, target: 2200 },
    { day: 'Wed', calories: 2300, target: 2200 },
    { day: 'Thu', calories: 2150, target: 2200 },
    { day: 'Fri', calories: 2000, target: 2200 },
    { day: 'Sat', calories: 2400, target: 2200 },
    { day: 'Sun', calories: 2100, target: 2200 },
  ];

  const goals = [
    { id: 1, title: 'Lose 10 lbs', current: 7, target: 10, unit: 'lbs', status: 'on-track' },
    { id: 2, title: 'Complete 20 workouts', current: 16, target: 20, unit: 'workouts', status: 'on-track' },
    { id: 3, title: 'Maintain calorie deficit', current: 85, target: 90, unit: '%', status: 'at-risk' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'behind': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{traineeName} Progress</h1>
              <p className="text-gray-600 mt-1">Track progress and achievements</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>
            <Button>Send Feedback</Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Weight Lost</p>
                  <p className="text-2xl font-bold text-green-900">7 lbs</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">-2 lbs this week</span>
                  </div>
                </div>
                <Scale className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Workouts Complete</p>
                  <p className="text-2xl font-bold text-blue-900">16/20</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600">80% completion</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg Daily Calories</p>
                  <p className="text-2xl font-bold text-purple-900">2,143</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Target className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600">Target: 2,200</span>
                  </div>
                </div>
                <Utensils className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Program Days</p>
                  <p className="text-2xl font-bold text-orange-900">28/30</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-orange-600" />
                    <span className="text-xs text-orange-600">2 days remaining</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(goal.status)}
                      <h4 className="font-semibold">{goal.title}</h4>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Progress Charts */}
        <Tabs defaultValue="weight" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weight">Weight Progress</TabsTrigger>
            <TabsTrigger value="workouts">Workout Compliance</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Workout Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                      <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Daily Calorie Intake vs Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nutritionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#8b5cf6" name="Actual" />
                      <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TraineeProgressTracking;
