
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Calendar, Award, Target, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

interface ProgressAnalyticsProps {
  weightEntries: any[];
  macroGoals: any[];
  className?: string;
}

const ProgressAnalytics = ({ weightEntries, macroGoals, className = "" }: ProgressAnalyticsProps) => {
  const { t } = useLanguage();

  // Calculate analytics data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      weight: 72 + Math.random() * 2,
      calories: 1800 + Math.random() * 400,
      workouts: Math.random() > 0.3 ? 1 : 0,
      steps: 8000 + Math.random() * 4000
    };
  });

  const progressMetrics = [
    {
      title: t('Weekly Progress'),
      value: '+2.1%',
      trend: 'up',
      description: t('Improvement from last week'),
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: t('Goal Completion'),
      value: '85%',
      trend: 'up',
      description: t('Average goal achievement'),
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: t('Consistency Score'),
      value: '92%',
      trend: 'up',
      description: t('Daily activity consistency'),
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: t('Streak Days'),
      value: '12',
      trend: 'stable',
      description: t('Current active streak'),
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <div className="w-3 h-3 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {progressMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Progress Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {t('Weekly Activity Overview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name={t('Calories')}
                />
                <Area 
                  type="monotone" 
                  dataKey="steps" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.4}
                  name={t('Steps')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macro Goals Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              {t('Daily Macro Goals')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {macroGoals.length > 0 ? macroGoals.map((goal, index) => {
              const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
              const isComplete = progress >= 100;
              
              return (
                <div key={goal.id || index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{goal.goal_type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {Math.round(goal.current_value)}/{goal.target_value}
                      </span>
                      {isComplete && <Award className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            }) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {t('No macro goals set. Visit the Goals tab to set up your daily targets.')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weight Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              {t('Weight Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weightEntries.length > 1 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightEntries.slice(0, 10).reverse().map(entry => ({
                    date: new Date(entry.recorded_at).toLocaleDateString(),
                    weight: entry.weight
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      name={t('Weight (kg)')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">
                  {t('Start tracking your weight to see progress charts')}
                </p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {t('Add Weight Entry')}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            {t('This Week Summary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">5</div>
              <div className="text-sm text-blue-600">{t('Workouts Completed')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">12,450</div>
              <div className="text-sm text-blue-600">{t('Avg Daily Calories')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">-0.5kg</div>
              <div className="text-sm text-blue-600">{t('Weight Change')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">92%</div>
              <div className="text-sm text-blue-600">{t('Goal Achievement')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
