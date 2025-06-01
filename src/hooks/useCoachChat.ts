
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

export const useCoachChat = () => {
  const [multipleCoachesInfo, setMultipleCoachesInfo] = useState<MultipleCoachesInfo>({
    totalCoaches: 0,
    activeCoaches: 0,
    coaches: []
  });
  const [coaches, setCoaches] = useState<CoachInfo[]>([]);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [unreadMessagesByCoach, setUnreadMessagesByCoach] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = (messageData: any) => {
    console.log('Sending message:', messageData);
    // Implementation here
  };

  const assignTrainee = (data: { traineeId: string; notes?: string }) => {
    console.log('Assigning trainee:', data);
    // Implementation here
  };

  return {
    multipleCoachesInfo,
    coaches,
    totalUnreadMessages,
    unreadMessagesByCoach,
    isLoading,
    error,
    sendMessage,
    assignTrainee,
    // Additional methods
    markMessageAsRead: (messageId: string) => {},
    getConversation: (coachId: string) => [],
    refreshData: () => {}
  };
};
