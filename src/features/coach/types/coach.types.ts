// Coach Feature Type Definitions

export interface CoachInfo {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  specialization?: string;
  experience_years?: number;
  rating?: number;
  bio?: string;
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

export interface TraineeInfo {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  coach_id?: string;
  assigned_at?: string;
  fitness_goals?: string[];
  current_weight?: number;
  target_weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  dietary_preferences?: string[];
  medical_conditions?: string[];
  progress_score?: number;
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
  attachment_url?: string;
  is_read: boolean;
  thread_id?: string;
  reply_to?: string;
  created_at: string;
  updated_at: string;
  
  // Populated fields
  sender?: CoachInfo | TraineeInfo;
  receiver?: CoachInfo | TraineeInfo;
}

export interface CoachTask {
  id: string;
  coach_id: string;
  trainee_id?: string;
  title: string;
  description?: string;
  type: 'follow_up' | 'review_progress' | 'create_plan' | 'check_in' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Populated fields
  trainee?: TraineeInfo;
}

export interface CoachAnalytics {
  total_trainees: number;
  active_trainees: number;
  pending_tasks: number;
  completed_tasks_this_week: number;
  average_response_time: number; // in minutes
  trainee_satisfaction_rating: number;
  weekly_activity: {
    date: string;
    messages_sent: number;
    tasks_completed: number;
    new_trainees: number;
  }[];
  top_performing_trainees: {
    trainee_id: string;
    name: string;
    progress_score: number;
  }[];
}

export interface CoachStats {
  trainees_count: number;
  active_conversations: number;
  pending_tasks: number;
  completed_this_week: number;
  response_rate: number;
  satisfaction_score: number;
}

export interface ChatThread {
  id: string;
  coach_id: string;
  trainee_id: string;
  last_message?: CoachMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
  
  // Populated fields
  coach?: CoachInfo;
  trainee?: TraineeInfo;
}

export interface TraineeProgress {
  trainee_id: string;
  week_start: string;
  weight_change: number;
  workouts_completed: number;
  workouts_planned: number;
  meals_logged: number;
  meals_planned: number;
  progress_score: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Form types
export interface CreateTaskForm {
  trainee_id?: string;
  title: string;
  description?: string;
  type: CoachTask['type'];
  priority: CoachTask['priority'];
  due_date?: string;
}

export interface UpdateTaskForm extends Partial<CreateTaskForm> {
  status?: CoachTask['status'];
  notes?: string;
}

export interface AssignTraineeForm {
  trainee_id: string;
  notes?: string;
}

export interface SendMessageForm {
  receiver_id: string;
  message: string;
  message_type?: CoachMessage['message_type'];
  attachment_url?: string;
  thread_id?: string;
  reply_to?: string;
}

// Filter and search types
export interface TraineeFilters {
  search?: string;
  fitness_goals?: string[];
  activity_level?: TraineeInfo['activity_level'][];
  progress_score_min?: number;
  progress_score_max?: number;
  assigned_date_from?: string;
  assigned_date_to?: string;
  sort_by?: 'name' | 'assigned_at' | 'progress_score' | 'last_active';
  sort_order?: 'asc' | 'desc';
}

export interface TaskFilters {
  status?: CoachTask['status'][];
  priority?: CoachTask['priority'][];
  type?: CoachTask['type'][];
  trainee_id?: string;
  due_date_from?: string;
  due_date_to?: string;
  sort_by?: 'due_date' | 'created_at' | 'priority' | 'status';
  sort_order?: 'asc' | 'desc';
}

// API Response types
export interface CoachApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}

export interface CoachNotification {
  id: string;
  coach_id: string;
  type: 'new_message' | 'task_due' | 'trainee_milestone' | 'system_update';
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
} 