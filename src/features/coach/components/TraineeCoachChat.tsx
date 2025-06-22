
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useRealtimeChat } from "@/features/chat/hooks/useRealtimeChat";
import { useTypingIndicator } from "@/shared/hooks/useTypingIndicator";
import { useUserOnlineStatus } from "@/shared/hooks/useUserOnlineStatus";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";
import { useLiveNotifications } from "@/shared/hooks/useLiveNotifications";
import { toast } from "sonner";
import { MobileChatInterface } from "@/features/chat/components";
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
  const queryClient = useQueryClient();
  
  const traineeId = user?.id || '';
  
  // Initialize real-time features
  useOnlineStatus(); // Track current user's online status
  useLiveNotifications(); // Listen for live notifications
  
  // Fetch messages with correct typing
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['coach-trainee-messages', coachId, traineeId],
    queryFn: async (): Promise<CoachChatMessage[]> => {
      if (!coachId || !traineeId) return [];

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('*')
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      // Transform the data to match CoachChatMessage type
      return (data || []).map(msg => ({
        id: msg.id,
        message: msg.message,
        sender_type: msg.sender_type as 'coach' | 'trainee',
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        is_read: msg.is_read,
        sender_name: msg.sender_type === 'coach' ? coachName : 'You'
      }));
    },
    enabled: !!coachId && !!traineeId,
  });
  
  const { isConnected } = useRealtimeChat(coachId, traineeId);
  
  // Check coach's online status
  const { isUserOnline, getUserLastSeen } = useUserOnlineStatus([coachId]);
  const isCoachOnline = isUserOnline(coachId);
  const coachLastSeen = getUserLastSeen(coachId);
  
  const { 
    typingUsers, 
    sendTypingIndicator, 
    stopTypingIndicator 
  } = useTypingIndicator(coachId, traineeId);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!traineeId || !coachId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId,
          sender_id: traineeId,
          sender_type: 'trainee',
          message: messageText,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      setMessage("");
      setReplyingTo(null);
      stopTypingIndicator();
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, newContent }: { messageId: string; newContent: string }) => {
      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .update({ message: newContent, updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', traineeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      setEditingMessage(null);
      setMessage('');
      toast.success('Message updated');
    },
    onError: (error) => {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('coach_trainee_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', traineeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      toast.success('Message deleted');
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    const messageText = message.trim();
    sendMessageMutation.mutate(messageText);
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
      await editMessageMutation.mutateAsync({
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
      await deleteMessageMutation.mutateAsync(messageId);
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
        <MessagesList
          messages={messages}
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
          isSending={sendMessageMutation.isPending}
          isEditing={editMessageMutation.isPending}
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
