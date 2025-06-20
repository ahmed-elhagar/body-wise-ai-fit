
# Authentication API

Complete authentication system with email/password, OAuth, and session management.

## 🔐 Authentication Endpoints

### Sign Up
**Method**: `POST`  
**Endpoint**: `supabase.auth.signUp()`

```javascript
const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName
      }
    }
  });
  
  return { data, error };
};
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600
  }
}
```

### Sign In
**Method**: `POST`  
**Endpoint**: `supabase.auth.signInWithPassword()`

```javascript
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};
```

### Google OAuth
**Method**: `POST`  
**Endpoint**: `supabase.auth.signInWithOAuth()`

```javascript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  
  return { data, error };
};
```

### Sign Out
**Method**: `POST`  
**Endpoint**: `supabase.auth.signOut()`

```javascript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
```

### Password Reset
**Method**: `POST`  
**Endpoint**: `supabase.auth.resetPasswordForEmail()`

```javascript
const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  return { data, error };
};
```

## 👤 Profile Management

### Get User Profile
**Method**: `GET`  
**Table**: `profiles`

```javascript
const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_preferences(*),
      subscriptions(*)
    `)
    .eq('id', userId)
    .single();
    
  return { data, error };
};
```

### Update Profile
**Method**: `PATCH`  
**Table**: `profiles`

```javascript
const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
    
  return { data, error };
};
```

## 🔄 Session Management

### Get Current Session
```javascript
const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};
```

### Refresh Session
```javascript
const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  return { data, error };
};
```

### Auth State Changes
```javascript
const setupAuthListener = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback({ event, session });
    }
  );
  
  return subscription;
};
```

## 🛡️ Security Features

### Row Level Security (RLS)
All profile data is protected with RLS policies:

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

### Password Requirements
- Minimum 8 characters
- Mixed case letters
- Numbers required
- Special characters recommended

### Session Security
- JWT tokens with 1-hour expiration
- Automatic refresh token rotation
- Secure httpOnly cookies
- CSRF protection

## 📱 React Native Integration

### Setup Auth Context
```javascript
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Persistent Auth Storage
```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage, // React Native
    autoRefreshToken: true,
    persistSession: true
  }
});
```

## 🚫 Error Handling

### Common Error Codes
```javascript
const AUTH_ERRORS = {
  'invalid_credentials': 'Invalid email or password',
  'email_already_exists': 'An account with this email already exists',
  'weak_password': 'Password must be at least 8 characters',
  'signup_disabled': 'Sign up is currently disabled',
  'email_not_confirmed': 'Please check your email and click the confirmation link'
};

const handleAuthError = (error) => {
  return AUTH_ERRORS[error.message] || 'An unexpected error occurred';
};
```

### Rate Limiting
- Sign up: 5 attempts per hour per IP
- Sign in: 10 attempts per hour per IP
- Password reset: 3 attempts per hour per email

This authentication system provides secure, scalable user management with comprehensive session handling and profile management capabilities.
