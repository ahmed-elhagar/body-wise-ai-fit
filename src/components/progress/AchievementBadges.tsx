
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Star, Target, Flame, Award, Calendar, Zap } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useGoals } from "@/hooks/useGoals";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { useMemo } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  target?: number;
  category: 'fitness' | 'nutrition' | 'consistency' | 'goals';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const AchievementBadges = () => {
  const { t } = useLanguage();
  const { weightEntries } = useWeightTracking();
  const { goals } = useGoals();
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");

  // Calculate real achievements based on user data
  const achievements = useMemo(() => {
    const baseAchievements: Achievement[] = [];

    // Weight tracking achievements
    const weightEntryCount = weightEntries.length;
    baseAchievements.push({
      id: 'first_weigh_in',
      title: t('First Steps'),
      description: t('Record your first weight entry'),
      icon: Star,
      earned: weightEntryCount >= 1,
      earnedDate: weightEntryCount >= 1 ? weightEntries[weightEntryCount - 1]?.recorded_at : undefined,
      category: 'fitness',
      rarity: 'common'
    });

    baseAchievements.push({
      id: 'consistent_tracker',
      title: t('Consistent Tracker'),
      description: t('Record weight 7 times'),
      icon: Calendar,
      earned: weightEntryCount >= 7,
      progress: weightEntryCount,
      target: 7,
      earnedDate: weightEntryCount >= 7 ? weightEntries[Math.max(0, weightEntryCount - 7)]?.recorded_at : undefined,
      category: 'consistency',
      rarity: 'rare'
    });

    baseAchievements.push({
      id: 'data_master',
      title: t('Data Master'),
      description: t('Record weight 30 times'),
      icon: Trophy,
      earned: weightEntryCount >= 30,
      progress: weightEntryCount,
      target: 30,
      category: 'consistency',
      rarity: 'epic'
    });

    // Goal achievements
    const activeGoals = goals.filter(goal => goal.status === 'active');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    
    baseAchievements.push({
      id: 'goal_setter',
      title: t('Goal Setter'),
      description: t('Create your first goal'),
      icon: Target,
      earned: goals.length >= 1,
      earnedDate: goals.length >= 1 ? goals[goals.length - 1]?.created_at : undefined,
      category: 'goals',
      rarity: 'common'
    });

    baseAchievements.push({
      id: 'goal_achiever',
      title: t('Goal Achiever'),
      description: t('Complete your first goal'),
      icon: Award,
      earned: completedGoals.length >= 1,
      earnedDate: completedGoals.length >= 1 ? completedGoals[0]?.updated_at : undefined,
      category: 'goals',
      rarity: 'rare'
    });

    baseAchievements.push({
      id: 'ambitious',
      title: t('Ambitious'),
      description: t('Have 5 active goals'),
      icon: Flame,
      earned: activeGoals.length >= 5,
      progress: activeGoals.length,
      target: 5,
      category: 'goals',
      rarity: 'epic'
    });

    // Exercise achievements
    if (currentExerciseProgram?.daily_workouts) {
      const totalExercises = currentExerciseProgram.daily_workouts.reduce(
        (sum, workout) => sum + (workout.exercises?.length || 0), 0
      );
      const completedExercises = currentExerciseProgram.daily_workouts.reduce(
        (sum, workout) => sum + (workout.exercises?.filter(ex => ex.completed).length || 0), 0
      );

      baseAchievements.push({
        id: 'first_workout',
        title: t('First Workout'),
        description: t('Complete your first exercise'),
        icon: Zap,
        earned: completedExercises >= 1,
        category: 'fitness',
        rarity: 'common'
      });

      baseAchievements.push({
        id: 'workout_warrior',
        title: t('Workout Warrior'),
        description: t('Complete 50 exercises'),
        icon: Trophy,
        earned: completedExercises >= 50,
        progress: completedExercises,
        target: 50,
        category: 'fitness',
        rarity: 'epic'
      });

      const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
      baseAchievements.push({
        id: 'perfectionist',
        title: t('Perfectionist'),
        description: t('Complete 100% of weekly exercises'),
        icon: Star,
        earned: completionRate >= 100 && totalExercises > 0,
        progress: Math.round(completionRate),
        target: 100,
        category: 'consistency',
        rarity: 'legendary'
      });
    }

    // Nutrition achievements
    if (currentMealPlan?.dailyMeals) {
      baseAchievements.push({
        id: 'meal_planner',
        title: t('Meal Planner'),
        description: t('Generate your first meal plan'),
        icon: Star,
        earned: true,
        category: 'nutrition',
        rarity: 'common'
      });

      const weeklyProtein = currentMealPlan.dailyMeals.reduce(
        (sum, meal) => sum + (meal.protein || 0), 0
      );

      baseAchievements.push({
        id: 'protein_champion',
        title: t('Protein Champion'),
        description: t('Plan 350g+ protein per week'),
        icon: Award,
        earned: weeklyProtein >= 350,
        progress: Math.round(weeklyProtein),
        target: 350,
        category: 'nutrition',
        rarity: 'rare'
      });
    }

    // Weight progress achievements
    if (weightEntries.length >= 2) {
      const weightChange = weightEntries[0].weight - weightEntries[weightEntries.length - 1].weight;
      
      if (weightChange <= -2) {
        baseAchievements.push({
          id: 'weight_loss_milestone',
          title: t('Weight Loss Milestone'),
          description: t('Lose 2kg or more'),
          icon: TrendingDown,
          earned: true,
          earnedDate: weightEntries[0].recorded_at,
          category: 'fitness',
          rarity: 'rare'
        });
      }

      if (weightChange <= -5) {
        baseAchievements.push({
          id: 'transformation',
          title: t('Transformation'),
          description: t('Lose 5kg or more'),
          icon: Trophy,
          earned: true,
          earnedDate: weightEntries[0].recorded_at,
          category: 'fitness',
          rarity: 'epic'
        });
      }
    }

    return baseAchievements.sort((a, b) => {
      // Sort by earned status first, then by rarity
      if (a.earned !== b.earned) return a.earned ? -1 : 1;
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });
  }, [weightEntries, goals, currentMealPlan, currentExerciseProgram, t]);

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'common': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return '💪';
      case 'nutrition': return '🍎';
      case 'consistency': return '📅';
      case 'goals': return '🎯';
      default: return '⭐';
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unlockedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-800">{earnedAchievements.length}</div>
            <div className="text-sm text-orange-600">{t('Earned')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-800">{unlockedAchievements.length}</div>
            <div className="text-sm text-blue-600">{t('Available')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-800">
              {Math.round((earnedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-purple-600">{t('Completion')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-800">
              {earnedAchievements.filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-green-600">{t('Rare Badges')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              {t('Earned Achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedAchievements.map(achievement => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${getRarityStyle(achievement.rarity)}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {getCategoryIcon(achievement.category)} {achievement.title}
                          </h4>
                          <Badge className={getRarityStyle(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.earnedDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('Earned:')} {new Date(achievement.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              {t('Available Achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map(achievement => {
                const IconComponent = achievement.icon;
                const progressPercentage = achievement.progress && achievement.target 
                  ? Math.min((achievement.progress / achievement.target) * 100, 100) 
                  : 0;

                return (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-gray-300 text-gray-600">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-600 truncate">
                            {getCategoryIcon(achievement.category)} {achievement.title}
                          </h4>
                          <Badge variant="outline" className="text-gray-500">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.target && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{achievement.progress} / {achievement.target}</span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementBadges;
