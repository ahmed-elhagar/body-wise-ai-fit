
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoginCredentials } from '../types';
import { toast } from 'sonner';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Successfully logged in!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    }
  });
};
