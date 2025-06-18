
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SignupData } from '../types';
import { toast } from 'sonner';

export const useSignup = () => {
  return useMutation({
    mutationFn: async (signupData: SignupData) => {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName
          }
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please check your email.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signup failed');
    }
  });
};
