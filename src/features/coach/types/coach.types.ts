
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
    activity_level?: string;
    fitness_goal?: string;
  };
}

export interface TraineeInfo {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

export interface CoachTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  type: 'review' | 'follow-up' | 'planning' | 'admin';
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
  coach_id: string;
  trainee_id?: string;
}

export interface CoachAnalytics {
  totalTrainees: number;
  activeTrainees: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  type: 'review' | 'follow-up' | 'planning' | 'admin';
  trainee_id?: string;
  due_date?: string;
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  due_date?: string;
}

export interface AssignTraineeForm {
  trainee_id: string;
  notes?: string;
}

export interface SendMessageForm {
  thread_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
}

export interface TraineeFilters {
  search?: string;
  activity_level?: string[];
}

export interface TaskFilters {
  status?: string[];
  priority?: string[];
  trainee_id?: string;
}

export interface CoachApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
