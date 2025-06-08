
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Target, Calendar, Award, BarChart3, LineChart, PieChart, Activity, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import AchievementBadges from '@/components/progress/AchievementBadges';

// Mock data for charts
const weightData = [
  { date: '2024-01-01', weight: 75 },
  { date: '2024-01-08', weight: 74.5 },
  { date: '2024-01-15', weight: 74.2 },
  { date: '2024-01-22', weight: 73.8 },
  { date: '2024-01-29', weight: 73.5 },
  { date: '2024-02-05', weight: 73.2 },
  { date: '2024-02-12', weight: 72.8 },
];

const caloriesData = [
  { day: 'Mon', calories: 2100, target: 2000 },
  { day: 'Tue', calories: 1950, target: 2000 },
  { day: 'Wed', calories: 2200, target: 2000 },
  { day: 'Thu', calories: 1800, target: 2000 },
  { day: 'Fri', calories: 2050, target: 2000 },
  { day: 'Sat', calories: 2300, target: 2000 },
  { day: 'Sun', calories: 1900, target: 2000 },
];

const macroData = [
  { name: 'Protein', value: 30, color: '#3B82F6' },
  { name: 'Carbs', value: 45, color: '#10B981' },
  { name: 'Fats', value: 25, color: '#F59E0B' },
];

const Progress = () => {
  const { t, isRTL } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');

  const currentWeight = 72.8;
  const startWeight = 75;
  const targetWeight = 70;
  const weightLost = startWeight - currentWeight;
  const weightToGo = currentWeight - targetWeight;
  const progressPercentage = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t('Progress Tracking')}
                  </CardTitle>
                  <p className="text-gray-600 font-medium">
                    {t('Monitor your health journey and celebrate achievements')}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{weightLost.toFixed(1)}kg</div>
                  <div className="text-xs text-gray-600">{t('lost')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{Math.round(progressPercentage)}%</div>
                  <div className="text-xs text-gray-600">{t('progress')}</div>
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    {t('On Track')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('Overview')}
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              {t('Weight')}
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              {t('Nutrition')}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              {t('Achievements')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      {t('Current')}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{currentWeight} kg</div>
                  <div className="text-sm text-gray-600">{t('Current Weight')}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {t('Lost')}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{weightLost.toFixed(1)} kg</div>
                  <div className="text-sm text-gray-600">{t('Weight Lost')}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                      {t('Remaining')}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{weightToGo.toFixed(1)} kg</div>
                  <div className="text-sm text-gray-600">{t('To Goal')}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                      {t('Progress')}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-gray-600">{t('Complete')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  {t('Goal Progress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>{t('Start')}: {startWeight} kg</span>
                    <span>{t('Current')}: {currentWeight} kg</span>
                    <span>{t('Goal')}: {targetWeight} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {progressPercentage >= 100 ? t('Goal Achieved! 🎉') : `${(100 - progressPercentage).toFixed(0)}% ${t('remaining')}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  {t('Weight Trend')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    {t('Weekly Calories')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={caloriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#10B981" />
                      <Bar dataKey="target" fill="#E5E7EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-orange-600" />
                    {t('Macro Distribution')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementBadges />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;
