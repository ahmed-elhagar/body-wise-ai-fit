import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GenderSelector } from "@/features/onboarding";

interface PhysicalInfoStepProps {
  height: string;
  weight: string;
  gender: string;
  healthIssues: string[];
  onHeightChange: (height: string) => void;
  onWeightChange: (weight: string) => void;
  onGenderChange: (gender: string) => void;
  onHealthIssuesChange: (healthIssues: string[]) => void;
}

const PhysicalInfoStep = ({
  height,
  weight,
  gender,
  healthIssues,
  onHeightChange,
  onWeightChange,
  onGenderChange,
  onHealthIssuesChange
}: PhysicalInfoStepProps) => {
  return (
    <div className="space-y-6">
      {/* Height and Weight Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height (cm)
          </Label>
          <Input
            type="number"
            id="height"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="Enter your height in cm"
            className="border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg)
          </Label>
          <Input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="Enter your weight in kg"
            className="border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          />
        </div>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Gender
        </Label>
        <GenderSelector value={gender} onChange={onGenderChange} />
      </div>

      {/* Health Issues Input */}
      <div>
        <Label className="text-sm font-medium text-gray-700">
          Any health conditions or concerns? (Optional)
        </Label>
        <Textarea
          placeholder="e.g., diabetes, high blood pressure, knee injury, etc."
          className="min-h-[100px] border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
        />
        <p className="text-xs text-gray-500">
          This information helps us create safer, more personalized recommendations for you.
        </p>
      </div>
    </div>
  );
};

export default PhysicalInfoStep;
