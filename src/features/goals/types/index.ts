
// Goals feature types - aligned with database schema
export interface Goal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value: number;
  category: string;
  difficulty: string;
  status: string;
  priority: string;
  start_date: string;
  target_date?: string;
  created_at: string;
  updated_at: string;
  milestones?: any[];
  tags?: string[];
  notes?: string;
}

export interface GoalProgress {
  date: string;
  value: number;
  notes?: string;
}
