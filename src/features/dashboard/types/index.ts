
// Dashboard feature types
export interface DashboardStats {
  weight: number;
  bmi: number;
  fitnessGoal: string;
  activityLevel: string;
  weeklyProgress: number;
  caloriesConsumed: number;
  caloriesTarget: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}
