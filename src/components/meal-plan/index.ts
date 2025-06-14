
// Compatibility re-exports - DO NOT USE in new code
// These files exist only for backward compatibility during migration
// Use @/features/meal-plan instead

console.warn('⚠️ Importing from @/components/meal-plan is deprecated. Use @/features/meal-plan instead.');

export { default as MealPlanContainer } from '@/features/meal-plan/components/MealPlanContainer';
export * from '@/features/meal-plan/components';
export * from '@/features/meal-plan/types';
