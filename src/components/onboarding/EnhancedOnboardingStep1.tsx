
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EnhancedOnboardingStep1Props {
  formData: any;
  updateFormData: (field: string, value: string) => void;
}

const EnhancedOnboardingStep1 = ({ formData, updateFormData }: EnhancedOnboardingStep1Props) => {
  const nationalities = [
    "prefer_not_to_say",
    "american",
    "british",
    "canadian",
    "australian",
    "german",
    "french",
    "spanish",
    "italian",
    "japanese",
    "chinese",
    "indian",
    "brazilian",
    "mexican",
    "other"
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">
            First Name *
          </Label>
          <Input
            id="first_name"
            data-testid="first-name"
            value={formData.first_name}
            onChange={(e) => updateFormData('first_name', e.target.value)}
            placeholder="Enter your first name"
            className="w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
            Last Name *
          </Label>
          <Input
            id="last_name"
            data-testid="last-name"
            value={formData.last_name}
            onChange={(e) => updateFormData('last_name', e.target.value)}
            placeholder="Enter your last name"
            className="w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-sm font-medium text-gray-700 mb-2 block">
            Age *
          </Label>
          <Input
            id="age"
            data-testid="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData('age', e.target.value)}
            placeholder="Your age"
            min="16"
            max="100"
            className="w-full"
            required
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Gender *
          </Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => updateFormData('gender', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" data-testid="gender-male" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" data-testid="gender-female" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" data-testid="gender-other" />
              <Label htmlFor="other" className="cursor-pointer">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 mb-2 block">
            Height (cm) *
          </Label>
          <Input
            id="height"
            data-testid="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData('height', e.target.value)}
            placeholder="170"
            min="100"
            max="250"
            className="w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 mb-2 block">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            data-testid="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData('weight', e.target.value)}
            placeholder="70"
            min="30"
            max="300"
            className="w-full"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 mb-2 block">
          Nationality
        </Label>
        <Select value={formData.nationality} onValueChange={(value) => updateFormData('nationality', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your nationality" />
          </SelectTrigger>
          <SelectContent>
            {nationalities.map((nationality) => (
              <SelectItem key={nationality} value={nationality}>
                {nationality.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep1;
