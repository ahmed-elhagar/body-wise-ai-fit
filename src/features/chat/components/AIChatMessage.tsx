
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatMessageProps {
  message: Message;
}

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <Card className={`max-w-[80%] ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
        <div className="p-3">
          <p className="text-sm">{message.text}</p>
          <div className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChatMessage;
