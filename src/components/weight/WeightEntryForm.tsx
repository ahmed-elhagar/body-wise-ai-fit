
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { toast } from "sonner";

interface WeightEntryFormProps {
  onSuccess?: () => void;
}

const WeightEntryForm = ({ onSuccess }: WeightEntryFormProps) => {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { addWeightEntry, isAdding } = useWeightTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) {
      toast.error("Please enter your weight");
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    addWeightEntry({
      weight: weightValue,
      body_fat_percentage: bodyFat ? parseFloat(bodyFat) : undefined,
      muscle_mass: muscleMass ? parseFloat(muscleMass) : undefined,
      recorded_at: new Date(date).toISOString(),
      notes: notes || undefined,
    });

    // Reset form
    setWeight("");
    setBodyFat("");
    setMuscleMass("");
    setNotes("");
    setDate(new Date().toISOString().split('T')[0]);
    
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <Label htmlFor="weight">Weight (kg) *</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min="0"
          max="500"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter your weight"
          required
        />
      </div>

      <div>
        <Label htmlFor="bodyFat">Body Fat Percentage (%)</Label>
        <Input
          id="bodyFat"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
        <Input
          id="muscleMass"
          type="number"
          step="0.1"
          min="0"
          max="200"
          value={muscleMass}
          onChange={(e) => setMuscleMass(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this entry..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isAdding}
        className="w-full"
      >
        {isAdding ? "Adding..." : "Add Weight Entry"}
      </Button>
    </form>
  );
};

export default WeightEntryForm;
