import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSignupState } from "@/components/signup/hooks/useSignupState";
import { mapBodyFatToBodyShape } from '@/utils/signupValidation';

interface BodyCompositionStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const BodyCompositionStep = ({ onNext, onBack }: BodyCompositionStepProps) => {
  const { personalInfo, bodyComposition, setBodyComposition } = useSignupState();
  const [bodyFatPercentage, setBodyFatPercentage] = React.useState(bodyComposition?.bodyFatPercentage || 20);
  const [goalBodyFat, setGoalBodyFat] = React.useState(bodyComposition?.goalBodyFat || 15);

  const handleNext = () => {
    setBodyComposition({
      bodyFatPercentage: bodyFatPercentage,
      goalBodyFat: goalBodyFat,
    });
    onNext();
  };

  const bodyShape = mapBodyFatToBodyShape(
    bodyFatPercentage, 
    personalInfo?.gender as 'male' | 'female'
  );

  const bmi = personalInfo?.weight && personalInfo?.height 
    ? personalInfo.weight / Math.pow(personalInfo.height / 100, 2)
    : 0;

  const bodyShapeForGoal = mapBodyFatToBodyShape(
    goalBodyFat, 
    personalInfo?.gender as 'male' | 'female'
  );

  return (
    <div className="flex flex-col space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Body Composition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="body-fat">Current Body Fat (%)</Label>
            <Input
              type="number"
              id="body-fat"
              value={bodyFatPercentage}
              onChange={(e) => setBodyFatPercentage(Number(e.target.value))}
            />
            <Slider
              defaultValue={[bodyFatPercentage]}
              max={40}
              step={1}
              onValueChange={(value) => setBodyFatPercentage(value[0])}
            />
            <p className="text-sm text-gray-500">Estimated Body Shape: {bodyShape}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-body-fat">Goal Body Fat (%)</Label>
            <Input
              type="number"
              id="goal-body-fat"
              value={goalBodyFat}
              onChange={(e) => setGoalBodyFat(Number(e.target.value))}
            />
            <Slider
              defaultValue={[goalBodyFat]}
              max={40}
              step={1}
              onValueChange={(value) => setGoalBodyFat(value[0])}
            />
             <p className="text-sm text-gray-500">Estimated Body Shape for Goal: {bodyShapeForGoal}</p>
          </div>

          <div>
            <p>Your BMI: {bmi.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
