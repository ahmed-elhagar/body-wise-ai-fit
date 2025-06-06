
import { Baby } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NewSignupFormData } from "@/hooks/useNewSignupForm";

interface Step7LifePhaseProps {
  formData: NewSignupFormData;
  updateFormData: (field: string, value: string) => void;
}

const Step7LifePhase = ({ formData, updateFormData }: Step7LifePhaseProps) => {
  const pregnancyOptions = [
    { id: 'none', label: 'Not Pregnant', description: 'Regular nutrition needs' },
    { id: '1', label: '1st Trimester', description: 'Weeks 1-12' },
    { id: '2', label: '2nd Trimester', description: 'Weeks 13-26' },
    { id: '3', label: '3rd Trimester', description: 'Weeks 27-40' }
  ];

  const breastfeedingOptions = [
    { id: 'none', label: 'Not Breastfeeding', description: 'Regular nutrition needs' },
    { id: 'exclusive', label: 'Exclusive Breastfeeding', description: 'Only breast milk' },
    { id: 'partial', label: 'Partial Breastfeeding', description: 'Breast milk + formula/food' }
  ];

  const fastingOptions = [
    { id: 'none', label: 'No Fasting', description: 'Regular eating schedule' },
    { id: 'ramadan', label: 'Ramadan Fasting', description: 'Dawn to sunset fasting' },
    { id: 'intermittent', label: 'Intermittent Fasting', description: '16:8, 18:6, etc.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-4 shadow-lg">
          <Baby className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Pregnancy Status */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">Pregnancy Status</Label>
          <div className="space-y-2">
            {pregnancyOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.pregnancy_trimester === option.id ? "default" : "outline"}
                className={`w-full h-auto p-4 flex justify-between items-center ${
                  formData.pregnancy_trimester === option.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("pregnancy_trimester", option.id)}
              >
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                {formData.pregnancy_trimester === option.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Breastfeeding Status */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">Breastfeeding Status</Label>
          <div className="space-y-2">
            {breastfeedingOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.breastfeeding_level === option.id ? "default" : "outline"}
                className={`w-full h-auto p-4 flex justify-between items-center ${
                  formData.breastfeeding_level === option.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("breastfeeding_level", option.id)}
              >
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                {formData.breastfeeding_level === option.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Fasting Preferences */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">Fasting Preferences</Label>
          <div className="space-y-2">
            {fastingOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.fasting_type === option.id ? "default" : "outline"}
                className={`w-full h-auto p-4 flex justify-between items-center ${
                  formData.fasting_type === option.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("fasting_type", option.id)}
              >
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                {formData.fasting_type === option.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">
            <strong>Life Phase Considerations:</strong> This helps us adjust your nutrition plan for your specific life circumstances and cultural preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step7LifePhase;
