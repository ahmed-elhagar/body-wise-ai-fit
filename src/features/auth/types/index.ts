
// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string; // Alias for compatibility
  lastName?: string; // Alias for compatibility
  role: 'normal' | 'coach' | 'admin';
  user_metadata?: {
    role?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
