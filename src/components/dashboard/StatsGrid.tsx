import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Flame, Activity } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface StatsGridProps {
  stats: {
    caloriesConsumed: number;
    targetCalories: number;
    workoutsCompleted: number;
    weeklyGoal: number;
    proteinIntake: number;
    targetProtein: number;
    waterIntake: number;
    targetWater: number;
  };
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const { t, isRTL } = useI18n();

  const statsData = [
    {
      title: t('dashboard.caloriesConsumed'),
      value: stats?.caloriesConsumed || 0,
      target: stats?.targetCalories || 2000,
      icon: Flame,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: t('dashboard.workoutsCompleted'),
      value: stats?.workoutsCompleted || 0,
      target: stats?.weeklyGoal || 4,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: t('dashboard.proteinIntake'),
      value: stats?.proteinIntake || 0,
      target: stats?.targetProtein || 150,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: t('dashboard.waterIntake'),
      value: stats?.waterIntake || 0,
      target: stats?.targetWater || 8,
      icon: Target,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.title} className={`p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor}/30`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Target: {stat.target.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
