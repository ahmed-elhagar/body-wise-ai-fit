import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Dumbbell, Home, Building2, Target, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  setPreferences: (preferences: any) => void;
  onGenerate: (preferences: any) => void;
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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("basic");

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const handleMuscleGroupToggle = (muscleGroup: string) => {
    const currentGroups = preferences.targetMuscleGroups || [];
    const updatedGroups = currentGroups.includes(muscleGroup)
      ? currentGroups.filter((g: string) => g !== muscleGroup)
      : [...currentGroups, muscleGroup];
    
    handlePreferenceChange("targetMuscleGroups", updatedGroups);
  };

  const handleWorkoutTypeToggle = (type: string) => {
    const currentTypes = preferences.preferredWorkouts || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter((t: string) => t !== type)
      : [...currentTypes, type];
    
    handlePreferenceChange("preferredWorkouts", updatedTypes);
  };

  const handleEquipmentToggle = (equipment: string) => {
    const currentEquipment = preferences.equipment || [];
    const updatedEquipment = currentEquipment.includes(equipment)
      ? currentEquipment.filter((e: string) => e !== equipment)
      : [...currentEquipment, equipment];
    
    handlePreferenceChange("equipment", updatedEquipment);
  };

  const muscleGroups = [
    { id: "chest", label: "Chest" },
    { id: "back", label: "Back" },
    { id: "shoulders", label: "Shoulders" },
    { id: "arms", label: "Arms" },
    { id: "legs", label: "Legs" },
    { id: "core", label: "Core" },
    { id: "full_body", label: "Full Body" }
  ];

  const workoutTypes = [
    { id: "strength", label: "Strength" },
    { id: "hypertrophy", label: "Hypertrophy" },
    { id: "endurance", label: "Endurance" },
    { id: "cardio", label: "Cardio" },
    { id: "hiit", label: "HIIT" },
    { id: "bodyweight", label: "Bodyweight" }
  ];

  const homeEquipment = [
    { id: "bodyweight", label: "Bodyweight Only" },
    { id: "resistance_bands", label: "Resistance Bands" },
    { id: "light_dumbbells", label: "Light Dumbbells" },
    { id: "kettlebell", label: "Kettlebell" },
    { id: "pull_up_bar", label: "Pull-up Bar" }
  ];

  const gymEquipment = [
    { id: "barbells", label: "Barbells" },
    { id: "dumbbells", label: "Dumbbells" },
    { id: "machines", label: "Machines" },
    { id: "cables", label: "Cables" },
    { id: "smith_machine", label: "Smith Machine" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-blue-500" />
            {t('AI Exercise Program Generator')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            {/* Workout Type */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Workout Environment</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={preferences.workoutType === "home" ? "default" : "outline"}
                  className={`h-20 ${preferences.workoutType === "home" ? "bg-blue-600" : ""}`}
                  onClick={() => handlePreferenceChange("workoutType", "home")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Home className="w-6 h-6" />
                    <span>Home Workout</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={preferences.workoutType === "gym" ? "default" : "outline"}
                  className={`h-20 ${preferences.workoutType === "gym" ? "bg-blue-600" : ""}`}
                  onClick={() => handlePreferenceChange("workoutType", "gym")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="w-6 h-6" />
                    <span>Gym Workout</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Fitness Goal */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Fitness Goal</Label>
              <Select
                value={preferences.goalType}
                onValueChange={(value) => handlePreferenceChange("goalType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="general_fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fitness Level */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Fitness Level</Label>
              <Select
                value={preferences.fitnessLevel}
                onValueChange={(value) => handlePreferenceChange("fitnessLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Time */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-base font-medium">Available Time Per Session</Label>
                <span className="text-sm text-gray-500">{preferences.availableTime} minutes</span>
              </div>
              <Slider
                value={[parseInt(preferences.availableTime)]}
                min={15}
                max={120}
                step={5}
                onValueChange={(value) => handlePreferenceChange("availableTime", value[0].toString())}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>15 min</span>
                <span>60 min</span>
                <span>120 min</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* Target Muscle Groups */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Target Muscle Groups</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {muscleGroups.map((muscle) => (
                  <div key={muscle.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`muscle-${muscle.id}`}
                      checked={preferences.targetMuscleGroups?.includes(muscle.id)}
                      onCheckedChange={() => handleMuscleGroupToggle(muscle.id)}
                    />
                    <label
                      htmlFor={`muscle-${muscle.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {muscle.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Workout Types */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Preferred Workout Types</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {workoutTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={preferences.preferredWorkouts?.includes(type.id)}
                      onCheckedChange={() => handleWorkoutTypeToggle(type.id)}
                    />
                    <label
                      htmlFor={`type-${type.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Duration */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Program Duration (Weeks)</Label>
              <Select
                value={preferences.duration}
                onValueChange={(value) => handlePreferenceChange("duration", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Week</SelectItem>
                  <SelectItem value="2">2 Weeks</SelectItem>
                  <SelectItem value="4">4 Weeks</SelectItem>
                  <SelectItem value="8">8 Weeks</SelectItem>
                  <SelectItem value="12">12 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Workout Days */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Workout Days Per Week</Label>
              <Select
                value={preferences.workoutDays}
                onValueChange={(value) => handlePreferenceChange("workoutDays", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workout frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3 days per week">2-3 days per week</SelectItem>
                  <SelectItem value="3-4 days per week">3-4 days per week</SelectItem>
                  <SelectItem value="4-5 days per week">4-5 days per week</SelectItem>
                  <SelectItem value="5-6 days per week">5-6 days per week</SelectItem>
                  <SelectItem value="6-7 days per week">6-7 days per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {preferences.workoutType === "home" ? "Home Equipment Available" : "Gym Equipment Preference"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(preferences.workoutType === "home" ? homeEquipment : gymEquipment).map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`equipment-${item.id}`}
                      checked={preferences.equipment?.includes(item.id)}
                      onCheckedChange={() => handleEquipmentToggle(item.id)}
                    />
                    <label
                      htmlFor={`equipment-${item.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Additional Notes (Optional)</Label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Any specific requirements or limitations..."
                value={preferences.notes || ""}
                onChange={(e) => handlePreferenceChange("notes", e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button 
            onClick={() => onGenerate(preferences)}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Program
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
