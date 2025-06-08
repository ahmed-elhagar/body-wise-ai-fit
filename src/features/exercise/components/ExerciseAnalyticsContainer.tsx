import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { calculateWorkoutProgress } from "@/features/exercise/utils";

interface ExerciseAnalyticsContainerProps {
  exercises: any[];
  onClose: () => void;
}

export const ExerciseAnalyticsContainer = ({ exercises, onClose }: ExerciseAnalyticsContainerProps) => {
  const workoutProgress = calculateWorkoutProgress(exercises);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-auto">
      <div className="container py-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Workout Analytics</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">Overall Progress</h4>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  You've completed {workoutProgress.toFixed(2)}% of this workout.
                </p>
                <Badge variant="outline">{exercises.filter(ex => ex.completed).length} / {exercises.length} Exercises</Badge>
              </div>
            </div>

            <h4 className="text-md font-semibold mb-2">Exercise Breakdown</h4>
            <ScrollArea className="h-[400px] pr-4">
              <ul className="space-y-3">
                {exercises.map((exercise: any) => (
                  <li key={exercise.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{exercise.exercise_name}</h5>
                      <Badge variant={exercise.completed ? "default" : "secondary"}>
                        {exercise.completed ? "Completed" : "Incomplete"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Sets: {exercise.sets}, Reps: {exercise.reps}</p>
                    {/* Add more details as needed */}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
