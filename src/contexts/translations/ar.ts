
import { commonTranslations } from './ar/common';
import { navigationTranslations } from './ar/navigation';
import { dashboardTranslations } from './ar/dashboard';
import { exercise } from './ar/exercise';
import { mealPlan } from './ar/mealPlan';
import { lifePhase } from './ar/lifePhase';

export const arTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...dashboardTranslations,
  exercise: exercise,
  mealPlan: mealPlan,
  
  // Life Phase Nutrition - add lifePhase to profile
  profile: {
    ...commonTranslations.profile,
    lifePhase: lifePhase
  },
  
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
