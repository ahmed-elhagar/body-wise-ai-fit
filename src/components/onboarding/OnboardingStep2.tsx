
import { Ruler } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GenderSelector from "./GenderSelector";

interface OnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep2 = ({ formData, updateFormData }: OnboardingStep2Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Ruler className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Physical Stats</h2>
        <p className="text-gray-600 text-sm sm:text-base">Tell us about your physical measurements</p>
      </div>

      {/* Gender Selector */}
      <div className="px-4">
        <GenderSelector
          value={formData.gender}
          onChange={(value) => updateFormData("gender", value)}
        />
      </div>

      {/* Physical Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="170"
            min="100"
            max="250"
            className="h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl text-base"
            data-testid="height"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="70"
            min="30"
            max="300"
            className="h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl text-base"
            data-testid="weight"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;
