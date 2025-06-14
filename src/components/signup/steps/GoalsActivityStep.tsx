import React from 'react';
import { Label } from "@/components/ui/label";
import { GoalBodyTypeSelector } from "@/features/onboarding";
import { ActivityLevelSelector } from "@/features/onboarding";

interface GoalsActivityStepProps {
  onNext: () => void;
  onPrevious: () => void;
  activityLevel: string;
  setActivityLevel: (level: string) => void;
  fitnessGoal: string;
  setFitnessGoal: (goal: string) => void;
}

const GoalsActivityStep = ({
  onNext,
  onPrevious,
  activityLevel,
  setActivityLevel,
  fitnessGoal,
  setFitnessGoal
}: GoalsActivityStepProps) => {
  return (
    <div className="space-y-6">
      {/* Activity Level Selector */}
      <div className="space-y-2">
        <Label htmlFor="activity-level" className="text-sm font-medium text-gray-700">
          What's your typical daily activity level?
        </Label>
        <ActivityLevelSelector value={activityLevel} onChange={setActivityLevel} />
      </div>

      {/* Fitness Goal Selector */}
      <div className="space-y-2">
        <Label htmlFor="fitness-goal" className="text-sm font-medium text-gray-700">
          What's your main fitness goal?
        </Label>
        <GoalBodyTypeSelector value={fitnessGoal} onChange={setFitnessGoal} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GoalsActivityStep;
