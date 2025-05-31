
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, Clock, CheckCheck, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCoachChat } from "@/hooks/useCoachChat";

interface TraineeCoachChatProps {
  coachId: string;
  coachName: string;
  onBack: () => void;
}

export const TraineeCoachChat = ({ coachId, coachName, onBack }: TraineeCoachChatProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use the coach ID and trainee ID (current user) for the chat
  const traineeId = user?.id || '';
  const { messages, isLoading, sendMessage, isSending, error } = useCoachChat(coachId, traineeId);

  console.log('TraineeCoachChat - coachId:', coachId, 'traineeId:', traineeId, 'messages:', messages.length, 'error:', error);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || isSending) return;

    const messageToSend = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX
    
    try {
      await sendMessage({ message: messageToSend });
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageToSend); // Restore message if sending failed
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  if (error) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center space-y-0 pb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Loading Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {retryCount > 2 
                ? "Unable to load chat messages. Please check your internet connection."
                : "Failed to load chat messages"
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleRetry} 
                variant="outline"
                disabled={retryCount > 3}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry {retryCount > 0 && `(${retryCount})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-green-100 text-green-700">
              {coachName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{coachName}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isLoading ? 'Loading...' : `${messages.length} messages`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {isLoading && messages.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">👋 Start the conversation!</p>
                <p className="text-sm">No messages yet. Send your first message to your coach below.</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isCoach = message.sender_type === 'coach';
                const isOwnMessage = message.sender_id === user?.id;
                const showDateSeparator = index === 0 || 
                  new Date(message.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center py-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(message.created_at).toLocaleDateString([], { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        <div className={`flex justify-between items-center mt-1 ${
                          isOwnMessage ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {formatTime(message.created_at)}
                          </span>
                          {isOwnMessage && (
                            <div className="flex items-center ml-2">
                              {message.is_read ? (
                                <CheckCheck className="h-3 w-3 text-green-200" />
                              ) : (
                                <CheckCheck className="h-3 w-3 text-green-300 opacity-60" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-gray-50">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to your coach..."
              disabled={isSending || isLoading}
              className="flex-1 bg-white"
              maxLength={500}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isSending || !newMessage.trim() || isLoading}
              size="sm"
              className="px-4"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {newMessage.length > 450 && (
            <p className="text-xs text-gray-500 mt-1">
              {500 - newMessage.length} characters remaining
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
