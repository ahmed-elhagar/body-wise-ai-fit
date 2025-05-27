
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

interface AIPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
}

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AIPreferences;
  onPreferencesChange: (preferences: AIPreferences) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AIGenerationDialog = ({ 
  isOpen, 
  onClose, 
  preferences, 
  onPreferencesChange, 
  onGenerate, 
  isGenerating 
}: AIGenerationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate AI Meal Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="duration">Plan Duration</Label>
            <Select 
              value={preferences.duration} 
              onValueChange={(value) => onPreferencesChange({ ...preferences, duration: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Week</SelectItem>
                <SelectItem value="2">2 Weeks</SelectItem>
                <SelectItem value="4">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cuisine">Preferred Cuisine (Optional)</Label>
            <Input
              value={preferences.cuisine}
              onChange={(e) => onPreferencesChange({ ...preferences, cuisine: e.target.value })}
              placeholder="e.g., Mediterranean, Asian, Italian"
            />
          </div>
          <div>
            <Label htmlFor="maxPrepTime">Max Prep Time (minutes)</Label>
            <Select 
              value={preferences.maxPrepTime} 
              onValueChange={(value) => onPreferencesChange({ ...preferences, maxPrepTime: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="w-full bg-fitness-gradient hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Plan
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
