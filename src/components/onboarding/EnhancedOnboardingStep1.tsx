
import { User } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GenderSelector from "./GenderSelector";
import NationalitySelector from "./NationalitySelector";

interface EnhancedOnboardingStep1Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep1 = ({ formData, updateFormData }: EnhancedOnboardingStep1Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">Basic information to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
            First Name *
          </Label>
          <Input
            id="first_name"
            type="text"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Enter your first name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="first-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
            Last Name *
          </Label>
          <Input
            id="last_name"
            type="text"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="last-name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="25"
            min="13"
            max="100"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="age"
          />
        </div>

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
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
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
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="weight"
          />
        </div>
      </div>

      <GenderSelector
        value={formData.gender}
        onChange={(value) => updateFormData("gender", value)}
      />

      <NationalitySelector
        value={formData.nationality}
        onChange={(value) => updateFormData("nationality", value)}
      />
    </div>
  );
};

export default EnhancedOnboardingStep1;
