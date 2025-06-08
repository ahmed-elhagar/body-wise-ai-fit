
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Home, Building2 } from "lucide-react";

interface WorkoutTypeToggleProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const WorkoutTypeToggle = ({ workoutType, onWorkoutTypeChange }: WorkoutTypeToggleProps) => {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Workout Environment</h3>
        
        <ToggleGroup 
          type="single" 
          value={workoutType} 
          onValueChange={(value) => value && onWorkoutTypeChange(value as "home" | "gym")}
          className="bg-gray-100 rounded-lg p-1"
        >
          <ToggleGroupItem 
            value="home" 
            className="data-[state=on]:bg-white data-[state=on]:shadow-sm rounded-md px-4 py-2 transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Home Workout
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="gym" 
            className="data-[state=on]:bg-white data-[state=on]:shadow-sm rounded-md px-4 py-2 transition-all"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Gym Workout
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Card>
  );
};
