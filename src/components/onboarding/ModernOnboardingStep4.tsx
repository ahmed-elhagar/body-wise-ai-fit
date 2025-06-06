
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UtensilsCrossed, ShieldAlert, Heart } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface ModernOnboardingStep4Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const ModernOnboardingStep4 = ({ formData, updateFormData, handleArrayInput }: ModernOnboardingStep4Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Food preferences</h2>
        <p className="text-gray-600">Tell us about your dietary preferences and restrictions <span className="text-orange-500">(Optional)</span></p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="allergies" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            Food Allergies
          </Label>
          <Input
            id="allergies"
            value={formData.allergies.join(', ')}
            placeholder="e.g., nuts, dairy, gluten (comma-separated)"
            onChange={(e) => handleArrayInput("allergies", e.target.value)}
            className="h-12 border-2 border-gray-200 focus:border-orange-500 transition-colors rounded-xl"
          />
          <p className="text-xs text-gray-500">This ensures your meal plans are safe for you</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_foods" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-orange-500" />
            Preferred Foods
          </Label>
          <Textarea
            id="preferred_foods"
            value={formData.preferred_foods.join(', ')}
            placeholder="Foods you enjoy eating (comma-separated)"
            onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
            className="min-h-[80px] border-2 border-gray-200 focus:border-orange-500 transition-colors rounded-xl resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietary_restrictions" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            Dietary Restrictions
          </Label>
          <Input
            id="dietary_restrictions"
            value={formData.dietary_restrictions.join(', ')}
            placeholder="e.g., vegetarian, vegan, keto (comma-separated)"
            onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
            className="h-12 border-2 border-gray-200 focus:border-orange-500 transition-colors rounded-xl"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-800 mb-1">Skip if you want!</h4>
            <p className="text-sm text-orange-700">This step is completely optional. You can always update your food preferences later in your profile settings. We'll start with general recommendations.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Almost done! One more click to complete your setup.
        </div>
      </div>
    </div>
  );
};

export default ModernOnboardingStep4;
