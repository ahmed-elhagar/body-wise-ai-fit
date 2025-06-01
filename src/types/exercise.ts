
export interface Exercise {
  id: string;
  daily_workout_id: string;
  name: string;
  sets?: number;
  reps?: string;
  muscle_groups?: string[];
  instructions?: string;
  youtube_search_term?: string;
  difficulty?: string;
  rest_seconds?: number;
  equipment?: string;
  notes?: string;
  actual_sets?: number;
  actual_reps?: string;
  completed?: boolean;
  order_number?: number;
  created_at?: string;
  updated_at?: string;
}
