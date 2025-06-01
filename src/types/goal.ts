
export interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  category: string;
  deadline: string;
  created_at: string;
  user_id: string;
}

export interface CreateGoalData {
  title: string;
  description: string;
  target_value: number;
  category: string;
  deadline: string;
}
