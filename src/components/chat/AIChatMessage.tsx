
import React from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface AIChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  };
}

export const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const { t } = useI18n();
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-100">
            <Bot className="w-4 h-4 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <Card className={`max-w-xs lg:max-w-md p-3 ${
        isAI 
          ? 'bg-gray-100 text-gray-800' 
          : 'bg-blue-500 text-white ml-auto'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isAI ? 'text-gray-500' : 'text-blue-100'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </Card>

      {!isAI && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-500">
            <User className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Default export for compatibility
export default AIChatMessage;
