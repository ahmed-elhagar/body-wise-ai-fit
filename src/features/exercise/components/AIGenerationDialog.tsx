
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Dumbbell, Home, Building, Target, Clock } from 'lucide-react';

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (preferences: any) => void;
  isGenerating: boolean;
}

export const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
  open,
  onClose,
  onGenerate,
  isGenerating
}) => {
  const [preferences, setPreferences] = useState({
    workoutType: 'home',
    fitnessLevel: 'beginner',
    goalType: 'general_fitness',
    availableTime: '30-45 minutes',
    workoutDays: '3-4 days',
    preferredWorkouts: ['strength'],
    targetMuscleGroups: ['full_body'],
    equipment: ['bodyweight']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(preferences);
    onClose();
  };

  const workoutTypes = [
    { value: 'home', label: 'Home Workout', icon: Home },
    { value: 'gym', label: 'Gym Workout', icon: Building }
  ];

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'strength', label: 'Strength Building' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'general_fitness', label: 'General Fitness' }
  ];

  const workoutTypeOptions = [
    'strength', 'cardio', 'hiit', 'yoga', 'pilates', 'functional'
  ];

  const muscleGroups = [
    'full_body', 'upper_body', 'lower_body', 'core', 'chest', 'back', 'shoulders', 'arms', 'legs'
  ];

  const equipmentOptions = [
    'bodyweight', 'dumbbells', 'barbell', 'resistance_bands', 'kettlebell', 'medicine_ball'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Generate AI Exercise Program
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Workout Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {workoutTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-all ${
                    preferences.workoutType === type.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setPreferences(prev => ({ ...prev, workoutType: type.value }))}
                >
                  <CardContent className="p-4 text-center">
                    <type.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <div className="font-medium">{type.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fitness Level & Goal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fitness Level</Label>
              <Select 
                value={preferences.fitnessLevel} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, fitnessLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fitnessLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Primary Goal</Label>
              <Select 
                value={preferences.goalType} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, goalType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goalTypes.map(goal => (
                    <SelectItem key={goal.value} value={goal.value}>
                      {goal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Available Time</Label>
              <Select 
                value={preferences.availableTime} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, availableTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-30 minutes">15-30 minutes</SelectItem>
                  <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                  <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                  <SelectItem value="60+ minutes">60+ minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Workout Days</Label>
              <Select 
                value={preferences.workoutDays} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, workoutDays: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3 days">2-3 days</SelectItem>
                  <SelectItem value="3-4 days">3-4 days</SelectItem>
                  <SelectItem value="4-5 days">4-5 days</SelectItem>
                  <SelectItem value="5-6 days">5-6 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferred Workouts */}
          <div className="space-y-3">
            <Label>Preferred Workout Types</Label>
            <div className="grid grid-cols-3 gap-2">
              {workoutTypeOptions.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={type}
                    checked={preferences.preferredWorkouts.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPreferences(prev => ({
                          ...prev,
                          preferredWorkouts: [...prev.preferredWorkouts, type]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          preferredWorkouts: prev.preferredWorkouts.filter(w => w !== type)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={type} className="text-sm capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Target Muscle Groups */}
          <div className="space-y-3">
            <Label>Target Muscle Groups</Label>
            <div className="grid grid-cols-3 gap-2">
              {muscleGroups.map(group => (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox 
                    id={group}
                    checked={preferences.targetMuscleGroups.includes(group)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPreferences(prev => ({
                          ...prev,
                          targetMuscleGroups: [...prev.targetMuscleGroups, group]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          targetMuscleGroups: prev.targetMuscleGroups.filter(g => g !== group)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={group} className="text-sm capitalize">
                    {group.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <Label>Available Equipment</Label>
            <div className="grid grid-cols-3 gap-2">
              {equipmentOptions.map(equipment => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox 
                    id={equipment}
                    checked={preferences.equipment.includes(equipment)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPreferences(prev => ({
                          ...prev,
                          equipment: [...prev.equipment, equipment]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          equipment: prev.equipment.filter(e => e !== equipment)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={equipment} className="text-sm capitalize">
                    {equipment.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Program
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
