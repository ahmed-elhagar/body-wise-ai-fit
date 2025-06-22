import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  Shield,
  Zap,
  Target,
  Heart,
  ChevronRight,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import GradientCard from '@/shared/components/design-system/GradientCard';
import { ActionButton } from '@/shared/components/design-system/ActionButton';

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

const ProfessionalAuth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Smart Goal Setting",
      description: "AI-powered fitness goals tailored to you"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Health Tracking",
      description: "Comprehensive wellness monitoring"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Quick Results",
      description: "See progress in just 7 days"
    }
  ];

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (activeTab === 'signup') {
      if (!formData.firstName || !formData.lastName) {
        toast.error('First and last name are required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (activeTab === 'signin') {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back to FitFatta!');
        navigate('/dashboard');
      } else {
        await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName
        });
        toast.success('Account created successfully! Let\'s complete your profile.');
        navigate('/onboarding');
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${activeTab === 'signin' ? 'sign in' : 'sign up'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderOnboardingCTA = () => (
    <div className="mt-8 p-6 bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 rounded-xl border border-brand-primary-200">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          New to FitFatta?
        </h3>
        <p className="text-gray-600 mb-4">
          Start your personalized fitness journey with our guided onboarding experience.
        </p>
        <ActionButton
          variant="outline"
          onClick={() => {
            setActiveTab('signup');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full border-brand-primary-300 text-brand-primary-700 hover:bg-brand-primary-100"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create Free Account
          <ArrowRight className="h-4 w-4 ml-2" />
        </ActionButton>
      </div>
    </div>
  );

  const renderSignInForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="signin-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <ActionButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        loading={loading}
        className="w-full h-12"
      >
        {!loading && (
          <>
            Sign In
            <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </ActionButton>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline"
          onClick={() => {/* TODO: Implement forgot password */}}
        >
          Forgot your password?
        </button>
      </div>

      <Separator className="my-6" />
      {renderOnboardingCTA()}
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="signup-firstname" className="text-sm font-medium text-gray-700">
            First Name
          </Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="signup-firstname"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
              placeholder="First name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="signup-lastname" className="text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="signup-lastname"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
              placeholder="Last name"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="signup-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10 pr-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
            placeholder="Create a password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
      </div>

      <div>
        <Label htmlFor="signup-confirm" className="text-sm font-medium text-gray-700">
          Confirm Password
        </Label>
        <div className="relative mt-1">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="signup-confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pl-10 pr-10 h-12 border-gray-200 focus:border-brand-500 focus:ring-brand-500"
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <ActionButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        loading={loading}
        className="w-full h-12"
      >
        {!loading && (
          <>
            Create Account & Start Onboarding
            <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </ActionButton>

      <p className="text-xs text-gray-500 text-center">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">
          Privacy Policy
        </a>
      </p>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex">
      {/* Left Side - Enhanced Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-primary-600 to-brand-secondary-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-600/95 to-brand-secondary-800/95"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse-soft"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse-soft"></div>
        
        <div className="relative z-10">
          <div className="mb-12">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Fitness Platform
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              Transform Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent-300 to-yellow-300">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of users who've achieved their health goals with our AI-powered platform.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white group-hover:bg-white/30 transition-colors duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center space-x-2 text-white/80">
            <CheckCircle className="h-5 w-5 text-brand-accent-400" />
            <span>Trusted by 10,000+ users worldwide</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <GradientCard variant="soft" className="p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to FitFatta
              </h2>
              <p className="text-gray-600">
                Your AI-powered fitness journey starts here
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-brand-primary-500 data-[state=active]:text-white font-semibold"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-brand-primary-500 data-[state=active]:text-white font-semibold"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6">
                {renderSignInForm()}
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                {renderSignUpForm()}
              </TabsContent>
            </Tabs>
          </GradientCard>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAuth; 