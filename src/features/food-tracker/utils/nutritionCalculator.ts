
import type { FoodConsumptionLog, FoodTrackerNutritionSummary } from '../types';

export const nutritionCalculator = {
  calculateDailyNutrition(logs: FoodConsumptionLog[]): FoodTrackerNutritionSummary {
    return logs.reduce(
      (summary, log) => ({
        totalCalories: summary.totalCalories + (log.calories_consumed || 0),
        totalProtein: summary.totalProtein + (log.protein_consumed || 0),
        totalCarbs: summary.totalCarbs + (log.carbs_consumed || 0),
        totalFat: summary.totalFat + (log.fat_consumed || 0),
      }),
      { 
        totalCalories: 0, 
        totalProtein: 0, 
        totalCarbs: 0, 
        totalFat: 0 
      }
    );
  },

  calculateMacroPercentages(nutrition: FoodTrackerNutritionSummary) {
    const totalCalories = nutrition.totalCalories;
    if (totalCalories === 0) {
      return { proteinPercent: 0, carbsPercent: 0, fatPercent: 0 };
    }

    const proteinCalories = nutrition.totalProtein * 4;
    const carbsCalories = nutrition.totalCarbs * 4;
    const fatCalories = nutrition.totalFat * 9;

    return {
      proteinPercent: Math.round((proteinCalories / totalCalories) * 100),
      carbsPercent: Math.round((carbsCalories / totalCalories) * 100),
      fatPercent: Math.round((fatCalories / totalCalories) * 100),
    };
  },

  calculateFoodNutrition(
    caloriesPer100g: number,
    proteinPer100g: number,
    carbsPer100g: number,
    fatPer100g: number,
    quantityGrams: number
  ) {
    const multiplier = quantityGrams / 100;
    
    return {
      calories: Math.round(caloriesPer100g * multiplier),
      protein: Math.round(proteinPer100g * multiplier * 10) / 10,
      carbs: Math.round(carbsPer100g * multiplier * 10) / 10,
      fat: Math.round(fatPer100g * multiplier * 10) / 10,
    };
  },
};
