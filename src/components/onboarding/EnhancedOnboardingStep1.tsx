
import { User, Calendar, Ruler, Weight, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GenderSelector from "./GenderSelector";
import SearchableNationalitySelector from "./SearchableNationalitySelector";

interface EnhancedOnboardingStep1Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
}

const EnhancedOnboardingStep1 = ({ formData, updateFormData }: EnhancedOnboardingStep1Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's get to know you</h2>
        <p className="text-gray-600">Tell us about yourself to create your personalized plan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            First Name *
          </Label>
          <Input
            id="first_name"
            type="text"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Your first name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="first-name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Last Name *
          </Label>
          <Input
            id="last_name"
            type="text"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Your last name"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="last-name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Your age"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="age"
            min="16"
            max="100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-blue-500" />
            Gender *
          </Label>
          <GenderSelector
            value={formData.gender}
            onChange={(value) => updateFormData("gender", value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-500" />
            Height (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="e.g., 175"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="height"
            min="100"
            max="250"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Weight className="w-4 h-4 text-blue-500" />
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="e.g., 70"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            data-testid="weight"
            min="30"
            max="300"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <SearchableNationalitySelector
          value={formData.nationality || "prefer_not_to_say"}
          onChange={(value) => updateFormData("nationality", value)}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Privacy & Security</h4>
            <p className="text-sm text-blue-700">Your personal information is encrypted and secure. We use this data only to create your personalized fitness plan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep1;
