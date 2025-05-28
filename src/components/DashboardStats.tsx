
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Calendar, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const DashboardStats = () => {
  const { profile } = useProfile();
  const { weightEntries, isLoading: weightLoading } = useWeightTracking();

  console.log('Dashboard - Profile data:', profile);
  console.log('Dashboard - Weight entries:', weightEntries);

  // Get the most recent weight entry for the current user
  const currentWeight = weightEntries && weightEntries.length > 0 ? weightEntries[0]?.weight : null;
  const previousWeight = weightEntries && weightEntries.length > 1 ? weightEntries[1]?.weight : null;
  const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : null;

  const getGoalBadgeColor = (goal?: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-red-500';
      case 'weight_gain': return 'bg-green-500';
      case 'muscle_gain': return 'bg-blue-500';
      case 'endurance': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateBMI = () => {
    // Use current weight from weight tracking if available, otherwise use profile weight
    const weight = currentWeight || profile?.weight;
    if (!profile?.height || !weight) return null;
    return (weight / Math.pow(profile.height / 100, 2)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="text-2xl font-bold text-gray-800">
              {weightLoading ? (
                "Loading..."
              ) : currentWeight ? (
                `${currentWeight} kg`
              ) : profile?.weight ? (
                `${profile.weight} kg`
              ) : (
                '—'
              )}
            </p>
            {weightChange && (
              <p className={`text-sm ${weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">BMI</p>
            <p className="text-2xl font-bold text-gray-800">
              {(() => {
                const bmi = calculateBMI();
                return bmi || '—';
              })()}
            </p>
            <p className="text-sm text-gray-500">
              {(() => {
                const bmi = calculateBMI();
                return bmi ? getBMICategory(parseFloat(bmi)) : 'Complete profile';
              })()}
            </p>
          </div>
          <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Fitness Goal</p>
            <div className="mt-2">
              {profile?.fitness_goal ? (
                <Badge className={`${getGoalBadgeColor(profile.fitness_goal)} text-white`}>
                  {profile.fitness_goal.replace('_', ' ').toUpperCase()}
                </Badge>
              ) : (
                <p className="text-sm text-gray-500">Set your goal</p>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Activity Level</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {profile?.activity_level 
                ? profile.activity_level.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')
                : 'Not set'
              }
            </p>
          </div>
          <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
