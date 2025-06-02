
export type ValidMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';

export const validateMealType = (mealType: string): ValidMealType => {
  // Normalize meal type
  const normalized = mealType?.toLowerCase().trim();
  
  // Map common variations to valid types
  const mealTypeMap: Record<string, ValidMealType> = {
    'breakfast': 'breakfast',
    'lunch': 'lunch',
    'dinner': 'dinner',
    'snack': 'snack1',
    'snack1': 'snack1',
    'snack2': 'snack2',
    'morning_snack': 'snack1',
    'afternoon_snack': 'snack2',
    'evening_snack': 'snack2',
    'mid_morning': 'snack1',
    'mid_afternoon': 'snack2'
  };

  const validType = mealTypeMap[normalized];
  
  if (!validType) {
    console.warn(`⚠️ Invalid meal type "${mealType}", defaulting to "snack1"`);
    return 'snack1';
  }

  return validType;
};

export const isValidMealType = (mealType: string): boolean => {
  const validTypes: ValidMealType[] = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
  return validTypes.includes(mealType as ValidMealType);
};
