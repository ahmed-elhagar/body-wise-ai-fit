
import { Baby } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UnifiedFormData } from "@/hooks/useUnifiedForm";

interface UnifiedStep6Props {
  formData: UnifiedFormData;
  updateFormData: (field: string, value: string) => void;
}

const UnifiedStep6 = ({ formData, updateFormData }: UnifiedStep6Props) => {
  const specialConditions = [
    { id: 'pregnancy', label: 'Pregnancy', description: 'Currently pregnant' },
    { id: 'breastfeeding', label: 'Breastfeeding', description: 'Currently breastfeeding' },
    { id: 'fasting', label: 'Intermittent Fasting', description: 'Following fasting routine' },
  ];

  const handleSpecialConditionToggle = (conditionId: string) => {
    const currentConditions = Array.isArray(formData.special_conditions) ? formData.special_conditions : [];
    
    if (currentConditions.includes(conditionId)) {
      const newConditions = currentConditions.filter(c => c !== conditionId);
      updateFormData('special_conditions', newConditions.join(','));
      
      // Reset related fields when unchecked
      if (conditionId === 'pregnancy') {
        updateFormData('pregnancy_trimester', 'none');
      } else if (conditionId === 'breastfeeding') {
        updateFormData('breastfeeding_level', 'none');
      } else if (conditionId === 'fasting') {
        updateFormData('fasting_type', 'none');
      }
    } else {
      const newConditions = [...currentConditions, conditionId];
      updateFormData('special_conditions', newConditions.join(','));
    }
  };

  const isConditionSelected = (conditionId: string) => {
    const conditions = Array.isArray(formData.special_conditions) ? formData.special_conditions : [];
    return conditions.includes(conditionId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-4 shadow-lg">
          <Baby className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Special Conditions</h2>
        <p className="text-gray-600">Help us adjust your nutrition and exercise plans</p>
        <div className="inline-flex items-center gap-2 mt-2">
          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Optional</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">
            Select any that apply to you:
          </Label>
          
          <div className="space-y-3">
            {specialConditions.map((condition) => (
              <Button
                key={condition.id}
                type="button"
                variant={isConditionSelected(condition.id) ? "default" : "outline"}
                className={`w-full h-auto p-4 flex items-center justify-between text-left ${
                  isConditionSelected(condition.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSpecialConditionToggle(condition.id)}
              >
                <div>
                  <div className="font-semibold">{condition.label}</div>
                  <div className="text-sm text-gray-600">{condition.description}</div>
                </div>
                {isConditionSelected(condition.id) && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Additional details for selected conditions */}
        {isConditionSelected('pregnancy') && (
          <div className="space-y-3 p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">
              Which trimester are you in?
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3'].map((trimester) => (
                <Button
                  key={trimester}
                  type="button"
                  variant={formData.pregnancy_trimester === trimester ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFormData('pregnancy_trimester', trimester)}
                >
                  {trimester}st Trimester
                </Button>
              ))}
            </div>
          </div>
        )}

        {isConditionSelected('breastfeeding') && (
          <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">
              Breastfeeding frequency:
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'exclusive', label: 'Exclusive breastfeeding' },
                { id: 'partial', label: 'Partial breastfeeding' },
                { id: 'occasional', label: 'Occasional breastfeeding' }
              ].map((level) => (
                <Button
                  key={level.id}
                  type="button"
                  variant={formData.breastfeeding_level === level.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFormData('breastfeeding_level', level.id)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {isConditionSelected('fasting') && (
          <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">
              Fasting type:
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: '16:8', label: '16:8 (16h fast, 8h eating)' },
                { id: '18:6', label: '18:6 (18h fast, 6h eating)' },
                { id: 'omad', label: 'OMAD (One meal a day)' },
                { id: 'alternate', label: 'Alternate day fasting' }
              ].map((type) => (
                <Button
                  key={type.id}
                  type="button"
                  variant={formData.fasting_type === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFormData('fasting_type', type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">
            <strong>Important:</strong> These conditions require special nutritional considerations. 
            Our AI will adjust your meal plans and exercise recommendations accordingly for your safety and health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedStep6;
