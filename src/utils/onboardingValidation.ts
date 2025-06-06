
export const validateOnboardingStep = (step: number, formData: any): boolean => {
  switch (step) {
    case 1:
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight
      );
    
    case 2:
      return !!(formData.body_shape);
    
    case 3:
      return !!(
        formData.fitness_goal &&
        formData.activity_level &&
        formData.health_conditions?.length > 0
      );
    
    case 4:
      return true; // This step is optional, preferences can be empty
    
    default:
      return false;
  }
};
