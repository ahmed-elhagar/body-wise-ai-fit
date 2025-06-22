
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFoodConsumption } from '../hooks';
import { useI18n } from '@/shared/hooks/useI18n';
import { 
  Activity,
  Flame,
  Target,
  TrendingUp,
  Zap,
  Plus,
  Utensils,
  Dumbbell,
  Apple,
  Coffee,
  Droplets,
  Calendar,
  Clock,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';
import { format } from 'date-fns';
import AddFoodDialog from './AddFoodDialog';
import { toast } from 'sonner';

interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailyGoals extends MacroData {
  water: number; // in ml
}

interface SimpleFoodTrackerProps {
  refreshKey?: number;
  onAddFood?: () => void;
}

const SimpleFoodTracker: React.FC<SimpleFoodTrackerProps> = ({ refreshKey, onAddFood }) => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: userLoading } = useAuth();
  const { todayConsumption, todayMealPlan, isLoading: consumptionLoading, forceRefresh } = useFoodConsumption();
  const { t, isRTL } = useI18n();
  
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  
  const isLoading = profileLoading || userLoading || consumptionLoading;

  // Force refresh on component mount or refresh key change
  useEffect(() => {
    forceRefresh();
  }, [forceRefresh, refreshKey]);

  // Load water intake from localStorage
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const savedWater = localStorage.getItem(`water-${today}`);
    if (savedWater) {
      setWaterIntake(parseInt(savedWater, 10));
    }
  }, []);

  // Calculate daily goals (using defaults until profile has goal fields)
  const dailyGoals: DailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 2000,
  };

  // Calculate consumed totals
  const consumedTotals: MacroData = (todayConsumption || []).reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories_consumed || 0),
      protein: acc.protein + (item.protein_consumed || 0),
      carbs: acc.carbs + (item.carbs_consumed || 0),
      fat: acc.fat + (item.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate progress percentages
  const progress = {
    calories: dailyGoals.calories > 0 ? Math.min((consumedTotals.calories / dailyGoals.calories) * 100, 100) : 0,
    protein: dailyGoals.protein > 0 ? Math.min((consumedTotals.protein / dailyGoals.protein) * 100, 100) : 0,
    carbs: dailyGoals.carbs > 0 ? Math.min((consumedTotals.carbs / dailyGoals.carbs) * 100, 100) : 0,
    fat: dailyGoals.fat > 0 ? Math.min((consumedTotals.fat / dailyGoals.fat) * 100, 100) : 0,
    water: dailyGoals.water > 0 ? Math.min((waterIntake / dailyGoals.water) * 100, 100) : 0,
  };

  // Calculate remaining values
  const remaining = {
    calories: Math.max(0, dailyGoals.calories - consumedTotals.calories),
    protein: Math.max(0, dailyGoals.protein - consumedTotals.protein),
    carbs: Math.max(0, dailyGoals.carbs - consumedTotals.carbs),
    fat: Math.max(0, dailyGoals.fat - consumedTotals.fat),
    water: Math.max(0, dailyGoals.water - waterIntake),
  };

  const handleAddWater = (amount: number) => {
    const newWaterIntake = waterIntake + amount;
    setWaterIntake(newWaterIntake);
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`water-${today}`, newWaterIntake.toString());
    if (newWaterIntake >= dailyGoals.water) {
      toast.success('🎉 Daily water goal achieved!');
    }
  };

  const handleFoodAdded = async () => {
    setIsAddFoodOpen(false);
    await forceRefresh();
    toast.success('Food added successfully!');
  };

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <SimpleLoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            
            <CardContent className="relative p-8 md:p-10">
              <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className={`flex items-center gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 shadow-lg">
                      <Utensils className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {t('welcome_back', { name: userName })}
                      </h1>
                      <p className="text-white/80 text-lg">
                        {t('track_your_nutrition_today')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Overview Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 text-orange-300" />
                        <div>
                          <p className="text-white/80 text-sm">{t('calories')}</p>
                          <p className="text-white font-bold text-lg">{Math.round(consumedTotals.calories)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Dumbbell className="w-6 h-6 text-blue-300" />
                        <div>
                          <p className="text-white/80 text-sm">{t('protein')}</p>
                          <p className="text-white font-bold text-lg">{Math.round(consumedTotals.protein)}g</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Apple className="w-6 h-6 text-green-300" />
                        <div>
                          <p className="text-white/80 text-sm">{t('carbs')}</p>
                          <p className="text-white font-bold text-lg">{Math.round(consumedTotals.carbs)}g</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Droplets className="w-6 h-6 text-cyan-300" />
                        <div>
                          <p className="text-white/80 text-sm">{t('water')}</p>
                          <p className="text-white font-bold text-lg">{Math.round(waterIntake / 250)} cups</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => setIsAddFoodOpen(true)}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 px-6 py-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add_food')}
                  </Button>
                  
                  <Button
                    onClick={() => handleAddWater(250)}
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 px-6 py-3"
                  >
                    <Droplets className="w-4 h-4 mr-2" />
                    {t('add_water')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Food Log */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    {t("today's_meals")}
                    <Badge variant="secondary" className="ml-auto">
                      {todayConsumption?.length || 0} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayConsumption && todayConsumption.length > 0 ? (
                    <div className="space-y-4">
                      {todayConsumption.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Utensils className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {item.food_item?.name || 'Unknown Food'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.quantity_g}g • {item.meal_type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {Math.round(item.calories_consumed)} cal
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(item.consumed_at), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">{t('no_meals_logged_today')}</p>
                      <p className="text-gray-400 text-sm mb-6">{t('start_tracking_your_nutrition')}</p>
                      <Button 
                        onClick={() => setIsAddFoodOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('add_first_meal')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Progress & Quick Actions */}
            <div className="space-y-6">
              {/* Daily Progress */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    {t('daily_progress')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('calories')}</span>
                      <span>{Math.round(progress.calories)}%</span>
                    </div>
                    <Progress value={progress.calories} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('protein')}</span>
                      <span>{Math.round(progress.protein)}%</span>
                    </div>
                    <Progress value={progress.protein} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('carbs')}</span>
                      <span>{Math.round(progress.carbs)}%</span>
                    </div>
                    <Progress value={progress.carbs} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('fat')}</span>
                      <span>{Math.round(progress.fat)}%</span>
                    </div>
                    <Progress value={progress.fat} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('water')}</span>
                      <span>{Math.round(progress.water)}%</span>
                    </div>
                    <Progress value={progress.water} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    {t('quick_actions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setIsAddFoodOpen(true)}
                    className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                    variant="ghost"
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    {t('log_meal')}
                  </Button>
                  
                  <Button 
                    onClick={() => handleAddWater(250)}
                    className="w-full justify-start bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                    variant="ghost"
                  >
                    <Droplets className="w-4 h-4 mr-3" />
                    Add 250ml Water
                  </Button>
                  
                  <Button 
                    onClick={() => handleAddWater(500)}
                    className="w-full justify-start bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                    variant="ghost"
                  >
                    <Coffee className="w-4 h-4 mr-3" />
                    Add 500ml Water
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Dialog */}
      <AddFoodDialog
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onFoodAdded={handleFoodAdded}
        preSelectedFood={null}
      />
    </div>
  );
};

export default SimpleFoodTracker; 
