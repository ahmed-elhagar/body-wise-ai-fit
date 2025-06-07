
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Brain, Zap, Clock } from "lucide-react";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { toast } from "sonner";

interface CompactHealthAssessmentFormProps {
  onComplete?: () => void;
}

const CompactHealthAssessmentForm = ({ onComplete }: CompactHealthAssessmentFormProps) => {
  const { assessment, saveAssessment, isSaving } = useHealthAssessment();
  const [formData, setFormData] = useState({
    stress_level: assessment?.stress_level || 5,
    sleep_quality: assessment?.sleep_quality || 7,
    energy_level: assessment?.energy_level || 6,
    work_schedule: assessment?.work_schedule || "regular",
    // Note: health_notes is not in the HealthAssessment interface, so we'll use a generic notes field
    notes: assessment?.chronic_conditions?.join(', ') || ""
  });

  const handleSubmit = async () => {
    try {
      await saveAssessment(formData);
      toast.success("Health assessment updated successfully!");
      onComplete?.();
    } catch (error) {
      toast.error("Failed to update health assessment");
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <h3 className="text-lg font-semibold">Quick Health Check</h3>
        <p className="text-sm text-gray-600">Help us personalize your experience</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4" />
            Stress Level: {formData.stress_level}/10
          </Label>
          <Slider
            value={[formData.stress_level]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, stress_level: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            Sleep Quality: {formData.sleep_quality}/10
          </Label>
          <Slider
            value={[formData.sleep_quality]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" />
            Energy Level: {formData.energy_level}/10
          </Label>
          <Slider
            value={[formData.energy_level]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, energy_level: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="mb-2 block">Work Schedule</Label>
          <Select value={formData.work_schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, work_schedule: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular (9-5)</SelectItem>
              <SelectItem value="shift">Shift Work</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
              <SelectItem value="irregular">Irregular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Health Notes (Optional)</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any health concerns or medications..."
            className="min-h-[60px]"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Updating..." : "Complete Assessment"}
      </Button>
    </Card>
  );
};

export default CompactHealthAssessmentForm;
