
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';

interface CoachTraineeChatProps {
  traineeId: string;
  traineeName?: string;
}

const CoachTraineeChat: React.FC<CoachTraineeChatProps> = ({
  traineeId,
  traineeName = 'Trainee'
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: 'coach' | 'trainee';
    timestamp: Date;
  }>>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'coach' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat with {traineeName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.sender === 'coach' 
                    ? 'bg-blue-100 ml-auto max-w-[80%]' 
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachTraineeChat;
