
import { SignupFormData } from "@/hooks/useSignupFlow";

export const validateStep = (step: number, formData: SignupFormData): boolean => {
  switch (step) {
    case 1:
      // Account Creation
      return !!(
        formData.email?.trim() &&
        formData.password?.trim() &&
        formData.firstName?.trim() &&
        formData.lastName?.trim() &&
        formData.password.length >= 6 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      );
    
    case 2:
      // Basic Info
      return !!(
        formData.age &&
        formData.gender &&
        parseInt(formData.age) >= 13 &&
        parseInt(formData.age) <= 120
      );
    
    case 3:
      // Physical Stats
      return !!(
        formData.height &&
        formData.weight &&
        parseFloat(formData.height) >= 100 &&
        parseFloat(formData.height) <= 250 &&
        parseFloat(formData.weight) >= 30 &&
        parseFloat(formData.weight) <= 300
      );
    
    case 4:
      // Body Composition (auto-valid with slider)
      return true;
    
    case 5:
      // Fitness Goals
      return !!(
        formData.fitnessGoal &&
        formData.activityLevel
      );
    
    case 6:
      // Health & Dietary (optional)
      return true;
    
    case 7:
      // Life Phase (optional)
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
    case 1: return "Set up your FitGenius account";
    case 2: return "Tell us about yourself";
    case 3: return "Your current measurements";
    case 4: return "Body composition and type";
    case 5: return "What are your goals?";
    case 6: return "Health conditions and preferences";
    case 7: return "Special considerations";
    default: return "Complete your setup";
  }
};
