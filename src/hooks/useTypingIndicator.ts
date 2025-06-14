
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTypingIndicator = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);
  const chatRoomId = `chat-${coachId}-${traineeId}`;
  const lastTypingSentRef = useRef<number>(0);
  const isTypingRef = useRef(false);

  // Throttled typing indicator to prevent spam
  const sendTypingIndicator = useCallback(async () => {
    if (!user?.id) return;

    const now = Date.now();
    // Throttle typing indicators to max once per 2 seconds
    if (now - lastTypingSentRef.current < 2000 && isTypingRef.current) {
      return;
    }

    try {
      console.log('⌨️ Sending typing indicator');
      
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

      lastTypingSentRef.current = now;
      isTypingRef.current = true;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        stopTypingIndicator();
      }, 4000); // Stop after 4 seconds of inactivity

    } catch (error) {
      console.error('❌ Error sending typing indicator:', error);
    }
  }, [user?.id, chatRoomId]);

  // Stop typing indicator
  const stopTypingIndicator = useCallback(async () => {
    if (!user?.id || !isTypingRef.current) return;

    try {
      console.log('⌨️ Stopping typing indicator');
      
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

      isTypingRef.current = false;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('❌ Error stopping typing indicator:', error);
    }
  }, [user?.id, chatRoomId]);

  useEffect(() => {
    if (!coachId || !traineeId || !user?.id) return;

    console.log('🔄 Setting up enhanced typing indicators subscription for:', chatRoomId);

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`typing-indicators-${chatRoomId}-${Date.now()}`)
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
                console.log(`👤 ${record.user_id} is typing`);
              } else {
                newSet.delete(record.user_id);
                console.log(`👤 ${record.user_id} stopped typing`);
              }
            } else if (eventType === 'DELETE' && oldRecord) {
              const record = oldRecord as any;
              newSet.delete(record.user_id);
              console.log(`👤 ${record.user_id} typing indicator deleted`);
            }
            
            return newSet;
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Typing indicators subscription status:', status);
      });

    channelRef.current = channel;

    // Cleanup old typing indicators on mount
    const cleanupOldIndicators = async () => {
      try {
        await supabase.rpc('cleanup_typing_indicators');
        console.log('🧹 Cleaned up old typing indicators');
      } catch (error) {
        console.error('❌ Error cleaning up typing indicators:', error);
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
  }, [coachId, traineeId, user?.id, chatRoomId, stopTypingIndicator]);

  return {
    typingUsers: Array.from(typingUsers),
    sendTypingIndicator,
    stopTypingIndicator,
    isTyping: isTypingRef.current
  };
};
