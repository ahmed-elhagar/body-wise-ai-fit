
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface EnhancedMotivationSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const EnhancedMotivationSelector = ({ value, onChange }: EnhancedMotivationSelectorProps) => {
  const motivations = [
    { 
      id: 'look_better', 
      label: 'Look better', 
      emoji: '💪',
      description: 'Improve your physical appearance',
      gradient: 'from-purple-400 to-pink-400'
    },
    { 
      id: 'feel_good', 
      label: 'Feel good in your body', 
      emoji: '😌',
      description: 'Boost confidence and self-esteem',
      gradient: 'from-green-400 to-emerald-400'
    },
    { 
      id: 'be_fitter', 
      label: 'Be fitter', 
      emoji: '🏃‍♂️',
      description: 'Increase strength and endurance',
      gradient: 'from-blue-400 to-cyan-400'
    },
    { 
      id: 'improve_health', 
      label: 'Improve health', 
      emoji: '🫁',
      description: 'Better overall wellness and energy',
      gradient: 'from-orange-400 to-red-400'
    },
    { 
      id: 'reduce_stress', 
      label: 'Reduce stress', 
      emoji: '🧘‍♀️',
      description: 'Mental wellness and relaxation',
      gradient: 'from-indigo-400 to-purple-400'
    }
  ];

  const handleToggle = (motivationId: string) => {
    const newValue = value.includes(motivationId)
      ? value.filter(id => id !== motivationId)
      : [...value, motivationId];
    onChange(newValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xl font-bold text-gray-800 mb-2 block">
          What motivates you to work out?
        </Label>
        <p className="text-sm text-gray-600">Choose all that apply to personalize your experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {motivations.map((motivation) => {
          const isSelected = value.includes(motivation.id);
          return (
            <Card
              key={motivation.id}
              className={`p-5 cursor-pointer transition-all duration-300 hover:shadow-xl border-2 relative overflow-hidden group ${
                isSelected
                  ? 'ring-4 ring-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 shadow-lg transform scale-[1.02]'
                  : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:transform hover:scale-[1.01]'
              }`}
              onClick={() => handleToggle(motivation.id)}
              data-testid={`motivation-${motivation.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${motivation.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{motivation.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {motivation.label}
                    </h3>
                    <p className="text-sm text-gray-600">{motivation.description}</p>
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {value.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✨</span>
            <p className="text-sm text-green-800 font-medium">
              Great! You've selected {value.length} motivation{value.length > 1 ? 's' : ''}. 
              We'll use this to create a personalized fitness plan just for you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMotivationSelector;
