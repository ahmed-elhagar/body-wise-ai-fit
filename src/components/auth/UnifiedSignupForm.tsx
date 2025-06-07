import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, User, Target, Heart, CheckCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BodyShapeSelector from "./BodyShapeSelector";
import { mapBodyFatToBodyShape, isValidBodyShape } from "@/utils/signupValidation";

interface SignupFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  
  // Physical Info
  age: string;
  gender: string;
  height: string;
  weight: string;
  bodyFatPercentage: number;
  nationality: string;
  
  // Goals & Activity
  fitnessGoal: string;
  activityLevel: string;
  
  // Health & Diet Info
  healthConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  preferredFoods: string[];
  specialConditions: string[];
}

const UnifiedSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const { signUp, user } = useAuth();
  const { updateProfile } = useProfile();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      console.log('UnifiedSignupForm - User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bodyFatPercentage: 20,
    nationality: "",
    fitnessGoal: "",
    activityLevel: "",
    healthConditions: [],
    allergies: [],
    dietaryRestrictions: [],
    preferredFoods: [],
    specialConditions: []
  });

  const totalSteps = 5;

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: keyof SignupFormData, value: string) => {
    const arrayValue = value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.password);
      case 2:
        return !!(formData.age && formData.gender && formData.height && formData.weight && formData.nationality);
      case 3:
        return !!(formData.bodyFatPercentage > 0);
      case 4:
        return !!(formData.fitnessGoal && formData.activityLevel);
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleFirstStep = async () => {
    if (!validateStep(1)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      console.log('Creating account with basic info:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      // Create account with basic metadata only
      const result = await signUp(formData.email, formData.password, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim()
      });

      if (result?.error) {
        // Handle specific error cases
        if (result.error.message?.includes('User already registered') || 
            result.error.message?.includes('already registered')) {
          toast.error("An account with this email already exists. Please sign in instead.");
          navigate('/auth');
          return;
        }
        throw new Error(result.error.message || 'Account creation failed');
      }

      console.log('Account created successfully, proceeding to next step');
      setAccountCreated(true);
      toast.success("Account created! Please complete your profile.");
      setCurrentStep(2);
      
    } catch (error: any) {
      console.error('Account creation error:', error);
      if (error.message?.includes('User already registered') || 
          error.message?.includes('already registered')) {
        toast.error("An account with this email already exists. Please sign in instead.");
        navigate('/auth');
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      handleFirstStep();
    } else if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!accountCreated) {
      toast.error("Account not created yet. Please go back to step 1.");
      return;
    }

    setLoading(true);
    try {
      console.log('Updating profile with complete data');
      
      // Prepare comprehensive profile data
      const profileData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        nationality: formData.nationality.trim(),
        fitness_goal: formData.fitnessGoal,
        activity_level: formData.activityLevel,
        body_fat_percentage: formData.bodyFatPercentage,
        body_shape: mapBodyFatToBodyShape(formData.bodyFatPercentage, formData.gender),
        health_conditions: formData.healthConditions.filter(Boolean),
        allergies: formData.allergies.filter(Boolean),
        dietary_restrictions: formData.dietaryRestrictions.filter(Boolean),
        preferred_foods: formData.preferredFoods.filter(Boolean),
        special_conditions: formData.specialConditions.filter(Boolean),
        profile_completion_score: 95,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      console.log('Profile data to update:', {
        ...profileData,
        health_conditions: `${profileData.health_conditions.length} items`,
        allergies: `${profileData.allergies.length} items`,
        dietary_restrictions: `${profileData.dietary_restrictions.length} items`,
        preferred_foods: `${profileData.preferred_foods.length} items`,
        special_conditions: `${profileData.special_conditions.length} items`
      });

      // Update profile with complete data
      const updateResult = await updateProfile(profileData);
      
      if (updateResult?.error) {
        throw new Error(updateResult.error.message || 'Profile update failed');
      }

      console.log('Profile updated successfully, redirecting to welcome');
      toast.success("Profile completed successfully! Welcome to FitGenius!");
      navigate('/welcome', { replace: true });
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to complete profile setup");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderPhysicalInfo();
      case 3:
        return renderBodyShape();
      case 4:
        return renderGoalsAndActivity();
      case 5:
        return renderDietaryPreferences();
      default:
        return null;
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Enter your first name"
            className="h-12"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Enter your last name"
            className="h-12"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="Enter your email"
          className="h-12"
          required
          disabled={accountCreated}
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="Create a password"
            className="h-12 pr-10"
            required
            disabled={accountCreated}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            disabled={accountCreated}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {accountCreated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium">Account Created Successfully!</p>
          <p className="text-green-600 text-sm">Continue to complete your profile</p>
        </div>
      )}
    </div>
  );

  const renderPhysicalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Physical Information</h2>
        <p className="text-gray-600">Help us understand your body metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age" className="text-sm font-medium text-gray-700 mb-2 block">
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateField("age", e.target.value)}
            placeholder="Enter your age"
            className="h-12"
            min="13"
            max="100"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Gender *</Label>
          <div className="grid grid-cols-2 gap-2">
            {["male", "female"].map((gender) => (
              <Button
                key={gender}
                type="button"
                variant={formData.gender === gender ? "default" : "outline"}
                onClick={() => updateField("gender", gender)}
                className="h-12 capitalize"
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 mb-2 block">
            Height (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateField("height", e.target.value)}
            placeholder="Enter your height"
            className="h-12"
            min="100"
            max="250"
            required
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 mb-2 block">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            placeholder="Enter your weight"
            className="h-12"
            min="30"
            max="300"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 mb-2 block">
          Nationality *
        </Label>
        <Input
          id="nationality"
          value={formData.nationality}
          onChange={(e) => updateField("nationality", e.target.value)}
          placeholder="Enter your nationality"
          className="h-12"
          required
        />
      </div>
    </div>
  );

  const renderBodyShape = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600">Select your current body type</p>
      </div>

      <BodyShapeSelector
        value={formData.bodyFatPercentage}
        onChange={(value) => updateField("bodyFatPercentage", value)}
        gender={formData.gender}
      />
    </div>
  );

  const renderGoalsAndActivity = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Activity</h2>
        <p className="text-gray-600">Tell us about your fitness goals</p>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Fitness Goal *</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "weight_loss", label: "Weight Loss" },
            { id: "muscle_gain", label: "Muscle Gain" },
            { id: "endurance", label: "Endurance" },
            { id: "general_fitness", label: "General Fitness" }
          ].map((goal) => (
            <Button
              key={goal.id}
              type="button"
              variant={formData.fitnessGoal === goal.id ? "default" : "outline"}
              onClick={() => updateField("fitnessGoal", goal.id)}
              className="h-12"
            >
              {goal.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Activity Level *</Label>
        <div className="space-y-2">
          {[
            { id: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
            { id: "lightly_active", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
            { id: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
            { id: "very_active", label: "Very Active", desc: "Hard exercise 6-7 days/week" }
          ].map((level) => (
            <Button
              key={level.id}
              type="button"
              variant={formData.activityLevel === level.id ? "default" : "outline"}
              onClick={() => updateField("activityLevel", level.id)}
              className="w-full h-16 justify-start text-left"
            >
              <div>
                <div className="font-medium">{level.label}</div>
                <div className="text-sm opacity-70">{level.desc}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDietaryPreferences = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
          <Info className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health & Diet Information</h2>
        <p className="text-gray-600">Help us personalize your experience (Optional)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="preferredFoods">Preferred Foods</Label>
          <Textarea
            id="preferredFoods"
            value={formData.preferredFoods.join(', ')}
            onChange={(e) => handleArrayInput('preferredFoods', e.target.value)}
            placeholder="e.g., Chicken, Rice, Vegetables, Fish"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
          <Textarea
            id="dietaryRestrictions"
            value={formData.dietaryRestrictions.join(', ')}
            onChange={(e) => handleArrayInput('dietaryRestrictions', e.target.value)}
            placeholder="e.g., Vegetarian, Gluten-free, Keto"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies & Intolerances</Label>
          <Textarea
            id="allergies"
            value={formData.allergies.join(', ')}
            onChange={(e) => handleArrayInput('allergies', e.target.value)}
            placeholder="e.g., Nuts, Dairy, Shellfish"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="healthConditions">Health Conditions</Label>
          <Textarea
            id="healthConditions"
            value={formData.healthConditions.join(', ')}
            onChange={(e) => handleArrayInput('healthConditions', e.target.value)}
            placeholder="e.g., Diabetes, Hypertension"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialConditions">Special Conditions</Label>
        <Textarea
          id="specialConditions"
          value={formData.specialConditions.join(', ')}
          onChange={(e) => handleArrayInput('specialConditions', e.target.value)}
          placeholder="e.g., Pregnancy, Breastfeeding, Recovery from injury"
          rows={2}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">Separate items with commas</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Join FitGenius</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[500px]">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="px-6"
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={loading || (currentStep === 1 ? !validateStep(1) : false)}
                className="px-8 bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                {loading ? (
                  currentStep === 1 ? "Creating Account..." : "Processing..."
                ) : (
                  currentStep === 1 ? "Create Account" : "Next"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(4) || loading || !accountCreated}
                className="px-8 bg-gradient-to-r from-green-500 to-emerald-600"
              >
                {loading ? "Completing Profile..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </Card>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignupForm;
