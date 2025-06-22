
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Crown, Coins, User } from 'lucide-react';
import { ExercisePreferences } from '../../hooks/core/useExerciseProgram';
import { useProfile } from '@/features/ai/hooks/useProfile';

interface EnhancedAIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (preferences: ExercisePreferences) => Promise<void>;
  currentWorkoutType: "home" | "gym";
  creditsRemaining: number;
  isPro: boolean;
  isGenerating: boolean;
}

export const EnhancedAIGenerationDialog: React.FC<EnhancedAIGenerationDialogProps> = ({
  open,
  onClose,
  onGenerate,
  currentWorkoutType,
  creditsRemaining,
  isPro,
  isGenerating
}) => {
  const { profile } = useProfile();
  const [preferences, setPreferences] = useState<ExercisePreferences>({
    workoutType: currentWorkoutType,
    fitnessLevel: 'beginner',
    goalType: 'general_fitness',
    availableTime: '30-45 minutes',
    workoutDays: '3-4 days',
    difficulty: 'beginner',
    duration: '4 weeks'
  });

  // Populate preferences from user profile when dialog opens
  useEffect(() => {
    if (open && profile) {
      setPreferences(prev => ({
        ...prev,
        age: profile.age || undefined,
        gender: profile.gender || undefined,
        weight: profile.weight || undefined,
        height: profile.height || undefined,
        activityLevel: profile.activity_level || undefined,
        fitnessLevel: profile.activity_level ? 
          profile.activity_level === 'low' ? 'beginner' :
          profile.activity_level === 'high' ? 'advanced' : 'intermediate'
          : 'beginner',
        goalType: profile.fitness_goal || 'general_fitness',
        language: profile.preferred_language || 'en'
      }));
    }
  }, [open, profile]);

  const handleGenerate = async () => {
    try {
      await onGenerate(preferences);
      onClose();
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'strength', label: 'Strength Building' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'general_fitness', label: 'General Fitness' }
  ];

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const timeOptions = [
    { value: '15-30 minutes', label: '15-30 minutes' },
    { value: '30-45 minutes', label: '30-45 minutes' },
    { value: '45-60 minutes', label: '45-60 minutes' },
    { value: '60+ minutes', label: '60+ minutes' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Generate AI Exercise Program
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Credits Info */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-800 font-medium">Pro Member - Unlimited Generations</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-800 font-medium">{creditsRemaining} Credits Remaining</span>
                  </>
                )}
              </div>
              <Badge className="bg-purple-100 text-purple-700">AI Generated</Badge>
            </div>
          </div>

          {/* Profile Info */}
          {profile && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">Your Profile Data</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                {profile.age && <div>Age: {profile.age}</div>}
                {profile.gender && <div>Gender: {profile.gender}</div>}
                {profile.weight && <div>Weight: {profile.weight}kg</div>}
                {profile.height && <div>Height: {profile.height}cm</div>}
                {profile.activity_level && <div>Activity: {profile.activity_level}</div>}
                {profile.fitness_goal && <div>Goal: {profile.fitness_goal}</div>}
              </div>
            </div>
          )}

          {/* Basic Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Workout Type</Label>
              <Select 
                value={preferences.workoutType} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, workoutType: value as "home" | "gym" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Workout</SelectItem>
                  <SelectItem value="gym">Gym Workout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
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

            <div>
              <Label>Available Time</Label>
              <Select 
                value={preferences.availableTime} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, availableTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Workout Days per Week</Label>
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
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Program Duration</Label>
              <Select 
                value={preferences.duration} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 weeks">2 weeks</SelectItem>
                  <SelectItem value="4 weeks">4 weeks</SelectItem>
                  <SelectItem value="6 weeks">6 weeks</SelectItem>
                  <SelectItem value="8 weeks">8 weeks</SelectItem>
                  <SelectItem value="12 weeks">12 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personal Details Override */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Override Profile Data (Optional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Age</Label>
                <Input
                  type="number"
                  placeholder={profile?.age?.toString() || "Age"}
                  value={preferences.age || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label className="text-xs">Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder={profile?.weight?.toString() || "Weight"}
                  value={preferences.weight || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || (!isPro && creditsRemaining <= 0)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
