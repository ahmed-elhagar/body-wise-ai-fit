
// Admin/Coach feature types
export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'coach' | 'normal';
  created_at: string;
  last_seen?: string;
  is_online?: boolean;
}

export interface CoachTrainee {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  trainee?: AdminUser;
}

export interface CoachTask {
  id: string;
  coach_id: string;
  trainee_id?: string;
  title: string;
  description?: string;
  type: 'review' | 'follow_up' | 'assessment' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  coach_id: string;
  trainee_id: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  message: string;
  message_type: 'text' | 'file' | 'system';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCoaches: number;
  totalTrainees: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  aiGenerationsToday: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
  lastHealthCheck: string;
}

export interface AIGenerationLog {
  id: string;
  user_id: string;
  generation_type: string;
  status: 'success' | 'failed' | 'pending';
  credits_used: number;
  created_at: string;
  error_message?: string;
}
