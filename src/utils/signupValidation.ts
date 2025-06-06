
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
      // Combined Basic Info + Physical Stats
      return !!(
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight &&
        parseInt(formData.age) >= 13 &&
        parseInt(formData.age) <= 120 &&
        parseFloat(formData.height) >= 100 &&
        parseFloat(formData.height) <= 250 &&
        parseFloat(formData.weight) >= 30 &&
        parseFloat(formData.weight) <= 300
      );
    
    case 3:
      // Body Composition (auto-valid with slider)
      return true;
    
    case 4:
      // Fitness Goals
      return !!(
        formData.fitnessGoal &&
        formData.activityLevel
      );
    
    case 5:
      // Health & Dietary (optional)
      return true;
    
    case 6:
      // Life Phase (optional)
      return true;
    
    default:
      return false;
  }
};

export const getStepTitle = (step: number): string => {
  switch (step) {
    case 1: return "Create Account";
    case 2: return "About You";
    case 3: return "Body Composition";
    case 4: return "Fitness Goals";
    case 5: return "Health & Preferences";
    case 6: return "Life Phase";
    default: return "Setup";
  }
};

export const getStepDescription = (step: number): string => {
  switch (step) {
    case 1: return "Set up your FitGenius account";
    case 2: return "Tell us about yourself and your measurements";
    case 3: return "Body composition and type";
    case 4: return "What are your goals?";
    case 5: return "Health conditions and preferences";
    case 6: return "Special considerations";
    default: return "Complete your setup";
  }
};
