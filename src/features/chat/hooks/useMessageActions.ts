
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMessageActions = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('coach_trainee_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  });

  const editMessage = useMutation({
    mutationFn: async ({ messageId, newContent }: { messageId: string; newContent: string }) => {
      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .update({ 
          message: newContent, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      toast.success('Message updated successfully');
    },
    onError: (error) => {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('coach_trainee_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
    },
    onError: (error) => {
      console.error('Error marking message as read:', error);
    }
  });

  return {
    deleteMessage: deleteMessage.mutate,
    editMessage: editMessage.mutate,
    markAsRead: markAsRead.mutate,
    isDeleting: deleteMessage.isPending,
    isEditing: editMessage.isPending,
    isMarkingAsRead: markAsRead.isPending
  };
};
