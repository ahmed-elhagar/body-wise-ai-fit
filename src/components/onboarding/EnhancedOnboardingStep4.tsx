
import { CheckCircle, Utensils, Dumbbell, Target } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Card } from "@/components/ui/card";

interface EnhancedOnboardingStep4Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const EnhancedOnboardingStep4 = ({ formData }: EnhancedOnboardingStep4Props) => {
  const getBodyShapeLabel = () => {
    const bodyFat = parseFloat(formData.body_fat_percentage || "0");
    const gender = formData.gender;
    
    if (gender === 'male') {
      if (bodyFat < 15) return "Lean Physique";
      if (bodyFat < 25) return "Athletic Build";
      return "Strong Build";
    } else {
      if (bodyFat < 20) return "Lean Physique";
      if (bodyFat < 30) return "Healthy Build";
      return "Curvy Build";
    }
  };

  const getGoalIcon = () => {
    switch (formData.fitness_goal) {
      case 'lose_weight': return <Target className="w-5 h-5 text-red-500" />;
      case 'gain_muscle': return <Dumbbell className="w-5 h-5 text-blue-500" />;
      case 'maintain_weight': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Target className="w-5 h-5 text-purple-500" />;
    }
  };

  const summaryData = [
    {
      label: "Name",
      value: `${formData.first_name} ${formData.last_name}`,
      icon: "👤"
    },
    {
      label: "Age & Gender",
      value: `${formData.age} years old, ${formData.gender}`,
      icon: "🎂"
    },
    {
      label: "Physical Stats",
      value: `${formData.height}cm, ${formData.weight}kg`,
      icon: "📏"
    },
    {
      label: "Body Composition",
      value: `${formData.body_fat_percentage}% - ${getBodyShapeLabel()}`,
      icon: "💪"
    },
    {
      label: "Fitness Goal",
      value: formData.fitness_goal?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set',
      icon: getGoalIcon()
    },
    {
      label: "Activity Level",
      value: formData.activity_level?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set',
      icon: "🏃"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Almost Done!</h2>
        <p className="text-gray-600">Review your information before we create your personalized plan</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-blue-600" />
          Your Profile Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaryData.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl">{typeof item.icon === 'string' ? item.icon : item.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-gray-800 font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {formData.health_conditions && formData.health_conditions.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-gray-800 mb-2">Health Considerations:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.health_conditions.map((condition, index) => (
                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Start Your Journey?</h3>
        <p className="text-gray-600">
          We'll create a personalized meal plan and exercise program just for you!
        </p>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep4;
