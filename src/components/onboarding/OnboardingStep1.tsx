
import { User } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OnboardingStep1Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep1 = ({ formData, updateFormData }: OnboardingStep1Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
        <p className="text-gray-600 text-sm sm:text-base">Let's start with your basic details</p>
      </div>

      {/* Name Fields - Stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4">
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
            className="h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl text-base"
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
            className="h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl text-base"
            data-testid="last-name"
          />
        </div>
      </div>

      {/* Age */}
      <div className="px-4">
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
            className="h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl text-base max-w-xs"
            data-testid="age"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep1;
