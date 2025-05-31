
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, Clock, CheckCheck, AlertCircle, RefreshCw, User, Smile, Paperclip } from "lucide-react";
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
      <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-50">
        <Card className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b border-green-100">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 hover:bg-green-100">
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
                  className="border-green-200 hover:bg-green-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry {retryCount > 0 && `(${retryCount})`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-50 min-h-[600px]">
      <Card className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-lg overflow-hidden">
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-4 border-0">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="text-white hover:bg-white/20 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarFallback className="bg-white/20 text-white font-semibold">
                {coachName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{coachName}</CardTitle>
              <div className="flex items-center gap-2 text-green-100 text-sm">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>Your Coach</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {isLoading ? 'Loading...' : `${messages.length} messages`}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Enhanced Messages Area */}
        <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-white to-green-50/30">
          <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your conversation...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journey!</h3>
                    <p className="text-gray-600 mb-4">No messages yet. Send your first message to your coach below and begin your personalized fitness journey.</p>
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Smile className="w-4 h-4" />
                      <span className="text-sm">Your coach is here to help!</span>
                    </div>
                  </div>
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
                        <div className="flex justify-center py-3">
                          <span className="text-xs text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                            {new Date(message.created_at).toLocaleDateString([], { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`group relative max-w-[75%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-100'
                          } ${isOwnMessage ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
                            <div className={`flex justify-between items-center mt-2 gap-3 ${
                              isOwnMessage ? 'text-green-100' : 'text-gray-400'
                            }`}>
                              <span className="text-xs font-medium">
                                {formatTime(message.created_at)}
                              </span>
                              {isOwnMessage && (
                                <div className="flex items-center">
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
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Enhanced Input Area */}
          <div className="border-t border-green-100 bg-white p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to your coach..."
                  disabled={isSending || isLoading}
                  className="min-h-[44px] pr-12 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-xl resize-none"
                  maxLength={500}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {newMessage.length > 450 && (
                    <span className="text-xs text-gray-400 mr-2">
                      {500 - newMessage.length}
                    </span>
                  )}
                </div>
              </div>
              <Button 
                onClick={handleSendMessage} 
                disabled={isSending || !newMessage.trim() || isLoading}
                size="sm"
                className="h-[44px] px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {newMessage.length > 450 && (
              <p className="text-xs text-amber-600 mt-2 ml-1">
                {500 - newMessage.length} characters remaining
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
