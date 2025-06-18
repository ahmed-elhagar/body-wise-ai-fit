
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, Utensils, AlertCircle } from "lucide-react";

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: {
    cuisine: string;
    maxPrepTime: string;
    includeSnacks: boolean;
  };
  onPreferencesChange: (newPrefs: any) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  hasExistingPlan: boolean;
}

const AIGenerationDialog = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Generate AI Meal Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {hasExistingPlan && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">
                    This will replace your existing meal plan
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cuisine Preference</Label>
              <Select
                value={preferences.cuisine}
                onValueChange={(value) => onPreferencesChange({ ...preferences, cuisine: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="mixed">Mixed Cuisine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Prep Time</Label>
              <Select
                value={preferences.maxPrepTime}
                onValueChange={(value) => onPreferencesChange({ ...preferences, maxPrepTime: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select prep time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="unlimited">No limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Include Snacks</Label>
              <p className="text-sm text-gray-500">Add healthy snack options between meals</p>
            </div>
            <Switch
              checked={preferences.includeSnacks}
              onCheckedChange={(checked) => onPreferencesChange({ ...preferences, includeSnacks: checked })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
