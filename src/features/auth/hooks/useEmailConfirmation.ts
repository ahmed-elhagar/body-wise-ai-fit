
import { useFeatureFlags } from './useFeatureFlags';

export const useEmailConfirmation = () => {
  const { flags } = useFeatureFlags();
  
  return {
    isEmailConfirmationEnabled: flags.email_confirmation,
  };
};
