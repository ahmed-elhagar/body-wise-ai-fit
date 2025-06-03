
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Target, Activity, Heart } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface ModernOnboardingStep3Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const ModernOnboardingStep3 = ({ formData, updateFormData, handleArrayInput }: ModernOnboardingStep3Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your fitness goals</h2>
        <p className="text-gray-600">What do you want to achieve on your fitness journey?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fitness_goal" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-500" />
            Primary Fitness Goal *
          </Label>
          <Select 
            value={formData.fitness_goal}
            onValueChange={(value) => updateFormData("fitness_goal", value)} 
            required
          >
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors rounded-xl">
              <SelectValue placeholder="What's your main goal?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">🎯 Weight Loss</SelectItem>
              <SelectItem value="muscle_gain">💪 Muscle Gain</SelectItem>
              <SelectItem value="maintenance">⚖️ Weight Maintenance</SelectItem>
              <SelectItem value="endurance">🏃 Improve Endurance</SelectItem>
              <SelectItem value="weight_gain">📈 Weight Gain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity_level" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Current Activity Level *
          </Label>
          <Select 
            value={formData.activity_level}
            onValueChange={(value) => updateFormData("activity_level", value)} 
            required
          >
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors rounded-xl">
              <SelectValue placeholder="How active are you currently?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">😴 Sedentary (little to no exercise)</SelectItem>
              <SelectItem value="lightly_active">🚶 Lightly Active (1-3 days/week)</SelectItem>
              <SelectItem value="moderately_active">🏃 Moderately Active (3-5 days/week)</SelectItem>
              <SelectItem value="very_active">💪 Very Active (6-7 days/week)</SelectItem>
              <SelectItem value="extremely_active">🔥 Extremely Active (2x per day)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="health_conditions" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-purple-500" />
            Health Conditions (Optional)
          </Label>
          <Textarea
            id="health_conditions"
            value={formData.health_conditions.join(', ')}
            placeholder="Any health conditions, injuries, or medical considerations (comma-separated)"
            onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
            className="min-h-[100px] border-2 border-gray-200 focus:border-purple-500 transition-colors rounded-xl resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500">This helps us create safer workout recommendations for you</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-purple-800 mb-1">Personalized Recommendations</h4>
            <p className="text-sm text-purple-700">Your goals and activity level help us create workout plans and meal recommendations that match your fitness level and aspirations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernOnboardingStep3;
