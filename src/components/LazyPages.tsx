
import { lazy } from 'react';

// Authentication & Public pages
export const Index = lazy(() => import('@/pages/Index'));
export const Landing = lazy(() => import('@/pages/Landing'));
export const Auth = lazy(() => import('@/pages/Auth'));
export const Signup = lazy(() => import('@/pages/Signup'));
export const Welcome = lazy(() => import('@/pages/Welcome'));

// Protected pages
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Profile = lazy(() => import('@/pages/Profile'));
export const MealPlan = lazy(() => import('@/pages/MealPlan'));
export const Exercise = lazy(() => import('@/pages/Exercise'));
export const FoodTracker = lazy(() => import('@/pages/FoodTracker'));
export const CalorieChecker = lazy(() => import('@/pages/CalorieChecker'));
export const WeightTracking = lazy(() => import('@/pages/WeightTracking'));
export const Goals = lazy(() => import('@/pages/Goals'));
export const Progress = lazy(() => import('@/pages/Progress'));
export const Settings = lazy(() => import('@/pages/Settings'));
export const Notifications = lazy(() => import('@/pages/Notifications'));
export const Chat = lazy(() => import('@/pages/Chat'));
export const Pro = lazy(() => import('@/pages/Pro'));

// Admin & Coach pages
export const Admin = lazy(() => import('@/pages/Admin'));
export const Coach = lazy(() => import('@/pages/Coach'));

// 404 page
export const NotFound = lazy(() => import('@/pages/NotFound'));

export const LazyPages = {
  Index,
  Landing,
  Auth,
  Signup,
  Welcome,
  Dashboard,
  Profile,
  MealPlan,
  Exercise,
  FoodTracker,
  CalorieChecker,
  WeightTracking,
  Goals,
  Progress,
  Settings,
  Notifications,
  Chat,
  Pro,
  Admin,
  Coach,
  NotFound,
};
