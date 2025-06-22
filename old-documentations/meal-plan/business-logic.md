
# Meal Plan Business Logic

Core business logic and calculations for meal planning functionality in React Native/Expo implementation.

## 🧮 Nutrition Calculations

### 1. BMR & TDEE Calculation Engine
```typescript
interface UserMetrics {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  activity_level: ActivityLevel;
  fitness_goal: FitnessGoal;
}

type ActivityLevel = 
  | 'sedentary' 
  | 'lightly_active' 
  | 'moderately_active' 
  | 'very_active' 
  | 'extremely_active';

type FitnessGoal = 
  | 'weight_loss' 
  | 'weight_gain' 
  | 'muscle_gain' 
  | 'maintenance' 
  | 'general_fitness';

class NutritionCalculator {
  static calculateBMR(metrics: UserMetrics): number {
    const { age, weight, height, gender } = metrics;
    
    // Harris-Benedict Revised Equation
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }
  
  static calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multipliers = {
      'sedentary': 1.2,           // Desk job, no exercise
      'lightly_active': 1.375,    // Light exercise 1-3 days/week
      'moderately_active': 1.55,  // Moderate exercise 3-5 days/week
      'very_active': 1.725,       // Heavy exercise 6-7 days/week
      'extremely_active': 1.9     // Very heavy exercise, physical job
    };
    
    return bmr * multipliers[activityLevel];
  }
  
  static calculateDailyCalories(metrics: UserMetrics): number {
    const bmr = this.calculateBMR(metrics);
    const tdee = this.calculateTDEE(bmr, metrics.activity_level);
    
    // Goal-based calorie adjustments
    const goalAdjustments = {
      'weight_loss': -500,      // 1 lb/week loss
      'weight_gain': 500,       // 1 lb/week gain
      'muscle_gain': 300,       // Lean muscle gain
      'maintenance': 0,         // No change
      'general_fitness': -200   // Slight deficit for body composition
    };
    
    return Math.round(tdee + goalAdjustments[metrics.fitness_goal]);
  }
  
  static calculateMacroDistribution(totalCalories: number, goal: FitnessGoal): MacroDistribution {
    const distributions = {
      'weight_loss': { protein: 0.30, carbs: 0.35, fat: 0.35 },
      'weight_gain': { protein: 0.25, carbs: 0.45, fat: 0.30 },
      'muscle_gain': { protein: 0.35, carbs: 0.40, fat: 0.25 },
      'maintenance': { protein: 0.25, carbs: 0.45, fat: 0.30 },
      'general_fitness': { protein: 0.30, carbs: 0.40, fat: 0.30 }
    };
    
    const dist = distributions[goal];
    
    return {
      protein: Math.round((totalCalories * dist.protein) / 4), // 4 cal/g
      carbs: Math.round((totalCalories * dist.carbs) / 4),     // 4 cal/g
      fat: Math.round((totalCalories * dist.fat) / 9)          // 9 cal/g
    };
  }
}

interface MacroDistribution {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
}
```

### 2. Life-Phase Nutrition Adjustments
```typescript
interface LifePhaseAdjustments {
  extraCalories: number;
  macroModifications: Partial<MacroDistribution>;
  specialRequirements: string[];
  restrictions: string[];
}

class LifePhaseCalculator {
  static getPregnancyAdjustments(trimester: number): LifePhaseAdjustments {
    const adjustments = {
      1: {
        extraCalories: 0,
        macroModifications: { protein: 10 }, // +10g protein
        specialRequirements: ['folate', 'iron', 'calcium'],
        restrictions: ['raw_fish', 'alcohol', 'high_mercury_fish']
      },
      2: {
        extraCalories: 340,
        macroModifications: { protein: 25, calcium: 200 },
        specialRequirements: ['folate', 'iron', 'calcium', 'omega3'],
        restrictions: ['raw_fish', 'alcohol', 'high_mercury_fish', 'excess_caffeine']
      },
      3: {
        extraCalories: 450,
        macroModifications: { protein: 25, calcium: 200, omega3: 200 },
        specialRequirements: ['protein', 'calcium', 'iron', 'dha'],
        restrictions: ['raw_fish', 'alcohol', 'high_mercury_fish']
      }
    };
    
    return adjustments[trimester] || adjustments[2];
  }
  
  static getBreastfeedingAdjustments(level: 'exclusive' | 'partial'): LifePhaseAdjustments {
    const adjustments = {
      exclusive: {
        extraCalories: 400,
        macroModifications: { protein: 20, calcium: 200 },
        specialRequirements: ['protein', 'calcium', 'omega3', 'vitamin_d'],
        restrictions: ['alcohol', 'excess_caffeine']
      },
      partial: {
        extraCalories: 250,
        macroModifications: { protein: 15, calcium: 150 },
        specialRequirements: ['protein', 'calcium', 'omega3'],
        restrictions: ['alcohol']
      }
    };
    
    return adjustments[level];
  }
  
  static getFastingAdjustments(fastingType: string): LifePhaseAdjustments {
    if (fastingType === 'ramadan' || fastingType === 'islamic') {
      return {
        extraCalories: 0,
        macroModifications: {},
        specialRequirements: ['hydration', 'slow_digesting_carbs', 'dates'],
        restrictions: ['daytime_eating'],
        mealTiming: {
          iftar: ['dates', 'water', 'soup', 'light_protein'],
          suhoor: ['complex_carbs', 'protein', 'healthy_fats', 'hydrating_foods']
        }
      };
    }
    
    return {
      extraCalories: 0,
      macroModifications: {},
      specialRequirements: [],
      restrictions: []
    };
  }
}
```

## 🍽️ Meal Distribution Logic

### 1. Calorie Distribution Across Meals
```typescript
interface MealDistribution {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack1?: number;
  snack2?: number;
}

class MealDistributionCalculator {
  static calculateMealCalories(
    totalCalories: number, 
    includeSnacks: boolean,
    userPreferences?: any
  ): MealDistribution {
    
    if (includeSnacks) {
      // 5-meal distribution
      return {
        breakfast: Math.round(totalCalories * 0.25), // 25%
        snack1: Math.round(totalCalories * 0.10),    // 10%
        lunch: Math.round(totalCalories * 0.30),     // 30%
        snack2: Math.round(totalCalories * 0.10),    // 10%
        dinner: Math.round(totalCalories * 0.25)     // 25%
      };
    } else {
      // 3-meal distribution
      return {
        breakfast: Math.round(totalCalories * 0.25), // 25%
        lunch: Math.round(totalCalories * 0.40),     // 40%
        dinner: Math.round(totalCalories * 0.35)     // 35%
      };
    }
  }
  
  static adjustForCulturalPreferences(
    distribution: MealDistribution,
    nationality: string
  ): MealDistribution {
    
    // Middle Eastern preference for larger lunch
    if (nationality?.includes('Saudi') || nationality?.includes('Arab')) {
      return {
        ...distribution,
        breakfast: Math.round(distribution.breakfast * 0.9),
        lunch: Math.round(distribution.lunch * 1.2),
        dinner: Math.round(distribution.dinner * 0.9)
      };
    }
    
    // Mediterranean preference for moderate portions
    if (['Italian', 'Greek', 'Spanish'].some(c => nationality?.includes(c))) {
      return {
        ...distribution,
        breakfast: Math.round(distribution.breakfast * 1.1),
        lunch: Math.round(distribution.lunch * 1.1),
        dinner: Math.round(distribution.dinner * 0.8)
      };
    }
    
    return distribution;
  }
}
```

### 2. Weekly Meal Planning Logic
```typescript
interface WeekPlanningConstraints {
  maxPrepTimePerMeal: number;
  cuisinePreferences: string[];
  varietyRequirement: number; // 1-10 scale
  budgetConstraint?: 'low' | 'medium' | 'high';
  cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
}

class WeeklyPlanLogic {
  static distributeVariety(meals: any[], constraints: WeekPlanningConstraints): any[] {
    const { varietyRequirement } = constraints;
    
    // Ensure no meal repeats within variety window
    const varietyWindow = Math.max(2, Math.floor(varietyRequirement * 1.5));
    const distributedMeals = [];
    const recentMeals = new Set();
    
    for (let day = 1; day <= 7; day++) {
      const dayMeals = this.selectDayMeals(meals, recentMeals, constraints);
      distributedMeals.push({ day, meals: dayMeals });
      
      // Update recent meals tracker
      dayMeals.forEach((meal: any) => {
        recentMeals.add(meal.name);
        if (recentMeals.size > varietyWindow) {
          const oldestMeal = Array.from(recentMeals)[0];
          recentMeals.delete(oldestMeal);
        }
      });
    }
    
    return distributedMeals;
  }
  
  static selectDayMeals(
    availableMeals: any[], 
    recentMeals: Set<string>, 
    constraints: WeekPlanningConstraints
  ): any[] {
    const { maxPrepTimePerMeal, cookingSkillLevel } = constraints;
    
    // Filter meals by constraints
    const validMeals = availableMeals.filter(meal => 
      !recentMeals.has(meal.name) &&
      meal.prep_time <= maxPrepTimePerMeal &&
      this.matchesSkillLevel(meal.difficulty, cookingSkillLevel)
    );
    
    // Select balanced meals for the day
    return [
      this.selectMealByType(validMeals, 'breakfast'),
      this.selectMealByType(validMeals, 'lunch'),
      this.selectMealByType(validMeals, 'dinner')
    ].filter(Boolean);
  }
  
  static matchesSkillLevel(mealDifficulty: string, userSkill: string): boolean {
    const difficultyLevels = {
      'beginner': ['easy', 'simple'],
      'intermediate': ['easy', 'simple', 'medium'],
      'advanced': ['easy', 'simple', 'medium', 'hard', 'complex']
    };
    
    return difficultyLevels[userSkill]?.includes(mealDifficulty) || false;
  }
}
```

## 🌍 Cultural Food Logic

### 1. Cultural Cuisine Selection
```typescript
interface CulturalFoodProfile {
  stapleIngredients: string[];
  commonSpices: string[];
  cookingMethods: string[];
  mealStructure: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  dietaryConsiderations: string[];
  seasonalPreferences?: { [season: string]: string[] };
}

class CulturalCuisineEngine {
  private static cuisineProfiles: { [key: string]: CulturalFoodProfile } = {
    'Saudi Arabia': {
      stapleIngredients: ['rice', 'dates', 'lamb', 'chicken', 'yogurt', 'lentils'],
      commonSpices: ['cardamom', 'cinnamon', 'black_lime', 'baharat', 'saffron'],
      cookingMethods: ['grilled', 'slow_cooked', 'steamed', 'baked'],
      mealStructure: {
        breakfast: ['ful', 'shakshuka', 'cheese_olives', 'dates'],
        lunch: ['kabsa', 'mandi', 'machboos', 'biryani'],
        dinner: ['grilled_meats', 'stews', 'salads', 'rice_dishes'],
        snacks: ['dates', 'nuts', 'fruits', 'arabic_coffee']
      },
      dietaryConsiderations: ['halal', 'no_pork', 'no_alcohol'],
      seasonalPreferences: {
        summer: ['cold_soups', 'salads', 'light_grains'],
        winter: ['stews', 'hot_soups', 'warm_spices']
      }
    },
    
    'Egypt': {
      stapleIngredients: ['rice', 'bread', 'lentils', 'beans', 'vegetables', 'fish'],
      commonSpices: ['cumin', 'coriander', 'garlic', 'onion', 'parsley'],
      cookingMethods: ['stewed', 'fried', 'baked', 'grilled'],
      mealStructure: {
        breakfast: ['ful', 'fatteh', 'cheese', 'bread'],
        lunch: ['koshari', 'molokhia', 'stuffed_vegetables'],
        dinner: ['grilled_fish', 'stews', 'rice', 'vegetables'],
        snacks: ['fruits', 'nuts', 'tea']
      },
      dietaryConsiderations: ['halal', 'mediterranean']
    }
  };
  
  static getCuisineProfile(nationality: string): CulturalFoodProfile {
    // Find exact match or closest cultural region
    for (const [country, profile] of Object.entries(this.cuisineProfiles)) {
      if (nationality?.includes(country) || country.includes(nationality)) {
        return profile;
      }
    }
    
    // Default to general profile
    return this.getGeneralProfile();
  }
  
  static filterMealsByCulture(meals: any[], nationality: string): any[] {
    const profile = this.getCuisineProfile(nationality);
    
    return meals.filter(meal => {
      // Check if meal ingredients align with cultural profile
      const hasStapleIngredients = meal.ingredients.some((ingredient: string) =>
        profile.stapleIngredients.includes(ingredient.toLowerCase())
      );
      
      // Check dietary considerations
      const meetsDietaryRequirements = profile.dietaryConsiderations.every(req => {
        if (req === 'halal') return !meal.ingredients.includes('pork');
        if (req === 'no_alcohol') return !meal.name.toLowerCase().includes('wine');
        return true;
      });
      
      return hasStapleIngredients && meetsDietaryRequirements;
    });
  }
  
  static suggestCulturalAlternatives(
    originalMeal: any, 
    nationality: string
  ): string[] {
    const profile = this.getCuisineProfile(nationality);
    const mealType = originalMeal.meal_type;
    
    return profile.mealStructure[mealType] || [];
  }
}
```

### 2. Dietary Restrictions Engine
```typescript
interface DietaryRestriction {
  name: string;
  forbiddenIngredients: string[];
  forbiddenMethods: string[];
  requiredSubstitutions: { [key: string]: string };
  nutritionalConsiderations: string[];
}

class DietaryRestrictionsEngine {
  private static restrictions: { [key: string]: DietaryRestriction } = {
    'vegetarian': {
      name: 'Vegetarian',
      forbiddenIngredients: ['meat', 'poultry', 'fish', 'seafood'],
      forbiddenMethods: [],
      requiredSubstitutions: {
        'chicken': 'tofu',
        'beef': 'beans',
        'fish': 'tempeh'
      },
      nutritionalConsiderations: ['protein', 'iron', 'b12', 'omega3']
    },
    
    'vegan': {
      name: 'Vegan',
      forbiddenIngredients: ['meat', 'poultry', 'fish', 'dairy', 'eggs', 'honey'],
      forbiddenMethods: [],
      requiredSubstitutions: {
        'milk': 'plant_milk',
        'cheese': 'nutritional_yeast',
        'eggs': 'flax_eggs'
      },
      nutritionalConsiderations: ['protein', 'iron', 'b12', 'calcium', 'omega3']
    },
    
    'halal': {
      name: 'Halal',
      forbiddenIngredients: ['pork', 'alcohol', 'non_halal_meat'],
      forbiddenMethods: ['alcohol_cooking'],
      requiredSubstitutions: {
        'pork': 'halal_beef',
        'wine': 'grape_juice'
      },
      nutritionalConsiderations: []
    },
    
    'keto': {
      name: 'Ketogenic',
      forbiddenIngredients: ['sugar', 'grains', 'high_carb_fruits', 'legumes'],
      forbiddenMethods: ['breading', 'sweet_sauces'],
      requiredSubstitutions: {
        'rice': 'cauliflower_rice',
        'pasta': 'zucchini_noodles',
        'bread': 'almond_flour_bread'
      },
      nutritionalConsiderations: ['very_low_carb', 'high_fat', 'moderate_protein']
    }
  };
  
  static validateMealAgainstRestrictions(
    meal: any, 
    userRestrictions: string[]
  ): { valid: boolean; violations: string[]; suggestions: string[] } {
    const violations: string[] = [];
    const suggestions: string[] = [];
    
    for (const restrictionName of userRestrictions) {
      const restriction = this.restrictions[restrictionName];
      if (!restriction) continue;
      
      // Check ingredients
      for (const ingredient of meal.ingredients) {
        if (restriction.forbiddenIngredients.some(forbidden => 
          ingredient.toLowerCase().includes(forbidden)
        )) {
          violations.push(`${ingredient} not allowed for ${restriction.name}`);
          
          // Suggest substitution
          const substitution = restriction.requiredSubstitutions[ingredient.toLowerCase()];
          if (substitution) {
            suggestions.push(`Replace ${ingredient} with ${substitution}`);
          }
        }
      }
    }
    
    return {
      valid: violations.length === 0,
      violations,
      suggestions
    };
  }
  
  static adaptMealForRestrictions(
    meal: any, 
    userRestrictions: string[]
  ): any {
    let adaptedMeal = { ...meal };
    
    for (const restrictionName of userRestrictions) {
      const restriction = this.restrictions[restrictionName];
      if (!restriction) continue;
      
      // Apply substitutions
      adaptedMeal.ingredients = adaptedMeal.ingredients.map((ingredient: string) => {
        const substitution = restriction.requiredSubstitutions[ingredient.toLowerCase()];
        return substitution || ingredient;
      });
      
      // Adjust nutrition for keto
      if (restrictionName === 'keto') {
        adaptedMeal.carbs = Math.min(adaptedMeal.carbs, 10); // Max 10g carbs
        adaptedMeal.fat = Math.max(adaptedMeal.fat, adaptedMeal.calories * 0.7 / 9);
      }
    }
    
    return adaptedMeal;
  }
}
```

## 📱 React Native Business Logic Integration

### 1. Meal Plan Service Class
```typescript
class MealPlanService {
  private nutritionCalculator = new NutritionCalculator();
  private culturalEngine = new CulturalCuisineEngine();
  private restrictionsEngine = new DietaryRestrictionsEngine();
  
  async generatePersonalizedMealPlan(
    userProfile: UserProfile,
    preferences: MealPlanPreferences
  ): Promise<WeeklyMealPlan> {
    
    // Step 1: Calculate nutrition requirements
    const dailyCalories = NutritionCalculator.calculateDailyCalories(userProfile);
    const macros = NutritionCalculator.calculateMacroDistribution(
      dailyCalories, 
      userProfile.fitness_goal
    );
    
    // Step 2: Apply life-phase adjustments
    let adjustedCalories = dailyCalories;
    if (userProfile.pregnancy_trimester) {
      const adjustments = LifePhaseCalculator.getPregnancyAdjustments(
        userProfile.pregnancy_trimester
      );
      adjustedCalories += adjustments.extraCalories;
    }
    
    // Step 3: Distribute calories across meals
    const mealDistribution = MealDistributionCalculator.calculateMealCalories(
      adjustedCalories,
      preferences.includeSnacks
    );
    
    // Step 4: Generate culturally appropriate meals
    try {
      const aiResponse = await this.callAIMealGeneration(userProfile, preferences);
      return this.processMealPlanResponse(aiResponse, mealDistribution);
    } catch (error) {
      // Fallback to rule-based generation
      return this.generateFallbackMealPlan(userProfile, mealDistribution);
    }
  }
  
  validateMealPlan(mealPlan: WeeklyMealPlan, userProfile: UserProfile): ValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Validate nutrition totals
    const totalCalories = mealPlan.dailyMeals.reduce(
      (sum, meal) => sum + meal.calories, 0
    );
    
    const expectedCalories = NutritionCalculator.calculateDailyCalories(userProfile) * 7;
    const calorieVariance = Math.abs(totalCalories - expectedCalories) / expectedCalories;
    
    if (calorieVariance > 0.1) { // More than 10% variance
      issues.push(`Calorie total (${totalCalories}) differs significantly from target (${expectedCalories})`);
      suggestions.push('Consider adjusting portion sizes or meal selections');
    }
    
    // Validate dietary restrictions
    for (const meal of mealPlan.dailyMeals) {
      const restrictionCheck = this.restrictionsEngine.validateMealAgainstRestrictions(
        meal, 
        userProfile.dietary_restrictions
      );
      
      if (!restrictionCheck.valid) {
        issues.push(...restrictionCheck.violations);
        suggestions.push(...restrictionCheck.suggestions);
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      score: Math.max(0, 100 - (issues.length * 10)) // 10 points per issue
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  score: number; // 0-100
}
```

This comprehensive business logic documentation provides the foundation for implementing intelligent, culturally-aware meal planning with proper nutrition calculations, dietary restrictions, and cultural preferences in React Native.
