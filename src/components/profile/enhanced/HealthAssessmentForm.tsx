
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { toast } from "sonner";

const HealthAssessmentForm = () => {
  const { assessment, updateAssessment, isUpdating } = useHealthAssessment();
  
  const [formData, setFormData] = useState({
    stress_level: assessment?.stress_level || 5,
    sleep_quality: assessment?.sleep_quality || 7,
    energy_level: assessment?.energy_level || 6,
    work_schedule: assessment?.work_schedule || "regular",
    health_notes: assessment?.health_notes || ""
  });

  const handleSubmit = async () => {
    try {
      await updateAssessment(formData);
      toast.success("Health assessment updated successfully!");
    } catch (error) {
      toast.error("Failed to update health assessment");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Health Assessment</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">Stress Level: {formData.stress_level}/10</Label>
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
          <Label className="mb-2 block">Sleep Quality: {formData.sleep_quality}/10</Label>
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
          <Label className="mb-2 block">Energy Level: {formData.energy_level}/10</Label>
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
          <Label className="mb-2 block">Health Notes</Label>
          <Textarea
            value={formData.health_notes}
            onChange={(e) => setFormData(prev => ({ ...prev, health_notes: e.target.value }))}
            placeholder="Any health concerns, medications, or additional notes..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Health Assessment"}
        </Button>
      </div>
    </Card>
  );
};

export default HealthAssessmentForm;
