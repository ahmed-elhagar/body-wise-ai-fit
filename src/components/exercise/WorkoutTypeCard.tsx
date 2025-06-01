import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface WorkoutTypeCardProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const WorkoutTypeCard = ({ workoutType, onWorkoutTypeChange }: WorkoutTypeCardProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('exercise.workoutType')}
        </h3>
        <div className="space-x-2">
          <Button
            variant={workoutType === "home" ? "default" : "outline"}
            onClick={() => onWorkoutTypeChange("home")}
          >
            <Home className="w-4 h-4 mr-2" />
            {t('exercise.home')}
          </Button>
          <Button
            variant={workoutType === "gym" ? "default" : "outline"}
            onClick={() => onWorkoutTypeChange("gym")}
          >
            <Building2 className="w-4 h-4 mr-2" />
            {t('exercise.gym')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
