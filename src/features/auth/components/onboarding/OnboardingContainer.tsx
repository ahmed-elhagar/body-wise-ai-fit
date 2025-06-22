import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Target, 
  Activity, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Scale,
  Ruler,
  Trophy,
  Calendar,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '@/features/profile/hooks/useProfile';

interface OnboardingData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  fitnessGoal: string;
  nationality: string;
  dietaryRestrictions: string[];
  cookingSkill: string;
  maxPrepTime: string;
  workoutEquipment: string[];
  workoutLocation: string;
  availableWorkoutDays: string;
  fitnessLevel: string;
}

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    fitnessGoal: '',
    nationality: '',
    dietaryRestrictions: [],
    cookingSkill: '',
    maxPrepTime: '',
    workoutEquipment: [],
    workoutLocation: '',
    availableWorkoutDays: '',
    fitnessLevel: ''
  });

  const navigate = useNavigate();
  const { updateProfile } = useProfile();

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    { 
      id: 1, 
      title: 'Basic Info', 
      icon: <User className="h-5 w-5" />,
      color: 'brand-primary',
      description: 'Tell us about yourself'
    },
    { 
      id: 2, 
      title: 'Physical Stats', 
      icon: <Scale className="h-5 w-5" />,
      color: 'brand-secondary',
      description: 'Your measurements'
    },
    { 
      id: 3, 
      title: 'Location & Diet', 
      icon: <Heart className="h-5 w-5" />,
      color: 'brand-accent',
      description: 'Food preferences'
    },
    { 
      id: 4, 
      title: 'Workout Setup', 
      icon: <Activity className="h-5 w-5" />,
      color: 'brand-primary',
      description: 'Exercise preferences'
    },
    { 
      id: 5, 
      title: 'Goals & Activity', 
      icon: <Target className="h-5 w-5" />,
      color: 'brand-secondary',
      description: 'Your fitness journey'
    }
  ];

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.gender && formData.nationality;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.cookingSkill && formData.maxPrepTime;
      case 4:
        return formData.workoutLocation && formData.availableWorkoutDays && formData.fitnessLevel;
      case 5:
        return formData.activityLevel && formData.fitnessGoal;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activity_level: formData.activityLevel,
        fitness_goal: formData.fitnessGoal,
        nationality: formData.nationality,
        dietary_restrictions: formData.dietaryRestrictions,
        cooking_skill: formData.cookingSkill,
        max_prep_time: parseInt(formData.maxPrepTime),
        workout_equipment: formData.workoutEquipment,
        workout_location: formData.workoutLocation,
        available_workout_days: parseInt(formData.availableWorkoutDays),
        fitness_level: formData.fitnessLevel,
        onboarding_completed: true,
        profile_completion_score: 100
      });

      toast.success('Welcome to FitFatta! Your profile is complete.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
          <User className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-brand-neutral-800 mb-3">Tell us about yourself</h2>
        <p className="text-brand-neutral-600 text-lg">Let's start with some basic information to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Age
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            placeholder="25"
            className="h-12 lg:h-14 text-lg border-2 border-brand-primary-200 focus:border-brand-primary-500 rounded-xl"
            min="13"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            <User className="h-4 w-4" />
            Gender
          </Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-primary-200 focus:border-brand-primary-500 rounded-xl">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="nationality" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            🌍 Nationality
          </Label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-primary-200 focus:border-brand-primary-500 rounded-xl">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              <SelectItem value="egypt">🇪🇬 Egypt</SelectItem>
              <SelectItem value="saudi_arabia">🇸🇦 Saudi Arabia</SelectItem>
              <SelectItem value="uae">🇦🇪 United Arab Emirates</SelectItem>
              <SelectItem value="usa">🇺🇸 United States</SelectItem>
              <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
              <SelectItem value="canada">🇨🇦 Canada</SelectItem>
              <SelectItem value="australia">🇦🇺 Australia</SelectItem>
              <SelectItem value="germany">🇩🇪 Germany</SelectItem>
              <SelectItem value="france">🇫🇷 France</SelectItem>
              <SelectItem value="italy">🇮🇹 Italy</SelectItem>
              <SelectItem value="spain">🇪🇸 Spain</SelectItem>
              <SelectItem value="turkey">🇹🇷 Turkey</SelectItem>
              <SelectItem value="lebanon">🇱🇧 Lebanon</SelectItem>
              <SelectItem value="jordan">🇯🇴 Jordan</SelectItem>
              <SelectItem value="morocco">🇲🇦 Morocco</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-xl p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-brand-primary-800 mb-2">Why we need this information</h3>
            <p className="text-brand-primary-700 text-sm">
              Your nationality helps us suggest culturally appropriate meals and understand your dietary preferences. 
              All information is kept private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Scale className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-brand-neutral-800 mb-3">Physical measurements</h2>
        <p className="text-brand-neutral-600 text-lg">Help us calculate your personalized fitness plan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Height (cm)
          </Label>
          <div className="relative">
            <Ruler className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-secondary-500" />
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              placeholder="170"
              className="pl-12 h-12 lg:h-14 text-lg border-2 border-brand-secondary-200 focus:border-brand-secondary-500 rounded-xl"
              min="100"
              max="250"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Weight (kg)
          </Label>
          <div className="relative">
            <Scale className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-secondary-500" />
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="70"
              className="pl-12 h-12 lg:h-14 text-lg border-2 border-brand-secondary-200 focus:border-brand-secondary-500 rounded-xl"
              min="30"
              max="300"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Heart className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-brand-neutral-800 mb-3">Food & Cooking Preferences</h2>
        <p className="text-brand-neutral-600 text-lg">Help us create meal plans that fit your lifestyle</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cookingSkill" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            👩‍🍳 Cooking Skill Level
          </Label>
          <Select value={formData.cookingSkill} onValueChange={(value) => handleInputChange('cookingSkill', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-accent-200 focus:border-brand-accent-500 rounded-xl">
              <SelectValue placeholder="Select your cooking skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">🥗 Beginner (Simple recipes, minimal prep)</SelectItem>
              <SelectItem value="intermediate">🍝 Intermediate (Moderate cooking experience)</SelectItem>
              <SelectItem value="advanced">👨‍🍳 Advanced (Complex recipes, love cooking)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrepTime" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            ⏰ Maximum Prep Time
          </Label>
          <Select value={formData.maxPrepTime} onValueChange={(value) => handleInputChange('maxPrepTime', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-accent-200 focus:border-brand-accent-500 rounded-xl">
              <SelectValue placeholder="How long can you spend cooking?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">⚡ 15 minutes or less</SelectItem>
              <SelectItem value="30">🏃 30 minutes</SelectItem>
              <SelectItem value="45">🍳 45 minutes</SelectItem>
              <SelectItem value="60">👨‍🍳 1 hour</SelectItem>
              <SelectItem value="90">🧑‍🍳 1.5 hours or more</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            🥗 Dietary Restrictions (Optional)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: 'vegetarian', label: '🥬 Vegetarian' },
              { value: 'vegan', label: '🌱 Vegan' },
              { value: 'gluten_free', label: '🌾 Gluten-Free' },
              { value: 'dairy_free', label: '🥛 Dairy-Free' },
              { value: 'halal', label: '☪️ Halal' },
              { value: 'kosher', label: '✡️ Kosher' }
            ].map((restriction) => (
              <button
                key={restriction.value}
                type="button"
                onClick={() => handleArrayInputChange('dietaryRestrictions', restriction.value)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  formData.dietaryRestrictions.includes(restriction.value)
                    ? 'border-brand-accent-500 bg-brand-accent-50 text-brand-accent-700'
                    : 'border-brand-neutral-200 bg-white text-brand-neutral-600 hover:border-brand-neutral-300'
                }`}
              >
                {restriction.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-accent-50 border border-brand-accent-200 rounded-xl p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 text-brand-accent-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-brand-accent-800 mb-2">Personalized Meal Planning</h3>
            <p className="text-brand-accent-700 text-sm">
              We'll create meal plans that match your cooking skills, time availability, and dietary needs. 
              You can always adjust these preferences later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Activity className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-brand-neutral-800 mb-3">Workout Preferences</h2>
        <p className="text-brand-neutral-600 text-lg">Let's set up your exercise routine for success</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fitnessLevel" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            💪 Current Fitness Level
          </Label>
          <Select value={formData.fitnessLevel} onValueChange={(value) => handleInputChange('fitnessLevel', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-primary-200 focus:border-brand-primary-500 rounded-xl">
              <SelectValue placeholder="Select your fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">🌱 Beginner (New to exercise)</SelectItem>
              <SelectItem value="intermediate">🏃 Intermediate (Some experience)</SelectItem>
              <SelectItem value="advanced">💪 Advanced (Regular exerciser)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workoutLocation" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            📍 Preferred Workout Location
          </Label>
          <Select value={formData.workoutLocation} onValueChange={(value) => handleInputChange('workoutLocation', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-primary-200 focus:border-brand-primary-500 rounded-xl">
              <SelectValue placeholder="Where do you prefer to workout?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">🏠 Home</SelectItem>
              <SelectItem value="gym">🏋️ Gym</SelectItem>
              <SelectItem value="outdoor">🌳 Outdoor</SelectItem>
              <SelectItem value="mixed">🔄 Mixed (Home + Gym)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableWorkoutDays" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            📅 Available Workout Days per Week
          </Label>
          <Select value={formData.availableWorkoutDays} onValueChange={(value) => handleInputChange('availableWorkoutDays', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-primary-200 focus:border-brand-primary-500 rounded-xl">
              <SelectValue placeholder="How many days can you workout?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 days per week</SelectItem>
              <SelectItem value="3">3 days per week</SelectItem>
              <SelectItem value="4">4 days per week</SelectItem>
              <SelectItem value="5">5 days per week</SelectItem>
              <SelectItem value="6">6 days per week</SelectItem>
              <SelectItem value="7">7 days per week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            🏋️ Available Equipment (Optional)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: 'bodyweight', label: '🤸 Bodyweight' },
              { value: 'dumbbells', label: '🏋️ Dumbbells' },
              { value: 'resistance_bands', label: '🎯 Resistance Bands' },
              { value: 'kettlebells', label: '⚫ Kettlebells' },
              { value: 'pull_up_bar', label: '🔗 Pull-up Bar' },
              { value: 'full_gym', label: '🏢 Full Gym Access' }
            ].map((equipment) => (
              <button
                key={equipment.value}
                type="button"
                onClick={() => handleArrayInputChange('workoutEquipment', equipment.value)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  formData.workoutEquipment.includes(equipment.value)
                    ? 'border-brand-primary-500 bg-brand-primary-50 text-brand-primary-700'
                    : 'border-brand-neutral-200 bg-white text-brand-neutral-600 hover:border-brand-neutral-300'
                }`}
              >
                {equipment.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-xl p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-brand-primary-800 mb-2">Smart Exercise Planning</h3>
            <p className="text-brand-primary-700 text-sm">
              We'll create workout plans that match your fitness level, available equipment, and schedule. 
              Our AI adapts exercises based on your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Target className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-brand-neutral-800 mb-3">Your fitness goals</h2>
        <p className="text-brand-neutral-600 text-lg">What would you like to achieve on your journey?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="activity" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Level
          </Label>
          <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-secondary-200 focus:border-brand-secondary-500 rounded-xl">
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">🪑 Sedentary (Little to no exercise)</SelectItem>
              <SelectItem value="lightly_active">🚶 Lightly Active (Light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderately_active">🏃 Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="very_active">💪 Very Active (Hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="extra_active">🔥 Extra Active (Very hard exercise, physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal" className="text-sm font-semibold text-brand-neutral-700 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Fitness Goal
          </Label>
          <Select value={formData.fitnessGoal} onValueChange={(value) => handleInputChange('fitnessGoal', value)}>
            <SelectTrigger className="h-12 lg:h-14 text-lg border-2 border-brand-secondary-200 focus:border-brand-secondary-500 rounded-xl">
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose_weight">⬇️ Lose Weight</SelectItem>
              <SelectItem value="gain_weight">⬆️ Gain Weight</SelectItem>
              <SelectItem value="maintain_weight">⚖️ Maintain Weight</SelectItem>
              <SelectItem value="build_muscle">💪 Build Muscle</SelectItem>
              <SelectItem value="improve_fitness">🎯 Improve Overall Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-brand-secondary-50 border border-brand-secondary-200 rounded-xl p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-brand-secondary-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-brand-secondary-800 mb-2">Almost Done! 🎉</h3>
            <p className="text-brand-secondary-700 text-sm">
              You're about to complete your FitFatta setup! We'll use all this information to create your 
              personalized fitness and nutrition plan powered by AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-white to-brand-secondary-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="bg-brand-primary-100 text-brand-primary-700 border-brand-primary-200 mb-6 px-4 py-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 mr-2" />
            Onboarding
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-neutral-800 mb-4">
            Welcome to <span className="bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent">FitFatta</span>
          </h1>
          <p className="text-brand-neutral-600 text-lg lg:text-xl max-w-2xl mx-auto">
            Let's personalize your fitness journey in just a few steps
          </p>
        </div>

        {/* Enhanced Progress */}
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step.id < currentStep
                        ? 'bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg'
                        : step.id === currentStep
                        ? `bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 text-white shadow-xl scale-110`
                        : 'bg-brand-neutral-100 text-brand-neutral-400 border-2 border-brand-neutral-200'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`text-sm lg:text-base font-semibold ${
                      step.id <= currentStep ? 'text-brand-neutral-800' : 'text-brand-neutral-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs lg:text-sm text-brand-neutral-500 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 lg:mx-6 rounded-full transition-all duration-300 ${
                      step.id < currentStep ? 'bg-gradient-to-r from-success-500 to-success-600' : 'bg-brand-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-3 lg:h-4 rounded-full" />
          <div className="flex justify-between text-sm lg:text-base text-brand-neutral-500 mt-3">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>

        {/* Enhanced Form */}
        <Card className="p-8 lg:p-12 mb-8 lg:mb-12 bg-white/80 backdrop-blur-sm border-2 border-brand-primary-100 shadow-xl rounded-3xl">
          {renderStepContent()}
        </Card>

        {/* Enhanced Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 h-12 lg:h-14 px-6 lg:px-8 text-base border-2 border-brand-neutral-200 hover:border-brand-neutral-300 rounded-xl order-2 sm:order-1"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 order-1 sm:order-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-brand-neutral-500 hover:text-brand-neutral-700 h-12 lg:h-14 px-6 lg:px-8 text-base"
            >
              Skip for now
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex items-center space-x-2 min-w-[160px] h-12 lg:h-14 px-6 lg:px-8 text-base font-semibold bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next'}</span>
                  {currentStep === totalSteps ? <Zap className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 