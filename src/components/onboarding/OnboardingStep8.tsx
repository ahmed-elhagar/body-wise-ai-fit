
import { Utensils } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OnboardingStep8Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep8 = ({ formData, updateFormData }: OnboardingStep8Props) => {
  const commonDietaryRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Keto',
    'Low-carb',
    'Halal',
    'Kosher',
    'Paleo',
    'Mediterranean'
  ];

  const commonAllergies = [
    'Nuts',
    'Peanuts',
    'Dairy',
    'Eggs',
    'Shellfish',
    'Fish',
    'Soy',
    'Wheat',
    'Sesame',
    'Sulfites'
  ];

  const toggleDietaryRestriction = (restriction: string) => {
    const currentRestrictions = formData.dietary_restrictions || [];
    const isSelected = currentRestrictions.includes(restriction);
    
    if (isSelected) {
      updateFormData("dietary_restrictions", currentRestrictions.filter(r => r !== restriction));
    } else {
      updateFormData("dietary_restrictions", [...currentRestrictions, restriction]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    const currentAllergies = formData.allergies || [];
    const isSelected = currentAllergies.includes(allergy);
    
    if (isSelected) {
      updateFormData("allergies", currentAllergies.filter(a => a !== allergy));
    } else {
      updateFormData("allergies", [...currentAllergies, allergy]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Dietary Preferences</h2>
        <p className="text-gray-600 text-sm sm:text-base">Customize your meal plans</p>
        <div className="inline-flex items-center gap-2 mt-2">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Optional</span>
        </div>
      </div>

      <div className="space-y-6 px-4">
        {/* Dietary Restrictions */}
        <Card className="p-4 border-2 border-green-200 bg-green-50/50">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Dietary Restrictions
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonDietaryRestrictions.map((restriction) => (
              <Button
                key={restriction}
                type="button"
                variant={formData.dietary_restrictions?.includes(restriction) ? "default" : "outline"}
                size="sm"
                className="h-auto py-2 px-3 text-xs"
                onClick={() => toggleDietaryRestriction(restriction)}
              >
                {restriction}
              </Button>
            ))}
          </div>
        </Card>

        {/* Allergies */}
        <Card className="p-4 border-2 border-red-200 bg-red-50/50">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Food Allergies
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonAllergies.map((allergy) => (
              <Button
                key={allergy}
                type="button"
                variant={formData.allergies?.includes(allergy) ? "default" : "outline"}
                size="sm"
                className="h-auto py-2 px-3 text-xs"
                onClick={() => toggleAllergy(allergy)}
              >
                {allergy}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingStep8;
