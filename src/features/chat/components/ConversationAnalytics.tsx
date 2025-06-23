
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MessageSquare, Clock, TrendingUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sender_type: "user" | "ai" | "coach" | "trainee";
}

interface ConversationAnalyticsProps {
  messages: ChatMessage[];
  className?: string;
}

const ConversationAnalytics: React.FC<ConversationAnalyticsProps> = ({ 
  messages, 
  className 
}) => {
  // Calculate analytics
  const totalMessages = messages.length;
  const userMessages = messages.filter(m => m.role === 'user').length;
  const aiMessages = messages.filter(m => m.role === 'assistant').length;
  
  // Calculate average response time (simulated for demo)
  const avgResponseTime = "1.2s";
  
  // Identify conversation topics (simplified)
  const getTopics = () => {
    const allContent = messages.map(m => m.content.toLowerCase()).join(' ');
    const topics = [];
    
    if (allContent.includes('workout') || allContent.includes('exercise')) {
      topics.push('Exercise');
    }
    if (allContent.includes('nutrition') || allContent.includes('meal') || allContent.includes('diet')) {
      topics.push('Nutrition');
    }
    if (allContent.includes('weight') || allContent.includes('calories')) {
      topics.push('Weight Management');
    }
    if (allContent.includes('goal') || allContent.includes('target')) {
      topics.push('Goal Setting');
    }
    
    return topics.length > 0 ? topics : ['General Health'];
  };

  const topics = getTopics();

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Conversation Analytics
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mb-2 mx-auto">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{totalMessages}</div>
            <div className="text-xs text-gray-600">Total Messages</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mb-2 mx-auto">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">{userMessages}</div>
            <div className="text-xs text-gray-600">Your Messages</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mb-2 mx-auto">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{aiMessages}</div>
            <div className="text-xs text-gray-600">AI Responses</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mb-2 mx-auto">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-700">{avgResponseTime}</div>
            <div className="text-xs text-gray-600">Avg Response</div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Conversation Topics:</div>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationAnalytics;
