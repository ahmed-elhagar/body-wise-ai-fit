
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Dumbbell, Home, Building2 } from "lucide-react";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  onPreferencesChange: (prefs: any) => void;
  onGenerate: (preferences: any) => Promise<void>;
  isGenerating: boolean;
  workoutType: "home" | "gym";
}

export const AIExerciseDialog = ({
  open,
  onOpenChange,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  workoutType
}: AIExerciseDialogProps) => {
  const handleGenerate = async () => {
    await onGenerate(preferences);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Generate Exercise Program
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
              workoutType === 'gym' 
                ? 'bg-purple-600' 
                : 'bg-blue-600'
            }`}>
              {workoutType === 'gym' ? (
                <Building2 className="w-6 h-6 text-white" />
              ) : (
                <Home className="w-6 h-6 text-white" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              AI-Powered {workoutType === 'gym' ? 'Gym' : 'Home'} Program
            </h3>
            <p className="text-sm text-gray-600">
              Generate a personalized 4-week exercise program tailored to your goals and preferences.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Workout Type</span>
              <Badge className={workoutType === 'gym' ? 'bg-purple-600' : 'bg-blue-600'}>
                {workoutType === 'gym' ? '🏋️ Gym' : '🏠 Home'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration</span>
              <Badge variant="outline">4 Weeks</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Frequency</span>
              <Badge variant="outline">4-5 Days/Week</Badge>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
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
