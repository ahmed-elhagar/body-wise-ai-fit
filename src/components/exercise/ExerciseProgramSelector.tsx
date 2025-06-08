
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Home, Building2, Clock, Target } from "lucide-react";
import { ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface ExerciseProgramSelectorProps {
  onGenerateProgram: (preferences: ExercisePreferences) => void;
  isGenerating: boolean;
  workoutType?: "home" | "gym";
}

export const ExerciseProgramSelector = ({ 
  onGenerateProgram, 
  isGenerating,
  workoutType = "home"
}: ExerciseProgramSelectorProps) => {
  const [selectedGoal, setSelectedGoal] = useState("general_fitness");
  const [selectedLevel, setSelectedLevel] = useState("beginner");

  const goals = [
    { id: "weight_loss", label: "Weight Loss", icon: "🔥" },
    { id: "muscle_gain", label: "Muscle Gain", icon: "💪" },
    { id: "general_fitness", label: "General Fitness", icon: "⚡" },
    { id: "endurance", label: "Endurance", icon: "🏃" }
  ];

  const levels = [
    { id: "beginner", label: "Beginner", desc: "New to exercise" },
    { id: "intermediate", label: "Intermediate", desc: "Some experience" },
    { id: "advanced", label: "Advanced", desc: "Very experienced" }
  ];

  const handleGenerate = () => {
    const preferences: ExercisePreferences = {
      workoutType,
      goalType: selectedGoal,
      fitnessLevel: selectedLevel,
      availableTime: "45",
      preferredWorkouts: workoutType === "gym" ? ["strength", "cardio"] : ["bodyweight", "cardio"],
      targetMuscleGroups: ["full_body"],
      equipment: workoutType === "gym" 
        ? ["barbells", "dumbbells", "machines", "cables"]
        : ["bodyweight", "resistance_bands", "light_dumbbells"],
      duration: "4",
      workoutDays: "4-5 days per week",
      difficulty: selectedLevel
    };
    
    onGenerateProgram(preferences);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {workoutType === "home" ? (
            <Home className="w-8 h-8 text-fitness-primary" />
          ) : (
            <Building2 className="w-8 h-8 text-fitness-primary" />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            {workoutType === "home" ? "Home" : "Gym"} Exercise Program
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Get a personalized {workoutType} workout plan powered by AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Fitness Goal Selection */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What's your fitness goal?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <Button
                key={goal.id}
                variant={selectedGoal === goal.id ? "default" : "outline"}
                className={`h-20 flex-col space-y-2 ${
                  selectedGoal === goal.id 
                    ? "bg-fitness-gradient text-white" 
                    : "bg-white/80 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedGoal(goal.id)}
              >
                <span className="text-2xl">{goal.icon}</span>
                <span className="text-sm font-medium">{goal.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Fitness Level Selection */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What's your fitness level?
          </h3>
          <div className="space-y-3">
            {levels.map((level) => (
              <Button
                key={level.id}
                variant={selectedLevel === level.id ? "default" : "outline"}
                className={`w-full justify-start h-16 ${
                  selectedLevel === level.id 
                    ? "bg-fitness-gradient text-white" 
                    : "bg-white/80 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="text-left">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm opacity-80">{level.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Program Features */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your {workoutType} program will include:
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-fitness-primary" />
            <span className="text-gray-700">45-min workouts</span>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-fitness-primary" />
            <span className="text-gray-700">4-5 days per week</span>
          </div>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-fitness-primary" />
            <span className="text-gray-700">AI-personalized exercises</span>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2">
          {workoutType === "home" ? (
            <>
              <Badge variant="secondary">Bodyweight exercises</Badge>
              <Badge variant="secondary">No equipment needed</Badge>
              <Badge variant="secondary">Small space friendly</Badge>
            </>
          ) : (
            <>
              <Badge variant="secondary">Full gym equipment</Badge>
              <Badge variant="secondary">Progressive overload</Badge>
              <Badge variant="secondary">Machine & free weights</Badge>
            </>
          )}
        </div>
      </Card>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className="bg-fitness-gradient hover:opacity-90 text-white px-8 py-4 text-lg"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full mr-3" />
              Generating Your Program...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Generate My {workoutType === "home" ? "Home" : "Gym"} Program
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
