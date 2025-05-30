
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scale, Plus, Edit, Trash2, Target } from "lucide-react";
import { useState } from "react";
import { useGoals, CreateGoalData } from "@/hooks/useGoals";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const WeightGoalCard = () => {
  const { getWeightGoal, createGoal, updateGoal, deleteGoal, isCreating, isUpdating } = useGoals();
  const { weightEntries } = useWeightTracking();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    target_weight: '',
    target_date: '',
    notes: ''
  });

  const weightGoal = getWeightGoal();
  const currentWeight = weightEntries[0]?.weight || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData: CreateGoalData = {
      goal_type: 'weight',
      title: `Reach ${formData.target_weight}kg`,
      target_value: parseFloat(formData.target_weight),
      target_unit: 'kg',
      current_value: currentWeight,
      target_date: formData.target_date || undefined,
      category: 'weight',
      notes: formData.notes || undefined
    };

    if (weightGoal) {
      updateGoal({
        id: weightGoal.id,
        ...goalData,
        current_value: currentWeight
      });
    } else {
      createGoal(goalData);
    }
    
    setIsEditing(false);
    setFormData({ target_weight: '', target_date: '', notes: '' });
  };

  const handleEdit = () => {
    if (weightGoal) {
      setFormData({
        target_weight: weightGoal.target_value?.toString() || '',
        target_date: weightGoal.target_date || '',
        notes: weightGoal.notes || ''
      });
    }
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (weightGoal && window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(weightGoal.id);
    }
  };

  const calculateProgress = () => {
    if (!weightGoal || !weightGoal.target_value || !currentWeight) return 0;
    
    const startWeight = weightGoal.current_value || currentWeight;
    const targetWeight = weightGoal.target_value;
    const difference = Math.abs(targetWeight - startWeight);
    const progress = Math.abs(currentWeight - startWeight);
    
    return Math.min((progress / difference) * 100, 100);
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 75) return 'text-green-600';
    if (progress >= 25) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Weight Goal
          </div>
          {weightGoal && !isEditing && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!weightGoal && !isEditing ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Set your weight goal to track progress</p>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Set Weight Goal
            </Button>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="target_weight">Target Weight (kg)</Label>
              <Input
                id="target_weight"
                type="number"
                step="0.1"
                value={formData.target_weight}
                onChange={(e) => setFormData({ ...formData, target_weight: e.target.value })}
                placeholder="Enter target weight"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="target_date">Target Date (optional)</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Why is this goal important to you?"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? 'Saving...' : 'Save Goal'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-800">{currentWeight.toFixed(1)} kg</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Target Weight</p>
                <p className="text-2xl font-bold text-blue-600">{weightGoal.target_value} kg</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progress</span>
                <span className={`text-sm font-medium ${getProgressColor()}`}>
                  {calculateProgress().toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(calculateProgress(), 100)}%` }}
                />
              </div>
            </div>
            
            {weightGoal.target_date && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Target Date:</span>
                <span>{new Date(weightGoal.target_date).toLocaleDateString()}</span>
              </div>
            )}
            
            {weightGoal.notes && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{weightGoal.notes}</p>
              </div>
            )}
            
            <Badge variant="secondary" className="w-fit">
              {calculateProgress() >= 75 ? 'Almost There!' : 
               calculateProgress() >= 25 ? 'Making Progress' : 'Getting Started'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightGoalCard;
