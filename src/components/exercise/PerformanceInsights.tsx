
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  Calendar,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Insight {
  id: string;
  type: 'recommendation' | 'achievement' | 'warning' | 'tip';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  metadata?: {
    improvement?: number;
    timeframe?: string;
    category?: string;
  };
}

interface PerformanceInsightsProps {
  onApplyRecommendation: (insightId: string) => void;
}

export const PerformanceInsights = ({ onApplyRecommendation }: PerformanceInsightsProps) => {
  const { t } = useLanguage();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'recommendations' | 'achievements'>('all');

  useEffect(() => {
    // Mock AI-generated insights - in real app, generate via AI analysis
    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'recommendation',
        title: t('Increase Upper Body Volume'),
        description: t('Your leg workouts are progressing well, but upper body could use 20% more volume for balanced development.'),
        priority: 'high',
        actionable: true,
        metadata: {
          improvement: 20,
          timeframe: '2 weeks',
          category: 'volume'
        }
      },
      {
        id: '2',
        type: 'achievement',
        title: t('Consistency Champion'),
        description: t('You\'ve completed 7 workouts in a row! Your consistency is excellent.'),
        priority: 'medium',
        actionable: false,
        metadata: {
          timeframe: '1 week'
        }
      },
      {
        id: '3',
        type: 'warning',
        title: t('Rest Day Recommended'),
        description: t('You\'ve been training intensely for 5 days. Consider taking a rest day to prevent overtraining.'),
        priority: 'high',
        actionable: true,
        metadata: {
          category: 'recovery'
        }
      },
      {
        id: '4',
        type: 'tip',
        title: t('Progressive Overload Opportunity'),
        description: t('Your squat has been at the same weight for 3 sessions. Try increasing by 2.5kg next time.'),
        priority: 'medium',
        actionable: true,
        metadata: {
          improvement: 3.2,
          category: 'progression'
        }
      },
      {
        id: '5',
        type: 'achievement',
        title: t('New Personal Record'),
        description: t('You just set a new PR in push-ups with 25 reps! That\'s a 25% improvement.'),
        priority: 'high',
        actionable: false,
        metadata: {
          improvement: 25,
          category: 'strength'
        }
      }
    ];

    setInsights(mockInsights);
    setIsLoading(false);
  }, [t]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Brain className="w-5 h-5 text-blue-600" />;
      case 'achievement': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-purple-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return true;
    if (activeTab === 'recommendations') return insight.type === 'recommendation' || insight.type === 'tip';
    if (activeTab === 'achievements') return insight.type === 'achievement';
    return true;
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('AI Performance Insights')}</h3>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {insights.length} {t('insights')}
          </Badge>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            {t('All')} ({insights.length})
          </Button>
          <Button
            variant={activeTab === 'recommendations' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('recommendations')}
          >
            {t('Recommendations')} ({insights.filter(i => i.type === 'recommendation' || i.type === 'tip').length})
          </Button>
          <Button
            variant={activeTab === 'achievements' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('achievements')}
          >
            {t('Achievements')} ({insights.filter(i => i.type === 'achievement').length})
          </Button>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.id} 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(insight.priority)}
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                  
                  {insight.metadata && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {insight.metadata.improvement && (
                        <div className="flex items-center gap-1">
                          <ArrowUp className="w-3 h-3 text-green-600" />
                          +{insight.metadata.improvement}%
                        </div>
                      )}
                      {insight.metadata.timeframe && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {insight.metadata.timeframe}
                        </div>
                      )}
                      {insight.metadata.category && (
                        <Badge variant="secondary" className="text-xs">
                          {insight.metadata.category}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {insight.actionable && (
                    <Button
                      size="sm"
                      onClick={() => onApplyRecommendation(insight.id)}
                      className="text-xs"
                    >
                      {insight.type === 'recommendation' ? t('Apply Recommendation') : t('Take Action')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">{t('No Insights Available')}</h4>
            <p className="text-gray-600 text-sm">
              {t('Complete more workouts to receive AI-powered insights!')}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
