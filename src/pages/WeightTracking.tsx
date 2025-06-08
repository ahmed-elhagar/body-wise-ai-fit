
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, TrendingDown, Target, Scale, Calendar, BarChart3 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data
const weightHistory = [
  { date: '2024-01-01', weight: 75.0 },
  { date: '2024-01-08', weight: 74.5 },
  { date: '2024-01-15', weight: 74.2 },
  { date: '2024-01-22', weight: 73.8 },
  { date: '2024-01-29', weight: 73.5 },
  { date: '2024-02-05', weight: 73.2 },
  { date: '2024-02-12', weight: 72.8 },
];

const WeightTracking = () => {
  const { t, isRTL } = useI18n();
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('log');

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const startWeight = weightHistory[0]?.weight || 0;
  const goalWeight = 70;
  const totalLoss = startWeight - currentWeight;
  const remainingToGoal = currentWeight - goalWeight;
  const progressPercentage = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100;

  const handleAddWeight = () => {
    if (!newWeight) {
      toast.error(t('Please enter a weight'));
      return;
    }

    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error(t('Please enter a valid weight'));
      return;
    }

    // Here you would normally save to database
    toast.success(t('Weight logged successfully!'));
    setNewWeight('');
    console.log('Logging weight:', { weight, date: selectedDate });
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return 'stable';
    const recent = weightHistory.slice(-3);
    const trend = recent[recent.length - 1].weight - recent[0].weight;
    return trend < -0.2 ? 'down' : trend > 0.2 ? 'up' : 'stable';
  };

  const trend = getWeightTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {t('Weight Tracking')}
                  </CardTitle>
                  <p className="text-gray-600 font-medium">
                    {t('Monitor your weight journey and track your progress')}
                  </p>
                </div>
              </div>

              {/* Current Weight Display */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentWeight} kg</div>
                  <div className="text-sm text-gray-600">{t('Current Weight')}</div>
                </div>
                <div className="text-center">
                  <Badge className={`${
                    trend === 'down' ? 'bg-green-500' : 
                    trend === 'up' ? 'bg-red-500' : 'bg-gray-500'
                  } text-white`}>
                    {trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : 
                     trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                     <Target className="w-3 h-3 mr-1" />}
                    {trend === 'down' ? t('Losing') : trend === 'up' ? t('Gaining') : t('Stable')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalLoss.toFixed(1)} kg</div>
              <div className="text-sm text-gray-600">{t('Total Weight Lost')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                  {t('Goal')}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{goalWeight} kg</div>
              <div className="text-sm text-gray-600">{t('Target Weight')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  {t('Remaining')}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{remainingToGoal.toFixed(1)} kg</div>
              <div className="text-sm text-gray-600">{t('To Goal')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
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

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('Log Weight')}
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('Progress Chart')}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('History')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  {t('Add New Weight Entry')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">{t('Weight (kg)')}</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="75.0"
                      className="text-xl font-bold text-center"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">{t('Date')}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAddWeight}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('Log Weight')}
                </Button>

                {/* Goal Progress */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-700">{t('Progress to Goal')}</span>
                    <span className="text-sm text-blue-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    {remainingToGoal > 0 ? `${remainingToGoal.toFixed(1)} kg ${t('to goal')}` : t('Goal achieved! 🎉')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  {t('Weight Progress Chart')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {t('Weight History')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weightHistory.slice().reverse().map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Scale className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{entry.weight} kg</div>
                          <div className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {index < weightHistory.length - 1 && (
                        <Badge variant="outline" className={
                          entry.weight < weightHistory[weightHistory.length - index - 2].weight
                            ? 'text-green-600 border-green-200 bg-green-50'
                            : entry.weight > weightHistory[weightHistory.length - index - 2].weight
                            ? 'text-red-600 border-red-200 bg-red-50'
                            : 'text-gray-600 border-gray-200 bg-gray-50'
                        }>
                          {entry.weight < weightHistory[weightHistory.length - index - 2].weight ? '↓' :
                           entry.weight > weightHistory[weightHistory.length - index - 2].weight ? '↑' : '→'}
                          {Math.abs(entry.weight - weightHistory[weightHistory.length - index - 2].weight).toFixed(1)} kg
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeightTracking;
