
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Calendar, Clock, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseAnalyticsContainerProps {
  exercises: any[];
  onClose: () => void;
}

export const ExerciseAnalyticsContainer = ({
  exercises,
  onClose
}: ExerciseAnalyticsContainerProps) => {
  const { t } = useLanguage();

  // Calculate analytics
  const totalExercises = exercises.length;
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const completionRate = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  
  const totalSets = exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0);
  const totalDuration = exercises.reduce((acc, ex) => acc + (ex.estimated_duration || 0), 0);
  
  const muscleGroups = exercises.reduce((acc, ex) => {
    if (ex.muscle_groups) {
      ex.muscle_groups.forEach((muscle: string) => {
        acc[muscle] = (acc[muscle] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topMuscleGroups = Object.entries(muscleGroups)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-3">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercises
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Exercise Analytics
          </h1>
          <p className="text-gray-600">
            Detailed insights into your workout performance and progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sets</p>
                <p className="text-xl font-bold text-gray-900">{totalSets}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Exercises</p>
                <p className="text-xl font-bold text-gray-900">{totalExercises}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Duration</p>
                <p className="text-xl font-bold text-gray-900">{totalDuration}min</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Muscle Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Muscle Groups Targeted
            </h3>
            <div className="space-y-3">
              {topMuscleGroups.map(([muscle, count]) => (
                <div key={muscle} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{muscle}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(count / totalExercises) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exercise Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{completedExercises}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-orange-600">{totalExercises - completedExercises}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-900">{totalExercises}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Exercise List */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Exercise Details
          </h3>
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div key={exercise.id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exercise.sets && (
                      <Badge variant="outline" className="text-xs">
                        {exercise.sets} sets
                      </Badge>
                    )}
                    {exercise.reps && (
                      <Badge variant="outline" className="text-xs">
                        {exercise.reps} reps
                      </Badge>
                    )}
                    {exercise.muscle_groups?.map((muscle: string) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge 
                    variant={exercise.completed ? "default" : "secondary"}
                    className={exercise.completed ? "bg-green-500" : ""}
                  >
                    {exercise.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
