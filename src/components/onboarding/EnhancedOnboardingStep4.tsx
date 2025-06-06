
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EnhancedOnboardingStep4Props {
  formData: any;
  updateFormData: (field: string, value: string | string[]) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const EnhancedOnboardingStep4 = ({ formData, updateFormData, handleArrayInput }: EnhancedOnboardingStep4Props) => {
  const commonAllergies = [
    'None',
    'Nuts',
    'Dairy',
    'Gluten',
    'Shellfish',
    'Eggs',
    'Soy',
    'Fish'
  ];

  const commonDietaryRestrictions = [
    'None',
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Keto',
    'Paleo',
    'Low Carb',
    'Low Fat'
  ];

  const commonPreferredFoods = [
    'Chicken',
    'Fish',
    'Beef',
    'Turkey',
    'Vegetables',
    'Fruits',
    'Rice',
    'Pasta',
    'Quinoa',
    'Oats',
    'Beans',
    'Nuts'
  ];

  const selectedAllergies = formData.allergies || [];
  const selectedDietaryRestrictions = formData.dietary_restrictions || [];
  const selectedPreferredFoods = formData.preferred_foods || [];

  const toggleSelection = (field: string, item: string, currentSelection: string[]) => {
    if (item === 'None') {
      updateFormData(field, ['None']);
      return;
    }

    let updated = currentSelection.filter(sel => sel !== 'None');
    
    if (updated.includes(item)) {
      updated = updated.filter(sel => sel !== item);
    } else {
      updated = [...updated, item];
    }
    
    if (updated.length === 0) {
      updated = ['None'];
    }
    
    updateFormData(field, updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Preferences</h2>
        <p className="text-gray-600">Tell us about your food preferences and restrictions</p>
      </div>

      {/* Allergies */}
      <div>
        <Label className="text-lg font-semibold text-gray-800 mb-4 block">
          Food Allergies
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonAllergies.map((allergy) => (
            <Button
              key={allergy}
              type="button"
              variant="outline"
              onClick={() => toggleSelection('allergies', allergy, selectedAllergies)}
              className={`h-auto p-3 text-sm border-2 transition-all duration-200 ${
                selectedAllergies.includes(allergy)
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {allergy}
            </Button>
          ))}
        </div>
        <div className="mt-3">
          <Textarea
            placeholder="Add other allergies (comma-separated)"
            value={selectedAllergies.filter(a => !commonAllergies.includes(a)).join(', ')}
            onChange={(e) => {
              const customAllergies = e.target.value;
              const commonSelected = selectedAllergies.filter(a => commonAllergies.includes(a));
              const customItems = customAllergies.split(',').map(item => item.trim()).filter(item => item.length > 0);
              updateFormData('allergies', [...commonSelected, ...customItems]);
            }}
            className="h-20 resize-none"
          />
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <Label className="text-lg font-semibold text-gray-800 mb-4 block">
          Dietary Restrictions
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonDietaryRestrictions.map((restriction) => (
            <Button
              key={restriction}
              type="button"
              variant="outline"
              onClick={() => toggleSelection('dietary_restrictions', restriction, selectedDietaryRestrictions)}
              className={`h-auto p-3 text-sm border-2 transition-all duration-200 ${
                selectedDietaryRestrictions.includes(restriction)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {restriction}
            </Button>
          ))}
        </div>
      </div>

      {/* Preferred Foods */}
      <div>
        <Label className="text-lg font-semibold text-gray-800 mb-4 block">
          Preferred Foods
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonPreferredFoods.map((food) => (
            <Button
              key={food}
              type="button"
              variant="outline"
              onClick={() => toggleSelection('preferred_foods', food, selectedPreferredFoods)}
              className={`h-auto p-3 text-sm border-2 transition-all duration-200 ${
                selectedPreferredFoods.includes(food)
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {food}
            </Button>
          ))}
        </div>
        <div className="mt-3">
          <Textarea
            placeholder="Add other preferred foods (comma-separated)"
            value={selectedPreferredFoods.filter(f => !commonPreferredFoods.includes(f)).join(', ')}
            onChange={(e) => {
              const customFoods = e.target.value;
              const commonSelected = selectedPreferredFoods.filter(f => commonPreferredFoods.includes(f));
              const customItems = customFoods.split(',').map(item => item.trim()).filter(item => item.length > 0);
              updateFormData('preferred_foods', [...commonSelected, ...customItems]);
            }}
            className="h-20 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Setup Summary</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
          <p><strong>Age:</strong> {formData.age} years old</p>
          <p><strong>Goal:</strong> {formData.fitness_goal?.replace(/_/g, ' ')}</p>
          <p><strong>Activity Level:</strong> {formData.activity_level?.replace(/_/g, ' ')}</p>
          <p><strong>Allergies:</strong> {selectedAllergies.join(', ') || 'None'}</p>
          <p><strong>Diet:</strong> {selectedDietaryRestrictions.join(', ') || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep4;
