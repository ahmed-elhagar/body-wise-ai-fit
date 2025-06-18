
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scale, User, Target } from "lucide-react";
import { BodyShapeSelector } from "@/features/auth";

interface BodyCompositionStepProps {
  formData: {
    height: string;
    weight: string;
    targetWeight: string;
    bodyShape: string;
    bodyFat: string;
    muscleMass: string;
    activityLevel: string;
  };
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

const BodyCompositionStep = ({ 
  formData, 
  updateField, 
  onNext, 
  onPrev, 
  currentStep, 
  totalSteps 
}: BodyCompositionStepProps) => {
  const handleBodyShapeChange = (shape: string) => {
    updateField('bodyShape', shape);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Body Composition
          </CardTitle>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Label htmlFor="targetWeight">Target Weight (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              value={formData.targetWeight}
              onChange={(e) => updateField('targetWeight', e.target.value)}
              placeholder="65"
            />
          </div>
          
          <div>
            <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
            <Input
              id="bodyFat"
              type="number"
              value={formData.bodyFat}
              onChange={(e) => updateField('bodyFat', e.target.value)}
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

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={onNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionStep;
