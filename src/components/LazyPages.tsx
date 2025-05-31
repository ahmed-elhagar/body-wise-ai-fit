
import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MealPlan = lazy(() => import('@/pages/MealPlan'));
const Exercise = lazy(() => import('@/pages/Exercise'));
const Progress = lazy(() => import('@/pages/Progress'));
const Settings = lazy(() => import('@/pages/Settings'));
const Coach = lazy(() => import('@/pages/Coach'));
const Admin = lazy(() => import('@/pages/Admin'));
const Profile = lazy(() => import('@/pages/Profile'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Chat = lazy(() => import('@/pages/Chat'));

export {
  Dashboard,
  MealPlan,
  Exercise,
  Progress,
  Settings,
  Coach,
  Admin,
  Profile,
  Notifications,
  Chat,
};
