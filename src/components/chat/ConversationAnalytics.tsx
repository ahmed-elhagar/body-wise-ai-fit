
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  Heart, 
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAIAnalytics } from '@/hooks/useAIAnalytics';
import { cn } from '@/lib/utils';

interface ConversationAnalyticsProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp?: number }>;
  className?: string;
}

const ConversationAnalytics = ({ messages, className }: ConversationAnalyticsProps) => {
  const { analyzeConversation, generateInsights } = useAIAnalytics();
  const [analytics, setAnalytics] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const result = analyzeConversation(messages);
      setAnalytics(result);
      
      if (result) {
        setInsights(generateInsights(result));
      }
    }
  }, [messages, analyzeConversation, generateInsights]);

  if (!analytics || messages.length < 3) {
    return null;
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={cn("border-0 bg-gradient-to-r from-slate-50 to-blue-50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-900">
              Conversation Analytics
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              AI Insights
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{analytics.totalMessages}</div>
            <div className="text-xs text-gray-600">Messages</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <Clock className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">
              {Math.round(analytics.avgResponseTime / 1000)}s
            </div>
            <div className="text-xs text-gray-600">Avg Response</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
            <div className={cn("text-lg font-bold", getScoreColor(analytics.engagementScore))}>
              {analytics.engagementScore}%
            </div>
            <div className="text-xs text-gray-600">Engagement</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className={cn("text-lg font-bold", getScoreColor(analytics.aiHelpfulness))}>
              {analytics.aiHelpfulness}%
            </div>
            <div className="text-xs text-gray-600">AI Helpfulness</div>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Sentiment Analysis */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">Sentiment Trend</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={cn("capitalize", getSentimentColor(analytics.sentimentTrend))}>
                  {analytics.sentimentTrend}
                </Badge>
                <Progress 
                  value={analytics.sentimentTrend === 'positive' ? 80 : analytics.sentimentTrend === 'negative' ? 20 : 50} 
                  className="flex-1 h-2"
                />
              </div>
            </div>

            {/* Top Topics */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900">Top Discussion Topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.topTopics.map((topic: string, index: number) => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="capitalize bg-purple-50 text-purple-700 border-purple-200"
                  >
                    #{topic}
                  </Badge>
                ))}
                {analytics.topTopics.length === 0 && (
                  <span className="text-sm text-gray-500">No specific topics identified yet</span>
                )}
              </div>
            </div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">AI Insights</span>
                </div>
                <div className="space-y-2">
                  {insights.map((insight, index) => (
                    <div 
                      key={index} 
                      className="text-sm text-blue-800 bg-white/50 rounded-lg p-2 border border-blue-200"
                    >
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationAnalytics;
