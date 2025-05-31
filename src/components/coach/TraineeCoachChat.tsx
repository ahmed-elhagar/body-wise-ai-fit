
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, UserCheck, Badge as BadgeIcon, AlertCircle, X, Edit } from "lucide-react";
import { useCoachChat } from "@/hooks/useCoachChat";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useMessageActions } from "@/hooks/useMessageActions";
import { cn } from "@/lib/utils";
import MobileChatInterface from "@/components/chat/MobileChatInterface";
import ChatSearchBar from "@/components/chat/ChatSearchBar";
import TypingIndicator from "@/components/chat/TypingIndicator";
import MessageActionsMenu from "@/components/chat/MessageActionsMenu";

interface TraineeCoachChatProps {
  coachId: string;
  coachName: string;
  onBack: () => void;
}

const TraineeCoachChat = ({ coachId, coachName, onBack }: TraineeCoachChatProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const traineeId = user?.id || '';
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    isSending,
    error 
  } = useCoachChat(coachId, traineeId);
  
  const { isConnected } = useRealtimeChat(coachId, traineeId);
  
  // Phase 2 features
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchActive, 
    setIsSearchActive, 
    filteredMessages, 
    searchStats,
    clearSearch 
  } = useMessageSearch(messages);
  
  const { 
    typingUsers, 
    sendTypingIndicator, 
    stopTypingIndicator 
  } = useTypingIndicator(coachId, traineeId);
  
  const {
    replyingTo,
    setReplyingTo,
    editingMessage,
    setEditingMessage,
    editMessage,
    deleteMessage,
    isEditing
  } = useMessageActions(coachId, traineeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    const messageText = message.trim();
    setMessage('');
    setReplyingTo(null);
    stopTypingIndicator();
    
    try {
      await sendMessage({ message: messageText });
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.trim()) {
      sendTypingIndicator();
    } else {
      stopTypingIndicator();
    }
  };

  const handleEditMessage = (msg: any) => {
    setEditingMessage(msg);
    setMessage(msg.message);
    inputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessage('');
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !message.trim()) return;
    
    try {
      await editMessage({
        messageId: editingMessage.id,
        newContent: message.trim()
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Use mobile interface on mobile devices
  if (isMobile) {
    return (
      <MobileChatInterface
        coachId={coachId}
        traineeId={traineeId}
        coachName={coachName}
        onBack={onBack}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-green-600" />
          <p className="text-gray-600 text-sm">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-600" />
          <p className="text-red-600 text-sm">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const displayMessages = searchStats.isFiltered ? filteredMessages : messages;

  // Desktop interface with enhanced features
  return (
    <Card className="h-[600px] flex flex-col bg-white shadow-lg rounded-xl">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {getInitials(coachName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-white mb-1">
              {coachName}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-300" : "bg-white/50"
              )} />
              <span className="text-green-100 text-sm">
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
            <UserCheck className="w-3 h-3 mr-1" />
            Coach
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Search Bar */}
        <ChatSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isActive={isSearchActive}
          onToggleSearch={() => setIsSearchActive(!isSearchActive)}
          searchStats={searchStats}
          onClearSearch={clearSearch}
        />

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {displayMessages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "group flex gap-3 max-w-[80%]",
                    isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {!isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {getInitials(msg.sender_name || coachName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex-1">
                    {/* Reply indicator */}
                    {replyingTo?.id === msg.id && (
                      <div className="text-xs text-blue-600 mb-1">
                        Replying to this message
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 relative",
                        isOwn
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-900",
                        msg.updated_at !== msg.created_at && "border-l-2 border-orange-400"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm whitespace-pre-wrap flex-1">
                          {msg.message}
                        </p>
                        <MessageActionsMenu
                          message={msg}
                          isOwnMessage={isOwn}
                          onReply={setReplyingTo}
                          onEdit={handleEditMessage}
                          onDelete={deleteMessage}
                        />
                      </div>
                      
                      <div className={cn(
                        "text-xs mt-1 flex items-center justify-between",
                        isOwn ? "text-green-100" : "text-gray-500"
                      )}>
                        <div className="flex items-center gap-2">
                          <span>{formatTime(msg.created_at)}</span>
                          {msg.updated_at !== msg.created_at && (
                            <span className="text-xs opacity-75">(edited)</span>
                          )}
                        </div>
                        {isOwn && msg.is_read && (
                          <span className="flex items-center gap-1">
                            <BadgeIcon className="w-3 h-3" />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            <TypingIndicator
              typingUsers={typingUsers}
              getCoachName={() => coachName}
            />
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4 bg-gray-50 rounded-b-xl">
          {/* Reply indicator */}
          {replyingTo && (
            <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">Replying to:</span>
                  <p className="text-gray-600 truncate mt-1">{replyingTo.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Edit indicator */}
          {editingMessage && (
            <div className="mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-orange-600 font-medium flex items-center gap-1">
                    <Edit className="h-3 w-3" />
                    Editing message
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isEditing}
                    className="p-1 text-green-600 hover:bg-green-100"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={editingMessage ? "Edit your message..." : "Type your message..."}
              className="flex-1 min-h-[60px] resize-none"
              disabled={isSending || isEditing}
            />
            <Button
              onClick={editingMessage ? handleSaveEdit : handleSendMessage}
              disabled={!message.trim() || isSending || isEditing}
              className="self-end bg-green-600 hover:bg-green-700"
            >
              {isSending || isEditing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingMessage ? (
                <Edit className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeCoachChat;
