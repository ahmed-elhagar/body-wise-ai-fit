
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTypingIndicator = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);
  const chatRoomId = `chat-${coachId}-${traineeId}`;

  // Send typing indicator
  const sendTypingIndicator = async () => {
    if (!user?.id) return;

    try {
      // Insert or update typing indicator
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: user.id,
          chat_room_id: chatRoomId,
          is_typing: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,chat_room_id'
        });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        stopTypingIndicator();
      }, 3000);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  // Stop typing indicator
  const stopTypingIndicator = async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: user.id,
          chat_room_id: chatRoomId,
          is_typing: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,chat_room_id'
        });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping typing indicator:', error);
    }
  };

  useEffect(() => {
    if (!coachId || !traineeId || !user?.id) return;

    console.log('🔄 Setting up typing indicators subscription');

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`typing-indicators-${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          console.log('⌨️ Typing indicator update:', payload);
          
          const { new: newRecord, old: oldRecord, eventType } = payload;
          
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            
            if (eventType === 'INSERT' || eventType === 'UPDATE') {
              const record = newRecord as any;
              
              // Don't show own typing indicator
              if (record.user_id === user.id) return prev;
              
              if (record.is_typing) {
                newSet.add(record.user_id);
              } else {
                newSet.delete(record.user_id);
              }
            } else if (eventType === 'DELETE' && oldRecord) {
              const record = oldRecord as any;
              newSet.delete(record.user_id);
            }
            
            return newSet;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup old typing indicators on mount
    const cleanupOldIndicators = async () => {
      try {
        await supabase.rpc('cleanup_typing_indicators');
      } catch (error) {
        console.error('Error cleaning up typing indicators:', error);
      }
    };

    cleanupOldIndicators();

    return () => {
      console.log('🔌 Cleaning up typing indicators subscription');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      // Stop typing when component unmounts
      stopTypingIndicator();
    };
  }, [coachId, traineeId, user?.id, chatRoomId]);

  return {
    typingUsers: Array.from(typingUsers),
    sendTypingIndicator,
    stopTypingIndicator
  };
};
