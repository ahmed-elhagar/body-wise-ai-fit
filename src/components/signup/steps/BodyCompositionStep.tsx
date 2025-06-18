
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Scale } from "lucide-react";
import { BodyShapeSelector } from "@/features/auth";

interface BodyCompositionStepProps {
  formData: {
    height: string;
    weight: string;
    targetWeight?: string;
    bodyShape: string;
    bodyFatPercentage?: string;
    muscleMass?: string;
    activityLevel?: string;
  };
  updateField: (field: string, value: string) => void;
}

const BodyCompositionStep = ({ 
  formData, 
  updateField
}: BodyCompositionStepProps) => {
  const handleBodyShapeChange = (shape: string) => {
    updateField('bodyShape', shape);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Body Composition</h2>
        <p className="text-gray-600">Help us understand your current physical state</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateField('height', e.target.value)}
            placeholder="170"
          />
        </div>
        
        <div>
          <Label htmlFor="weight">Current Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateField('weight', e.target.value)}
            placeholder="70"
          />
        </div>
        
        <div>
          <Label htmlFor="bodyFatPercentage">Body Fat % (optional)</Label>
          <Input
            id="bodyFatPercentage"
            type="number"
            value={formData.bodyFatPercentage || ''}
            onChange={(e) => updateField('bodyFatPercentage', e.target.value)}
            placeholder="20"
          />
        </div>
      </div>

      <div>
        <Label>Body Shape</Label>
        <BodyShapeSelector
          value={formData.bodyShape}
          onChange={handleBodyShapeChange}
        />
      </div>
    </div>
  );
};

export default BodyCompositionStep;
