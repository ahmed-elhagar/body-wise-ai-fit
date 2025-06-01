
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  Shield, 
  TrendingUp, 
  Crown, 
  UserCheck,
  Calendar
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';

const EnhancedStatsCards = () => {
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
        <p className="text-red-600">Error loading admin statistics</p>
      </Card>
    );
  }

  const statsData = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.recentSignups || 0,
      changeLabel: 'New this week',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Shield,
      label: 'Active Sessions',
      value: stats?.activeSessions || 0,
      change: null,
      changeLabel: 'Last 24h',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Activity,
      label: 'Pro Subscriptions',
      value: stats?.activeSubscriptions || 0,
      change: null,
      changeLabel: 'Active now',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: TrendingUp,
      label: 'AI Generations',
      value: stats?.totalGenerations || 0,
      change: null,
      changeLabel: 'Total used',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const roleStatsData = [
    {
      icon: Crown,
      label: 'Admins',
      value: stats?.adminCount || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: UserCheck,
      label: 'Coaches',
      value: stats?.coachCount || 0,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Calendar,
      label: 'New Users',
      value: stats?.recentSignups || 0,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card 
            key={stat.label} 
            className={`p-4 md:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor}/20`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.change !== null && (
                    <p className="text-xs text-gray-500">
                      +{stat.change} {stat.changeLabel}
                    </p>
                  )}
                  {stat.change === null && (
                    <p className="text-xs text-gray-500">{stat.changeLabel}</p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={`${stat.bgColor} ${stat.color} border-current`}>
                Live
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleStatsData.map((stat) => (
          <Card 
            key={stat.label} 
            className={`p-4 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 ${stat.bgColor}/20`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedStatsCards;
