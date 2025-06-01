
export interface Goal {
  id: string;
  user_id: string;
  goal_type: string;
  category: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value: number;
  target_unit?: string;
  start_date: string;
  target_date?: string;
  status: string;
  priority?: string;
  difficulty?: string;
  tags?: string[];
  notes?: string;
  milestones?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalData {
  goal_type: string;
  category: string;
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  target_date?: string;
  priority?: string;
  difficulty?: string;
  tags?: string[];
  notes?: string;
}
