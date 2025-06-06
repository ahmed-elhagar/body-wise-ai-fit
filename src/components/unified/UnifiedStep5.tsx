
import { Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedFormData } from "@/hooks/useUnifiedForm";

interface UnifiedStep5Props {
  formData: UnifiedFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const UnifiedStep5 = ({ formData, updateFormData }: UnifiedStep5Props) => {
  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, arrayValue);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health & Preferences</h2>
        <p className="text-gray-600">Help us create safer, personalized recommendations</p>
        <div className="inline-flex items-center gap-2 mt-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Optional</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Health Conditions or Concerns
          </Label>
          <Textarea
            value={Array.isArray(formData.health_conditions) ? formData.health_conditions.join(', ') : ''}
            onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
            placeholder="e.g., diabetes, high blood pressure, knee injury (separate with commas)"
            className="min-h-[80px] border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Food Allergies
          </Label>
          <Textarea
            value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : ''}
            onChange={(e) => handleArrayInput("allergies", e.target.value)}
            placeholder="e.g., nuts, dairy, gluten (separate with commas)"
            className="min-h-[80px] border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Preferred Foods
          </Label>
          <Textarea
            value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods.join(', ') : ''}
            onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
            placeholder="e.g., chicken, salmon, quinoa, vegetables (separate with commas)"
            className="min-h-[80px] border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Dietary Restrictions
          </Label>
          <Textarea
            value={Array.isArray(formData.dietary_restrictions) ? formData.dietary_restrictions.join(', ') : ''}
            onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
            placeholder="e.g., vegetarian, vegan, keto, halal (separate with commas)"
            className="min-h-[80px] border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Privacy Note:</strong> This information helps us create safer, more personalized recommendations. 
            Your health data is confidential and will only be used to improve your fitness and nutrition plans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedStep5;
