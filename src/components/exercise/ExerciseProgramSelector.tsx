
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Home, Building2, Clock, Target, Zap } from "lucide-react";

interface ExerciseProgramSelectorProps {
  onGenerateProgram: (preferences: any) => void;
  isGenerating: boolean;
}

export const ExerciseProgramSelector = ({ onGenerateProgram, isGenerating }: ExerciseProgramSelectorProps) => {
  const [selectedType, setSelectedType] = useState<"home" | "gym">("home");
  const [fitnessGoal, setFitnessGoal] = useState("general_fitness");
  const [fitnessLevel, setFitnessLevel] = useState("beginner");
  const [availableTime, setAvailableTime] = useState("45");

  const handleGenerate = () => {
    const preferences = {
      workoutType: selectedType,
      goalType: fitnessGoal,
      fitnessLevel,
      availableTime,
      preferredWorkouts: selectedType === "home" ? ["bodyweight", "cardio"] : ["strength", "cardio"],
      targetMuscleGroups: ["full_body"],
      equipment: selectedType === "home" ? ["Basic home equipment", "Bodyweight"] : ["Full gym equipment"],
      duration: "4",
      workoutDays: "4-5 days per week",
      difficulty: fitnessLevel
    };
    
    onGenerateProgram(preferences);
  };

  return (
    <div className="space-y-6">
      {/* Workout Type Selection */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Training Environment</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedType === "home" 
                ? "border-fitness-primary bg-fitness-primary/10 shadow-md" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedType("home")}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Home className="w-6 h-6 text-fitness-primary" />
              <h4 className="font-semibold text-gray-800">Home Training</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Perfect for beginners and those who prefer working out at home</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">Bodyweight</Badge>
              <Badge variant="outline" className="text-xs">Minimal Equipment</Badge>
              <Badge variant="outline" className="text-xs">Flexible Schedule</Badge>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedType === "gym" 
                ? "border-fitness-primary bg-fitness-primary/10 shadow-md" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedType("gym")}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="w-6 h-6 text-fitness-primary" />
              <h4 className="font-semibold text-gray-800">Gym Training</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Advanced workouts with full equipment access</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">Full Equipment</Badge>
              <Badge variant="outline" className="text-xs">Progressive Overload</Badge>
              <Badge variant="outline" className="text-xs">Advanced Training</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Fitness Goal Selection */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <Target className="w-5 h-5 inline mr-2" />
          Fitness Goal
        </h3>
        <RadioGroup value={fitnessGoal} onValueChange={setFitnessGoal} className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weight_loss" id="weight_loss" />
            <Label htmlFor="weight_loss" className="cursor-pointer">Weight Loss</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="muscle_gain" id="muscle_gain" />
            <Label htmlFor="muscle_gain" className="cursor-pointer">Muscle Gain</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general_fitness" id="general_fitness" />
            <Label htmlFor="general_fitness" className="cursor-pointer">General Fitness</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strength" id="strength" />
            <Label htmlFor="strength" className="cursor-pointer">Strength Building</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="endurance" id="endurance" />
            <Label htmlFor="endurance" className="cursor-pointer">Endurance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flexibility" id="flexibility" />
            <Label htmlFor="flexibility" className="cursor-pointer">Flexibility</Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Fitness Level & Time */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <Zap className="w-5 h-5 inline mr-2" />
            Fitness Level
          </h3>
          <RadioGroup value={fitnessLevel} onValueChange={setFitnessLevel} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner" className="cursor-pointer">Beginner (0-6 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="cursor-pointer">Intermediate (6+ months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced" className="cursor-pointer">Advanced (2+ years)</Label>
            </div>
          </RadioGroup>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <Clock className="w-5 h-5 inline mr-2" />
            Available Time
          </h3>
          <RadioGroup value={availableTime} onValueChange={setAvailableTime} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30" id="time_30" />
              <Label htmlFor="time_30" className="cursor-pointer">30 minutes per session</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="45" id="time_45" />
              <Label htmlFor="time_45" className="cursor-pointer">45 minutes per session</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60" id="time_60" />
              <Label htmlFor="time_60" className="cursor-pointer">60 minutes per session</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="90" id="time_90" />
              <Label htmlFor="time_90" className="cursor-pointer">90+ minutes per session</Label>
            </div>
          </RadioGroup>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
              Generating Your Program...
            </>
          ) : (
            <>
              <Target className="w-5 h-5 mr-2" />
              Generate {selectedType === "home" ? "Home" : "Gym"} Program
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
