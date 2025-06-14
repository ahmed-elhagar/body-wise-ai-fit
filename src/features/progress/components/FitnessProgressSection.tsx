import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  TrendingUp, 
  Calendar, 
  Target,
  Dumbbell,
  Clock,
  Zap,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";

export const FitnessProgressSection = () => {
  const navigate = useNavigate();
  const { programs } = useExercisePrograms();
  const { currentProgram, completedExercises, totalExercises, progressPercentage } = useOptimizedExerciseProgramPage();

  const activePrograms = programs?.filter(p => p.status === 'active') || [];
  const totalWorkouts = currentProgram?.daily_workouts?.length || 0;
  const completedWorkouts = currentProgram?.daily_workouts?.filter(w => w.completed)?.length || 0;
  const weeklyProgress = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  const fitnessStats = [
    {
      label: "Active Programs",
      value: activePrograms.length,
      total: programs?.length || 0,
      icon: Dumbbell,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Today's Progress",
      value: completedExercises,
      total: totalExercises,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Weekly Workouts",
      value: completedWorkouts,
      total: totalWorkouts,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Current Streak",
      value: 5, // This would come from a streak tracking system
      total: 7,
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fitnessStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const progressValue = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
          
          return (
            <Card key={index} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-all duration-300`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {Math.round(progressValue)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{stat.label}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    {stat.total > 0 && (
                      <span className="text-sm text-gray-500">/ {stat.total}</span>
                    )}
                  </div>
                  <Progress value={progressValue} className="h-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Program Details */}
      {currentProgram && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Activity className="w-5 h-5" />
                Current Program: {currentProgram.program_name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/exercise')}
                className="bg-white hover:bg-blue-50 text-blue-700 border-blue-300"
              >
                View Program
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900 mb-1">{progressPercentage}%</div>
                <div className="text-sm text-blue-600">Today's Progress</div>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900 mb-1">Week {currentProgram.current_week || 1}</div>
                <div className="text-sm text-blue-600">Current Week</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-500">Active Program</span>
                </div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900 mb-1">{weeklyProgress.toFixed(0)}%</div>
                <div className="text-sm text-blue-600">Week Complete</div>
                <Progress value={weeklyProgress} className="mt-2 h-2" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recent Activity
              </h4>
              <div className="space-y-2">
                {currentProgram.daily_workouts?.slice(0, 3).map((workout: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${workout.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm font-medium text-blue-900">Day {workout.day_number}</span>
                    </div>
                    <Badge 
                      variant={workout.completed ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {workout.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/exercise')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
        >
          <Dumbbell className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/exercise/create')}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <Target className="w-4 h-4 mr-2" />
          Create Program
        </Button>
      </div>
    </div>
  );
};
