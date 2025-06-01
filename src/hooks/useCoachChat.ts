
import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  content?: string;
  message?: string; // Alternative property name
  sender: "user" | "ai" | "coach" | "trainee";
  sender_id?: string;
  sender_name?: string;
  sender_type?: string;
  receiver_id?: string;
  timestamp: Date;
  created_at?: string;
  updated_at?: string;
  is_read?: boolean;
  message_text?: string;
  message_type?: string;
}

export interface CoachInfo {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_completion_score?: number;
  ai_generations_remaining?: number;
  age?: number;
  weight?: number;
  height?: number;
  fitness_goal?: string;
  gender?: string;
  phone_number?: string;
  address?: string;
  updated_at?: string;
  last_login?: string;
}

export interface MultipleCoachesInfo {
  totalCoaches: number;
  activeCoaches: number;
  coaches: CoachInfo[];
}

export const useCoachChat = (coachId?: string, traineeId?: string) => {
  const [multipleCoachesInfo, setMultipleCoachesInfo] = useState<MultipleCoachesInfo>({
    totalCoaches: 0,
    activeCoaches: 0,
    coaches: []
  });
  const [coaches, setCoaches] = useState<CoachInfo[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [unreadMessagesByCoach, setUnreadMessagesByCoach] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = (messageData: { message: string }) => {
    console.log('Sending message:', messageData.message, 'between coach:', coachId, 'and trainee:', traineeId);
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
    }, 1000);
  };

  const assignTrainee = (data: { traineeId: string; notes?: string }) => {
    console.log('Assigning trainee:', data);
    // Implementation here
  };

  return {
    multipleCoachesInfo,
    coaches,
    messages,
    totalUnreadMessages,
    unreadMessagesByCoach,
    isLoading,
    isSending,
    error,
    sendMessage,
    assignTrainee,
    // Additional methods
    markMessageAsRead: (messageId: string) => {},
    getConversation: (coachId: string) => [],
    refreshData: () => {}
  };
};
