
import { lazy } from 'react';

// Lazy load pages for better performance
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Profile = lazy(() => import('@/pages/Profile'));
export const MealPlan = lazy(() => import('@/pages/MealPlan'));
export const Exercise = lazy(() => import('@/pages/Exercise'));
export const FoodTracker = lazy(() => import('@/pages/FoodTracker'));
export const Goals = lazy(() => import('@/pages/Goals'));
export const Settings = lazy(() => import('@/pages/Settings'));
export const Auth = lazy(() => import('@/pages/Auth'));
export const Signup = lazy(() => import('@/pages/Signup'));
export const Landing = lazy(() => import('@/pages/Landing'));
export const Index = lazy(() => import('@/pages/Index'));
export const UnifiedSignup = lazy(() => import('@/pages/Signup'));
export const Welcome = lazy(() => import('@/pages/Welcome'));
export const CalorieChecker = lazy(() => import('@/pages/CalorieChecker'));
export const WeightTracking = lazy(() => import('@/pages/WeightTracking'));
export const Progress = lazy(() => import('@/pages/Progress'));
export const Notifications = lazy(() => import('@/pages/Notifications'));
export const Chat = lazy(() => import('@/pages/Chat'));
export const Pro = lazy(() => import('@/pages/Pro'));
export const Admin = lazy(() => import('@/pages/Admin'));
export const Coach = lazy(() => import('@/pages/Coach'));
export const NotFound = lazy(() => import('@/pages/NotFound'));

// Export default for backward compatibility
export default {
  Dashboard,
  Profile,
  MealPlan,
  Exercise,
  FoodTracker,
  Goals,
  Settings,
  Auth,
  Signup,
  Landing,
  Index,
  UnifiedSignup,
  Welcome,
  CalorieChecker,
  WeightTracking,
  Progress,
  Notifications,
  Chat,
  Pro,
  Admin,
  Coach,
  NotFound
};
