
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import { toast } from "sonner";

interface WeightEntryFormProps {
  onSuccess?: () => void;
}

const WeightEntryForm = ({ onSuccess }: WeightEntryFormProps) => {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addWeightEntry } = useWeightTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) {
      toast.error('Weight is required');
      return;
    }

    setIsLoading(true);
    
    try {
      await addWeightEntry({
        weight: parseFloat(weight),
        body_fat_percentage: bodyFat ? parseFloat(bodyFat) : undefined,
        muscle_mass: muscleMass ? parseFloat(muscleMass) : undefined,
        notes: notes.trim() || undefined,
        recorded_at: new Date().toISOString()
      });
      
      toast.success('Weight entry added successfully!');
      
      // Reset form
      setWeight('');
      setBodyFat('');
      setMuscleMass('');
      setNotes('');
      
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add weight entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="weight">Weight (kg) *</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter your weight"
          required
        />
      </div>

      <div>
        <Label htmlFor="body-fat">Body Fat % (optional)</Label>
        <Input
          id="body-fat"
          type="number"
          step="0.1"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          placeholder="Enter body fat percentage"
        />
      </div>

      <div>
        <Label htmlFor="muscle-mass">Muscle Mass (kg) (optional)</Label>
        <Input
          id="muscle-mass"
          type="number"
          step="0.1"
          value={muscleMass}
          onChange={(e) => setMuscleMass(e.target.value)}
          placeholder="Enter muscle mass"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Adding...' : 'Add Entry'}
      </Button>
    </form>
  );
};

export default WeightEntryForm;
