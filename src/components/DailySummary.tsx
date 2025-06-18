import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Flame, Clock, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/features/profile";

interface DailySummaryProps {
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
}

const DailySummary = ({ totalCalories, totalProtein, onShowShoppingList }: DailySummaryProps) => {
  const { t, isRTL } = useLanguage();
  const { profile } = useProfile();
  
  // Calculate target values from user profile or use intelligent defaults
  const calculateTargetCalories = () => {
    if (profile?.weight && profile?.height && profile?.age) {
      // Basic BMR calculation using Mifflin-St Jeor Equation
      const weight = Number(profile.weight);
      const height = Number(profile.height);
      const age = Number(profile.age);
      
      let bmr = 0;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      // Activity level multiplier
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.375;
      
      // Adjust for fitness goal
      let calorieAdjustment = 1;
      if (profile.fitness_goal === 'lose_weight') {
        calorieAdjustment = 0.85; // 15% deficit
      } else if (profile.fitness_goal === 'gain_weight') {
        calorieAdjustment = 1.15; // 15% surplus
      }
      
      return Math.round(bmr * multiplier * calorieAdjustment);
    }
    
    // Default based on average adult needs
    return 2000;
  };

  const calculateTargetProtein = () => {
    if (profile?.weight) {
      const weight = Number(profile.weight);
      
      // Protein needs based on fitness goal and activity level
      let proteinPerKg = 1.2; // baseline for sedentary adults
      
      if (profile.activity_level === 'very_active' || profile.activity_level === 'extremely_active') {
        proteinPerKg = 1.6; // active individuals
      } else if (profile.activity_level === 'moderately_active') {
        proteinPerKg = 1.4;
      }
      
      // Adjust for fitness goals
      if (profile.fitness_goal === 'gain_weight') {
        proteinPerKg = Math.max(proteinPerKg, 1.8); // muscle building
      } else if (profile.fitness_goal === 'lose_weight') {
        proteinPerKg = Math.max(proteinPerKg, 1.4); // preserve muscle during weight loss
      }
      
      return Math.round(weight * proteinPerKg);
    }
    
    // Default based on average adult needs
    return 150;
  };
  
  const targetCalories = calculateTargetCalories();
  const targetProtein = calculateTargetProtein();
  
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / targetProtein) * 100, 100);

  // Calculate meals count for averages
  const mealsCount = Math.max(1, 4); // Assuming 4 meals per day (breakfast, lunch, dinner, snack)

  return (
    <div className="space-y-3">
      {/* Main Summary Card */}
      <Card className="p-4 bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-lg">
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">{t('mealPlan.todaysSummary')}</h3>
        </div>
        
        <div className="space-y-4">
          {/* Calories */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">{t('mealPlan.calories')}</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalCalories} / {targetCalories}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-2" />
            <div className="text-center">
              <span className="text-xl font-bold text-red-600">{totalCalories}</span>
              <span className="text-xs text-gray-500 ml-1">{t('mealPlan.calToday')}</span>
            </div>
          </div>

          {/* Protein */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{t('mealPlan.protein')}</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalProtein}g / {targetProtein}g
              </span>
            </div>
            <Progress value={proteinProgress} className="h-2" />
            <div className="text-center">
              <span className="text-xl font-bold text-green-600">{totalProtein}g</span>
              <span className="text-xs text-gray-500 ml-1">{t('mealPlan.proteinToday')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-blue-800">{Math.round(totalCalories / mealsCount)}</div>
              <div className="text-xs text-blue-600">{t('mealPlan.avgPerMeal')}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-sm font-bold text-purple-800">{Math.round(totalProtein / mealsCount)}g</div>
              <div className="text-xs text-purple-600">{t('mealPlan.proteinPerMeal')}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailySummary;
