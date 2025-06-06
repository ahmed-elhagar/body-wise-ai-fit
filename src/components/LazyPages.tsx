
import { lazy } from 'react';

// Import all the page components lazily
const Index = lazy(() => import('@/pages/Index'));
const Landing = lazy(() => import('@/pages/Landing'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Profile = lazy(() => import('@/pages/Profile'));
const MealPlan = lazy(() => import('@/pages/MealPlan'));
const Exercise = lazy(() => import('@/pages/Exercise'));
const FoodTracker = lazy(() => import('@/pages/FoodTracker'));
const CalorieChecker = lazy(() => import('@/pages/CalorieChecker'));
const WeightTracking = lazy(() => import('@/pages/WeightTracking'));
const Goals = lazy(() => import('@/pages/Goals'));
const Progress = lazy(() => import('@/pages/Progress'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Chat = lazy(() => import('@/pages/Chat'));
const Pro = lazy(() => import('@/pages/Pro'));
const Admin = lazy(() => import('@/pages/Admin'));
const Coach = lazy(() => import('@/pages/Coach'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Export as a namespace object that App.tsx expects
export const LazyPages = {
  Index,
  Landing,
  Auth,
  Dashboard,
  Onboarding,
  Profile,
  MealPlan,
  Exercise,
  FoodTracker,
  CalorieChecker,
  WeightTracking,
  Goals,
  Progress,
  Analytics,
  Settings,
  Notifications,
  Chat,
  Pro,
  Admin,
  Coach,
  NotFound,
};

// Also export individual components for backward compatibility
export {
  Dashboard,
  MealPlan,
  Exercise,
  Progress,
  Analytics,
  Settings,
  Coach,
  Admin,
  Profile,
  Notifications,
  Chat,
};
