
import { Target } from "lucide-react";
import BodyShapeSelector from "@/components/auth/BodyShapeSelector";
import { SignupFormData } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BodyCompositionStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const BodyCompositionStep = ({ formData, updateField }: BodyCompositionStepProps) => {
  // Ensure there's always a default value
  const currentBodyFat = formData.bodyFatPercentage || (formData.gender === 'male' ? 20 : 25);
  
  const handleBodyFatChange = (value: number) => {
    console.log('Body fat percentage changed to:', value);
    updateField("bodyFatPercentage", value);
  };

  const handleBodyShapeChange = (value: string) => {
    updateField("bodyShape", value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600">Select your current body type to help us create your personalized plan</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bodyShape">Body Shape</Label>
          <Select value={formData.bodyShape || ''} onValueChange={handleBodyShapeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your body shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ectomorph">Ectomorph (Lean/Thin)</SelectItem>
              <SelectItem value="mesomorph">Mesomorph (Athletic/Muscular)</SelectItem>
              <SelectItem value="endomorph">Endomorph (Rounded/Soft)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <BodyShapeSelector
          value={currentBodyFat}
          onChange={handleBodyFatChange}
          gender={formData.gender || 'male'}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't worry if you're not sure - you can always adjust this later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default BodyCompositionStep;
