
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Calendar, TrendingUp, Zap, Award, Users, Heart } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const EnhancedDashboardStats = () => {
  const { profile } = useProfile();
  const { weightEntries, isLoading: weightLoading } = useWeightTracking();

  console.log('Dashboard - Profile data:', profile);
  console.log('Dashboard - Weight entries:', weightEntries);

  // Use profile weight as primary source
  const profileWeight = profile?.weight;
  const latestTrackedWeight = weightEntries && weightEntries.length > 0 ? weightEntries[0]?.weight : null;
  const previousTrackedWeight = weightEntries && weightEntries.length > 1 ? weightEntries[1]?.weight : null;
  
  const displayWeight = profileWeight || latestTrackedWeight;
  const weightSource = profileWeight ? 'profile' : 'tracking';
  
  // Calculate weight change only if we have tracking data
  const weightChange = latestTrackedWeight && previousTrackedWeight ? latestTrackedWeight - previousTrackedWeight : null;
  
  const heightInMeters = profile?.height ? profile.height / 100 : null;

  const getGoalBadgeColor = (goal?: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'weight_gain': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'muscle_gain': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'endurance': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const calculateBMI = () => {
    if (!heightInMeters || !displayWeight) return null;
    return (displayWeight / Math.pow(heightInMeters, 2)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const getActivityLevelIcon = (level?: string) => {
    switch (level) {
      case 'sedentary': return <Users className="w-6 h-6" />;
      case 'lightly_active': return <Calendar className="w-6 h-6" />;
      case 'moderately_active': return <Activity className="w-6 h-6" />;
      case 'very_active': return <Zap className="w-6 h-6" />;
      case 'extremely_active': return <Award className="w-6 h-6" />;
      default: return <Calendar className="w-6 h-6" />;
    }
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Weight Card - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-600">Current Weight</p>
              {weightChange && (
                <Badge variant="outline" className={`text-xs ${weightChange > 0 ? 'text-red-500 border-red-200' : 'text-green-500 border-green-200'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Badge>
              )}
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {weightLoading ? (
                "Loading..."
              ) : displayWeight ? (
                `${displayWeight} kg`
              ) : (
                '—'
              )}
            </p>
            {displayWeight && (
              <p className="text-xs text-gray-500 mt-1">
                {weightSource === 'profile' ? '📊 From profile' : '📈 From tracking'}
              </p>
            )}
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>
      </Card>

      {/* BMI Card - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">BMI Index</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {bmi || '—'}
            </p>
            <p className={`text-sm font-medium mt-1 ${bmiCategory?.color || 'text-gray-500'}`}>
              {bmiCategory?.text || 'Complete profile'}
            </p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white" />
          </div>
        </div>
      </Card>

      {/* Fitness Goal Card - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-white to-orange-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">Fitness Goal</p>
            <div className="mt-2">
              {profile?.fitness_goal ? (
                <Badge className={`${getGoalBadgeColor(profile.fitness_goal)} text-white font-semibold px-3 py-1 text-sm shadow-lg`}>
                  {profile.fitness_goal.replace('_', ' ').toUpperCase()}
                </Badge>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">Set your goal</p>
              )}
            </div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Target className="w-7 h-7 text-white" />
          </div>
        </div>
      </Card>

      {/* Activity Level Card - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Activity Level</p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              {profile?.activity_level 
                ? profile.activity_level.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')
                : 'Not set'
              }
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full mr-1 ${
                      level <= (profile?.activity_level === 'sedentary' ? 1 :
                              profile?.activity_level === 'lightly_active' ? 2 :
                              profile?.activity_level === 'moderately_active' ? 3 :
                              profile?.activity_level === 'very_active' ? 4 :
                              profile?.activity_level === 'extremely_active' ? 5 : 0)
                        ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            {getActivityLevelIcon(profile?.activity_level)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedDashboardStats;
