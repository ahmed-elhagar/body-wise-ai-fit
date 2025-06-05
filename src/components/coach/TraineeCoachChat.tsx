
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCoachChat } from "@/hooks/useCoachChat";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useMessageActions } from "@/hooks/useMessageActions";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLiveNotifications } from "@/hooks/useLiveNotifications";
import MobileChatInterface from "@/components/chat/MobileChatInterface";
import ChatSearchBar from "@/components/chat/ChatSearchBar";
import ChatHeader from "./chat/ChatHeader";
import MessagesList from "./chat/MessagesList";
import ChatInput from "./chat/ChatInput";
import type { CoachChatMessage } from "./types/chatTypes";

interface TraineeCoachChatProps {
  coachId: string;
  coachName: string;
  onBack: () => void;
}

const TraineeCoachChat = ({ coachId, coachName, onBack }: TraineeCoachChatProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [message, setMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<CoachChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<CoachChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const traineeId = user?.id || '';
  
  // Initialize real-time features
  useOnlineStatus(); // Track current user's online status
  useLiveNotifications(); // Listen for live notifications
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    isSending,
    error 
  } = useCoachChat(coachId, traineeId);
  
  const { isConnected } = useRealtimeChat(coachId, traineeId);
  
  // Check coach's online status
  const { isUserOnline, getUserLastSeen } = useUserOnlineStatus([coachId]);
  const isCoachOnline = isUserOnline(coachId);
  const coachLastSeen = getUserLastSeen(coachId);
  
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
      if (editingMessage) {
        handleSaveEdit();
      } else {
        handleSendMessage();
      }
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

  const handleEditMessage = (msg: CoachChatMessage) => {
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
      setEditingMessage(null);
      setMessage('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
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

  // Desktop interface with enhanced real-time features
  return (
    <Card className="h-[600px] flex flex-col bg-white shadow-lg rounded-xl">
      <ChatHeader
        coachName={coachName}
        isCoachOnline={isCoachOnline}
        coachLastSeen={coachLastSeen}
        isConnected={isConnected}
        onBack={onBack}
      />
      
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

        <MessagesList
          messages={displayMessages}
          currentUserId={user?.id}
          coachName={coachName}
          typingUsers={typingUsers}
          replyingTo={replyingTo}
          onReply={setReplyingTo}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          messagesEndRef={messagesEndRef}
        />
        
        <ChatInput
          message={message}
          setMessage={setMessage}
          isSending={isSending}
          isEditing={isEditing}
          editingMessage={editingMessage}
          replyingTo={replyingTo}
          onSend={handleSendMessage}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onCancelReply={() => setReplyingTo(null)}
          onKeyPress={handleKeyPress}
          onChange={handleInputChange}
          inputRef={inputRef}
        />
      </CardContent>
    </Card>
  );
};

export default TraineeCoachChat;
