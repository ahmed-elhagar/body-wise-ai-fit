
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ScrollableBodyShapeSelector from "./ScrollableBodyShapeSelector";

interface EnhancedOnboardingStep2Props {
  formData: any;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep2 = ({ formData, updateFormData }: EnhancedOnboardingStep2Props) => {
  const [bodyFatPercentage, setBodyFatPercentage] = useState(formData.body_fat_percentage || 20);

  const motivations = [
    { id: 'look_better', label: 'Look Better', icon: '✨' },
    { id: 'feel_good', label: 'Feel Good', icon: '😊' },
    { id: 'be_fitter', label: 'Be Fitter', icon: '💪' },
    { id: 'improve_health', label: 'Improve Health', icon: '❤️' },
    { id: 'gain_confidence', label: 'Gain Confidence', icon: '🦋' },
    { id: 'have_energy', label: 'Have Energy', icon: '⚡' }
  ];

  const selectedMotivations = formData.motivations || [];

  const toggleMotivation = (motivationId: string) => {
    const current = selectedMotivations;
    if (current.includes(motivationId)) {
      updateFormData('motivations', current.filter((id: string) => id !== motivationId));
    } else {
      updateFormData('motivations', [...current, motivationId]);
    }
  };

  const handleBodyFatChange = (value: number) => {
    setBodyFatPercentage(value);
    updateFormData('body_fat_percentage', value.toString());
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Shape & Motivation</h2>
        <p className="text-gray-600">Help us understand your body and what motivates you</p>
      </div>

      {/* Body Shape Selector */}
      <div className="mb-8">
        <ScrollableBodyShapeSelector
          value={formData.body_shape}
          onChange={(value) => updateFormData('body_shape', value)}
          bodyFatValue={bodyFatPercentage}
          onBodyFatChange={handleBodyFatChange}
          gender={formData.gender}
        />
      </div>

      {/* Motivation Section */}
      <div>
        <Label className="text-xl font-bold text-gray-800 mb-4 block">
          What motivates you? (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {motivations.map((motivation) => (
            <Button
              key={motivation.id}
              type="button"
              variant="outline"
              data-testid={`motivation-${motivation.id}`}
              onClick={() => toggleMotivation(motivation.id)}
              className={`h-auto p-4 flex flex-col items-center space-y-2 border-2 transition-all duration-200 ${
                selectedMotivations.includes(motivation.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{motivation.icon}</span>
              <span className="text-sm font-medium text-center">{motivation.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep2;
