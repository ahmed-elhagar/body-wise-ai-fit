
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Redirect logic for authenticated users
  useEffect(() => {
    if (user && profile !== undefined) {
      console.log('Auth - User authenticated, checking profile:', {
        userId: user.id,
        hasProfile: !!profile,
        onboardingCompleted: profile?.onboarding_completed
      });
      
      // If no profile or onboarding not completed, redirect to onboarding
      if (!profile || !profile.onboarding_completed) {
        console.log('Auth - Redirecting to onboarding');
        navigate('/onboarding');
      } else {
        console.log('Auth - Redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, profile, navigate]);

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Email and password are required');
      return false;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    if (isSignUp && (!firstName || !lastName)) {
      toast.error('First name and last name are required');
      return false;
    }
    
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await signIn(email, password);
      console.log('Sign in successful');
      // Navigation will be handled by useEffect
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await signUp(email, password, { 
        first_name: firstName, 
        last_name: lastName 
      });
      console.log('Sign up successful, will redirect to onboarding');
      toast.success('Account created! Please complete your profile.');
      // Navigation will be handled by useEffect after user state updates
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, don't render the form
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-fitness-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-fitness-gradient bg-clip-text text-transparent">
            FitGenius AI
          </h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-11"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-11 pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-fitness-gradient hover:opacity-90 text-white font-medium shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmail("");
              setPassword("");
              setFirstName("");
              setLastName("");
            }}
            className="text-sm hover:bg-gray-100"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
