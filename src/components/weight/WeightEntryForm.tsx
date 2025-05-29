
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Scale, TrendingDown } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const WeightEntryForm = () => {
  const { addWeightEntry, isAdding } = useWeightTracking();
  const [formData, setFormData] = useState({
    weight: "",
    body_fat_percentage: "",
    muscle_mass: "",
    notes: "",
    recorded_at: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || parseFloat(formData.weight) <= 0) return;

    addWeightEntry({
      weight: parseFloat(formData.weight),
      body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : undefined,
      muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : undefined,
      notes: formData.notes || undefined,
      recorded_at: new Date(formData.recorded_at).toISOString()
    });

    // Reset form
    setFormData({
      weight: "",
      body_fat_percentage: "",
      muscle_mass: "",
      notes: "",
      recorded_at: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center mb-6">
        <Scale className="w-5 h-5 text-fitness-primary mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Log Weight Entry</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="Enter your weight"
              required
            />
          </div>
          <div>
            <Label htmlFor="recorded_at">Date</Label>
            <Input
              id="recorded_at"
              type="date"
              value={formData.recorded_at}
              onChange={(e) => setFormData(prev => ({ ...prev, recorded_at: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="body_fat">Body Fat % (optional)</Label>
            <Input
              id="body_fat"
              type="number"
              step="0.1"
              value={formData.body_fat_percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, body_fat_percentage: e.target.value }))}
              placeholder="e.g., 15.2"
            />
          </div>
          <div>
            <Label htmlFor="muscle_mass">Muscle Mass (kg) (optional)</Label>
            <Input
              id="muscle_mass"
              type="number"
              step="0.1"
              value={formData.muscle_mass}
              onChange={(e) => setFormData(prev => ({ ...prev, muscle_mass: e.target.value }))}
              placeholder="e.g., 45.0"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="How are you feeling? Any observations?"
            rows={3}
          />
        </div>

        <Button 
          type="submit"
          disabled={isAdding || !formData.weight}
          className="w-full bg-fitness-gradient hover:opacity-90 text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {isAdding ? 'Adding...' : 'Log Entry'}
        </Button>
      </form>
    </Card>
  );
};

export default WeightEntryForm;
