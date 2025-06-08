import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface MultipleCoachesChatProps {
  onClose: () => void;
}

const MultipleCoachesChat = ({ onClose }: MultipleCoachesChatProps) => {
  const { t } = useI18n();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate coach response
    setTimeout(() => {
      const coachMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. One of our coaches will respond shortly.',
        sender: 'coach',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMessage]);
    }, 1000);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {t('coach:multipleCoaches') || 'Multiple Coaches Chat'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-3 mb-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {msg.sender === 'user' ? 'U' : 'C'}
                </AvatarFallback>
              </Avatar>
              
              <div 
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-center p-4">
              <div className="max-w-sm">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('coach:startConversation') || 'Start a conversation'}
                </h3>
                <p className="text-gray-600">
                  {t('coach:messageAllCoaches') || 'Send a message to connect with all available coaches'}
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('coach:typeMessage') || 'Type your message...'}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleCoachesChat;
