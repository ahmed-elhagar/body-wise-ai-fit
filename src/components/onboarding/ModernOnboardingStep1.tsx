
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Sparkles } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface ModernOnboardingStep1Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
}

const ModernOnboardingStep1 = ({ formData, updateFormData }: ModernOnboardingStep1Props) => {
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
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            First Name *
          </Label>
          <Input
            id="first_name"
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
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender *
          </Label>
          <Select 
            value={formData.gender} 
            onValueChange={(value) => updateFormData("gender", value)} 
            required
          >
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
            Nationality *
          </Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => updateFormData("nationality", e.target.value)}
            placeholder="Your nationality"
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Why do we need this?</h4>
            <p className="text-sm text-blue-700">This basic information helps us create personalized meal plans and exercise recommendations that fit your profile perfectly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernOnboardingStep1;
