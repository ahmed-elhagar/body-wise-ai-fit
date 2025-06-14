
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

interface WeightStatsCardsProps {
  weightEntries: WeightEntry[];
}

const WeightStatsCards = ({ weightEntries }: WeightStatsCardsProps) => {
  const calculateStats = () => {
    if (weightEntries.length === 0) {
      return {
        totalChange: 0,
        averageWeeklyChange: 0,
        daysTracked: 0,
        trend: 'stable' as const
      };
    }

    const latest = weightEntries[0];
    const oldest = weightEntries[weightEntries.length - 1];
    const totalChange = latest.weight - oldest.weight;
    
    // Calculate weekly average
    const daysDiff = Math.max(1, Math.abs(new Date(latest.recorded_at).getTime() - new Date(oldest.recorded_at).getTime()) / (1000 * 60 * 60 * 24));
    const averageWeeklyChange = (totalChange / daysDiff) * 7;
    
    const trend = totalChange > 0.5 ? 'gaining' : totalChange < -0.5 ? 'losing' : 'stable';
    
    return {
      totalChange,
      averageWeeklyChange,
      daysTracked: Math.floor(daysDiff),
      trend
    };
  };

  const stats = calculateStats();

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'gaining':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'losing':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Target className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTrendColor = () => {
    switch (stats.trend) {
      case 'gaining':
        return 'text-orange-600';
      case 'losing':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Change</p>
            <p className={`text-xl font-bold ${getTrendColor()}`}>
              {stats.totalChange > 0 ? '+' : ''}{stats.totalChange.toFixed(1)} kg
            </p>
          </div>
          {getTrendIcon()}
        </div>
      </Card>

      <Card className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Weekly Average</p>
            <p className={`text-xl font-bold ${getTrendColor()}`}>
              {stats.averageWeeklyChange > 0 ? '+' : ''}{stats.averageWeeklyChange.toFixed(1)} kg
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Days Tracked</p>
            <p className="text-xl font-bold text-gray-800">{stats.daysTracked}</p>
          </div>
          <Calendar className="w-5 h-5 text-gray-600" />
        </div>
      </Card>
    </div>
  );
};

export default WeightStatsCards;
