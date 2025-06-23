
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Lightbulb, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sender_type: "user" | "ai" | "coach" | "trainee";
}

interface SmartReplySuggestionsProps {
  conversationHistory: ChatMessage[];
  onSelectReply: (reply: string) => void;
  className?: string;
}

export const SmartReplySuggestions: React.FC<SmartReplySuggestionsProps> = ({
  conversationHistory,
  onSelectReply,
  className
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Generate smart reply suggestions based on conversation context
  useEffect(() => {
    if (conversationHistory.length === 0) {
      setSuggestions([]);
      setIsVisible(false);
      return;
    }

    const lastMessage = conversationHistory[conversationHistory.length - 1];
    
    // Only show suggestions after AI responses
    if (lastMessage.role !== 'assistant') {
      setIsVisible(false);
      return;
    }

    const generateSuggestions = () => {
      const content = lastMessage.content.toLowerCase();
      const suggestions: string[] = [];

      // Context-aware suggestions based on AI response content
      if (content.includes('workout') || content.includes('exercise')) {
        suggestions.push(
          "Can you modify this workout?",
          "How often should I do this?",
          "What equipment do I need?"
        );
      } else if (content.includes('nutrition') || content.includes('meal') || content.includes('diet')) {
        suggestions.push(
          "Can you suggest alternatives?",
          "What about portion sizes?",
          "Any meal prep tips?"
        );
      } else if (content.includes('goal') || content.includes('target')) {
        suggestions.push(
          "How do I track progress?",
          "What if I miss a day?",
          "Can you break this down?"
        );
      } else if (content.includes('calories') || content.includes('weight')) {
        suggestions.push(
          "How accurate is this?",
          "What affects these numbers?",
          "Any tips for consistency?"
        );
      } else {
        // Generic helpful follow-ups
        suggestions.push(
          "Tell me more about this",
          "Can you give me an example?",
          "What's the next step?"
        );
      }

      // Add some universal options
      suggestions.push(
        "Thank you!",
        "That's helpful",
        "Can you explain further?"
      );

      return suggestions.slice(0, 4); // Limit to 4 suggestions
    };

    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
    setIsVisible(newSuggestions.length > 0);
  }, [conversationHistory]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className={cn("border-0 bg-transparent shadow-none", className)}>
      <div className="p-2 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Quick replies</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelectReply(suggestion)}
              className="h-8 px-3 text-xs bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 rounded-full"
            >
              {suggestion}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-1 px-2 text-xs text-gray-500">
          <Lightbulb className="h-3 w-3" />
          <span>Tap a suggestion or type your own message</span>
        </div>
      </div>
    </Card>
  );
};
