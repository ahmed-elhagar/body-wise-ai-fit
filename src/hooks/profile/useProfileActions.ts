
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';

export const useProfileActions = () => {
  const { updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const saveProfile = async (formData: any) => {
    setIsUpdating(true);
    try {
      const result = await updateProfile(formData);
      if (result.error) {
        throw new Error(result.error.message);
      }
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    saveProfile,
    isUpdating
  };
};
