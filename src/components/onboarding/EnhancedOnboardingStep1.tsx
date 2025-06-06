
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GenderSelector from "./GenderSelector";
import NationalitySelector from "./NationalitySelector";

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's get to know you</h2>
        <p className="text-gray-600">Basic information to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
            First Name *
          </Label>
          <Input
            id="first_name"
            data-testid="first-name"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Enter your first name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
            Last Name *
          </Label>
          <Input
            id="last_name"
            data-testid="last-name"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age *
          </Label>
          <Input
            id="age"
            data-testid="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Your age"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            min="13"
            max="120"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height (cm) *
          </Label>
          <Input
            id="height"
            data-testid="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="Your height"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            min="100"
            max="250"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            data-testid="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="Your weight"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            min="30"
            max="300"
            required
          />
        </div>

        <div className="md:col-span-2">
          <GenderSelector
            value={formData.gender}
            onChange={(value) => updateFormData("gender", value)}
          />
        </div>

        <div className="md:col-span-2">
          <NationalitySelector
            value={formData.nationality}
            onChange={(value) => updateFormData("nationality", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep1;
