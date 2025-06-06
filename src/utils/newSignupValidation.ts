
import { NewSignupFormData } from "@/hooks/useNewSignupForm";

export const validateNewSignupStep = (step: number, formData: NewSignupFormData): boolean => {
  switch (step) {
    case 1:
      // Account Creation - All fields required
      return !!(
        formData.email?.trim() &&
        formData.password?.trim() &&
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.password.length >= 6
      );
    
    case 2:
      // Basic Info - Age and Gender required
      return !!(
        formData.age &&
        formData.gender &&
        parseInt(formData.age) >= 13 &&
        parseInt(formData.age) <= 120
      );
    
    case 3:
      // Physical Stats - Height and Weight required
      return !!(
        formData.height &&
        formData.weight &&
        parseFloat(formData.height) >= 100 &&
        parseFloat(formData.height) <= 250 &&
        parseFloat(formData.weight) >= 30 &&
        parseFloat(formData.weight) <= 300
      );
    
    case 4:
      // Body Composition - Shape and body fat required
      return !!(
        formData.body_shape &&
        formData.body_fat_percentage >= 5 &&
        formData.body_fat_percentage <= 50
      );
    
    case 5:
      // Fitness Goals - Both required
      return !!(
        formData.fitness_goal &&
        formData.activity_level
      );
    
    case 6:
      // Health & Dietary - All optional
      return true;
    
    case 7:
      // Life Phase - Optional (females only)
      return true;
    
    default:
      return false;
  }
};

export const getStepTitle = (step: number): string => {
  switch (step) {
    case 1: return "Create Account";
    case 2: return "Basic Information";
    case 3: return "Physical Stats";
    case 4: return "Body Composition";
    case 5: return "Fitness Goals";
    case 6: return "Health & Preferences";
    case 7: return "Life Phase";
    default: return "Setup";
  }
};

export const getStepDescription = (step: number): string => {
  switch (step) {
    case 1: return "Let's start your fitness journey";
    case 2: return "Tell us about yourself";
    case 3: return "Your current measurements";
    case 4: return "Body type and composition";
    case 5: return "What are your goals?";
    case 6: return "Health conditions and preferences";
    case 7: return "Special life phase considerations";
    default: return "Complete your setup";
  }
};
