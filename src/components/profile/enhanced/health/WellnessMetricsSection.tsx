
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface WellnessMetricsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const WellnessMetricsSection = ({ formData, setFormData }: WellnessMetricsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800">Wellness Metrics</h3>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Stress Level: {formData.stress_level || 5}/10</Label>
          <Slider
            value={[formData.stress_level || 5]}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, stress_level: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <Label className="text-sm">Sleep Quality: {formData.sleep_quality || 7}/10</Label>
          <Slider
            value={[formData.sleep_quality || 7]}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, sleep_quality: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div>
          <Label className="text-sm">Energy Level: {formData.energy_level || 7}/10</Label>
          <Slider
            value={[formData.energy_level || 7]}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, energy_level: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessMetricsSection;
