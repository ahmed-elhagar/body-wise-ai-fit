
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Target, Award } from "lucide-react";

interface MotivationSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MotivationSelector = ({ value, onChange }: MotivationSelectorProps) => {
  const motivations = [
    { id: 'health', label: 'Better Health', icon: Heart, color: 'text-red-500' },
    { id: 'energy', label: 'More Energy', icon: Zap, color: 'text-yellow-500' },
    { id: 'strength', label: 'Get Stronger', icon: Target, color: 'text-blue-500' },
    { id: 'confidence', label: 'Build Confidence', icon: Award, color: 'text-purple-500' },
  ];

  const toggleMotivation = (motivationId: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(motivationId)) {
      onChange(currentValues.filter(v => v !== motivationId));
    } else {
      onChange([...currentValues, motivationId]);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        What motivates you? (Optional)
      </Label>
      
      <div className="grid grid-cols-2 gap-3">
        {motivations.map((motivation) => {
          const Icon = motivation.icon;
          const isSelected = Array.isArray(value) && value.includes(motivation.id);
          
          return (
            <Button
              key={motivation.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => toggleMotivation(motivation.id)}
            >
              <Icon className={`w-6 h-6 ${motivation.color}`} />
              <span className="text-sm font-medium">{motivation.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MotivationSelector;
