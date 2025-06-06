
import { Heart } from "lucide-react";
import { SignupFormData } from "@/hooks/useSignupFlow";
import AutocompleteField from "../AutocompleteField";

interface HealthPreferencesStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: string[]) => void;
}

const HealthPreferencesStep = ({ formData, updateField }: HealthPreferencesStepProps) => {
  const healthConditionsSuggestions = [
    "Diabetes", "High Blood Pressure", "Heart Disease", "Asthma", "Arthritis",
    "Thyroid Issues", "PCOS", "Depression", "Anxiety", "Sleep Apnea",
    "High Cholesterol", "Osteoporosis", "Back Pain", "Knee Problems",
    "Acid Reflux", "IBS", "Migraine", "None"
  ];

  const allergiesSuggestions = [
    "Dairy", "Gluten", "Nuts", "Shellfish", "Eggs", "Soy", "Fish",
    "Peanuts", "Tree Nuts", "Sesame", "Lactose", "Wheat", "None"
  ];

  const dietaryRestrictionsSuggestions = [
    "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "Low Carb",
    "Low Fat", "High Protein", "Dairy-Free", "Gluten-Free", "Halal",
    "Kosher", "Intermittent Fasting", "Raw Food", "None"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Help us create safer, personalized plans</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <AutocompleteField
          label="Health Conditions"
          placeholder="Type to search health conditions..."
          suggestions={healthConditionsSuggestions}
          selectedItems={formData.healthConditions}
          onSelectionChange={(items) => updateField("healthConditions", items)}
          maxSelections={5}
        />

        <AutocompleteField
          label="Food Allergies"
          placeholder="Type to search allergies..."
          suggestions={allergiesSuggestions}
          selectedItems={formData.allergies}
          onSelectionChange={(items) => updateField("allergies", items)}
          maxSelections={8}
        />

        <AutocompleteField
          label="Dietary Restrictions"
          placeholder="Type to search dietary preferences..."
          suggestions={dietaryRestrictionsSuggestions}
          selectedItems={formData.dietaryRestrictions}
          onSelectionChange={(items) => updateField("dietaryRestrictions", items)}
          maxSelections={5}
        />

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Optional Step:</strong> This information helps us create safer, more personalized meal plans. You can skip this step and add details later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthPreferencesStep;
