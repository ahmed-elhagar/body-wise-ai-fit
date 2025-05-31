
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageSquare, ThumbsUp, HelpCircle } from 'lucide-react';
import { useSmartReplies } from '@/hooks/useSmartReplies';
import { cn } from '@/lib/utils';

interface SmartReply {
  id: string;
  text: string;
  category: 'question' | 'feedback' | 'request' | 'acknowledgment';
  relevanceScore: number;
}

interface SmartReplySuggestionsProps {
  lastMessage: string;
  conversationHistory: Array<{ role: string; content: string }>;
  onSelectReply: (reply: string) => void;
  className?: string;
}

const SmartReplySuggestions = ({ 
  lastMessage, 
  conversationHistory, 
  onSelectReply, 
  className 
}: SmartReplySuggestionsProps) => {
  const { generateSmartReplies, isGenerating } = useSmartReplies();
  const [suggestions, setSuggestions] = useState<SmartReply[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!lastMessage) return;

    const generateSuggestions = async () => {
      const replies = await generateSmartReplies(lastMessage, conversationHistory);
      setSuggestions(replies);
      setIsVisible(replies.length > 0);
    };

    // Debounce suggestion generation
    const timeout = setTimeout(generateSuggestions, 1000);
    return () => clearTimeout(timeout);
  }, [lastMessage, conversationHistory, generateSmartReplies]);

  const getCategoryIcon = (category: SmartReply['category']) => {
    switch (category) {
      case 'question':
        return <HelpCircle className="w-3 h-3" />;
      case 'feedback':
        return <ThumbsUp className="w-3 h-3" />;
      case 'request':
        return <MessageSquare className="w-3 h-3" />;
      case 'acknowledgment':
        return <Sparkles className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: SmartReply['category']) => {
    switch (category) {
      case 'question':
        return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
      case 'feedback':
        return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
      case 'request':
        return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
      case 'acknowledgment':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
    }
  };

  if (!isVisible || (!isGenerating && suggestions.length === 0)) {
    return null;
  }

  return (
    <div className={cn(
      "space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">Smart Reply Suggestions</span>
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
          AI-Powered
        </Badge>
      </div>

      {isGenerating ? (
        <div className="flex items-center gap-2 py-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Generating suggestions...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => onSelectReply(suggestion.text)}
              className={cn(
                "justify-start text-left h-auto py-2 px-3 transition-all duration-200 transform hover:scale-105",
                getCategoryColor(suggestion.category)
              )}
            >
              <div className="flex items-center gap-2 w-full">
                {getCategoryIcon(suggestion.category)}
                <span className="text-sm font-medium truncate flex-1">
                  {suggestion.text}
                </span>
                <Badge 
                  variant="secondary" 
                  className="text-xs ml-auto bg-white/50"
                >
                  {Math.round(suggestion.relevanceScore * 100)}%
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 text-center pt-2 border-t border-blue-200">
        💡 Click any suggestion to use it as your response
      </div>
    </div>
  );
};

export default SmartReplySuggestions;
