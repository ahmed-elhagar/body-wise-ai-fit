
export interface TraineeProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_completion_score?: number;
  ai_generations_remaining?: number;
  activity_level?: string;
  fitness_goal?: string;
}

export interface CoachTraineeRelationship {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  trainee_profile: TraineeProfile | null;
}

export interface CoachProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface CoachInfo {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  coach_profile: CoachProfile | null;
}

export interface MultipleCoachesInfo {
  coaches: CoachInfo[];
  totalUnreadMessages: number;
  unreadMessagesByCoach: Record<string, number>;
}

export interface CoachTask {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'follow-up' | 'planning' | 'admin';
  completed: boolean;
  dueDate?: Date;
  traineeId?: string;
  traineeName?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'follow-up' | 'planning' | 'admin';
  completed: boolean;
  dueDate?: Date;
  traineeId?: string;
  traineeName?: string;
}
