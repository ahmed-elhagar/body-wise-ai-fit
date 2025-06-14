
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PerformanceInsightsProps {
  onApplyRecommendation: (insightId: string) => void;
}

export const PerformanceInsights = ({ onApplyRecommendation }: PerformanceInsightsProps) => {
  const { t } = useLanguage();

  const mockInsights = [
    {
      id: '1',
      type: 'improvement',
      title: 'Increase Progressive Overload',
      description: 'Your bench press has plateaued. Consider increasing weight by 2.5kg.',
      priority: 'high',
      category: 'Strength'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Recovery Time',
      description: 'You\'re training chest 3 days in a row. Consider adding rest days.',
      priority: 'medium',
      category: 'Recovery'
    },
    {
      id: '3',
      type: 'success',
      title: 'Great Progress!',
      description: 'Your squat form has improved significantly this week.',
      priority: 'low',
      category: 'Form'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Brain className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">{t('AI Performance Insights')}</h3>
      </div>

      <div className="grid gap-4">
        {mockInsights.map((insight) => (
          <Card key={insight.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-semibold">{insight.title}</h4>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-2">{insight.description}</p>
                <Badge variant="outline">{insight.category}</Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplyRecommendation(insight.id)}
                className="ml-4"
              >
                {t('Apply')}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
