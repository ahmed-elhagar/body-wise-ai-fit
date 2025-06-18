
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeightTracking } from "@/hooks/useWeightTracking";

interface WeightEntryFormProps {
  onSubmit?: (weight: number) => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export const WeightEntryForm = ({ onSubmit, onSuccess, isLoading }: WeightEntryFormProps) => {
  const [weight, setWeight] = useState('');
  const { addWeightEntry, isAdding } = useWeightTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    if (weightValue && weightValue > 0) {
      if (onSubmit) {
        onSubmit(weightValue);
      } else {
        // Use the hook's addWeightEntry if no custom onSubmit
        addWeightEntry({
          weight: weightValue,
          recorded_at: new Date().toISOString(),
        });
        onSuccess?.();
      }
      setWeight('');
    }
  };

  const loading = isLoading || isAdding;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Weight Entry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Entry'}
        </Button>
      </form>
    </Card>
  );
};
