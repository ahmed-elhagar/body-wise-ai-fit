
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { SignupFormData } from "../types";

interface HealthInfoStepProps {
  formData: SignupFormData;
  handleArrayInput: (field: keyof SignupFormData, value: string) => void;
}

const HealthInfoStep = ({ formData, handleArrayInput }: HealthInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
          <Info className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health & Diet Information</h2>
        <p className="text-gray-600">Help us personalize your experience (Optional)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="preferredFoods">Preferred Foods</Label>
          <Textarea
            id="preferredFoods"
            value={formData.preferredFoods.join(', ')}
            onChange={(e) => handleArrayInput('preferredFoods', e.target.value)}
            placeholder="e.g., Chicken, Rice, Vegetables, Fish"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
          <Textarea
            id="dietaryRestrictions"
            value={formData.dietaryRestrictions.join(', ')}
            onChange={(e) => handleArrayInput('dietaryRestrictions', e.target.value)}
            placeholder="e.g., Vegetarian, Gluten-free, Keto"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies & Intolerances</Label>
          <Textarea
            id="allergies"
            value={formData.allergies.join(', ')}
            onChange={(e) => handleArrayInput('allergies', e.target.value)}
            placeholder="e.g., Nuts, Dairy, Shellfish"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="healthConditions">Health Conditions</Label>
          <Textarea
            id="healthConditions"
            value={formData.healthConditions.join(', ')}
            onChange={(e) => handleArrayInput('healthConditions', e.target.value)}
            placeholder="e.g., Diabetes, Hypertension"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Separate items with commas</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialConditions">Special Conditions</Label>
        <Textarea
          id="specialConditions"
          value={formData.specialConditions.join(', ')}
          onChange={(e) => handleArrayInput('specialConditions', e.target.value)}
          placeholder="e.g., Pregnancy, Breastfeeding, Recovery from injury"
          rows={2}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">Separate items with commas</p>
      </div>
    </div>
  );
};

export default HealthInfoStep;
