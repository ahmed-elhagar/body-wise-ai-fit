
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { ChatMessage } from './useCoachChat';

interface EditMessageParams {
  messageId: string;
  newContent: string;
}

export const useMessageActions = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, newContent }: EditMessageParams) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('coach_trainee_messages')
        .update({ 
          message: newContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id); // Only allow editing own messages

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
      setEditingMessage(null);
      toast.success('Message updated');
    },
    onError: (error) => {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('coach_trainee_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user.id); // Only allow deleting own messages

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
      toast.success('Message deleted');
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  });

  return {
    replyingTo,
    setReplyingTo,
    editingMessage,
    setEditingMessage,
    editMessage: editMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
    isEditing: editMessageMutation.isPending,
    isDeleting: deleteMessageMutation.isPending
  };
};
