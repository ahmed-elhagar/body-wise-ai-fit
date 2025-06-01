
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  return {
    user,
    isLoading,
    error,
    signOut: () => {
      setUser(null);
    }
  };
};
