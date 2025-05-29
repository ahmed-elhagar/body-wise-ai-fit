
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Calendar, TrendingUp, Heart, Scale } from "lucide-react";
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
    if (bmi < 18.5) return { text: t('bmi.underweight'), color: 'text-blue-600' };
    if (bmi < 25) return { text: t('bmi.normal'), color: 'text-green-600' };
    if (bmi < 30) return { text: t('bmi.overweight'), color: 'text-yellow-600' };
    return { text: t('bmi.obese'), color: 'text-red-600' };
  };

  const getGoalBadgeColor = (goal?: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-red-500';
      case 'weight_gain': return 'bg-green-500';
      case 'muscle_gain': return 'bg-blue-500';
      case 'endurance': return 'bg-purple-500';
      default: return 'bg-gray-500';
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
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.bmiIndex'),
      value: bmi || '—',
      subtitle: bmiCategory?.text || t('dashboard.completeProfile'),
      subtitleColor: bmiCategory?.color || 'text-gray-500',
      icon: Heart,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('dashboard.fitnessGoal'),
      value: getFitnessGoalText(profile?.fitness_goal),
      badge: true,
      badgeColor: getGoalBadgeColor(profile?.fitness_goal),
      icon: Target,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: t('dashboard.activityLevel'),
      value: activityInfo.text,
      level: activityInfo.level,
      icon: Activity,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${stat.bgColor}`}>
          <div className="p-4">
            <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                
                {stat.badge ? (
                  <Badge className={`${stat.badgeColor} text-white font-medium px-2 py-1 text-xs shadow-sm border-0`}>
                    {stat.value}
                  </Badge>
                ) : (
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">
                    {stat.value}
                  </p>
                )}
                
                {stat.change && (
                  <Badge variant="outline" className={`mt-1 text-xs ${stat.changeType === 'increase' ? 'text-red-600 border-red-200 bg-red-50' : 'text-green-600 border-green-200 bg-green-50'}`}>
                    {stat.change}
                  </Badge>
                )}
                
                {stat.subtitle && (
                  <p className={`text-xs font-medium mt-1 ${stat.subtitleColor}`}>
                    {stat.subtitle}
                  </p>
                )}
                
                {stat.level !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          level <= stat.level! 
                            ? 'bg-purple-500' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center ${isRTL ? 'mr-2' : 'ml-2'}`}>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
