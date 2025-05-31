
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isLoading?: boolean;
  };
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const AIChatMessage = ({ message, onRegenerate, onFeedback }: AIChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    onFeedback?.(message.id, type);
  };

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "group flex gap-3 max-w-[85%] mb-4",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={cn(
          "text-xs font-semibold",
          isUser 
            ? "bg-blue-100 text-blue-700" 
            : "bg-green-100 text-green-700"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className={cn(
          "rounded-lg px-4 py-3 text-sm relative",
          isUser
            ? "bg-blue-600 text-white ml-4"
            : "bg-gray-100 text-gray-900 mr-4",
          message.isLoading && "animate-pulse"
        )}>
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-gray-500">AI is thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </div>
          )}
          
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        
        {/* Action buttons for assistant messages */}
        {isAssistant && !message.isLoading && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}
            
            {onFeedback && (
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    "h-6 w-6 p-0",
                    feedback === 'positive' && "bg-green-100 text-green-600"
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
                    feedback === 'negative' && "bg-red-100 text-red-600"
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatMessage;
