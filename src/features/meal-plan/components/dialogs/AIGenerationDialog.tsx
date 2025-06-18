
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2 } from "lucide-react";

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (prefs: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasExistingPlan: boolean;
}

export const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  const handlePreferenceChange = (key: string, value: any) => {
    onPreferencesChange({ [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            {hasExistingPlan ? 'Regenerate Meal Plan' : 'Generate AI Meal Plan'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="duration">Plan Duration</Label>
            <Select
              value={preferences.duration}
              onValueChange={(value) => handlePreferenceChange('duration', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Select
              value={preferences.cuisine}
              onValueChange={(value) => handlePreferenceChange('cuisine', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="american">American</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prepTime">Max Prep Time</Label>
            <Select
              value={preferences.maxPrepTime}
              onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select prep time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSnacks"
              checked={preferences.includeSnacks}
              onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
            />
            <Label htmlFor="includeSnacks">Include snacks</Label>
          </div>

          <div className="pt-4">
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {hasExistingPlan ? 'Regenerate Plan' : 'Generate Plan'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
