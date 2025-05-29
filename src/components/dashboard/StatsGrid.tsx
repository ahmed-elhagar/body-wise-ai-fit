
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Calendar, TrendingUp, Zap, Award, Users, Heart, Scale, Flame } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsGrid = () => {
  const { profile } = useProfile();
  const { weightEntries, isLoading: weightLoading } = useWeightTracking();
  const { t, isRTL } = useLanguage();

  const profileWeight = profile?.weight;
  const latestTrackedWeight = weightEntries && weightEntries.length > 0 ? weightEntries[0]?.weight : null;
  const previousTrackedWeight = weightEntries && weightEntries.length > 1 ? weightEntries[1]?.weight : null;
  
  const displayWeight = profileWeight || latestTrackedWeight;
  const weightChange = latestTrackedWeight && previousTrackedWeight ? latestTrackedWeight - previousTrackedWeight : null;
  
  const heightInMeters = profile?.height ? profile.height / 100 : null;

  const calculateBMI = () => {
    if (!heightInMeters || !displayWeight) return null;
    return (displayWeight / Math.pow(heightInMeters, 2)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: t('bmi.underweight'), color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { text: t('bmi.normal'), color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { text: t('bmi.overweight'), color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: t('bmi.obese'), color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getGoalBadgeColor = (goal?: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'weight_gain': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'muscle_gain': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'endurance': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getFitnessGoalText = (goal?: string) => {
    switch (goal) {
      case 'weight_loss': return t('goal.weightLoss');
      case 'weight_gain': return t('goal.weightGain');
      case 'muscle_gain': return t('goal.muscleGain');
      case 'endurance': return t('goal.endurance');
      default: return t('dashboard.setYourGoal');
    }
  };

  const getActivityLevelText = (level?: string) => {
    const levels = {
      'sedentary': { text: t('activity.sedentary'), level: 1 },
      'lightly_active': { text: t('activity.lightlyActive'), level: 2 },
      'moderately_active': { text: t('activity.moderatelyActive'), level: 3 },
      'very_active': { text: t('activity.veryActive'), level: 4 },
      'extremely_active': { text: t('activity.extremelyActive'), level: 5 }
    };
    return levels[level as keyof typeof levels] || { text: t('dashboard.notSet'), level: 0 };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;
  const activityInfo = getActivityLevelText(profile?.activity_level);

  const stats = [
    {
      title: t('dashboard.currentWeight'),
      value: weightLoading ? "..." : displayWeight ? `${displayWeight} kg` : '—',
      change: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : null,
      changeType: weightChange ? (weightChange > 0 ? 'increase' : 'decrease') : null,
      icon: Scale,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50'
    },
    {
      title: t('dashboard.bmiIndex'),
      value: bmi || '—',
      subtitle: bmiCategory?.text || t('dashboard.completeProfile'),
      subtitleColor: bmiCategory?.color || 'text-gray-500',
      icon: Heart,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: t('dashboard.fitnessGoal'),
      value: getFitnessGoalText(profile?.fitness_goal),
      badge: true,
      badgeColor: getGoalBadgeColor(profile?.fitness_goal),
      icon: Target,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      title: t('dashboard.activityLevel'),
      value: activityInfo.text,
      level: activityInfo.level,
      icon: Activity,
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${stat.bgGradient}`}>
          <div className="p-4 sm:p-6">
            <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                
                {stat.badge ? (
                  <Badge className={`${stat.badgeColor} text-white font-semibold px-3 py-1 text-xs sm:text-sm shadow-lg border-0`}>
                    {stat.value}
                  </Badge>
                ) : (
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                )}
                
                {stat.change && (
                  <Badge variant="outline" className={`mt-2 text-xs ${stat.changeType === 'increase' ? 'text-red-500 border-red-200 bg-red-50' : 'text-green-500 border-green-200 bg-green-50'}`}>
                    {stat.change}
                  </Badge>
                )}
                
                {stat.subtitle && (
                  <p className={`text-sm font-medium mt-2 ${stat.subtitleColor}`}>
                    {stat.subtitle}
                  </p>
                )}
                
                {stat.level !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          level <= stat.level! 
                            ? 'bg-purple-500 shadow-sm' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg ${isRTL ? 'mr-3' : 'ml-3'}`}>
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
