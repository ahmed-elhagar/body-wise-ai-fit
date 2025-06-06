
import { Heart } from "lucide-react";
import { NewSignupFormData } from "@/hooks/useNewSignupForm";
import AutocompleteInput from "../autocomplete/AutocompleteInput";

interface Step6HealthPreferencesProps {
  formData: NewSignupFormData;
  updateFormData: (field: string, value: string[]) => void;
}

const Step6HealthPreferences = ({ formData, updateFormData }: Step6HealthPreferencesProps) => {
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-8">
        <AutocompleteInput
          label="Health Conditions"
          placeholder="Type to search health conditions..."
          suggestions={healthConditionsSuggestions}
          selectedItems={formData.health_conditions}
          onSelectionChange={(items) => updateFormData("health_conditions", items)}
          maxSelections={5}
        />

        <AutocompleteInput
          label="Food Allergies"
          placeholder="Type to search allergies..."
          suggestions={allergiesSuggestions}
          selectedItems={formData.allergies}
          onSelectionChange={(items) => updateFormData("allergies", items)}
          maxSelections={8}
        />

        <AutocompleteInput
          label="Dietary Restrictions"
          placeholder="Type to search dietary preferences..."
          suggestions={dietaryRestrictionsSuggestions}
          selectedItems={formData.dietary_restrictions}
          onSelectionChange={(items) => updateFormData("dietary_restrictions", items)}
          maxSelections={5}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Optional Step:</strong> This information helps us create safer, more personalized meal plans. You can skip this step and add details later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step6HealthPreferences;
