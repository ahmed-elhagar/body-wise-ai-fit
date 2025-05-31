
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  message: string;
  created_at: string;
  sender_name: string;
}

interface CoachTraineeChatProps {
  traineeId: string;
  traineeName: string;
  onBack: () => void;
}

export const CoachTraineeChat = ({ traineeId, traineeName, onBack }: CoachTraineeChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching messages (in a real app, this would fetch from a messages table)
  useEffect(() => {
    // For now, show a placeholder message
    const placeholderMessages: Message[] = [
      {
        id: '1',
        sender_id: traineeId,
        sender_type: 'trainee',
        message: 'Hello coach! I have a question about my workout plan.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sender_name: traineeName
      },
      {
        id: '2',
        sender_id: user?.id || '',
        sender_type: 'coach',
        message: 'Hi! I\'m here to help. What would you like to know?',
        created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        sender_name: 'Coach'
      }
    ];
    setMessages(placeholderMessages);
  }, [traineeId, traineeName, user?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        sender_type: 'coach',
        message: newMessage,
        created_at: new Date().toISOString(),
        sender_name: 'Coach'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {traineeName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{traineeName}</CardTitle>
            <p className="text-sm text-muted-foreground">Trainee</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_type === 'coach' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.sender_type === 'coach'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_type === 'coach' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !newMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
