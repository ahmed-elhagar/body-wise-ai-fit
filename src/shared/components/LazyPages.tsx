
import { lazy } from 'react';

// Exercise Feature
export const ExercisePage = lazy(() => import('@/features/exercise/components/ExercisePage'));

// Meal Plan Feature
export const MealPlanPage = lazy(() => import('@/features/meal-plan/components/MealPlanPage'));

// Dashboard Feature
export const Dashboard = lazy(() => import('@/features/dashboard/components/Dashboard'));

// Profile Feature
export const ProfilePage = lazy(() => import('@/features/profile/components/ProfilePage'));

// Goals Feature
export const GoalsPage = lazy(() => import('@/features/goals/components/GoalsPage'));

// Progress Feature
export const ProgressPage = lazy(() => import('@/features/progress/components/ProgressPage'));

// Food Tracker Feature
export const FoodTrackerPage = lazy(() => import('@/features/food-tracker/components/FoodTrackerPage'));

// Chat Feature
export const ChatPage = lazy(() => import('@/features/chat/components/ChatPage'));

// Coach Feature
export const CoachPage = lazy(() => import('@/features/coach/components/CoachPage'));

// Admin Feature
export const AdminPage = lazy(() => import('@/features/admin/components/AdminPage'));

// Auth Feature
export const AuthPage = lazy(() => import('@/features/auth/components/AuthPage'));
export const OnboardingPage = lazy(() => import('@/features/auth/components/OnboardingPage'));

// Landing Feature
export const LandingPage = lazy(() => import('@/features/landing/components/LandingPage'));

// Pro Feature
export const ProPage = lazy(() => import('@/features/pro/components/ProPage'));

// Notifications Feature
export const NotificationsPage = lazy(() => import('@/features/notifications/components/NotificationsPage'));
