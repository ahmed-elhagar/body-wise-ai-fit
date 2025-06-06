
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HealthIssuesSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const HealthIssuesSelector = ({ value, onChange }: HealthIssuesSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Any health conditions or concerns? (Optional)
      </Label>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., diabetes, high blood pressure, knee injury, etc."
        className="min-h-[100px] border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
      />
      
      <p className="text-xs text-gray-500">
        This information helps us create safer, more personalized recommendations for you.
      </p>
    </div>
  );
};

export default HealthIssuesSelector;
