import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, User, Target, Heart, CheckCircle } from "lucide-react";
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
  
  // Goals & Activity
  fitnessGoal: string;
  activityLevel: string;
  
  // Optional
  nationality: string;
  healthConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
}

const UnifiedSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    fitnessGoal: "",
    activityLevel: "",
    nationality: "",
    healthConditions: [],
    allergies: [],
    dietaryRestrictions: []
  });

  const totalSteps = 4;

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.password);
      case 2:
        return !!(formData.age && formData.gender && formData.height && formData.weight);
      case 3:
        return !!(formData.bodyFatPercentage > 0);
      case 4:
        return !!(formData.fitnessGoal && formData.activityLevel);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
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

    setLoading(true);
    try {
      console.log('UnifiedSignupForm - Starting signup process with complete data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        bodyFatPercentage: formData.bodyFatPercentage,
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel,
        nationality: formData.nationality,
        healthConditions: formData.healthConditions,
        allergies: formData.allergies,
        dietaryRestrictions: formData.dietaryRestrictions
      });
      
      // Sign up user
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName
      });

      // Map body fat to body shape
      const bodyShape = mapBodyFatToBodyShape(formData.bodyFatPercentage, formData.gender);
      
      if (!isValidBodyShape(bodyShape)) {
        throw new Error("Invalid body shape calculation");
      }

      // Create complete profile with ALL signup data and correct field mapping
      const profileData = {
        // Basic Info - ensure exact field mapping
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        nationality: formData.nationality || null,
        
        // Body composition
        body_fat_percentage: formData.bodyFatPercentage,
        body_shape: bodyShape,
        
        // Goals & Activity
        fitness_goal: formData.fitnessGoal,
        activity_level: formData.activityLevel,
        
        // Health & Preferences arrays
        health_conditions: formData.healthConditions || [],
        allergies: formData.allergies || [],
        dietary_restrictions: formData.dietaryRestrictions || [],
        preferred_foods: [], // Initialize as empty array
        special_conditions: [], // Initialize as empty array
        
        // System fields
        ai_generations_remaining: 5,
        profile_completion_score: 95 // Higher score since all data is filled
      };

      console.log('UnifiedSignupForm - Creating profile with complete mapped data:', profileData);
      
      const result = await updateProfile(profileData);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to create profile');
      }

      console.log('UnifiedSignupForm - Profile created successfully, redirecting to welcome');
      toast.success("Account created successfully!");
      navigate('/welcome', { replace: true });
    } catch (error: any) {
      console.error('UnifiedSignupForm - Signup error:', error);
      toast.error(error.message || "Failed to create account");
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
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
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
              disabled={currentStep === 1}
              className="px-6"
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="px-8 bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep) || loading}
                className="px-8 bg-gradient-to-r from-green-500 to-emerald-600"
              >
                {loading ? "Creating Account..." : "Create Account"}
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
