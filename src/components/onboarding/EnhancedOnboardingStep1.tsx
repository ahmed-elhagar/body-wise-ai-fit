
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GenderSelector from "./GenderSelector";
import SearchableNationalitySelector from "./SearchableNationalitySelector";

interface EnhancedOnboardingStep1Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
}

const EnhancedOnboardingStep1 = ({ formData, updateFormData }: EnhancedOnboardingStep1Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about yourself to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">
            First Name *
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Enter your first name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="first-name"
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
            Last Name *
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="last-name"
            required
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-sm font-medium text-gray-700 mb-2 block">
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Enter your age"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="age"
            min="13"
            max="100"
            required
          />
        </div>
        <div>
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 mb-2 block">
            Height (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="Enter your height"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="height"
            min="100"
            max="250"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 mb-2 block">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="Enter your weight"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="weight"
            min="30"
            max="300"
            required
          />
        </div>
      </div>

      <div className="space-y-6">
        <GenderSelector
          value={formData.gender}
          onChange={(value) => updateFormData("gender", value)}
        />

        <SearchableNationalitySelector
          value={formData.nationality}
          onChange={(value) => updateFormData("nationality", value)}
        />
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep1;
