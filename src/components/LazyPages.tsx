
import { lazy } from 'react';

// Main Pages
export const Landing = lazy(() => import('@/pages/Landing'));
export const Auth = lazy(() => import('@/pages/Auth'));
export const SignupFlow = lazy(() => import('@/pages/SignupFlow'));
export const OnboardingSuccess = lazy(() => import('@/pages/OnboardingSuccess'));

// Dashboard & Core Features
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const MealPlan = lazy(() => import('@/pages/MealPlan'));
export const Exercise = lazy(() => import('@/pages/Exercise'));
export const FoodTracker = lazy(() => import('@/pages/FoodTracker'));
export const CalorieChecker = lazy(() => import('@/pages/CalorieChecker'));

// Goals & Progress
export const Goals = lazy(() => import('@/pages/Goals'));
export const Progress = lazy(() => import('@/pages/Progress'));
export const WeightTracking = lazy(() => import('@/pages/WeightTracking'));

// User Management
export const Profile = lazy(() => import('@/pages/Profile'));
export const OptimizedProfile = lazy(() => import('@/pages/OptimizedProfile'));
export const Settings = lazy(() => import('@/pages/Settings'));

// Communication
export const Chat = lazy(() => import('@/pages/Chat'));
export const Notifications = lazy(() => import('@/pages/Notifications'));

// Admin & Management
export const Admin = lazy(() => import('@/pages/Admin'));
export const Coach = lazy(() => import('@/pages/Coach'));
export const Analytics = lazy(() => import('@/pages/Analytics'));
export const Pro = lazy(() => import('@/pages/Pro'));

// Utility
export const NotFound = lazy(() => import('@/pages/NotFound'));
