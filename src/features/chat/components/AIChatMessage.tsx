
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
  MoreVertical
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

  // Format message content with better structure
  const formatContent = (content: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a header (starts with ##)
      if (paragraph.startsWith('##')) {
        const headerText = paragraph.replace(/^##\s*/, '');
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2 first:mt-0">
            {headerText}
          </h3>
        );
      }
      
      // Check if it's a list (contains bullet points or numbers)
      if (paragraph.includes('\n-') || paragraph.includes('\n•') || /^\d+\./.test(paragraph)) {
        const items = paragraph.split('\n').filter(line => line.trim());
        return (
          <div key={index} className="mb-3">
            {items.map((item, itemIndex) => {
              if (item.startsWith('-') || item.startsWith('•')) {
                return (
                  <div key={itemIndex} className="flex items-start gap-2 mb-1">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{item.replace(/^[-•]\s*/, '')}</span>
                  </div>
                );
              } else if (/^\d+\./.test(item)) {
                return (
                  <div key={itemIndex} className="flex items-start gap-2 mb-1">
                    <span className="text-blue-500 font-medium">{item.match(/^\d+/)?.[0]}.</span>
                    <span>{item.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                );
              } else {
                return <p key={itemIndex} className="mb-2">{item}</p>;
              }
            })}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-3 last:mb-0 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className={cn(
      "flex gap-4 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Avatar */}
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <Card className={cn(
          "relative transition-all duration-200",
          isUser 
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg" 
            : "bg-white border border-gray-200 shadow-sm hover:shadow-md",
          isLoading && "animate-pulse"
        )}>
          <div className={cn(
            "p-4",
            isUser ? "text-white" : "text-gray-900"
          )}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="space-y-2">
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
            <span className="text-gray-500">
              {formatTime(message.timestamp)}
            </span>
            
            {!isUser && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    "h-6 w-6 p-0",
                    feedback === 'positive' 
                      ? "text-green-600 bg-green-50" 
                      : "text-gray-400 hover:text-green-600"
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('negative')}
                  className={cn(
                    "h-6 w-6 p-0",
                    feedback === 'negative' 
                      ? "text-red-600 bg-red-50" 
                      : "text-gray-400 hover:text-red-600"
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
                
                {onRegenerate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
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
          <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white text-sm">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default AIChatMessage;
