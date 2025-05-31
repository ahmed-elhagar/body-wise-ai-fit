
import { 
  Scale, 
  Utensils, 
  Dumbbell, 
  Camera, 
  Target,
  Calendar
} from "lucide-react";

export const getQuickActionsData = (t: any, navigate: any) => [
  {
    icon: Scale,
    title: t('quickActions.logWeight'),
    description: t('quickActions.trackProgress'),
    color: "bg-health-primary",
    action: () => navigate('/weight-tracking')
  },
  {
    icon: Camera,
    title: t('quickActions.logFood'),
    description: t('quickActions.checkCalories'),
    color: "bg-health-accent",
    action: () => navigate('/calorie-checker')
  },
  {
    icon: Utensils,
    title: t('quickActions.mealPlan'),
    description: t('quickActions.viewWeeklyMeals'),
    color: "bg-health-secondary",
    action: () => navigate('/meal-plan')
  },
  {
    icon: Dumbbell,
    title: t('quickActions.workout'),
    description: t('quickActions.startExercising'),
    color: "bg-health-primary",
    action: () => navigate('/exercise')
  },
  {
    icon: Target,
    title: t('quickActions.updateGoals'),
    description: t('quickActions.modifyTargets'),
    color: "bg-health-accent",
    action: () => navigate('/profile')
  },
  {
    icon: Calendar,
    title: t('quickActions.schedule'),
    description: t('quickActions.planWeek'),
    color: "bg-health-secondary",
    action: () => navigate('/dashboard')
  }
];
