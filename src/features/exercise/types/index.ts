
// Exercise feature types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  equipment_needed: string[];
  instructions: string[];
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  exercises: Exercise[];
  completed: boolean;
  duration: number;
  notes?: string;
  created_at: string;
}
