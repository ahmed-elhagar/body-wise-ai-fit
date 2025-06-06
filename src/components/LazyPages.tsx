
import { lazy } from 'react';

export const LazyPages = {
  Landing: lazy(() => import('@/pages/Landing')),
  Auth: lazy(() => import('@/pages/Auth')),
  RegisterOnboarding: lazy(() => import('@/pages/RegisterOnboarding')),
  Onboarding: lazy(() => import('@/pages/Onboarding')),
  OnboardingSuccess: lazy(() => import('@/pages/OnboardingSuccess')),
  Dashboard: lazy(() => import('@/pages/Dashboard')),
  Settings: lazy(() => import('@/pages/Settings')),
  Profile: lazy(() => import('@/pages/Profile')),
  Exercise: lazy(() => import('@/pages/Exercise')),
  FoodTracker: lazy(() => import('@/pages/FoodTracker')),
  Chat: lazy(() => import('@/pages/Chat')),
  Admin: lazy(() => import('@/pages/Admin')),
  Coach: lazy(() => import('@/pages/Coach'))
};
