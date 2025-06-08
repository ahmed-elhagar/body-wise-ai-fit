
import { commonTranslations } from './common';
import { dashboard } from './dashboard';
import { pro } from './pro';
import { foodTracker } from './foodTracker';
import { admin } from './admin';
import { navigationTranslations } from './navigation';
import { exercise } from './exercise';
import { profile } from './profile';
import { mealPlan } from './mealPlan';

export const arTranslations = {
  common: commonTranslations,
  dashboard,
  pro,
  foodTracker,
  admin,
  navigation: navigationTranslations,
  exercise,
  profile,
  mealPlan
} as const;
