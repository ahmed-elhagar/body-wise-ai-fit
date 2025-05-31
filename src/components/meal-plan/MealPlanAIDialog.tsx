
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import LoadingIndicator from "@/components/ui/loading-indicator";

interface MealPlanAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const MealPlanAIDialog = ({
  open,
  onOpenChange,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating
}: MealPlanAIDialogProps) => {
  const [localPreferences, setLocalPreferences] = useState({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner",
    ...preferences
  });

  const handlePreferenceChange = (key: string, value: any) => {
    const newPrefs = { ...localPreferences, [key]: value };
    setLocalPreferences(newPrefs);
    onPreferencesChange(newPrefs);
  };

  const handleGenerate = () => {
    console.log('🎯 AI Dialog: Starting generation with preferences:', localPreferences);
    onGenerate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-fitness-primary-600 to-fitness-secondary-600 bg-clip-text text-transparent">
            <Sparkles className="h-6 w-6 text-fitness-primary-600" />
            Generate AI Meal Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-fitness-neutral-700">Duration</Label>
            <Select 
              value={localPreferences.duration} 
              onValueChange={(value) => handlePreferenceChange('duration', value)}
            >
              <SelectTrigger className="bg-fitness-neutral-50 border-fitness-neutral-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">1 Week</SelectItem>
                <SelectItem value="14">2 Weeks</SelectItem>
                <SelectItem value="30">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-fitness-neutral-700">Cuisine Type</Label>
            <Select 
              value={localPreferences.cuisine} 
              onValueChange={(value) => handlePreferenceChange('cuisine', value)}
            >
              <SelectTrigger className="bg-fitness-neutral-50 border-fitness-neutral-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed International</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-fitness-neutral-700">Max Prep Time</Label>
            <Select 
              value={localPreferences.maxPrepTime} 
              onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
            >
              <SelectTrigger className="bg-fitness-neutral-50 border-fitness-neutral-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-fitness-primary-50 rounded-lg">
            <div>
              <Label className="text-sm font-semibold text-fitness-primary-900">Include Snacks</Label>
              <p className="text-xs text-fitness-primary-700">Add healthy snacks between meals</p>
            </div>
            <Switch 
              checked={localPreferences.includeSnacks}
              onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
            />
          </div>

          {isGenerating ? (
            <LoadingIndicator
              status="loading"
              message="Generating Your Plan..."
              description="Please wait while AI creates your personalized meal plan"
              variant="card"
              size="lg"
            />
          ) : (
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-fitness-primary-600 to-fitness-secondary-600 hover:from-fitness-primary-700 hover:to-fitness-secondary-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Meal Plan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanAIDialog;
