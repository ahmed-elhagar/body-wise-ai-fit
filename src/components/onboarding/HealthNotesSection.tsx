
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface HealthNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const HealthNotesSection = ({ value, onChange }: HealthNotesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-purple-500" />
        <Label className="text-sm font-medium text-gray-700">
          Additional Health Notes (Optional)
        </Label>
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Any additional health information, medications, recent injuries, or concerns you'd like us to know about..."
        className="min-h-[120px] border-2 border-gray-200 focus:border-purple-500 transition-colors rounded-xl resize-none"
        rows={5}
      />
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs text-purple-700">
          <strong>Privacy Note:</strong> This information helps us create safer, more personalized recommendations. 
          Your health data is confidential and will only be used to improve your fitness and nutrition plans.
        </p>
      </div>
    </div>
  );
};

export default HealthNotesSection;
