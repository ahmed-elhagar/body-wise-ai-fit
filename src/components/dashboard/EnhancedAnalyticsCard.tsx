
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { TrendingUp, ArrowRight, Calendar, Target, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EnhancedAnalyticsCardProps {
  className?: string;
}

const EnhancedAnalyticsCard = ({ className = "" }: EnhancedAnalyticsCardProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const quickStats = [
    {
      label: t('This Week'),
      value: '+2.1%',
      trend: 'up',
      description: t('Overall progress')
    },
    {
      label: t('Goal Achievement'),
      value: '85%',
      trend: 'up',
      description: t('Daily targets met')
    },
    {
      label: t('Streak Days'),
      value: '12',
      trend: 'stable',
      description: t('Current active streak')
    }
  ];

  const recentInsights = [
    {
      type: 'positive',
      message: t('Excellent workout consistency this week! 🏆')
    },
    {
      type: 'tip',
      message: t('Consider adding more protein to your breakfast 💪')
    },
    {
      type: 'achievement',
      message: t('You\'ve completed 75% of your weekly goals! 🎯')
    }
  ];

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 text-green-700 border-green-200';
      case 'tip': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'achievement': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {t('Progress Analytics')}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/progress/analytics')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            {t('View All')}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Recent AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-semibold text-gray-800">{t('AI Insights')}</h4>
          </div>
          <div className="space-y-2">
            {recentInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border text-sm ${getInsightStyle(insight.type)}`}
              >
                {insight.message}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/progress/achievements')}
            className="flex-1 text-xs"
          >
            <Target className="w-3 h-3 mr-1" />
            {t('Achievements')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/progress/trends')}
            className="flex-1 text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {t('Trends')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalyticsCard;
