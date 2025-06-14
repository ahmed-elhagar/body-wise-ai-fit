
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate AI Exercise Program</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Fitness Level</Label>
            <Select
              value={preferences?.fitness_level || "beginner"}
              onValueChange={(value) => onPreferencesChange({ ...preferences, fitness_level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Primary Goal</Label>
            <Select
              value={preferences?.goal_type || "general_fitness"}
              onValueChange={(value) => onPreferencesChange({ ...preferences, goal_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
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

          <div>
            <Label>Session Duration (minutes)</Label>
            <Input
              type="number"
              value={preferences?.session_duration || 45}
              onChange={(e) => onPreferencesChange({ ...preferences, session_duration: parseInt(e.target.value) })}
              min="15"
              max="120"
            />
          </div>

          <div>
            <Label>Special Notes</Label>
            <Textarea
              value={preferences?.special_notes || ""}
              onChange={(e) => onPreferencesChange({ ...preferences, special_notes: e.target.value })}
              placeholder="Any specific requirements or limitations..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate {workoutType === 'gym' ? 'Gym' : 'Home'} Program
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
