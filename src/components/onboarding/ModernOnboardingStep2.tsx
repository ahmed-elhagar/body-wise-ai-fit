
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Weight, Zap } from "lucide-react";
import BodyShapeSelector from "@/components/BodyShapeSelector";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface ModernOnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
}

const ModernOnboardingStep2 = ({ formData, updateFormData }: ModernOnboardingStep2Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <Ruler className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your physical profile</h2>
        <p className="text-gray-600">Help us understand your body measurements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-500" />
            Height (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="e.g., 175"
            className="h-12 border-2 border-gray-200 focus:border-emerald-500 transition-colors rounded-xl"
            min="100"
            max="250"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Weight className="w-4 h-4 text-emerald-500" />
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="e.g., 70"
            className="h-12 border-2 border-gray-200 focus:border-emerald-500 transition-colors rounded-xl"
            min="30"
            max="300"
            required
          />
        </div>
      </div>

      <div className="mt-8">
        <Label className="text-sm font-medium text-gray-700 mb-4 block flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-500" />
          Body Shape (Optional)
        </Label>
        <BodyShapeSelector
          value={formData.body_shape}
          onChange={(value) => updateFormData("body_shape", value)}
          gender={formData.gender}
        />
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-emerald-800 mb-1">Privacy & Security</h4>
            <p className="text-sm text-emerald-700">Your measurements are used only for calculating accurate calorie needs and exercise recommendations. All data is securely encrypted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernOnboardingStep2;
