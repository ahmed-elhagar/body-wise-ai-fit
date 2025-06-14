
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
  Landing
};
