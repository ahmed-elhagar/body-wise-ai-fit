
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MealComment {
  id: string;
  meal_log_id: string;
  coach_id: string;
  trainee_id: string;
  body: string;
  created_at: string;
  coach_profile?: {
    first_name: string;
    last_name: string;
  };
  trainee_profile?: {
    first_name: string;
    last_name: string;
  };
}

export const useMealComments = (mealLogId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get comments for a specific meal log
  const { data: comments = [], isLoading, refetch } = useQuery({
    queryKey: ['meal-comments', mealLogId],
    queryFn: async () => {
      if (!mealLogId || !user?.id) return [];

      const { data, error } = await supabase
        .from('meal_comments')
        .select(`
          *,
          coach_profile:profiles!meal_comments_coach_id_fkey(first_name, last_name),
          trainee_profile:profiles!meal_comments_trainee_id_fkey(first_name, last_name)
        `)
        .eq('meal_log_id', mealLogId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching meal comments:', error);
        throw error;
      }

      return data as MealComment[];
    },
    enabled: !!mealLogId && !!user?.id,
  });

  // Get comment count for a meal log
  const getCommentCount = async (mealLogId: string): Promise<number> => {
    if (!mealLogId) return 0;

    const { count, error } = await supabase
      .from('meal_comments')
      .select('*', { count: 'exact', head: true })
      .eq('meal_log_id', mealLogId);

    if (error) {
      console.error('Error getting comment count:', error);
      return 0;
    }

    return count || 0;
  };

  // Add a new comment
  const addCommentMutation = useMutation({
    mutationFn: async ({ 
      mealLogId, 
      body, 
      traineeId, 
      coachId 
    }: { 
      mealLogId: string; 
      body: string; 
      traineeId: string;
      coachId?: string;
    }) => {
      // If no coachId provided, this is a trainee reply
      const isCoachComment = !!coachId;
      
      const { data, error } = await supabase
        .from('meal_comments')
        .insert({
          meal_log_id: mealLogId,
          body,
          coach_id: isCoachComment ? coachId : user?.id,
          trainee_id: traineeId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-comments'] });
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    },
  });

  // Delete a comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('meal_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-comments'] });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    },
  });

  // Set up real-time subscription
  const subscribeToComments = (mealLogId: string, callback: () => void) => {
    const channel = supabase
      .channel('meal-comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_comments',
          filter: `meal_log_id=eq.${mealLogId}`,
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    comments,
    isLoading,
    refetch,
    getCommentCount,
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    subscribeToComments,
  };
};
