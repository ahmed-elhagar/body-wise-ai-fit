
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GenderSelector = ({ value, onChange }: GenderSelectorProps) => {
  const genders = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
    { id: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Gender *
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {genders.map((gender) => (
          <Button
            key={gender.id}
            type="button"
            variant={value === gender.id ? "default" : "outline"}
            className={`h-auto p-4 flex flex-col items-center gap-2 ${
              value === gender.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onChange(gender.id)}
            data-testid={`gender-${gender.id}`}
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{gender.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenderSelector;
