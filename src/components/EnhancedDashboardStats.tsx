
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}

interface EnhancedDashboardStatsProps {
  stats: Stat[];
}

const EnhancedDashboardStats = ({ stats }: EnhancedDashboardStatsProps) => {
  const { t, isRTL } = useI18n();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {getTrendIcon(stat.trend)}
              </div>
              <p className={`text-xs text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {stat.change}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedDashboardStats;
