
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { SignupFormData } from "../types";
import HealthConditionsAutocompleteEnhanced from "@/components/onboarding/HealthConditionsAutocompleteEnhanced";
import TagsAutocomplete from "@/components/ui/tags-autocomplete";

interface HealthInfoStepProps {
  formData: SignupFormData;
  handleArrayInput: (field: keyof SignupFormData, value: string[]) => void;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const PREFERRED_FOODS_SUGGESTIONS = [
  'Chicken', 'Fish', 'Rice', 'Quinoa', 'Vegetables', 'Fruits', 'Nuts', 'Eggs',
  'Greek Yogurt', 'Sweet Potatoes', 'Avocado', 'Salmon', 'Broccoli', 'Spinach',
  'Oats', 'Beans', 'Lentils', 'Turkey', 'Cottage Cheese', 'Berries'
];

const DIETARY_RESTRICTIONS_SUGGESTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo',
  'Low-carb', 'Low-fat', 'Mediterranean', 'Intermittent Fasting',
  'Pescatarian', 'Halal', 'Kosher', 'Raw Food', 'Whole30'
];

const SPECIAL_CONDITIONS_SUGGESTIONS = [
  'Pregnancy', 'Breastfeeding', 'Recovery from injury', 'Post-surgery',
  'Training for competition', 'Weight cutting', 'Bulking phase',
  'Muscle building', 'Endurance training', 'Strength training'
];

const HealthInfoStep = ({ formData, updateField }: HealthInfoStepProps) => {
  const handleHealthConditionsChange = (conditions: string[]) => {
    updateField('healthConditions', conditions);
  };

  const handleAllergiesChange = (allergies: string[]) => {
    updateField('allergies', allergies);
  };

  const handlePreferredFoodsChange = (foods: string[]) => {
    updateField('preferredFoods', foods);
  };

  const handleDietaryRestrictionsChange = (restrictions: string[]) => {
    updateField('dietaryRestrictions', restrictions);
  };

  const handleSpecialConditionsChange = (conditions: string[]) => {
    updateField('specialConditions', conditions);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
          <Info className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health & Diet Information</h2>
        <p className="text-gray-600">Help us personalize your experience (Optional)</p>
      </div>

      <div className="space-y-6">
        <HealthConditionsAutocompleteEnhanced
          selectedConditions={formData.healthConditions || []}
          onConditionsChange={handleHealthConditionsChange}
          label="Health Conditions"
          placeholder="Search for health conditions..."
        />

        <HealthConditionsAutocompleteEnhanced
          selectedConditions={formData.allergies || []}
          onConditionsChange={handleAllergiesChange}
          label="Allergies & Food Intolerances"
          placeholder="Search for allergies..."
        />

        <div className="grid grid-cols-1 gap-6">
          <TagsAutocomplete
            label="Preferred Foods"
            selectedTags={formData.preferredFoods || []}
            onTagsChange={handlePreferredFoodsChange}
            placeholder="Type to add preferred foods..."
            suggestions={PREFERRED_FOODS_SUGGESTIONS}
          />

          <TagsAutocomplete
            label="Dietary Restrictions"
            selectedTags={formData.dietaryRestrictions || []}
            onTagsChange={handleDietaryRestrictionsChange}
            placeholder="Type to add dietary restrictions..."
            suggestions={DIETARY_RESTRICTIONS_SUGGESTIONS}
          />
        </div>

        <TagsAutocomplete
          label="Special Conditions"
          selectedTags={formData.specialConditions || []}
          onTagsChange={handleSpecialConditionsChange}
          placeholder="Type to add special conditions..."
          suggestions={SPECIAL_CONDITIONS_SUGGESTIONS}
        />
      </div>
    </div>
  );
};

export default HealthInfoStep;
