
export interface CoachInfo {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  coach_profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
}

export interface CoachTraineeRelationship {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  trainee_profile: {
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
  } | null;
}

// New type for multiple coaches
export interface MultipleCoachesInfo {
  coaches: CoachInfo[];
  totalUnreadMessages: number;
  unreadMessagesByCoach: Record<string, number>;
}
