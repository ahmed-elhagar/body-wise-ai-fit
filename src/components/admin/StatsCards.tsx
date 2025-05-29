
import { Card } from '@/components/ui/card';
import { Users, Activity, Shield, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  totalActiveSessions: number;
  totalGenerations: number;
}

const StatsCards = ({ totalUsers, activeUsers, totalActiveSessions, totalGenerations }: StatsCardsProps) => {
  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: totalUsers,
      color: 'text-blue-500'
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: activeUsers,
      color: 'text-green-500'
    },
    {
      icon: Shield,
      label: 'Active Sessions',
      value: totalActiveSessions,
      color: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      label: 'Total AI Generations',
      value: totalGenerations,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center">
            <stat.icon className={`w-8 h-8 ${stat.color} mr-3`} />
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
