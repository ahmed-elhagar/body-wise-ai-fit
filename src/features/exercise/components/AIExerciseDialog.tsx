
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Home, Building2, Clock, Target, Zap, Users, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  setPreferences: (prefs: any) => void;
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

  const handleGenerateProgram = () => {
    onGenerate(preferences);
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Dumbbell className="w-6 h-6 text-blue-600" />
            {t('exercise.generateProgram') || 'Generate AI Exercise Program'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Basic Settings
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            {/* Workout Type */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Workout Environment</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={preferences.workoutType === "home" ? "default" : "outline"}
                    onClick={() => updatePreference("workoutType", "home")}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Home className="w-6 h-6" />
                    <span>Home Workout</span>
                  </Button>
                  <Button
                    variant={preferences.workoutType === "gym" ? "default" : "outline"}
                    onClick={() => updatePreference("workoutType", "gym")}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Building2 className="w-6 h-6" />
                    <span>Gym Workout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fitness Level */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Fitness Level</Label>
                <Select value={preferences.fitnessLevel} onValueChange={(value) => updatePreference("fitnessLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - New to exercise</SelectItem>
                    <SelectItem value="intermediate">Intermediate - 6+ months experience</SelectItem>
                    <SelectItem value="advanced">Advanced - 2+ years experience</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Primary Goals */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Primary Fitness Goals</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "weightLoss", label: "Weight Loss" },
                    { key: "muscleGain", label: "Muscle Gain" },
                    { key: "strength", label: "Strength" },
                    { key: "endurance", label: "Endurance" },
                    { key: "flexibility", label: "Flexibility" },
                    { key: "general", label: "General Fitness" }
                  ].map((goal) => (
                    <div key={goal.key} className="flex items-center space-x-2">
                      <Switch
                        checked={preferences.goals?.includes(goal.key)}
                        onCheckedChange={(checked) => {
                          const currentGoals = preferences.goals || [];
                          if (checked) {
                            updatePreference("goals", [...currentGoals, goal.key]);
                          } else {
                            updatePreference("goals", currentGoals.filter((g: string) => g !== goal.key));
                          }
                        }}
                      />
                      <Label>{goal.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* Available Equipment */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Available Equipment</Label>
                <Textarea
                  placeholder="List your available equipment (e.g., dumbbells, resistance bands, pull-up bar...)"
                  value={preferences.equipment || ""}
                  onChange={(e) => updatePreference("equipment", e.target.value)}
                  className="min-h-20"
                />
              </CardContent>
            </Card>

            {/* Time per Session */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">
                  Time per Session: {preferences.sessionDuration || 45} minutes
                </Label>
                <Slider
                  value={[preferences.sessionDuration || 45]}
                  onValueChange={(value) => updatePreference("sessionDuration", value[0])}
                  min={15}
                  max={90}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>15 min</span>
                  <span>45 min</span>
                  <span>90 min</span>
                </div>
              </CardContent>
            </Card>

            {/* Injuries/Limitations */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Injuries or Limitations</Label>
                <Textarea
                  placeholder="Describe any injuries, physical limitations, or exercises to avoid..."
                  value={preferences.limitations || ""}
                  onChange={(e) => updatePreference("limitations", e.target.value)}
                  className="min-h-20"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            {/* Days per Week */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">
                  Workout Days per Week: {preferences.daysPerWeek || 4}
                </Label>
                <Slider
                  value={[preferences.daysPerWeek || 4]}
                  onValueChange={(value) => updatePreference("daysPerWeek", value[0])}
                  min={2}
                  max={6}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>2 days</span>
                  <span>4 days</span>
                  <span>6 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Preferred Days */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Preferred Workout Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <Button
                      key={day}
                      variant={preferences.preferredDays?.includes(index + 1) ? "default" : "outline"}
                      onClick={() => {
                        const currentDays = preferences.preferredDays || [];
                        const dayNumber = index + 1;
                        if (currentDays.includes(dayNumber)) {
                          updatePreference("preferredDays", currentDays.filter((d: number) => d !== dayNumber));
                        } else {
                          updatePreference("preferredDays", [...currentDays, dayNumber]);
                        }
                      }}
                      className="h-12"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">Special Instructions</Label>
                <Textarea
                  placeholder="Any specific requests for your workout program? (e.g., focus on core, include cardio, prefer compound movements...)"
                  value={preferences.specialInstructions || ""}
                  onChange={(e) => updatePreference("specialInstructions", e.target.value)}
                  className="min-h-20"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Generation takes 30-60 seconds</span>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateProgram} 
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Program
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
