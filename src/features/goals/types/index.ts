
export interface Goal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value: number;
  target_unit?: string;
  target_date?: string;
  start_date: string;
  status: string;
  priority?: string;
  difficulty?: string;
  category: string;
  tags?: string[];
  notes?: string;
  milestones: any[];
  created_at: string;
  updated_at: string;
}

export interface GoalFormData {
  title: string;
  description: string;
  goalType: 'weight' | 'calories' | 'protein' | 'carbs' | 'fat';
  targetValue: number;
  targetUnit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: number;
}
