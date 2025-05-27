
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, Target, Youtube, Home, Dumbbell } from "lucide-react";

const Exercise = () => {
  const navigate = useNavigate();

  const todaysWorkout = {
    name: "Upper Body Strength",
    duration: "45 minutes",
    level: "Intermediate",
    equipment: "Dumbbells, Resistance Bands",
    burnedCalories: 320,
    completedExercises: 4,
    totalExercises: 6
  };

  const exercises = [
    {
      name: "Push-ups",
      sets: 3,
      reps: "12-15",
      duration: "3 min",
      completed: true,
      muscleGroup: "Chest, Triceps",
      videoId: "IODxDxX7oi4",
      equipment: "None"
    },
    {
      name: "Dumbbell Rows",
      sets: 3,
      reps: "10-12",
      duration: "4 min",
      completed: true,
      muscleGroup: "Back, Biceps",
      videoId: "roCP6wCXPqo",
      equipment: "Dumbbells"
    },
    {
      name: "Overhead Press",
      sets: 3,
      reps: "8-10",
      duration: "4 min",
      completed: true,
      muscleGroup: "Shoulders",
      videoId: "qEwKCR5JCog",
      equipment: "Dumbbells"
    },
    {
      name: "Resistance Band Pull-Apart",
      sets: 3,
      reps: "15-20",
      duration: "3 min",
      completed: true,
      muscleGroup: "Rear Delts",
      videoId: "akgQbxhrhOc",
      equipment: "Resistance Bands"
    },
    {
      name: "Tricep Dips",
      sets: 3,
      reps: "10-12",
      duration: "3 min",
      completed: false,
      muscleGroup: "Triceps",
      videoId: "tKjcgfu44sI",
      equipment: "Chair"
    },
    {
      name: "Plank Hold",
      sets: 3,
      reps: "30-45 sec",
      duration: "3 min",
      completed: false,
      muscleGroup: "Core",
      videoId: "ASdvN_XEl_c",
      equipment: "None"
    }
  ];

  const weeklyPrograms = [
    {
      day: "Monday",
      name: "Upper Body Strength",
      duration: "45 min",
      type: "Strength",
      location: "Home"
    },
    {
      day: "Tuesday",
      name: "Cardio HIIT",
      duration: "30 min",
      type: "Cardio",
      location: "Home"
    },
    {
      day: "Wednesday",
      name: "Lower Body Power",
      duration: "50 min",
      type: "Strength",
      location: "Gym"
    },
    {
      day: "Thursday",
      name: "Yoga Flow",
      duration: "35 min",
      type: "Flexibility",
      location: "Home"
    },
    {
      day: "Friday",
      name: "Full Body Circuit",
      duration: "40 min",
      type: "Circuit",
      location: "Gym"
    }
  ];

  const progressPercentage = (todaysWorkout.completedExercises / todaysWorkout.totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Exercise Program</h1>
              <p className="text-gray-600">Today's workout session</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-white/80">
              <Home className="w-3 h-3 mr-1" />
              Home Workout
            </Badge>
            <Badge variant="outline" className="bg-white/80">
              <Dumbbell className="w-3 h-3 mr-1" />
              Equipment Required
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Workout Summary */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Workout</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">{todaysWorkout.name}</h4>
                <p className="text-sm text-gray-600">{todaysWorkout.level}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">{todaysWorkout.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Calories</span>
                  <span className="text-sm font-medium">{todaysWorkout.burnedCalories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Equipment</span>
                  <span className="text-sm font-medium">{todaysWorkout.equipment}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">
                    {todaysWorkout.completedExercises}/{todaysWorkout.totalExercises}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <Button className="w-full bg-fitness-gradient hover:opacity-90 text-white">
                <Play className="w-4 h-4 mr-2" />
                Continue Workout
              </Button>
            </div>
          </Card>

          {/* Exercise List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Exercise List</h2>
              <Badge variant="outline" className="bg-white/80">
                {exercises.length} exercises
              </Badge>
            </div>
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <Card 
                  key={index} 
                  className={`p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    exercise.completed ? 'bg-green-50/80' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        exercise.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {exercise.completed ? '✓' : index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {exercise.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>{exercise.sets} sets × {exercise.reps} reps</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {exercise.duration}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-3 h-3 mr-1" />
                            {exercise.muscleGroup}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {exercise.equipment}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/80"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${exercise.videoId}`, '_blank')}
                      >
                        <Youtube className="w-4 h-4 mr-1" />
                        Tutorial
                      </Button>
                      {!exercise.completed && (
                        <Button
                          size="sm"
                          className="bg-fitness-gradient hover:opacity-90 text-white"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Program */}
        <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Exercise Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weeklyPrograms.map((program, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                  index === 0 
                    ? 'border-fitness-primary bg-fitness-primary/10' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-gray-800 mb-2">{program.day}</p>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    {program.name}
                  </h4>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {program.type}
                    </Badge>
                    <p className="text-xs text-gray-600">{program.duration}</p>
                    <div className="flex items-center justify-center text-xs text-gray-600">
                      {program.location === 'Home' ? (
                        <Home className="w-3 h-3 mr-1" />
                      ) : (
                        <Dumbbell className="w-3 h-3 mr-1" />
                      )}
                      {program.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Exercise;
