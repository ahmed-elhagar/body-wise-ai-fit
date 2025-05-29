
import { commonTranslations } from './ar/common';
import { navigationTranslations } from './ar/navigation';
import { dashboardTranslations } from './ar/dashboard';
import { exerciseTranslations } from './ar/exercise';
import { mealPlan } from './ar/mealPlan';

export const arTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...dashboardTranslations,
  ...exerciseTranslations,
  mealPlan: mealPlan,
  
  // Days of week
  saturday: "السبت",
  sunday: "الأحد", 
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  
  // Diet types
  balanced: "متوازن",
  vegetarian: "نباتي",
  keto: "كيتو",
  highProtein: "عالي البروتين",
};
