
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'trainee';
  timestamp: Date;
}

interface MessagesListProps {
  messages: Message[];
  traineeName: string;
}

const MessagesList = ({ messages, traineeName }: MessagesListProps) => {
  const { t } = useI18n();

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex gap-3 ${message.sender === 'coach' ? 'flex-row-reverse' : ''}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                {message.sender === 'coach' ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>
            
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'coach' 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'coach' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
