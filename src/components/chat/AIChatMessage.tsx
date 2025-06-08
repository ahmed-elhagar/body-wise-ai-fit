
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface AIChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isTyping?: boolean;
  };
}

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const { isRTL } = useI18n();
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : 'flex-row')}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <Card className={`flex-1 p-4 ${isUser ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Badge variant={isUser ? "default" : "secondary"}>
            {isUser ? 'You' : 'AI Coach'}
          </Badge>
          {!isUser && <Sparkles className="w-3 h-3 text-purple-500" />}
        </div>
        
        <div className={`prose prose-sm max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
          {message.isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-500 text-sm ml-2">AI is thinking...</span>
            </div>
          ) : (
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </Card>
    </div>
  );
};

export default AIChatMessage;
