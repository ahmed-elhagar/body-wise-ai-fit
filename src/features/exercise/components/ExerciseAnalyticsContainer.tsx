
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Exercise } from "@/features/exercise";

interface ExerciseAnalyticsContainerProps {
  exercises: Exercise[];
  onClose: () => void;
}

export const ExerciseAnalyticsContainer = ({ exercises, onClose }: ExerciseAnalyticsContainerProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exercise Analytics</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the exercise analytics.</p>
          <p>Number of exercises: {exercises.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};
