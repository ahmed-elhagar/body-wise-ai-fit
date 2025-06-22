import React, { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFoodConsumption } from '../hooks';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useI18n } from '@/shared/hooks/useI18n';
import { useNavigate } from 'react-router-dom';
import { brandColors, gradients, shadows, components } from '@/shared/config/design.config';
import { 
  Activity,
  Flame,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Scale,
  Clock,
  Calendar,
  Bell,
  Plus,
  ArrowRight,
  Trophy,
  Utensils,
  Dumbbell,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Camera,
  Search,
  History,
  Apple,
  Coffee,
  Cookie
} from 'lucide-react';
import GradientCard from '@/shared/components/design-system/GradientCard';
import StatsCard from '@/shared/components/design-system/StatsCard';
import { ActionButton } from '@/shared/components/design-system/ActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';
import { format, isToday, startOfDay, endOfDay } from 'date-fns';
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

interface FoodTrackerProps {
  refreshKey?: number;
  onAddFood?: () => void;
}

const FoodTracker: React.FC<FoodTrackerProps> = ({ refreshKey, onAddFood }) => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: userLoading } = useAuth();
  const { todayConsumption, todayMealPlan, isLoading: consumptionLoading, forceRefresh } = useFoodConsumption();
  const { notifications } = useNotifications();
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();
  
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [preSelectedFood, setPreSelectedFood] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('today');
  const [waterIntake, setWaterIntake] = useState(0); // Local state for water tracking
  
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

  // Calculate daily goals based on profile (using defaults until goal fields are added)
  const dailyGoals: DailyGoals = {
    calories: 2000, // TODO: Add daily_calorie_goal to profile
    protein: 150,   // TODO: Add daily_protein_goal to profile
    carbs: 250,     // TODO: Add daily_carb_goal to profile
    fat: 65,        // TODO: Add daily_fat_goal to profile
    water: 2000,    // TODO: Add daily_water_goal to profile (ml)
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

  // Meal distribution analysis
  const mealDistribution = (todayConsumption || []).reduce((acc, item) => {
    const mealType = item.meal_type || 'snack';
    acc[mealType] = (acc[mealType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMeals = Object.values(mealDistribution).reduce((sum, count) => sum + count, 0);

  // Achievement badges logic
  const achievements = [];
  if (progress.calories >= 80) achievements.push({ icon: '🎯', text: 'Great Progress!', color: 'green' });
  if (progress.protein >= 100) achievements.push({ icon: '💪', text: 'Protein Goal!', color: 'blue' });
  if (progress.water >= 100) achievements.push({ icon: '💧', text: 'Hydrated!', color: 'cyan' });
  if (totalMeals >= 3) achievements.push({ icon: '🍽️', text: 'Regular Meals!', color: 'purple' });
  if (consumedTotals.calories > 0 && totalMeals > 0 && (consumedTotals.calories / totalMeals) <= 600) {
    achievements.push({ icon: '⚖️', text: 'Balanced Portions!', color: 'orange' });
  }

  // Nutrition insights
  const insights = [];
  if (progress.protein < 50 && progress.calories > 50) {
    insights.push({ type: 'warning', message: 'Consider adding more protein-rich foods' });
  }
  if (progress.water < 50) {
    insights.push({ type: 'info', message: 'Stay hydrated! Drink more water today' });
  }
  if (remaining.calories < 300 && remaining.calories > 0) {
    insights.push({ type: 'success', message: 'Almost at your calorie goal!' });
  }

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
    setPreSelectedFood(null);
    await forceRefresh();
    toast.success('Food added successfully!');
  };

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 flex items-center justify-center">
        <SimpleLoadingIndicator />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: gradients.background }}
    >
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <div 
            className="relative overflow-hidden rounded-3xl"
            style={{ 
              background: gradients.primary,
              boxShadow: shadows.brand
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-10 right-10 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-32 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300" />
            
            <div className="relative p-8 md:p-10">
              <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className={`flex items-center gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30"
                      style={{ boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)' }}
                    >
                      <Utensils className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                        {t('Food Tracker')}
                      </h1>
                      <p className="text-white/80 text-lg">
                        {t('Hey')} {userName}! {t('Track your nutrition and reach your goals')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      {Math.round(consumedTotals.calories)} / {dailyGoals.calories} cal
                    </div>
                    <div className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {totalMeals} meals logged
                    </div>
                  </div>
                </div>
                
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    icon={Camera}
                    onClick={() => navigate('/calorie-checker')}
                    gradient="primary"
                  >
                    {t('Scan Food')}
                  </ActionButton>
                  
                  <ActionButton
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => setIsAddFoodOpen(true)}
                    gradient="primary"
                  >
                    {t('Add Food')}
                  </ActionButton>
                </div>
              </div>
            </div>
                      </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title={t('Calories')}
              value={Math.round(consumedTotals.calories)}
              subtitle={`${remaining.calories} remaining`}
              icon={Flame}
              trend={progress.calories >= 80 ? 'up' : 'neutral'}
              color="orange"
            />
            
            <StatsCard
              title={t('Protein')}
              value={`${Math.round(consumedTotals.protein)}g`}
              subtitle={`${Math.round(progress.protein)}% of goal`}
              icon={Dumbbell}
              trend={progress.protein >= 100 ? 'up' : 'neutral'}
              color="blue"
            />
            
            <StatsCard
              title={t('Water')}
              value={`${waterIntake}ml`}
              subtitle={`${Math.round(progress.water)}% of goal`}
              icon={Heart}
              trend={progress.water >= 100 ? 'up' : 'neutral'}
              color="cyan"
            />
            
            <StatsCard
              title={t('Meals')}
              value={totalMeals}
              subtitle={totalMeals >= 3 ? 'Great job!' : 'Keep going'}
              icon={Utensils}
              trend={totalMeals >= 3 ? 'up' : 'neutral'}
              color="green"
            />
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-14 rounded-xl">
              <TabsTrigger 
                value="today" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-500 data-[state=active]:to-brand-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-medium flex items-center gap-3 rounded-lg transition-all duration-300"
              >
                <Utensils className="w-4 h-4" />
                <span>{t('Today')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="nutrition" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-medium flex items-center gap-3 rounded-lg transition-all duration-300"
              >
                <Target className="w-4 h-4" />
                <span>{t('Nutrition')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-medium flex items-center gap-3 rounded-lg transition-all duration-300"
              >
                <History className="w-4 h-4" />
                <span>{t('History')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Today Tab */}
            <TabsContent value="today" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Meals */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-brand-700 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {t("Today's Meals")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {todayConsumption && todayConsumption.length > 0 ? (
                        <div className="space-y-4">
                          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                            const meals = todayConsumption.filter(item => item.meal_type === mealType);
                            if (meals.length === 0) return null;

                            const mealIcons = {
                              breakfast: Coffee,
                              lunch: Apple,
                              dinner: Utensils,
                              snack: Cookie
                            };
                            const MealIcon = mealIcons[mealType as keyof typeof mealIcons];

                            return (
                              <div key={mealType} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <MealIcon className="w-5 h-5 text-brand-600" />
                                  <h4 className="font-semibold text-gray-900 capitalize">{mealType}</h4>
                                  <Badge variant="outline" className="ml-auto">
                                    {meals.reduce((sum, meal) => sum + (meal.calories_consumed || 0), 0)} cal
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  {meals.map((meal, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                      <span className="text-gray-700">{meal.food_name}</span>
                                      <span className="text-gray-500">{meal.quantity}g</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">{t('No meals logged today')}</p>
                          <Button onClick={() => setIsAddFoodOpen(true)} className="bg-brand-600 hover:bg-brand-700">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('Add Your First Meal')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Water Tracking */}
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-cyan-700 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        {t('Water Intake')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-600">{waterIntake}ml</div>
                        <div className="text-sm text-gray-500">of {dailyGoals.water}ml goal</div>
                        <Progress value={progress.water} className="mt-2 h-3" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[250, 500, 750].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddWater(amount)}
                            className="text-xs"
                          >
                            +{amount}ml
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  {achievements.length > 0 && (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-yellow-700 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          {t("Today's Achievements")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <span className="text-lg">{achievement.icon}</span>
                              <span className="text-sm font-medium text-gray-700">{achievement.text}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Insights */}
                  {insights.length > 0 && (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-indigo-700 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          {t('Insights')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                              {insight.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                              {insight.type === 'info' && <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />}
                              {insight.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}
                              <span className="text-sm text-gray-700">{insight.message}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Macro Breakdown */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-emerald-700 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {t('Macro Breakdown')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Calories */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{t('Calories')}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(consumedTotals.calories)} / {dailyGoals.calories}
                        </span>
                      </div>
                      <Progress value={progress.calories} className="h-3" />
                      <div className="text-xs text-gray-500 mt-1">
                        {remaining.calories} {t('remaining')}
                      </div>
                    </div>

                    {/* Protein */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{t('Protein')}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(consumedTotals.protein)}g / {dailyGoals.protein}g
                        </span>
                      </div>
                      <Progress value={progress.protein} className="h-3" />
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(remaining.protein)}g {t('remaining')}
                      </div>
                    </div>

                    {/* Carbs */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{t('Carbs')}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(consumedTotals.carbs)}g / {dailyGoals.carbs}g
                        </span>
                      </div>
                      <Progress value={progress.carbs} className="h-3" />
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(remaining.carbs)}g {t('remaining')}
                      </div>
                    </div>

                    {/* Fat */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{t('Fat')}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(consumedTotals.fat)}g / {dailyGoals.fat}g
                        </span>
                      </div>
                      <Progress value={progress.fat} className="h-3" />
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(remaining.fat)}g {t('remaining')}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Summary */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-brand-700 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      {t('Daily Summary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{Math.round(consumedTotals.calories)}</div>
                        <div className="text-sm text-orange-700">{t('Calories Consumed')}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(consumedTotals.protein)}g</div>
                        <div className="text-sm text-blue-700">{t('Protein')}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{totalMeals}</div>
                        <div className="text-sm text-green-700">{t('Meals Logged')}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-cyan-50 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-600">{waterIntake}ml</div>
                        <div className="text-sm text-cyan-700">{t('Water Intake')}</div>
                      </div>
                    </div>

                    {totalMeals > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">
                            {Math.round(consumedTotals.calories / totalMeals)} cal/meal
                          </div>
                          <div className="text-sm text-gray-500">{t('Average per meal')}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t('Food History')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">{t('Food history feature coming soon')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Add Food Dialog */}
          <AddFoodDialog
            isOpen={isAddFoodOpen}
            onClose={() => {
              setIsAddFoodOpen(false);
              setPreSelectedFood(null);
            }}
            onFoodAdded={handleFoodAdded}
            preSelectedFood={preSelectedFood}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodTracker; 
