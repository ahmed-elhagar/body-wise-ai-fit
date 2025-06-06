
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface MotivationSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MotivationSelector = ({ value = [], onChange }: MotivationSelectorProps) => {
  const motivations = [
    {
      id: 'look_better',
      title: 'Look Better',
      description: 'Improve physical appearance and confidence',
      icon: '✨',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'feel_good',
      title: 'Feel Good',
      description: 'Boost energy levels and mood',
      icon: '😊',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'be_fitter',
      title: 'Be Fitter',
      description: 'Increase strength and endurance',
      icon: '💪',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'improve_health',
      title: 'Improve Health',
      description: 'Better overall wellness and vitality',
      icon: '❤️',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'lose_weight',
      title: 'Lose Weight',
      description: 'Achieve a healthier body weight',
      icon: '⚖️',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'gain_muscle',
      title: 'Gain Muscle',
      description: 'Build lean muscle mass',
      icon: '🏋️',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const handleMotivationToggle = (motivationId: string) => {
    if (value.includes(motivationId)) {
      onChange(value.filter(id => id !== motivationId));
    } else {
      onChange([...value, motivationId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Label className="text-xl font-bold text-gray-800 mb-2 block">
          What motivates you?
        </Label>
        <p className="text-gray-600">
          Select all that apply - this helps us personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {motivations.map((motivation) => {
          const isSelected = value.includes(motivation.id);
          
          return (
            <Card
              key={motivation.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => handleMotivationToggle(motivation.id)}
              data-testid={`motivation-${motivation.id}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${motivation.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
                  {motivation.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{motivation.title}</h3>
                  <p className="text-sm text-gray-600">{motivation.description}</p>
                </div>
                
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {value.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-800 mb-1">Great choices!</h4>
              <p className="text-sm text-green-700">
                You've selected {value.length} motivation{value.length > 1 ? 's' : ''}. 
                We'll use these to tailor your fitness journey.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotivationSelector;
