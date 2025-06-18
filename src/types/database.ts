
// Database related types (extending Supabase types)
export interface DatabaseUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  role: 'normal' | 'coach' | 'admin';
  created_at: string;
  updated_at: string;
}
