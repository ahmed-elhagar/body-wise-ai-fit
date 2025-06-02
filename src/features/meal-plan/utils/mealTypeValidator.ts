
export type ValidMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const validateMealType = (mealType: string): ValidMealType => {
  // Normalize meal type
  const normalized = mealType?.toLowerCase().trim();
  
  // Map common variations to valid types
  const mealTypeMap: Record<string, ValidMealType> = {
    'breakfast': 'breakfast',
    'lunch': 'lunch',
    'dinner': 'dinner',
    'snack': 'snack',
    'snack1': 'snack',
    'snack2': 'snack',
    'morning_snack': 'snack',
    'afternoon_snack': 'snack',
    'evening_snack': 'snack',
    'mid_morning': 'snack',
    'mid_afternoon': 'snack'
  };

  const validType = mealTypeMap[normalized];
  
  if (!validType) {
    console.warn(`⚠️ Invalid meal type "${mealType}", defaulting to "snack"`);
    return 'snack';
  }

  return validType;
};

export const isValidMealType = (mealType: string): boolean => {
  const validTypes: ValidMealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  return validTypes.includes(mealType as ValidMealType);
};
