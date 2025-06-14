
export interface CoachChatTypes {
  message: string;
  sender: string;
  timestamp: Date;
}

export interface CoachInfo {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  rating?: number;
  coach_profile?: {
    name: string;
    avatar_url?: string;
  };
}

export interface TraineeInfo {
  id: string;
  name: string;
  email: string;
  joined_at: string;
  last_active?: string;
}
