import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Target, Clock, Calendar, Coins } from "lucide-react";
import { useState } from "react";
import { useCreditSystem } from "@/hooks/useCreditSystem";

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
  const { userCredits } = useCreditSystem();
  const [customRequirements, setCustomRequirements] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "wednesday", "friday"]);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleGenerate = () => {
    const enhancedPreferences = {
      ...preferences,
      customRequirements: customRequirements.trim() || undefined,
      selectedWorkoutDays: selectedDays
    };
    onGenerate(enhancedPreferences);
  };

  const workoutDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const workoutTypeLabel = preferences.workoutType === 'gym' ? 'Gym' : 'Home';
  const canGenerate = !isGenerating && userCredits > 0 && preferences.goalType && preferences.fitnessLevel && selectedDays.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Generate Your {workoutTypeLabel} Exercise Program
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Create a personalized {workoutTypeLabel.toLowerCase()} workout plan tailored to your fitness goals and preferences.
          </p>
        </DialogHeader>

        {/* Credits Info */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
          <Coins className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">
            {userCredits === -1 ? 'Unlimited generations available' : `${userCredits} generation${userCredits !== 1 ? 's' : ''} remaining`}
          </span>
        </div>
        
        <div className="space-y-6 mt-4">
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
            <Label className="text-base font-semibold">Current Fitness Level</Label>
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

          {/* Custom Weekly Schedule */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly Workout Schedule
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              Select the days when you want to work out. Choose at least 2 days for effective results.
            </p>
            
            {/* Quick Select Options */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDays(["monday", "wednesday", "friday"])}
                className="text-xs"
              >
                3 Days (M/W/F)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDays(["monday", "tuesday", "thursday", "friday"])}
                className="text-xs"
              >
                4 Days (M/T/Th/F)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDays(["monday", "tuesday", "wednesday", "thursday", "friday"])}
                className="text-xs"
              >
                5 Days (Weekdays)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDays([])}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>

            {/* Day Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {workoutDays.map((day) => (
                <div key={day.key} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedDays.includes(day.key)}
                    onCheckedChange={() => handleDayToggle(day.key)}
                  />
                  <Label className="text-sm font-medium cursor-pointer">{day.label}</Label>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              Selected: {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} per week
            </p>
          </div>

          {/* Equipment Preferences for Home Workouts */}
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
            disabled={!canGenerate}
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
          
          {!canGenerate && (
            <div className="text-center">
              {userCredits === 0 ? (
                <p className="text-xs text-red-500">
                  No AI generations remaining. Please upgrade your plan.
                </p>
              ) : selectedDays.length === 0 ? (
                <p className="text-xs text-red-500">
                  Please select at least one workout day to continue.
                </p>
              ) : (
                <p className="text-xs text-red-500">
                  Please fill in all required fields to continue.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
