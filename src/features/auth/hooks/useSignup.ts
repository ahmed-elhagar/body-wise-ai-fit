
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SignupData } from '../types';
import { toast } from 'sonner';

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });
      if (error) throw error;
      return authData;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signup failed');
    }
  });
};
