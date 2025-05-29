
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ExerciseProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: any;
  onSave: (sets: number, reps: string, notes?: string) => void;
}

export const ExerciseProgressDialog = ({
  open,
  onOpenChange,
  exercise,
  onSave
}: ExerciseProgressDialogProps) => {
  const [sets, setSets] = useState(exercise.sets || 3);
  const [reps, setReps] = useState(exercise.reps || "10");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave(sets, reps, notes);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{exercise.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sets" className="text-sm">Sets</Label>
              <Input
                id="sets"
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="reps" className="text-sm">Reps</Label>
              <Input
                id="reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="10 or 30s"
                className="h-9"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-sm">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Any adjustments?"
              className="h-20 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-health-primary hover:bg-health-primary/90">
              Complete Exercise
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
