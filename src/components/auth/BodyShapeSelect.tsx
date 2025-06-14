
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BodyShapeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const BodyShapeSelect = ({ value, onChange }: BodyShapeSelectProps) => {
  const shapes = [
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'apple', label: 'Apple' },
    { id: 'pear', label: 'Pear' },
    { id: 'hourglass', label: 'Hourglass' }
  ];

  return (
    <div className="space-y-3">
      <Label>Body Shape</Label>
      <div className="grid grid-cols-2 gap-3">
        {shapes.map((shape) => (
          <Button
            key={shape.id}
            type="button"
            variant={value === shape.id ? "default" : "outline"}
            onClick={() => onChange(shape.id)}
          >
            {shape.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BodyShapeSelect;
