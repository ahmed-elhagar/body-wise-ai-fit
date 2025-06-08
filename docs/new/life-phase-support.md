
# FitFatta Life Phase Support Documentation

## Overview
FitFatta provides comprehensive support for users in different life phases that require specialized nutrition and fitness adaptations: pregnancy, breastfeeding, and Islamic fasting periods.

## Supported Life Phases

### 1. Pregnancy Support

#### Trimester-Based Nutrition
```typescript
interface PregnancySupport {
  trimester: 1 | 2 | 3;
  calorieAdjustment: number;
  keyNutrients: string[];
  avoidFoods: string[];
  recommendations: string[];
}

const pregnancyPhases = {
  trimester_1: {
    calorieAdjustment: 0, // No additional calories needed
    keyNutrients: [
      'folic_acid',      // 400-800 mcg daily
      'iron',            // 27mg daily
      'calcium',         // 1000mg daily
      'vitamin_d',       // 600 IU daily
      'omega_3_dha'      // 200mg daily
    ],
    avoidFoods: [
      'raw_fish', 'sushi', 'unpasteurized_dairy', 'deli_meats',
      'high_mercury_fish', 'raw_eggs', 'alcohol', 'excessive_caffeine'
    ],
    recommendations: [
      'Focus on prenatal vitamins with folic acid',
      'Small, frequent meals to manage nausea',
      'Stay hydrated with 8-10 glasses of water daily',
      'Avoid foods that trigger morning sickness'
    ]
  },
  
  trimester_2: {
    calorieAdjustment: 340, // Additional 340 calories daily
    keyNutrients: [
      'protein',         // 75-100g daily
      'calcium',         // 1000mg daily
      'iron',            // 27mg daily
      'vitamin_d',       // 600 IU daily
      'fiber'            // 25-30g daily
    ],
    avoidFoods: [
      'raw_fish', 'unpasteurized_dairy', 'deli_meats',
      'high_mercury_fish', 'alcohol', 'excessive_caffeine'
    ],
    recommendations: [
      'Increase protein intake for fetal development',
      'Include calcium-rich foods for bone development',
      'Maintain regular, balanced meals',
      'Monitor weight gain (0.5-1 lb per week)'
    ]
  },
  
  trimester_3: {
    calorieAdjustment: 450, // Additional 450 calories daily
    keyNutrients: [
      'protein',         // 75-100g daily
      'iron',            // 27mg daily
      'calcium',         // 1000mg daily
      'omega_3_dha',     // 200mg daily
      'vitamin_k'        // For blood clotting
    ],
    avoidFoods: [
      'raw_fish', 'unpasteurized_dairy', 'deli_meats',
      'high_mercury_fish', 'alcohol', 'excessive_caffeine'
    ],
    recommendations: [
      'Higher protein needs for rapid fetal growth',
      'Iron-rich foods to prevent anemia',
      'Smaller, more frequent meals due to stomach compression',
      'Prepare for breastfeeding nutrition transition'
    ]
  }
};
```

#### Exercise Modifications During Pregnancy
```typescript
const pregnancyExerciseGuidelines = {
  general_guidelines: [
    'Avoid exercises lying flat on back after first trimester',
    'No contact sports or high fall-risk activities',
    'Stay hydrated and avoid overheating',
    'Listen to your body and modify as needed'
  ],
  
  recommended_exercises: {
    first_trimester: [
      'walking', 'swimming', 'prenatal_yoga', 'light_weight_training',
      'stationary_cycling', 'pilates_modifications'
    ],
    second_trimester: [
      'walking', 'swimming', 'prenatal_yoga', 'modified_strength_training',
      'pelvic_floor_exercises', 'core_breathing'
    ],
    third_trimester: [
      'gentle_walking', 'swimming', 'prenatal_yoga', 'pelvic_preparation',
      'breathing_exercises', 'gentle_stretching'
    ]
  },
  
  avoid_exercises: [
    'contact_sports', 'high_altitude_activities', 'scuba_diving',
    'hot_yoga', 'exercises_on_back', 'heavy_lifting', 'high_impact'
  ]
};
```

### 2. Breastfeeding Support

#### Nutrition Requirements
```typescript
interface BreastfeedingSupport {
  feedingType: 'exclusive' | 'partial';
  calorieAdjustment: number;
  fluidRequirements: string;
  keyNutrients: string[];
  supportFoods: string[];
}

const breastfeedingPhases = {
  exclusive: {
    calorieAdjustment: 400, // Additional 400 calories daily
    fluidRequirements: '2.5-3 liters daily',
    keyNutrients: [
      'protein',         // 71g daily
      'calcium',         // 1000mg daily
      'iron',            // 9mg daily
      'vitamin_d',       // 600 IU daily
      'omega_3_dha',     // 200mg daily
      'vitamin_b12',     // 2.8 mcg daily
      'choline'          // 550mg daily
    ],
    supportFoods: [
      'oats', 'salmon', 'eggs', 'leafy_greens', 'almonds',
      'avocado', 'sweet_potato', 'quinoa', 'yogurt', 'lentils'
    ],
    recommendations: [
      'Maintain high-quality nutrition for milk production',
      'Stay well-hydrated throughout the day',
      'Include healthy fats for brain development',
      'Consider continuing prenatal vitamins'
    ]
  },
  
  partial: {
    calorieAdjustment: 250, // Additional 250 calories daily
    fluidRequirements: '2-2.5 liters daily',
    keyNutrients: [
      'protein', 'calcium', 'iron', 'vitamin_d', 'omega_3_dha'
    ],
    supportFoods: [
      'oats', 'salmon', 'eggs', 'leafy_greens', 'nuts', 'seeds'
    ],
    recommendations: [
      'Balanced nutrition to support continued breastfeeding',
      'Monitor milk supply with dietary changes',
      'Gradual transition as feeding decreases'
    ]
  }
};
```

#### Lactation-Supporting Meal Planning
```typescript
const lactationMealGuidelines = {
  galactagogue_foods: [
    'oats', 'fenugreek', 'fennel', 'brewers_yeast',
    'almonds', 'sesame_seeds', 'dark_leafy_greens'
  ],
  
  meal_timing: {
    frequent_meals: 'Every 2-3 hours to maintain energy',
    pre_feeding_snacks: 'Light snacks before nursing sessions',
    post_workout_nutrition: 'Within 30 minutes of exercise'
  },
  
  hydration_strategy: {
    water_before_feeding: 'Glass of water before each session',
    herbal_teas: 'Lactation teas with fennel, fenugreek',
    avoid_excessive_caffeine: 'Limit to 1-2 cups coffee daily'
  }
};
```

### 3. Islamic Fasting Support

#### Ramadan Fasting
```typescript
interface IslamicFastingSupport {
  fastingType: 'ramadan' | 'general';
  mealStructure: string[];
  nutritionFocus: {
    suhoor: string[];
    iftar: string[];
  };
  hydrationStrategy: string[];
}

const islamicFastingGuidelines = {
  ramadan: {
    mealStructure: ['suhoor', 'iftar', 'optional_late_evening'],
    
    suhoor_guidelines: {
      timing: '30-60 minutes before dawn prayer',
      focus: [
        'complex_carbohydrates',  // For sustained energy
        'high_quality_protein',   // For satiety
        'healthy_fats',          // For hormone production
        'fiber_rich_foods',      // For digestive health
        'adequate_fluids'        // For hydration
      ],
      recommended_foods: [
        'oatmeal', 'whole_grain_bread', 'eggs', 'yogurt',
        'dates', 'nuts', 'seeds', 'milk', 'water', 'herbal_tea'
      ],
      avoid_foods: [
        'excessive_salt', 'fried_foods', 'sugary_foods',
        'excessive_caffeine', 'spicy_foods'
      ]
    },
    
    iftar_guidelines: {
      timing: 'At sunset prayer time',
      breaking_fast: [
        'Start with dates and water (Sunnah)',
        'Light soup or broth',
        'Gradual progression to main meal'
      ],
      focus: [
        'gentle_rehydration',    // Gradual fluid replacement
        'balanced_nutrition',    // Complete meal planning
        'digestive_ease',        // Easy-to-digest foods
        'social_connection'      // Family meal importance
      ],
      meal_structure: [
        'dates_water',           // Traditional breaking
        'soup_salad',           // Light start
        'main_course',          // Balanced protein/carbs
        'optional_dessert'      // Moderate portion
      ]
    },
    
    exercise_modifications: {
      timing: 'Light exercise 1-2 hours after iftar',
      intensity: 'Low to moderate intensity only',
      hydration: 'Ensure adequate hydration post-iftar',
      avoid: 'No exercise while fasting unless very light walking'
    }
  },
  
  general_fasting: {
    flexible_timing: 'Adapted to personal fasting schedule',
    nutrition_principles: 'Similar to Ramadan but timing flexible',
    hydration_focus: 'Maintain hydration during eating windows'
  }
};
```

#### Cultural Considerations
```typescript
const culturalAdaptations = {
  middle_eastern: {
    traditional_iftar_foods: [
      'dates', 'fattoush', 'hummus', 'grilled_meats',
      'rice_dishes', 'lentil_soup', 'baklava'
    ],
    suhoor_traditions: [
      'ful_medames', 'cheese_olives', 'yogurt', 'tea'
    ]
  },
  
  south_asian: {
    traditional_iftar_foods: [
      'dates', 'samosas', 'pakoras', 'biryani',
      'dal', 'chapati', 'lassi'
    ],
    suhoor_traditions: [
      'paratha', 'yogurt', 'chai', 'eggs'
    ]
  }
};
```

## Implementation in Meal Planning

### 1. AI Prompt Enhancement
```typescript
const enhancePromptWithLifePhase = (basePrompt: string, nutritionContext: any, language: string) => {
  let enhancements = [];
  
  if (nutritionContext.isPregnant) {
    const pregnancyText = language === 'ar' 
      ? `الحمل - الثلث ${nutritionContext.pregnancyTrimester}: تحتاج لتغذية إضافية للأم والجنين`
      : `Pregnancy - Trimester ${nutritionContext.pregnancyTrimester}: Requires additional nutrition for mother and baby`;
    
    enhancements.push(pregnancyText);
    enhancements.push(`Additional calories: +${nutritionContext.extraCalories}`);
    enhancements.push(`Key nutrients: ${pregnancyPhases[`trimester_${nutritionContext.pregnancyTrimester}`].keyNutrients.join(', ')}`);
    enhancements.push(`Foods to avoid: ${pregnancyPhases[`trimester_${nutritionContext.pregnancyTrimester}`].avoidFoods.join(', ')}`);
  }
  
  if (nutritionContext.isBreastfeeding) {
    const breastfeedingText = language === 'ar'
      ? `الرضاعة الطبيعية (${nutritionContext.breastfeedingLevel}): تحتاج سعرات حرارية إضافية`
      : `Breastfeeding (${nutritionContext.breastfeedingLevel}): Requires additional calories`;
    
    enhancements.push(breastfeedingText);
    enhancements.push(`Additional calories: +${nutritionContext.extraCalories}`);
    enhancements.push(`Include lactation-supporting foods: ${breastfeedingPhases[nutritionContext.breastfeedingLevel].supportFoods.join(', ')}`);
  }
  
  if (nutritionContext.isMuslimFasting) {
    const fastingText = language === 'ar'
      ? 'الصيام الإسلامي: يجب مراعاة أوقات الإفطار والسحور'
      : 'Islamic Fasting: Must consider Iftar and Suhur meal timing';
    
    enhancements.push(fastingText);
    enhancements.push('Meal structure: Suhoor (pre-dawn), Iftar (sunset), optional late evening');
    enhancements.push('Suhoor focus: complex carbohydrates, protein, healthy fats, hydration');
    enhancements.push('Iftar focus: gentle rehydration, balanced nutrition, digestive ease');
  }
  
  if (enhancements.length > 0) {
    const enhancementHeader = language === 'ar'
      ? '\n\nاعتبارات خاصة مهمة:'
      : '\n\nIMPORTANT SPECIAL CONSIDERATIONS:';
    
    return basePrompt + enhancementHeader + '\n- ' + enhancements.join('\n- ');
  }
  
  return basePrompt;
};
```

### 2. Database Schema for Life Phase Tracking
```sql
-- User profile extensions for life phases
ALTER TABLE profiles ADD COLUMN pregnancy_trimester INTEGER CHECK (pregnancy_trimester IN (1, 2, 3));
ALTER TABLE profiles ADD COLUMN breastfeeding_level TEXT CHECK (breastfeeding_level IN ('exclusive', 'partial'));
ALTER TABLE profiles ADD COLUMN fasting_type TEXT CHECK (fasting_type IN ('ramadan', 'islamic', 'general'));

-- Special conditions tracking
CREATE TABLE special_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  condition_type TEXT NOT NULL, -- 'pregnancy', 'breastfeeding', 'fasting'
  start_date DATE NOT NULL,
  end_date DATE,
  details JSONB, -- Store specific details like trimester, level, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to calculate nutrition adjustments
CREATE OR REPLACE FUNCTION calculate_life_phase_calories(
  pregnancy_trimester INTEGER,
  breastfeeding_level TEXT
) RETURNS INTEGER AS $$
BEGIN
  DECLARE total_adjustment INTEGER := 0;
  
  -- Pregnancy adjustments
  IF pregnancy_trimester = 2 THEN
    total_adjustment := total_adjustment + 340;
  ELSIF pregnancy_trimester = 3 THEN
    total_adjustment := total_adjustment + 450;
  END IF;
  
  -- Breastfeeding adjustments
  IF breastfeeding_level = 'exclusive' THEN
    total_adjustment := total_adjustment + 400;
  ELSIF breastfeeding_level = 'partial' THEN
    total_adjustment := total_adjustment + 250;
  END IF;
  
  RETURN total_adjustment;
END;
$$ LANGUAGE plpgsql;
```

### 3. UI Components for Life Phase Display
```typescript
// src/components/meal-plan/LifePhaseRibbon.tsx
export const LifePhaseRibbon = ({ 
  pregnancyTrimester, 
  breastfeedingLevel, 
  fastingType, 
  extraCalories 
}) => {
  const { t, isRTL } = useLanguage();

  if (!pregnancyTrimester && !breastfeedingLevel && !fastingType) {
    return null;
  }

  const getIcon = () => {
    if (pregnancyTrimester) return <Baby className="w-4 h-4" />;
    if (breastfeedingLevel) return <Heart className="w-4 h-4" />;
    if (fastingType) return <Moon className="w-4 h-4" />;
    return null;
  };

  const getLabel = () => {
    if (pregnancyTrimester) {
      return `${t('profile.lifePhase.pregnancy.trimester' + pregnancyTrimester)} (+${extraCalories} kcal)`;
    }
    if (breastfeedingLevel) {
      return `${t('profile.lifePhase.breastfeeding.' + breastfeedingLevel)} (+${extraCalories} kcal)`;
    }
    if (fastingType) {
      return t('profile.lifePhase.fasting.' + fastingType);
    }
    return '';
  };

  return (
    <Badge 
      variant="secondary" 
      className={`bg-gradient-to-r from-health-primary/10 to-health-secondary/10 text-health-primary border-health-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      {getIcon()}
      <span className={isRTL ? 'mr-2' : 'ml-2'}>{getLabel()}</span>
    </Badge>
  );
};
```

## Exercise Adaptations

### 1. Pregnancy Exercise Modifications
```typescript
const pregnancyExerciseModifications = {
  trimester_1: {
    intensity: 'moderate',
    duration: '30-45 minutes',
    frequency: '3-4 times per week',
    focus: ['cardiovascular_health', 'strength_maintenance'],
    modifications: [
      'Listen to body signals',
      'Stay hydrated',
      'Avoid overheating'
    ]
  },
  
  trimester_2: {
    intensity: 'moderate',
    duration: '30 minutes',
    frequency: '3-4 times per week',
    focus: ['core_stability', 'pelvic_floor', 'posture'],
    modifications: [
      'Avoid exercises lying on back',
      'Modify core exercises',
      'Use prenatal modifications'
    ]
  },
  
  trimester_3: {
    intensity: 'low_to_moderate',
    duration: '20-30 minutes',
    frequency: '3 times per week',
    focus: ['flexibility', 'birth_preparation', 'comfort'],
    modifications: [
      'Focus on pelvic floor exercises',
      'Gentle stretching',
      'Breathing exercises'
    ]
  }
};
```

### 2. Fasting Period Exercise Adaptations
```typescript
const fastingExerciseGuidelines = {
  during_fasting: {
    recommended: [
      'light_walking',
      'gentle_stretching',
      'meditation',
      'breathing_exercises'
    ],
    avoid: [
      'intense_cardio',
      'heavy_weight_training',
      'high_intensity_intervals'
    ]
  },
  
  post_iftar: {
    timing: '1-2 hours after breaking fast',
    recommended: [
      'moderate_cardio',
      'strength_training',
      'yoga',
      'swimming'
    ],
    hydration: 'Ensure adequate fluid replacement'
  }
};
```

## Monitoring & Analytics

### 1. Life Phase Progress Tracking
```typescript
const trackLifePhaseProgress = async (userId: string) => {
  const { data: conditions } = await supabase
    .from('special_conditions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
    
  const { data: mealPlans } = await supabase
    .from('weekly_meal_plans')
    .select('nutrition_context, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
    
  return {
    activeConditions: conditions,
    recentAdaptations: mealPlans.map(plan => plan.nutrition_context),
    adherenceScore: calculateAdherenceScore(conditions, mealPlans)
  };
};
```

### 2. Health Professional Integration
```typescript
const generateLifePhaseReport = (userId: string, timeRange: string) => {
  // Generate summary report for healthcare providers
  return {
    nutritionSummary: {
      averageCalories: 'Daily average with adjustments',
      keyNutrients: 'Intake tracking for critical nutrients',
      adherenceRate: 'Percentage following recommendations'
    },
    exerciseAdaptations: {
      modificationCompliance: 'Following safe exercise guidelines',
      intensityTracking: 'Appropriate intensity levels',
      symptoms: 'Any reported issues or concerns'
    },
    recommendations: [
      'Continue current approach',
      'Adjust specific nutrients',
      'Consult healthcare provider'
    ]
  };
};
```
