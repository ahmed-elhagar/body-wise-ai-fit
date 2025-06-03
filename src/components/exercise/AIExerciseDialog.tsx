
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Target, Clock, Dumbbell, Heart, Zap, Home, Building2 } from "lucide-react";
import { useState } from "react";

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
  const [customRequirements, setCustomRequirements] = useState("");

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const handleGenerate = () => {
    const enhancedPreferences = {
      ...preferences,
      customRequirements: customRequirements.trim() || undefined
    };
    onGenerate(enhancedPreferences);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Customize Your Exercise Program
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Workout Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Workout Environment
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={preferences.workoutType === "home" ? "default" : "outline"}
                onClick={() => handlePreferenceChange('workoutType', 'home')}
                className="h-16 flex flex-col items-center gap-2"
              >
                <Home className="w-5 h-5" />
                <span>Home Workout</span>
              </Button>
              <Button
                variant={preferences.workoutType === "gym" ? "default" : "outline"}
                onClick={() => handlePreferenceChange('workoutType', 'gym')}
                className="h-16 flex flex-col items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                <span>Gym Workout</span>
              </Button>
            </div>
          </div>

          {/* Primary Goal */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Primary Fitness Goal
            </Label>
            <Select 
              value={preferences.goalType} 
              onValueChange={(value) => handlePreferenceChange('goalType', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your main goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">🔥 Weight Loss & Fat Burn</SelectItem>
                <SelectItem value="muscle_gain">💪 Muscle Building</SelectItem>
                <SelectItem value="strength">⚡ Strength Training</SelectItem>
                <SelectItem value="endurance">🏃 Endurance & Cardio</SelectItem>
                <SelectItem value="flexibility">🧘 Flexibility & Mobility</SelectItem>
                <SelectItem value="general_fitness">🎯 General Fitness</SelectItem>
                <SelectItem value="athletic_performance">🏆 Athletic Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fitness Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Current Fitness Level
            </Label>
            <Select 
              value={preferences.fitnessLevel} 
              onValueChange={(value) => handlePreferenceChange('fitnessLevel', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🌱 Beginner (New to exercise)</SelectItem>
                <SelectItem value="intermediate">🚀 Intermediate (6+ months experience)</SelectItem>
                <SelectItem value="advanced">🔥 Advanced (2+ years experience)</SelectItem>
                <SelectItem value="expert">👑 Expert (Professional level)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Availability */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Available Time Per Session
            </Label>
            <Select 
              value={preferences.availableTime} 
              onValueChange={(value) => handlePreferenceChange('availableTime', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="How much time do you have?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">⚡ Quick (15-20 minutes)</SelectItem>
                <SelectItem value="30">🎯 Standard (30-40 minutes)</SelectItem>
                <SelectItem value="45">💪 Extended (45-60 minutes)</SelectItem>
                <SelectItem value="60">🔥 Intensive (60+ minutes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Workout Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Weekly Workout Days</Label>
            <Select 
              value={preferences.workoutDays} 
              onValueChange={(value) => handlePreferenceChange('workoutDays', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="How many days per week?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Days/Week (Beginner friendly)</SelectItem>
                <SelectItem value="4">4 Days/Week (Balanced approach)</SelectItem>
                <SelectItem value="5">5 Days/Week (Active lifestyle)</SelectItem>
                <SelectItem value="6">6 Days/Week (High commitment)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Preferences */}
          {preferences.workoutType === "home" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Available Home Equipment</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'bodyweight', label: 'Bodyweight Only' },
                  { key: 'dumbbells', label: 'Dumbbells' },
                  { key: 'resistance_bands', label: 'Resistance Bands' },
                  { key: 'yoga_mat', label: 'Yoga Mat' },
                  { key: 'pull_up_bar', label: 'Pull-up Bar' },
                  { key: 'kettlebell', label: 'Kettlebell' }
                ].map((equipment) => (
                  <div key={equipment.key} className="flex items-center space-x-2 p-2 border rounded-lg">
                    <Switch
                      checked={preferences.equipment?.includes(equipment.key)}
                      onCheckedChange={(checked) => {
                        const currentEquipment = preferences.equipment || [];
                        const newEquipment = checked
                          ? [...currentEquipment, equipment.key]
                          : currentEquipment.filter((e: string) => e !== equipment.key);
                        handlePreferenceChange('equipment', newEquipment);
                      }}
                    />
                    <Label className="text-sm">{equipment.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Muscle Groups */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Focus Areas (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'upper_body', label: 'Upper Body' },
                { key: 'lower_body', label: 'Lower Body' },
                { key: 'core', label: 'Core/Abs' },
                { key: 'cardio', label: 'Cardio' },
                { key: 'full_body', label: 'Full Body' },
                { key: 'flexibility', label: 'Flexibility' }
              ].map((area) => (
                <div key={area.key} className="flex items-center space-x-2 p-2 border rounded-lg">
                  <Switch
                    checked={preferences.targetMuscleGroups?.includes(area.key)}
                    onCheckedChange={(checked) => {
                      const currentAreas = preferences.targetMuscleGroups || [];
                      const newAreas = checked
                        ? [...currentAreas, area.key]
                        : currentAreas.filter((a: string) => a !== area.key);
                      handlePreferenceChange('targetMuscleGroups', newAreas);
                    }}
                  />
                  <Label className="text-sm">{area.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Requirements */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Additional Requirements (Optional)</Label>
            <Textarea
              placeholder="e.g., I have a bad knee, prefer low-impact exercises, want to focus on posture improvement..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !preferences.goalType || !preferences.fitnessLevel}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Program...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Personalized Program
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
