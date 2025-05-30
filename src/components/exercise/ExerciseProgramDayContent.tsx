
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Repeat, Target, CheckCircle, Play } from "lucide-react";
import { format, addDays } from "date-fns";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  rest_time?: number;
  completed: boolean;
}

interface ExerciseProgramDayContentProps {
  selectedDay: number;
  todaysWorkouts: any[];
  todaysExercises: Exercise[];
  isRestDay: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, progress: any) => void;
  weekStartDate: Date;
}

const ExerciseProgramDayContent = ({
  selectedDay,
  todaysWorkouts,
  todaysExercises,
  isRestDay,
  onExerciseComplete,
  onExerciseProgressUpdate,
  weekStartDate
}: ExerciseProgramDayContentProps) => {
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  const dayDate = getDateForDay(selectedDay);

  if (isRestDay) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            {getDayName(selectedDay)} - {format(dayDate, 'MMM d')} (Rest Day)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Target className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Recovery Day</h3>
          <p className="text-gray-600">
            Take time to rest and let your muscles recover. Light stretching or walking is recommended.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-fitness-primary" />
          {getDayName(selectedDay)} - {format(dayDate, 'MMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaysExercises.length > 0 ? (
          <div className="space-y-4">
            {todaysExercises.map((exercise, index) => (
              <Card key={exercise.id} className={`border-l-4 ${exercise.completed ? 'border-l-green-500' : 'border-l-fitness-primary'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {exercise.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Play className="h-5 w-5 text-fitness-primary" />
                        )}
                        <h4 className={`font-semibold text-lg ${exercise.completed ? 'line-through text-gray-500' : ''}`}>
                          {exercise.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {exercise.sets} sets × {exercise.reps} reps
                        </span>
                        {exercise.weight && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {exercise.weight} kg
                          </span>
                        )}
                        {exercise.rest_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exercise.rest_time}s rest
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {!exercise.completed ? (
                      <Button 
                        size="sm"
                        onClick={() => onExerciseComplete(exercise.id)}
                        className="bg-fitness-gradient text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onExerciseComplete(exercise.id)}
                      >
                        Mark Incomplete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                    >
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No exercises planned for this day</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgramDayContent;
