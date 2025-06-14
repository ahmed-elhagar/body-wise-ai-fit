
import { Card } from '@/components/ui/card';
import { Users, Activity, Shield, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdminStats } from '@/hooks/useAdminStats';

const StatsCards = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-600">Error loading statistics: {error.message}</p>
      </Card>
    );
  }

  const statsData = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Activity,
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Shield,
      label: 'Active Sessions',
      value: stats?.activeSessions || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: TrendingUp,
      label: 'Total AI Generations',
      value: stats?.totalGenerations || 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.label} className={`p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor}/30`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
              </div>
            </div>
            <Badge variant="outline" className={`${stat.bgColor} ${stat.color} border-current`}>
              Live
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
