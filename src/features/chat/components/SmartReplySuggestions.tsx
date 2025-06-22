
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatMessage } from '../types/chat.types';

export interface SmartReplySuggestionsProps {
  conversationHistory: ChatMessage[];
  onSelectReply: (reply: string) => void;
  className?: string;
}

export const SmartReplySuggestions: React.FC<SmartReplySuggestionsProps> = ({
  conversationHistory,
  onSelectReply,
  className = ''
}) => {
  const generateSmartReplies = (history: ChatMessage[]): string[] => {
    if (history.length === 0) return [];

    const lastMessage = history[history.length - 1];
    const messageContent = lastMessage.content.toLowerCase();

    // Generate contextual replies based on message content
    if (messageContent.includes('workout') || messageContent.includes('exercise')) {
      return [
        "That sounds like a great workout plan!",
        "How often should I do this routine?",
        "Can you suggest any modifications for beginners?"
      ];
    }

    if (messageContent.includes('nutrition') || messageContent.includes('diet') || messageContent.includes('meal')) {
      return [
        "Thanks for the nutrition advice!",
        "What about portion sizes?",
        "Can you suggest some healthy alternatives?"
      ];
    }

    if (messageContent.includes('progress') || messageContent.includes('goal')) {
      return [
        "I'm excited to track my progress!",
        "How should I measure my results?",
        "What if I don't see progress right away?"
      ];
    }

    // Default replies
    return [
      "That's really helpful, thank you!",
      "Can you tell me more about this?",
      "I'll definitely try that approach."
    ];
  };

  const suggestions = generateSmartReplies(conversationHistory);

  if (suggestions.length === 0) return null;

  return (
    <Card className={`p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Replies</h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectReply(suggestion)}
            className="text-xs hover:bg-indigo-50 hover:border-indigo-300"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </Card>
  );
};
