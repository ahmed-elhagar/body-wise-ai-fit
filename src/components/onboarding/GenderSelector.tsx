
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
      description: "Male"
    },
    {
      value: "female",
      label: "Female", 
      icon: "👩",
      description: "Female"
    },
    {
      value: "other",
      label: "Other",
      icon: "🧑",
      description: "Other/Non-binary"
    }
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Gender *
      </Label>
      <div className="grid grid-cols-3 gap-3" data-testid="gender">
        {genderOptions.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg text-center ${
              value === option.value
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => onChange(option.value)}
            data-testid={`gender-${option.value}`}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <div className="text-sm font-medium text-gray-800">{option.label}</div>
            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GenderSelector;
