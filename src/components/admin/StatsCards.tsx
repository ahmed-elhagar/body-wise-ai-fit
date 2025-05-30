
import { Card } from '@/components/ui/card';
import { Users, Activity, Shield, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StatsCards = () => {
  // Mock data - in a real app, this would come from props or a hook
  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: 1247,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: 892,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Shield,
      label: 'Active Sessions',
      value: 156,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: TrendingUp,
      label: 'Total AI Generations',
      value: 5643,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
              +12%
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
