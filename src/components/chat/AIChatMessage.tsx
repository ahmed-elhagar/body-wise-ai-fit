
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { isRTL } = useLanguage();

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

  const formatText = (text: string) => {
    // Handle bold text **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Handle italic text *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Handle inline code `code`
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    return text;
  };

  const formatAIResponse = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Check if it's a list
      if (trimmedParagraph.includes('•') || trimmedParagraph.includes('-') || /^\d+\./.test(trimmedParagraph)) {
        const lines = trimmedParagraph.split('\n');
        return (
          <div key={index} className="mb-4">
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;
              
              return (
                <div key={lineIndex} className={cn(
                  "mb-2 flex items-start gap-2",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {trimmedLine.startsWith('•') || trimmedLine.startsWith('-') ? (
                    <>
                      <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                      <span 
                        className="flex-1"
                        dangerouslySetInnerHTML={{ 
                          __html: formatText(trimmedLine.replace(/^[•\-]\s*/, '')) 
                        }} 
                      />
                    </>
                  ) : /^\d+\./.test(trimmedLine) ? (
                    <>
                      <span className="text-blue-600 font-semibold flex-shrink-0">
                        {trimmedLine.match(/^\d+\./)?.[0]}
                      </span>
                      <span 
                        className="flex-1"
                        dangerouslySetInnerHTML={{ 
                          __html: formatText(trimmedLine.replace(/^\d+\.\s*/, '')) 
                        }} 
                      />
                    </>
                  ) : (
                    <span 
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: formatText(trimmedLine) }} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      }
      
      // Check if it's a heading (starts with # or **text**)
      if (trimmedParagraph.startsWith('#') || (trimmedParagraph.startsWith('**') && trimmedParagraph.endsWith('**'))) {
        const headingText = trimmedParagraph.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        return (
          <h3 
            key={index} 
            className={cn(
              "font-semibold text-gray-900 mb-3 text-base",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {headingText}
          </h3>
        );
      }
      
      // Regular paragraph
      return (
        <p 
          key={index} 
          className={cn(
            "mb-3 leading-relaxed",
            isRTL ? "text-right" : "text-left"
          )}
          dangerouslySetInnerHTML={{ __html: formatText(trimmedParagraph) }}
        />
      );
    });
  };

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "group flex gap-4 mb-6 max-w-none",
      isUser ? "justify-end" : "justify-start",
      isRTL && "flex-row-reverse"
    )}>
      {/* Avatar for assistant */}
      {isAssistant && (
        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-green-100">
          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex-1 max-w-[80%]",
        isUser && "max-w-[70%]"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm relative shadow-sm border",
          isUser
            ? "bg-blue-600 text-white ml-auto rounded-br-md"
            : "bg-white text-gray-900 border-gray-200 rounded-bl-md",
          message.isLoading && "animate-pulse",
          isUser && isRTL && "mr-auto ml-0 rounded-bl-md rounded-br-2xl",
          isAssistant && isRTL && "rounded-br-md rounded-bl-2xl"
        )}>
          {message.isLoading ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-gray-500">AI is thinking...</span>
            </div>
          ) : (
            <div className={cn(
              "break-words",
              isUser ? "text-white" : "text-gray-900",
              isRTL ? "text-right" : "text-left"
            )}>
              {isAssistant ? (
                <div className="prose prose-sm max-w-none">
                  {formatAIResponse(message.content)}
                </div>
              ) : (
                <div 
                  className={cn(isRTL ? "text-right" : "text-left")}
                  dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
                />
              )}
            </div>
          )}
          
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500",
            isRTL ? "text-right" : "text-left"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        
        {/* Action buttons for assistant messages */}
        {isAssistant && !message.isLoading && (
          <div className={cn(
            "flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
            isRTL && "flex-row-reverse"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs hover:bg-gray-100"
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
                className="h-7 px-2 text-xs hover:bg-gray-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}
            
            {onFeedback && (
              <div className={cn(
                "flex gap-1 ml-2",
                isRTL && "mr-2 ml-0"
              )}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    "h-7 w-7 p-0 hover:bg-green-100",
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
                    "h-7 w-7 p-0 hover:bg-red-100",
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

      {/* Avatar for user */}
      {isUser && (
        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-blue-100">
          <AvatarFallback className="bg-blue-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default AIChatMessage;
