
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Dumbbell } from "lucide-react";

interface WorkoutTypeTabsProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const WorkoutTypeTabs = ({ workoutType, onWorkoutTypeChange }: WorkoutTypeTabsProps) => {
  return (
    <Tabs value={workoutType} onValueChange={onWorkoutTypeChange as (value: string) => void}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="home" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Home Workout
        </TabsTrigger>
        <TabsTrigger value="gym" className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4" />
          Gym Workout
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
