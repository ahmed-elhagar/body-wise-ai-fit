
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Utensils, Camera, History, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import TodayTab from '@/components/food-tracker/TodayTab';
import HistoryTab from '@/components/food-tracker/HistoryTab';
import FoodPhotoAnalyzer from '@/components/calorie/FoodPhotoAnalyzer';

const FoodTracker = () => {
  const { t, isRTL } = useI18n();
  const [activeTab, setActiveTab] = useState('today');

  // Mock data for demo
  const todayStats = {
    calories: 1245,
    target: 2000,
    protein: 65,
    carbs: 145,
    fats: 42
  };

  const caloriesPercentage = (todayStats.calories / todayStats.target) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {t('Food Tracker')}
                  </CardTitle>
                  <p className="text-gray-600 font-medium">
                    {t('Track your daily nutrition and reach your health goals')}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{todayStats.calories}</div>
                  <div className="text-xs text-gray-600">{t('calories')}</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{todayStats.protein}g</div>
                  <div className="text-xs text-gray-600">{t('protein')}</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <Badge className={`${caloriesPercentage >= 100 ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
                    {Math.round(caloriesPercentage)}%
                  </Badge>
                  <div className="text-xs text-gray-600">{t('of goal')}</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {t('Today')}
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {t('Photo Analysis')}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              {t('History')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <TodayTab />
          </TabsContent>

          <TabsContent value="photo" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <FoodPhotoAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FoodTracker;
