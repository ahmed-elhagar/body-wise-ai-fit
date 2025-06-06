
import { Baby } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SignupFormData } from "@/hooks/useSignupFlow";

interface LifePhaseStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: string) => void;
}

const LifePhaseStep = ({ formData, updateField }: LifePhaseStepProps) => {
  const pregnancyOptions = [
    { id: 'none', label: 'Not Pregnant', description: 'Standard nutrition plan' },
    { id: '1', label: 'First Trimester', description: '1-12 weeks' },
    { id: '2', label: 'Second Trimester', description: '13-26 weeks' },
    { id: '3', label: 'Third Trimester', description: '27-40 weeks' }
  ];

  const breastfeedingOptions = [
    { id: 'none', label: 'Not Breastfeeding', description: 'Standard nutrition' },
    { id: 'exclusive', label: 'Exclusive Breastfeeding', description: 'Only breast milk' },
    { id: 'partial', label: 'Partial Breastfeeding', description: 'Breast milk + formula/food' }
  ];

  const fastingOptions = [
    { id: 'none', label: 'No Fasting', description: 'Regular eating schedule' },
    { id: 'intermittent', label: 'Intermittent Fasting', description: 'Time-restricted eating' },
    { id: 'ramadan', label: 'Ramadan Fasting', description: 'Religious fasting' },
    { id: 'other', label: 'Other Fasting', description: 'Custom fasting schedule' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Baby className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Special life phase considerations</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Pregnancy Status */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-800">Pregnancy Status</Label>
          <div className="space-y-2">
            {pregnancyOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.pregnancyTrimester === option.id ? "default" : "outline"}
                className={`w-full h-auto p-3 sm:p-4 flex justify-between items-center ${
                  formData.pregnancyTrimester === option.id ? 'ring-2 ring-pink-500 bg-gradient-to-r from-pink-500 to-purple-600' : ''
                }`}
                onClick={() => updateField("pregnancyTrimester", option.id)}
              >
                <div className="text-left">
                  <div className="font-medium text-sm sm:text-base">{option.label}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{option.description}</div>
                </div>
                {formData.pregnancyTrimester === option.id && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Breastfeeding Status */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-800">Breastfeeding Status</Label>
          <div className="space-y-2">
            {breastfeedingOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.breastfeedingLevel === option.id ? "default" : "outline"}
                className={`w-full h-auto p-3 sm:p-4 flex justify-between items-center ${
                  formData.breastfeedingLevel === option.id ? 'ring-2 ring-pink-500 bg-gradient-to-r from-pink-500 to-purple-600' : ''
                }`}
                onClick={() => updateField("breastfeedingLevel", option.id)}
              >
                <div className="text-left">
                  <div className="font-medium text-sm sm:text-base">{option.label}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{option.description}</div>
                </div>
                {formData.breastfeedingLevel === option.id && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Fasting Status */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-800">Fasting Preferences</Label>
          <div className="space-y-2">
            {fastingOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.fastingType === option.id ? "default" : "outline"}
                className={`w-full h-auto p-3 sm:p-4 flex justify-between items-center ${
                  formData.fastingType === option.id ? 'ring-2 ring-pink-500 bg-gradient-to-r from-pink-500 to-purple-600' : ''
                }`}
                onClick={() => updateField("fastingType", option.id)}
              >
                <div className="text-left">
                  <div className="font-medium text-sm sm:text-base">{option.label}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{option.description}</div>
                </div>
                {formData.fastingType === option.id && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
          <p className="text-sm text-pink-700">
            <strong>Personalized Care:</strong> These settings help us adjust your nutrition and exercise plans for your specific life phase needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifePhaseStep;
