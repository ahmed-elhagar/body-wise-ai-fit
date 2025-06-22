
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUserOnlineStatus } from "@/shared/hooks/useUserOnlineStatus";
import { useRealtimeChat } from "@/features/chat/hooks/useRealtimeChat";
import { useTypingIndicator } from "@/shared/hooks/useTypingIndicator";
import { useMessageActions } from "@/shared/hooks/useMessageActions";
import { toast } from "sonner";
import ChatHeader from "./chat/ChatHeader";
import MessagesList from "./chat/MessagesList";
import ChatInput from "./chat/ChatInput";
import type { CoachChatMessage } from "./types/chatTypes";

interface CoachTraineeChatProps {
  traineeId: string;
  traineeName: string;
  onBack: () => void;
}

export const CoachTraineeChat = ({ traineeId, traineeName, onBack }: CoachTraineeChatProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<CoachChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<CoachChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  
  const coachId = user?.id || '';

  // Real-time features
  const { isConnected } = useRealtimeChat(coachId, traineeId);
  const { isUserOnline, getUserLastSeen } = useUserOnlineStatus([traineeId]);
  const { 
    typingUsers, 
    sendTypingIndicator, 
    stopTypingIndicator 
  } = useTypingIndicator(coachId, traineeId);

  // Fetch messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['coach-trainee-messages', coachId, traineeId],
    queryFn: async () => {
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

      return data as CoachChatMessage[];
    },
    enabled: !!coachId && !!traineeId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!coachId || !traineeId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId,
          sender_id: coachId,
          sender_type: 'coach',
          message: messageText,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      queryClient.invalidateQueries({ queryKey: ['last-messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
      setNewMessage("");
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
        .eq('sender_id', coachId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      setEditingMessage(null);
      setNewMessage('');
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
        .eq('sender_id', coachId);

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(newMessage.trim());
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
    setNewMessage(value);
    
    if (value.trim()) {
      sendTypingIndicator();
    } else {
      stopTypingIndicator();
    }
  };

  const handleEditMessage = (msg: CoachChatMessage) => {
    setEditingMessage(msg);
    setNewMessage(msg.message);
    inputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !newMessage.trim()) return;
    
    editMessageMutation.mutate({
      messageId: editingMessage.id,
      newContent: newMessage.trim()
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0 && coachId) {
      const unreadMessages = messages.filter(
        msg => !msg.is_read && msg.sender_type === 'trainee' && msg.sender_id === traineeId
      );

      if (unreadMessages.length > 0) {
        supabase
          .from('coach_trainee_messages')
          .update({ is_read: true })
          .in('id', unreadMessages.map(msg => msg.id))
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
            queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
          });
      }
    }
  }, [messages, coachId, traineeId, queryClient]);

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-600 text-sm">{t('Loading conversation...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-600" />
          <p className="text-red-600 text-sm">{t('Error loading conversation')}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col bg-white shadow-lg rounded-xl">
      <ChatHeader
        coachName={traineeName}
        isCoachOnline={isUserOnline(traineeId)}
        coachLastSeen={getUserLastSeen(traineeId)}
        isConnected={isConnected}
        onBack={onBack}
      />
      
      <CardContent className="flex-1 flex flex-col p-0">
        <MessagesList
          messages={messages}
          currentUserId={coachId}
          coachName={traineeName}
          typingUsers={typingUsers}
          replyingTo={replyingTo}
          onReply={setReplyingTo}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          messagesEndRef={messagesEndRef}
        />
        
        <ChatInput
          message={newMessage}
          setMessage={setNewMessage}
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
