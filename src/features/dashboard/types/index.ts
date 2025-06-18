
// Dashboard types
export interface DashboardStats {
  currentWeight?: number;
  targetWeight?: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  workoutsCompleted: number;
  workoutsTarget: number;
  streak: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  isAvailable: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'meal' | 'workout' | 'weight' | 'goal';
  description: string;
  timestamp: string;
  icon: string;
}
