
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Home, Building2, Target, Clock, Zap } from "lucide-react";
import { ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: ExercisePreferences;
  setPreferences: (prefs: ExercisePreferences) => void;
  onGenerate: (preferences: ExercisePreferences) => void;
  isGenerating: boolean;
}

export const AIExerciseDialog = ({
  open,
  onOpenChange,
  preferences,
  setPreferences,
  onGenerate,
  isGenerating
}: AIExerciseDialogProps) => {
  const handleGenerate = () => {
    onGenerate(preferences);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Customize Your AI Exercise Program
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Type Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Environment</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  preferences.workoutType === "home" 
                    ? "border-fitness-primary bg-fitness-primary/10 shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPreferences({...preferences, workoutType: "home"})}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Home className="w-6 h-6 text-fitness-primary" />
                  <h4 className="font-semibold text-gray-800">Home Training</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Bodyweight and minimal equipment exercises</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Bodyweight</Badge>
                  <Badge variant="outline" className="text-xs">Minimal Equipment</Badge>
                  <Badge variant="outline" className="text-xs">Flexible Schedule</Badge>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  preferences.workoutType === "gym" 
                    ? "border-fitness-primary bg-fitness-primary/10 shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPreferences({...preferences, workoutType: "gym"})}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Building2 className="w-6 h-6 text-fitness-primary" />
                  <h4 className="font-semibold text-gray-800">Gym Training</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Full equipment access and advanced training</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Full Equipment</Badge>
                  <Badge variant="outline" className="text-xs">Progressive Overload</Badge>
                  <Badge variant="outline" className="text-xs">Advanced Training</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Fitness Goals */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <Target className="w-5 h-5 inline mr-2" />
              Fitness Goal
            </h3>
            <RadioGroup 
              value={preferences.goalType} 
              onValueChange={(value) => setPreferences({...preferences, goalType: value})}
              className="grid md:grid-cols-3 gap-4"
            >
              {[
                { value: "weight_loss", label: "Weight Loss" },
                { value: "muscle_gain", label: "Muscle Gain" },
                { value: "general_fitness", label: "General Fitness" },
                { value: "strength", label: "Strength Building" },
                { value: "endurance", label: "Endurance" },
                { value: "flexibility", label: "Flexibility" }
              ].map((goal) => (
                <div key={goal.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={goal.value} id={goal.value} />
                  <Label htmlFor={goal.value} className="cursor-pointer">{goal.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Fitness Level & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <Zap className="w-5 h-5 inline mr-2" />
                Fitness Level
              </h3>
              <RadioGroup 
                value={preferences.fitnessLevel} 
                onValueChange={(value) => setPreferences({...preferences, fitnessLevel: value})}
                className="space-y-3"
              >
                {[
                  { value: "beginner", label: "Beginner (0-6 months)" },
                  { value: "intermediate", label: "Intermediate (6+ months)" },
                  { value: "advanced", label: "Advanced (2+ years)" }
                ].map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <Label htmlFor={level.value} className="cursor-pointer">{level.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <Clock className="w-5 h-5 inline mr-2" />
                Available Time
              </h3>
              <RadioGroup 
                value={preferences.availableTime} 
                onValueChange={(value) => setPreferences({...preferences, availableTime: value})}
                className="space-y-3"
              >
                {[
                  { value: "30", label: "30 minutes per session" },
                  { value: "45", label: "45 minutes per session" },
                  { value: "60", label: "60 minutes per session" },
                  { value: "90", label: "90+ minutes per session" }
                ].map((time) => (
                  <div key={time.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={time.value} id={time.value} />
                    <Label htmlFor={time.value} className="cursor-pointer">{time.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Generate Program
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
