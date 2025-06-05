
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useMessageActions } from "@/hooks/useMessageActions";
import { toast } from "sonner";
import ChatHeader from "./chat/ChatHeader";
import MessagesList from "./chat/MessagesList";
import ChatInput from "./chat/ChatInput";

interface CoachTraineeChatProps {
  traineeId: string;
  traineeName: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'coach' | 'trainee';
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

export const CoachTraineeChat = ({ traineeId, traineeName, onBack }: CoachTraineeChatProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
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
  
  const {
    replyingTo,
    setReplyingTo,
    editingMessage,
    setEditingMessage,
    editMessage,
    deleteMessage,
    isEditing
  } = useMessageActions(coachId, traineeId);

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

      return data as ChatMessage[];
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

  const handleEditMessage = (msg: ChatMessage) => {
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
    
    try {
      await editMessage({
        messageId: editingMessage.id,
        newContent: newMessage.trim()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
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
          onDelete={deleteMessage}
          messagesEndRef={messagesEndRef}
        />
        
        <ChatInput
          message={newMessage}
          setMessage={setNewMessage}
          isSending={sendMessageMutation.isPending}
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
