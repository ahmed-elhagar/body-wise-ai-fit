
import { lazy } from 'react';

// Lazy load pages for better performance - only existing components
export const Dashboard = lazy(() => import('@/features/dashboard/components/Dashboard'));
export const Profile = lazy(() => import('@/features/profile/components/ProfessionalProfile'));
export const MealPlan = lazy(() => import('@/features/meal-plan/components/MealPlanContainer'));
export const Exercise = lazy(() => import('@/features/exercise/components/ExerciseContainer'));
export const FoodTracker = lazy(() => import('@/features/food-tracker/components/FoodTracker'));
export const Goals = lazy(() => import('@/features/goals/components/GoalsPage'));
export const Auth = lazy(() => import('@/features/auth/components/ProfessionalAuth'));
export const Landing = lazy(() => import('@/features/landing/components/LandingPage'));
export const Index = lazy(() => import('@/shared/components/IndexPage'));
export const Chat = lazy(() => import('@/features/chat/components/ChatPage'));
export const Progress = lazy(() => import('@/features/progress/components/ModernProgressTracker'));
export const NotFound = lazy(() => import('@/shared/components/NotFoundPage'));

// Missing components - need to be created or fixed
export const UnifiedSignup = lazy(() => import('@/features/auth/components/signup/UnifiedSignup'));
export const Onboarding = lazy(() => import('@/features/auth/components/onboarding/OnboardingContainer'));
export const Welcome = lazy(() => import('@/shared/components/WelcomePage'));
export const CalorieChecker = lazy(() => import('@/features/food-tracker/components/CalorieChecker'));
export const WeightTracking = lazy(() => import('@/features/progress/components/WeightTracking'));
export const Settings = lazy(() => import('@/features/profile/components/SettingsPage'));
export const Notifications = lazy(() => import('@/features/notifications/components/NotificationsPage'));
export const Pro = lazy(() => import('@/features/pro/components/ProPage'));
export const Admin = lazy(() => import('@/features/admin/components/AdminPage'));
export const Coach = lazy(() => import('@/features/coach/components/CoachPage'));

// Simplified export for backward compatibility
export default {
  Dashboard,
  Profile,
  MealPlan,
  Exercise,
  FoodTracker,
  Goals,
  Auth,
  Landing,
  Index,
  Chat,
  Progress,
  NotFound,
  UnifiedSignup,
  Onboarding,
  Welcome,
  CalorieChecker,
  WeightTracking,
  Settings,
  Notifications,
  Pro,
  Admin,
  Coach
};
