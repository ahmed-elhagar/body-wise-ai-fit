
// Goals feature types
export interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  category: 'weight' | 'exercise' | 'nutrition' | 'habit';
  deadline: string;
  completed: boolean;
  progress_percentage: number;
}

export interface GoalProgress {
  date: string;
  value: number;
  notes?: string;
}
