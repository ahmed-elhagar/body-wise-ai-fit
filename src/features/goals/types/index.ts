
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  goal_type: string;
  category: string;
  target_value?: number;
  current_value: number;
  target_unit?: string;
  target_date?: string;
  start_date: string;
  status: 'active' | 'completed' | 'paused';
  priority?: 'low' | 'medium' | 'high';
  difficulty?: 'easy' | 'medium' | 'hard';
  milestones: Milestone[];
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  target_value: number;
  completed: boolean;
  completed_at?: string;
}

export interface GoalProgress {
  goal_id: string;
  date: string;
  value: number;
  notes?: string;
}

export interface GoalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
