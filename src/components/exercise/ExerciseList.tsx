
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";
import { ExerciseListCard } from "./ExerciseListCard";

interface ExerciseListProps {
  exercises: any[];
  workoutsLoading: boolean;
}

export const ExerciseList = ({ exercises, workoutsLoading }: ExerciseListProps) => {
  if (workoutsLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-600">Loading exercises...</p>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
        <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Exercises for Today</h3>
        <p className="text-gray-600">This might be a rest day or select another day to see exercises</p>
      </Card>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Exercise List</h2>
        <Badge variant="outline" className="bg-white/80">
          {exercises.length} exercises
        </Badge>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseListCard key={exercise.id} exercise={exercise} index={index} />
        ))}
      </div>
    </div>
  );
};
