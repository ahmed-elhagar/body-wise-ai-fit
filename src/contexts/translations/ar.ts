
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
  
  // Days of week (global level for reuse)
  saturday: "السبت",
  sunday: "الأحد", 
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  
  // Diet types (global level for reuse)
  balanced: "متوازن",
  vegetarian: "نباتي",
  keto: "كيتو",
  highProtein: "عالي البروتين",
  
  // Global common terms
  minutes: "دقائق",
  cuisine: "المطبخ",
  mixed: "مختلط",
  all: "الكل",
  cancel: "إلغاء",
  apply: "تطبيق",
  reset: "إعادة تعيين",
  generating: "جاري التوليد...",
  
  // Auth related
  authRequired: "يرجى تسجيل الدخول للمتابعة",
  signInRequired: "يرجى تسجيل الدخول للوصول لهذه الميزة"
};
