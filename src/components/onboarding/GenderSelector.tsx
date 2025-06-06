
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GenderSelector = ({ value, onChange }: GenderSelectorProps) => {
  const genderOptions = [
    {
      value: "male",
      label: "Male",
      icon: "👨",
      gradient: "from-blue-400 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      value: "female",
      label: "Female", 
      icon: "👩",
      gradient: "from-pink-400 to-pink-600",
      bgColor: "from-pink-50 to-pink-100"
    },
    {
      value: "other",
      label: "Other",
      icon: "🧑",
      gradient: "from-purple-400 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="text-blue-500">👤</span>
        Gender *
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-testid="gender">
        {genderOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <Card
              key={option.value}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg text-center border-2 group relative overflow-hidden ${
                isSelected
                  ? `ring-4 ring-blue-500/30 bg-gradient-to-br ${option.bgColor} border-blue-500 shadow-lg transform scale-105`
                  : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:transform hover:scale-[1.02]'
              }`}
              onClick={() => onChange(option.value)}
              data-testid={`gender-${option.value}`}
            >
              <div className="relative z-10">
                <div className={`text-3xl mb-2 transform transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {option.icon}
                </div>
                <div className="text-base font-semibold text-gray-800">{option.label}</div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
    </div>
  );
};

export default GenderSelector;
