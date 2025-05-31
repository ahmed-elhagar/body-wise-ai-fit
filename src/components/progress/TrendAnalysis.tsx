
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Brain, Lightbulb } from "lucide-react";

interface TrendAnalysisProps {
  className?: string;
}

const TrendAnalysis = ({ className = "" }: TrendAnalysisProps) => {
  const { t } = useLanguage();

  const trends = [
    {
      id: 'weight_loss',
      title: t('Weight Loss Trend'),
      description: t('Consistent downward trend over the past 2 weeks'),
      trend: 'positive',
      confidence: 'high',
      insight: t('Your current calorie deficit is working well. Keep up the good work!'),
      recommendation: t('Continue with your current meal plan and consider adding 1 more workout per week.')
    },
    {
      id: 'calorie_intake',
      title: t('Calorie Intake Pattern'),
      description: t('Slightly above target on weekends'),
      trend: 'neutral',
      confidence: 'medium',
      insight: t('Weekend calorie intake is 15% higher than weekdays on average.'),
      recommendation: t('Plan healthier weekend activities and prepare snacks in advance.')
    },
    {
      id: 'workout_consistency',
      title: t('Workout Consistency'),
      description: t('Excellent consistency in the last month'),
      trend: 'positive',
      confidence: 'high',
      insight: t('92% workout completion rate - you\'re building a strong habit!'),
      recommendation: t('Consider gradually increasing workout intensity or duration.')
    },
    {
      id: 'macro_balance',
      title: t('Macro Balance Analysis'),
      description: t('Protein intake could be improved'),
      trend: 'attention',
      confidence: 'high',
      insight: t('Protein intake is 20% below target, which may slow muscle recovery.'),
      recommendation: t('Add a protein shake post-workout or increase lean meat portions.')
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'attention': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'positive': return <Badge className="bg-green-100 text-green-800 border-green-200">{t('Positive')}</Badge>;
      case 'negative': return <Badge className="bg-red-100 text-red-800 border-red-200">{t('Needs Attention')}</Badge>;
      case 'attention': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{t('Monitor')}</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{t('Stable')}</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t('High Confidence')}</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t('Medium Confidence')}</Badge>;
      default: return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{t('Low Confidence')}</Badge>;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="w-5 h-5" />
            {t('AI-Powered Trend Analysis')}
          </CardTitle>
          <p className="text-sm text-blue-600">
            {t('Based on your data from the last 30 days, here are the key trends and insights')}
          </p>
        </CardHeader>
      </Card>

      {/* Trend Analysis Cards */}
      <div className="space-y-4">
        {trends.map((trend) => (
          <Card key={trend.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(trend.trend)}
                    <div>
                      <h3 className="font-semibold text-gray-800">{trend.title}</h3>
                      <p className="text-sm text-gray-600">{trend.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getTrendBadge(trend.trend)}
                    {getConfidenceBadge(trend.confidence)}
                  </div>
                </div>

                {/* Insight */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">{t('AI Insight')}</h4>
                      <p className="text-sm text-gray-700">{trend.insight}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-sm mb-1">{t('Recommendation')}</h4>
                      <p className="text-sm text-blue-700">{trend.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
            <h3 className="font-bold text-green-800">{t('Overall Progress: Excellent!')}</h3>
            <p className="text-sm text-green-700">
              {t('You\'re on track to reach your goals. Keep following the AI recommendations for optimal results.')}
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-300 mt-4">
              {t('Analysis updated daily')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
