import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, User, Target, Heart } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    nationality: "",
    // Health & Goals
    body_shape: "",
    health_conditions: [] as string[],
    fitness_goal: "",
    activity_level: "",
    // Nutrition
    allergies: [] as string[],
    preferred_foods: [] as string[],
    dietary_restrictions: [] as string[]
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save user data to Supabase
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender as any,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nationality: formData.nationality,
        body_shape: formData.body_shape as any,
        health_conditions: formData.health_conditions,
        fitness_goal: formData.fitness_goal as any,
        activity_level: formData.activity_level as any,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions
      };

      updateProfile(profileData);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateFormData(field, items);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fitness-gradient rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about yourself to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData("first_name", e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData("last_name", e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => updateFormData("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => updateFormData("nationality", e.target.value)}
                  placeholder="Your nationality"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                  placeholder="Enter your height"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>
              <div>
                <Label htmlFor="body_shape">Body Shape</Label>
                <Select onValueChange={(value) => updateFormData("body_shape", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ectomorph">Ectomorph (Naturally thin)</SelectItem>
                    <SelectItem value="mesomorph">Mesomorph (Athletic build)</SelectItem>
                    <SelectItem value="endomorph">Endomorph (Naturally curvy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fitness-gradient rounded-full mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Activity</h2>
              <p className="text-gray-600">Help us understand your fitness goals</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fitness_goal">Primary Fitness Goal</Label>
                <Select onValueChange={(value) => updateFormData("fitness_goal", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="weight_gain">Weight Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activity_level">Current Activity Level</Label>
                <Select onValueChange={(value) => updateFormData("activity_level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (2x per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="health_conditions">Health Conditions</Label>
                <Textarea
                  id="health_conditions"
                  placeholder="Any health conditions, injuries, or medical considerations (comma-separated)"
                  onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fitness-gradient rounded-full mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Nutrition Preferences</h2>
              <p className="text-gray-600">Tell us about your dietary preferences</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies">Food Allergies</Label>
                <Input
                  id="allergies"
                  placeholder="e.g., nuts, dairy, gluten (comma-separated)"
                  onChange={(e) => handleArrayInput("allergies", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="preferred_foods">Preferred Foods</Label>
                <Textarea
                  id="preferred_foods"
                  placeholder="Foods you enjoy eating (comma-separated)"
                  onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                <Input
                  id="dietary_restrictions"
                  placeholder="e.g., vegetarian, vegan, keto (comma-separated)"
                  onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Setup Your Profile</h1>
            <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={isUpdating}
              className="bg-fitness-gradient hover:opacity-90 text-white flex items-center space-x-2"
            >
              <span>{step === totalSteps ? 'Complete Setup' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
