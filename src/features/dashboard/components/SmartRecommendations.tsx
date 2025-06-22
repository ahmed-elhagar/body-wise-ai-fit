import React from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { 
  Dumbbell,
  Utensils,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Calendar,
  ChefHat,
  Building2,
  Mountain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SmartRecommendationsProps {
  className?: string;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ className = '' }) => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Smart workout recommendations based on equipment and fitness level
  const getTopWorkoutRecommendation = () => {
    const equipment = (profile as any)?.workout_equipment || [];
    const fitnessLevel = (profile as any)?.fitness_level || 'beginner';

    // Return only the most relevant recommendation
    if (equipment.includes('full_gym')) {
      return {
        title: 'Full Body Strength Training',
        description: 'Complete gym workout targeting all muscle groups',
        duration: '60-75 min',
        difficulty: fitnessLevel === 'beginner' ? 'Beginner' : fitnessLevel === 'intermediate' ? 'Intermediate' : 'Advanced',
        icon: Building2,
        color: 'bg-brand-accent-100 text-brand-accent-700 border-brand-accent-200',
        equipment: 'Full Gym Access',
        calories: fitnessLevel === 'beginner' ? '300-400' : '400-600'
      };
    }

    if (equipment.includes('dumbbells') || equipment.includes('kettlebells')) {
      return {
        title: 'Functional Strength Circuit',
        description: 'Build real-world strength with compound movements',
        duration: '45-60 min',
        difficulty: fitnessLevel === 'beginner' ? 'Beginner' : 'Intermediate',
        icon: Dumbbell,
        color: 'bg-brand-primary-100 text-brand-primary-700 border-brand-primary-200',
        equipment: equipment.includes('kettlebells') ? 'Kettlebells' : 'Dumbbells',
        calories: '250-400'
      };
    }

    return {
      title: 'Bodyweight HIIT',
      description: 'High-intensity workout using only your body weight',
      duration: '20-30 min',
      difficulty: fitnessLevel === 'advanced' ? 'Advanced' : 'Beginner-Friendly',
      icon: Zap,
      color: 'bg-brand-secondary-100 text-brand-secondary-700 border-brand-secondary-200',
      equipment: 'No Equipment',
      calories: '200-350'
    };
  };

  // Smart meal recommendations based on cooking skills and dietary restrictions
  const getTopMealRecommendation = () => {
    const cookingSkill = (profile as any)?.cooking_skill || 'beginner';
    const maxPrepTime = (profile as any)?.max_prep_time || 30;
    const dietaryRestrictions = (profile as any)?.dietary_restrictions || [];
    const fitnessGoal = profile?.fitness_goal || 'maintenance';

    if (dietaryRestrictions.includes('vegetarian') || dietaryRestrictions.includes('vegan')) {
      return {
        title: 'Plant-Based Power Meals',
        description: 'Complete proteins from plants for optimal performance',
        prepTime: `${maxPrepTime || 30} min`,
        difficulty: cookingSkill === 'beginner' ? 'Easy' : 'Moderate',
        icon: Heart,
        color: 'bg-brand-secondary-100 text-brand-secondary-700 border-brand-secondary-200',
        macros: 'Plant Protein Focus',
        servings: '2-3 meals'
      };
    }

    if (cookingSkill === 'beginner' || maxPrepTime <= 20) {
      return {
        title: 'Quick Protein Bowls',
        description: 'Simple, nutritious meals ready in 15 minutes',
        prepTime: '10-15 min',
        difficulty: 'Super Easy',
        icon: Utensils,
        color: 'bg-brand-secondary-100 text-brand-secondary-700 border-brand-secondary-200',
        macros: fitnessGoal === 'muscle_gain' ? 'High Protein' : 'Balanced',
        servings: '1-2 meals'
      };
    }

    return {
      title: 'Meal Prep Containers',
      description: 'Batch cook healthy meals for the entire week',
      prepTime: '60-90 min',
      difficulty: 'Moderate',
      icon: ChefHat,
      color: 'bg-brand-primary-100 text-brand-primary-700 border-brand-primary-200',
      macros: 'Customizable',
      servings: '4-6 meals'
    };
  };

  const workoutRec = getTopWorkoutRecommendation();
  const mealRec = getTopMealRecommendation();

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      {/* Top Workout Recommendation */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-primary-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-brand-primary-700 text-sm">
            <div className="w-8 h-8 bg-brand-primary-100 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-brand-primary-600" />
            </div>
            Recommended Workout
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white rounded-lg p-3 border border-neutral-200">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${workoutRec.color}`}>
                <workoutRec.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-neutral-900 text-sm">{workoutRec.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {workoutRec.difficulty}
                  </Badge>
                </div>
                <p className="text-neutral-600 text-xs mb-2">{workoutRec.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workoutRec.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {workoutRec.calories} cal
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/exercise')}
            size="sm"
            className="w-full mt-3 bg-brand-primary-600 hover:bg-brand-primary-700 text-white text-xs font-medium shadow-sm border-0 transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Start Workout
          </Button>
        </CardContent>
      </Card>

      {/* Top Meal Recommendation */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-secondary-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-brand-secondary-700 text-sm">
            <div className="w-8 h-8 bg-brand-secondary-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-brand-secondary-600" />
            </div>
            Recommended Meal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white rounded-lg p-3 border border-neutral-200">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mealRec.color}`}>
                <mealRec.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-neutral-900 text-sm">{mealRec.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {mealRec.difficulty}
                  </Badge>
                </div>
                <p className="text-neutral-600 text-xs mb-2">{mealRec.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {mealRec.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {mealRec.macros}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/meal-plan')}
            size="sm"
            className="w-full mt-3 bg-brand-secondary-600 hover:bg-brand-secondary-700 text-white text-xs font-medium shadow-sm border-0 transition-all duration-200 hover:shadow-md active:scale-95"
          >
            View Meal Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 