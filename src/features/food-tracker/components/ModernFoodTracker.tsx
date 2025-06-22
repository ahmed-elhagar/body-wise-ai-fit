import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Utensils, 
  Plus, 
  Camera, 
  Target, 
  Flame, 
  Dumbbell, 
  Apple, 
  Droplets,
  Clock,
  Coffee,
  Cookie,
  Activity,
  History,
  TrendingUp,
  Award
} from 'lucide-react';

// Design System Components
import { 
  FeatureLayout, 
  GradientStatsCard, 
  StatsGrid,
  ActionButton,
  UniversalLoadingState
} from '@/shared/components/design-system';
import { useTheme } from '@/shared/hooks';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Feature Components
import { useFoodConsumption } from '../hooks';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useI18n } from '@/shared/hooks/useI18n';

// Types
interface FoodTrackerProps {
  refreshKey?: number;
  onAddFood?: () => void;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ModernFoodTracker: React.FC<FoodTrackerProps> = ({ refreshKey, onAddFood }) => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: userLoading } = useAuth();
  const { todayConsumption, todayMealPlan, isLoading: consumptionLoading, forceRefresh } = useFoodConsumption();
  const { t, isRTL } = useI18n();
  const { classes } = useTheme();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('today');
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

  // Calculate daily goals based on profile (using defaults until goal fields are added)
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

  // Meal distribution analysis
  const mealDistribution = (todayConsumption || []).reduce((acc, item) => {
    const mealType = item.meal_type || 'snack';
    acc[mealType] = (acc[mealType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMeals = Object.values(mealDistribution).reduce((sum, count) => sum + count, 0);

  const handleAddWater = (amount: number) => {
    const newWaterIntake = waterIntake + amount;
    setWaterIntake(newWaterIntake);
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`water-${today}`, newWaterIntake.toString());
    if (newWaterIntake >= dailyGoals.water) {
      toast.success('🎉 Daily water goal achieved!');
    }
  };

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  // Tab configuration
  const tabs = [
    { id: 'today', label: t('Today'), icon: Utensils },
    { id: 'nutrition', label: t('Nutrition'), icon: Target },
    { id: 'history', label: t('History'), icon: History },
  ];

  // Header actions
  const headerActions = (
    <div className="flex gap-3">
      <ActionButton
        variant="outline"
        size="sm"
        icon={Camera}
        onClick={() => navigate('/calorie-checker')}
      >
        {t('Scan Food')}
      </ActionButton>
      
      <ActionButton
        variant="primary"
        size="sm"
        icon={Plus}
        onClick={onAddFood}
      >
        {t('Add Food')}
      </ActionButton>
    </div>
  );

  if (isLoading) {
    return <UniversalLoadingState feature="food-tracker" />;
  }

  return (
    <FeatureLayout
      title={t('Food Tracker')}
      subtitle={`${t('Hey')} ${userName}! ${t('Track your nutrition and reach your goals')}`}
      icon={Utensils}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={headerActions}
      isLoading={isLoading}
    >
      {/* Stats Grid */}
      <StatsGrid>
        <GradientStatsCard
          title={t('Calories')}
          value={Math.round(consumedTotals.calories)}
          subtitle={`${remaining.calories} remaining`}
          icon={Flame}
          trend={progress.calories >= 80 ? 'up' : 'neutral'}
          variant="calories"
        />
        
        <GradientStatsCard
          title={t('Protein')}
          value={`${Math.round(consumedTotals.protein)}g`}
          subtitle={`${Math.round(progress.protein)}% of goal`}
          icon={Dumbbell}
          trend={progress.protein >= 100 ? 'up' : 'neutral'}
          variant="weight"
        />
        
        <GradientStatsCard
          title={t('Water')}
          value={`${waterIntake}ml`}
          subtitle={`${Math.round(progress.water)}% of goal`}
          icon={Droplets}
          trend={progress.water >= 100 ? 'up' : 'neutral'}
          variant="workout"
        />
        
        <GradientStatsCard
          title={t('Meals')}
          value={totalMeals}
          subtitle={totalMeals >= 3 ? 'Great job!' : 'Keep going'}
          icon={Utensils}
          trend={totalMeals >= 3 ? 'up' : 'neutral'}
          variant="goal"
        />
      </StatsGrid>

      {/* Tab Content */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Meals */}
          <div className="lg:col-span-2 space-y-4">
            <Card className={`border-0 ${classes.cardBg}`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-800 flex items-center gap-2">
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
                        <div key={mealType} className={`border border-gray-200 rounded-lg p-4 ${classes.cardBg}`}>
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
                  <div className="text-center py-12 text-gray-500">
                    <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">{t('No meals logged today')}</p>
                    <p className="text-sm mb-4">{t('Start tracking your nutrition!')}</p>
                    <ActionButton
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={onAddFood}
                    >
                      {t('Add Your First Meal')}
                    </ActionButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Water Intake & Quick Actions */}
          <div className="space-y-6">
            {/* Water Intake */}
            <Card className={`border-0 ${classes.cardBg}`}>
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  {t('Water Intake')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {waterIntake}ml
                  </div>
                  <div className="text-sm text-gray-500">
                    {remaining.water}ml remaining
                  </div>
                </div>
                <Progress value={progress.water} className="h-3 mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddWater(250)}
                  >
                    +250ml
                  </ActionButton>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddWater(500)}
                  >
                    +500ml
                  </ActionButton>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddWater(1000)}
                  >
                    +1L
                  </ActionButton>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`border-0 ${classes.cardBg}`}>
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('Quick Actions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton
                  variant="outline"
                  size="sm"
                  icon={Camera}
                  onClick={() => navigate('/calorie-checker')}
                  className="w-full justify-start"
                >
                  {t('Scan Food Photo')}
                </ActionButton>
                
                <ActionButton
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={onAddFood}
                  className="w-full justify-start"
                >
                  {t('Log Manual Entry')}
                </ActionButton>
                
                <ActionButton
                  variant="outline"
                  size="sm"
                  icon={History}
                  onClick={() => setActiveTab('history')}
                  className="w-full justify-start"
                >
                  {t('View History')}
                </ActionButton>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Macro Breakdown */}
          <Card className={`border-0 ${classes.cardBg}`}>
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
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
          <Card className={`border-0 ${classes.cardBg}`}>
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('Daily Summary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-4 rounded-lg ${classes.statsOrange}`}>
                  <div className="text-2xl font-bold text-orange-600">{Math.round(consumedTotals.calories)}</div>
                  <div className="text-sm text-orange-700">{t('Calories Consumed')}</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${classes.statsBlue}`}>
                  <div className="text-2xl font-bold text-blue-600">{Math.round(consumedTotals.protein)}g</div>
                  <div className="text-sm text-blue-700">{t('Protein')}</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${classes.statsGreen}`}>
                  <div className="text-2xl font-bold text-green-600">{totalMeals}</div>
                  <div className="text-sm text-green-700">{t('Meals Logged')}</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${classes.statsPurple}`}>
                  <div className="text-2xl font-bold text-purple-600">{waterIntake}ml</div>
                  <div className="text-sm text-purple-700">{t('Water Intake')}</div>
                </div>
              </div>

              {/* Achievements */}
              {(progress.calories >= 80 || progress.protein >= 100 || progress.water >= 100 || totalMeals >= 3) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {t('Today\'s Achievements')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {progress.calories >= 80 && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        🎯 Great Progress!
                      </Badge>
                    )}
                    {progress.protein >= 100 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        💪 Protein Goal!
                      </Badge>
                    )}
                    {progress.water >= 100 && (
                      <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                        💧 Hydrated!
                      </Badge>
                    )}
                    {totalMeals >= 3 && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        🍽️ Regular Meals!
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card className={`border-0 ${classes.cardBg}`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5" />
              {t('Food History')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">{t('Food History Coming Soon')}</p>
              <p className="text-sm">{t('Track your nutrition patterns and insights')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </FeatureLayout>
  );
};

export default ModernFoodTracker; 