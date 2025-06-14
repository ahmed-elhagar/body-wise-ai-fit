
import { useEnhancedProfile } from './useEnhancedProfile';

// This is a wrapper/alias for useEnhancedProfile for backward compatibility
export const useOptimizedProfile = () => {
  return useEnhancedProfile();
};
