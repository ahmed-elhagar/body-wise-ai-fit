
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedProfile } from '@/features/profile/hooks/useOptimizedProfile';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface UseEnhancedAIChatOptions {
  systemPrompt?: string;
  maxMessages?: number;
  includeUserContext?: boolean;
}

export const useEnhancedAIChat = (options: UseEnhancedAIChatOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { profile } = useOptimizedProfile();

  const { 
    systemPrompt = "You are FitGenius AI, a knowledgeable and supportive fitness assistant.", 
    maxMessages = 100,
    includeUserContext = true
  } = options;

  const generateEnhancedSystemPrompt = useCallback(() => {
    if (!includeUserContext || !profile) {
      return systemPrompt;
    }

    const userContext = {
      name: profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'User',
      age: profile.age,
      gender: profile.gender,
      fitnessGoal: profile.fitness_goal,
      activityLevel: profile.activity_level,
      height: profile.height,
      weight: profile.weight,
      healthConditions: profile.health_conditions,
      dietaryRestrictions: profile.dietary_restrictions,
      allergies: profile.allergies,
      nationality: profile.nationality,
      specialConditions: profile.special_conditions,
      bodyShape: profile.body_shape,
      bodyFatPercentage: profile.body_fat_percentage
    };

    const contextualPrompt = `${systemPrompt}

USER PROFILE CONTEXT:
- Name: ${userContext.name}
${userContext.age ? `- Age: ${userContext.age} years old` : ''}
${userContext.gender ? `- Gender: ${userContext.gender}` : ''}
${userContext.fitnessGoal ? `- Primary Fitness Goal: ${userContext.fitnessGoal}` : ''}
${userContext.activityLevel ? `- Activity Level: ${userContext.activityLevel}` : ''}
${userContext.height ? `- Height: ${userContext.height} cm` : ''}
${userContext.weight ? `- Weight: ${userContext.weight} kg` : ''}
${userContext.bodyShape ? `- Body Shape: ${userContext.bodyShape}` : ''}
${userContext.bodyFatPercentage ? `- Body Fat: ${userContext.bodyFatPercentage}%` : ''}
${userContext.healthConditions?.length ? `- Health Conditions: ${userContext.healthConditions.join(', ')}` : ''}
${userContext.dietaryRestrictions?.length ? `- Dietary Restrictions: ${userContext.dietaryRestrictions.join(', ')}` : ''}
${userContext.allergies?.length ? `- Allergies: ${userContext.allergies.join(', ')}` : ''}
${userContext.nationality ? `- Nationality: ${userContext.nationality}` : ''}
${userContext.specialConditions ? `- Special Conditions: ${JSON.stringify(userContext.specialConditions)}` : ''}

IMPORTANT INSTRUCTIONS:
1. Always personalize responses using the user's name and profile information
2. Provide advice that's specifically tailored to their fitness goal, activity level, and any health conditions
3. Consider their dietary restrictions and allergies when suggesting nutrition advice
4. Be encouraging and supportive while being realistic about their goals
5. Reference their profile information naturally in conversations when relevant
6. If asked about their profile, provide accurate information from the context above
7. Always prioritize safety and recommend consulting healthcare professionals for medical concerns

Remember: You are ${userContext.name}'s personal AI fitness assistant with full knowledge of their profile and goals.`;

    return contextualPrompt;
  }, [systemPrompt, profile, includeUserContext]);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', isLoading = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      role,
      timestamp: new Date(),
      isLoading,
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      return updated.slice(-maxMessages);
    });

    return newMessage.id;
  }, [maxMessages]);

  const updateMessage = useCallback((messageId: string, content: string, isLoading = false) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isLoading }
        : msg
    ));
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    console.log('🤖 Enhanced AI Chat - User Profile Context:', profile);

    // Add user message
    addMessage(userMessage.trim(), 'user');
    
    // Add loading assistant message
    const assistantMessageId = addMessage('', 'assistant', true);
    setIsLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Generate enhanced system prompt with user context
      const enhancedSystemPrompt = generateEnhancedSystemPrompt();

      // Add system message and current user message
      const apiMessages = [
        { role: 'system', content: enhancedSystemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage.trim() }
      ];

      console.log('🤖 Enhanced AI Chat - Sending with user context:', { 
        userMessage, 
        historyLength: conversationHistory.length,
        hasUserProfile: !!profile,
        userGoal: profile?.fitness_goal,
        userName: profile?.first_name
      });

      const { data, error } = await supabase.functions.invoke('fitness-chat', {
        body: {
          messages: apiMessages,
          userProfile: profile,
          includeContext: includeUserContext
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data || !data.response) {
        throw new Error('No response received from AI');
      }

      // Update the loading message with the response
      updateMessage(assistantMessageId, data.response, false);
      
      console.log('✅ Enhanced AI response received with user context');

    } catch (error: any) {
      console.error('❌ Error in enhanced AI chat:', error);
      
      if (error.name === 'AbortError') {
        // Request was cancelled, remove the loading message
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      } else {
        // Update loading message with error
        updateMessage(
          assistantMessageId, 
          'Sorry, I encountered an error. Please try again.', 
          false
        );
        toast.error('Failed to get AI response. Please try again.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, addMessage, updateMessage, generateEnhancedSystemPrompt, profile, includeUserContext]);

  const regenerateLastMessage = useCallback(() => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages(prev => {
      const filtered = prev.filter(msg => 
        !(msg.role === 'assistant' && msg.timestamp > lastUserMessage.timestamp)
      );
      return filtered;
    });

    // Resend the last user message
    sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    regenerateLastMessage,
    clearConversation,
    cancelRequest,
    userProfile: profile,
    hasUserContext: includeUserContext && !!profile
  };
};
