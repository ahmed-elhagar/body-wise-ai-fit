
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
      description: "Male",
      gradient: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-500"
    },
    {
      value: "female",
      label: "Female", 
      icon: "👩",
      description: "Female",
      gradient: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-500"
    },
    {
      value: "other",
      label: "Other",
      icon: "🧑",
      description: "Other/Non-binary",
      gradient: "from-purple-400 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-500"
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="text-blue-500">👤</span>
        Gender *
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="gender">
        {genderOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <Card
              key={option.value}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-xl text-center border-2 group relative overflow-hidden ${
                isSelected
                  ? `ring-4 ring-blue-500/30 bg-gradient-to-br ${option.bgColor} ${option.borderColor} shadow-lg transform scale-105`
                  : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:transform hover:scale-[1.02]'
              }`}
              onClick={() => onChange(option.value)}
              data-testid={`gender-${option.value}`}
            >
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-r ${option.bgColor} opacity-60`} />
              )}
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${option.gradient} shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{option.icon}</span>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
                
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 bg-gradient-to-r ${option.gradient} rounded-full flex items-center justify-center shadow-lg`}>
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
    </div>
  );
};

export default GenderSelector;
