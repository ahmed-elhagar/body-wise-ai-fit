
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Trophy, Zap, Target } from "lucide-react";

interface MotivationSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MotivationSelector = ({ value, onChange }: MotivationSelectorProps) => {
  const motivations = [
    { id: 'health', label: 'Better Health', icon: Heart, color: 'text-red-500' },
    { id: 'confidence', label: 'More Confidence', icon: Trophy, color: 'text-yellow-500' },
    { id: 'energy', label: 'More Energy', icon: Zap, color: 'text-orange-500' },
    { id: 'goals', label: 'Achieve Goals', icon: Target, color: 'text-green-500' },
  ];

  const toggleMotivation = (motivationId: string) => {
    const newValue = value.includes(motivationId)
      ? value.filter(id => id !== motivationId)
      : [...value, motivationId];
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        What motivates you? (Optional)
      </Label>
      
      <div className="grid grid-cols-2 gap-3">
        {motivations.map((motivation) => {
          const Icon = motivation.icon;
          const isSelected = value.includes(motivation.id);
          
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
              <span className="font-medium text-sm">{motivation.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MotivationSelector;
