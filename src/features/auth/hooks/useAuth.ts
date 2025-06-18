
import { useContext } from 'react';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

export const useAuth = () => {
  return useAuthHook();
};
