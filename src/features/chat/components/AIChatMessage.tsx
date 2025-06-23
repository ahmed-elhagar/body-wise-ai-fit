
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIChatMessageProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const AIChatMessage: React.FC<AIChatMessageProps> = ({
  message,
  onRegenerate,
  onFeedback
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('Message copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    onFeedback?.(message.id, type);
    toast.success(`Feedback sent: ${type === 'positive' ? 'Helpful' : 'Not helpful'}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Enhanced content formatting with better visual structure
  const formatContent = (content: string) => {
    // Split by double newlines for paragraphs
    const sections = content.split('\n\n');
    
    return sections.map((section, index) => {
      // Main headers (## format)
      if (section.startsWith('##')) {
        const headerText = section.replace(/^##\s*/, '');
        return (
          <div key={index} className="mb-4 first:mt-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {headerText}
              </h3>
            </div>
          </div>
        );
      }
      
      // Sub-headers (### format)
      if (section.startsWith('###')) {
        const headerText = section.replace(/^###\s*/, '');
        return (
          <div key={index} className="mb-3 first:mt-0">
            <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              {headerText}
            </h4>
          </div>
        );
      }
      
      // Bold text formatting (**text**)
      const formatBoldText = (text: string) => {
        return text.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-gray-900 bg-blue-50 px-1.5 py-0.5 rounded">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
      };
      
      // List handling (bullet points and numbered lists)
      if (section.includes('\n-') || section.includes('\n•') || /^\d+\./.test(section)) {
        const items = section.split('\n').filter(line => line.trim());
        const hasNumberedList = items.some(item => /^\d+\./.test(item));
        
        return (
          <div key={index} className="mb-4">
            <div className={cn(
              "space-y-2 p-3 rounded-lg",
              hasNumberedList ? "bg-green-50 border-l-4 border-green-400" : "bg-blue-50 border-l-4 border-blue-400"
            )}>
              {items.map((item, itemIndex) => {
                if (item.startsWith('-') || item.startsWith('•')) {
                  return (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {formatBoldText(item.replace(/^[-•]\s*/, ''))}
                      </span>
                    </div>
                  );
                } else if (/^\d+\./.test(item)) {
                  const number = item.match(/^\d+/)?.[0];
                  return (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {number}
                      </div>
                      <span className="text-gray-700 leading-relaxed">
                        {formatBoldText(item.replace(/^\d+\.\s*/, ''))}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <p key={itemIndex} className="text-gray-700 leading-relaxed font-medium">
                      {formatBoldText(item)}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        );
      }
      
      // Regular paragraphs with enhanced formatting
      if (section.trim()) {
        return (
          <div key={index} className="mb-3 last:mb-0">
            <p className="text-gray-700 leading-relaxed">
              {formatBoldText(section)}
            </p>
          </div>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <div className={cn(
      "flex gap-3 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Avatar */}
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[85%] space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <Card className={cn(
          "relative transition-all duration-300 shadow-sm hover:shadow-md",
          isUser 
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0" 
            : "bg-white border border-gray-100",
          isLoading && "animate-pulse"
        )}>
          <div className={cn(
            "p-4",
            isUser ? "text-white" : "text-gray-900"
          )}>
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">FitGenius is thinking...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {isUser ? (
                  <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                ) : (
                  <div className="space-y-1">
                    {formatContent(message.content)}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Message Actions */}
        {!isLoading && (
          <div className={cn(
            "flex items-center gap-2 text-xs",
            isUser ? "justify-end" : "justify-start"
          )}>
            <span className="text-gray-500 font-medium">
              {formatTime(message.timestamp)}
            </span>
            
            {!isUser && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Copy message"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    "h-7 w-7 p-0 rounded-full",
                    feedback === 'positive' 
                      ? "text-green-600 bg-green-100 hover:bg-green-200" 
                      : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                  )}
                  title="Helpful"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('negative')}
                  className={cn(
                    "h-7 w-7 p-0 rounded-full",
                    feedback === 'negative' 
                      ? "text-red-600 bg-red-100 hover:bg-red-200" 
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  )}
                  title="Not helpful"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
                
                {onRegenerate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    className="h-7 w-7 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full"
                    title="Regenerate response"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-700 text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default AIChatMessage;
