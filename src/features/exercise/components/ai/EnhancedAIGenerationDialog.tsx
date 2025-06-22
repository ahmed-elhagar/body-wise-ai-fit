import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sparkles,
  Dumbbell,
  Target,
  Clock,
  Home,
  Building,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { ExercisePreferences } from '../../hooks/core/useExerciseProgram';

interface EnhancedAIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (preferences: ExercisePreferences) => Promise<void>;
  currentWorkoutType: "home" | "gym";
  creditsRemaining: number;
  isPro: boolean;
  isGenerating?: boolean;
  progress?: number;
}

export const EnhancedAIGenerationDialog: React.FC<EnhancedAIGenerationDialogProps> = ({
  open,
  onClose,
  onGenerate,
  currentWorkoutType,
  creditsRemaining,
  isPro,
  isGenerating = false,
  progress = 0
}) => {
  const [preferences, setPreferences] = useState<ExercisePreferences>({
    workoutType: currentWorkoutType,
    goalType: 'strength',
    fitnessLevel: 'intermediate',
    availableTime: '45',
    preferredWorkouts: ['strength_training'],
    targetMuscleGroups: ['full_body'],
    equipment: currentWorkoutType === 'gym' ? ['dumbbells', 'barbells', 'machines'] : ['bodyweight'],
    duration: '4_weeks',
    workoutDays: '4',
    difficulty: 'intermediate'
  });

  const [step, setStep] = useState<'preferences' | 'generating' | 'complete'>('preferences');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep('preferences');
      setGenerationProgress(0);
    }
  }, [open]);

  // Simulate progress during generation
  useEffect(() => {
    if (isGenerating && step === 'generating') {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isGenerating, step]);

  const goalTypes = [
    { value: 'strength', label: 'Build Strength', icon: '💪', description: 'Focus on compound movements and progressive overload' },
    { value: 'muscle_building', label: 'Build Muscle', icon: '🏋️', description: 'Hypertrophy-focused training with higher volume' },
    { value: 'weight_loss', label: 'Lose Weight', icon: '🔥', description: 'High-intensity workouts with cardio elements' },
    { value: 'endurance', label: 'Build Endurance', icon: '🏃', description: 'Cardiovascular fitness and stamina improvement' },
    { value: 'general_fitness', label: 'General Fitness', icon: '⚡', description: 'Balanced approach to overall health' },
    { value: 'athletic_performance', label: 'Athletic Performance', icon: '🏆', description: 'Sport-specific training and conditioning' }
  ];

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to exercise or returning after long break' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular exercise for 6+ months' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced with complex movements' }
  ];

  const timeOptions = [
    { value: '15', label: '15 minutes', icon: '⚡' },
    { value: '30', label: '30 minutes', icon: '🕐' },
    { value: '45', label: '45 minutes', icon: '🕑' },
    { value: '60', label: '60 minutes', icon: '🕒' },
    { value: '90', label: '90+ minutes', icon: '🕓' }
  ];

  const workoutDaysOptions = [
    { value: '3', label: '3 days/week', description: 'Perfect for beginners or busy schedules' },
    { value: '4', label: '4 days/week', description: 'Balanced approach for most people' },
    { value: '5', label: '5 days/week', description: 'Dedicated fitness enthusiasts' },
    { value: '6', label: '6 days/week', description: 'Advanced athletes and competitors' }
  ];

  const muscleGroups = [
    { value: 'full_body', label: 'Full Body', icon: '🎯' },
    { value: 'upper_body', label: 'Upper Body', icon: '💪' },
    { value: 'lower_body', label: 'Lower Body', icon: '🦵' },
    { value: 'core', label: 'Core', icon: '🔥' },
    { value: 'back', label: 'Back', icon: '🏋️' },
    { value: 'chest', label: 'Chest', icon: '💯' }
  ];

  const handleGenerate = async () => {
    setStep('generating');
    setGenerationProgress(0);
    
    try {
      await onGenerate(preferences);
      setGenerationProgress(100);
      setStep('complete');
      
      setTimeout(() => {
        onClose();
        setStep('preferences');
        setGenerationProgress(0);
      }, 2000);
    } catch (error) {
      setStep('preferences');
      setGenerationProgress(0);
    }
  };

  const updatePreference = (key: keyof ExercisePreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleMuscleGroup = (group: string) => {
    setPreferences(prev => ({
      ...prev,
      targetMuscleGroups: prev.targetMuscleGroups.includes(group)
        ? prev.targetMuscleGroups.filter(g => g !== group)
        : [...prev.targetMuscleGroups, group]
    }));
  };

  const renderPreferencesStep = () => (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
      {/* Workout Type */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Building className="h-4 w-4 mr-2 text-indigo-600" />
          Workout Environment
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'home', label: 'Home Workout', icon: Home, description: 'Bodyweight & minimal equipment' },
            { value: 'gym', label: 'Gym Workout', icon: Building, description: 'Full equipment access' }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => updatePreference('workoutType', type.value)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                preferences.workoutType === type.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <type.icon className="h-5 w-5 text-indigo-600" />
                <span className="font-medium">{type.label}</span>
              </div>
              <p className="text-xs text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Goal Type */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="h-4 w-4 mr-2 text-indigo-600" />
          Primary Goal
        </label>
        <div className="grid grid-cols-2 gap-2">
          {goalTypes.map((goal) => (
            <button
              key={goal.value}
              onClick={() => updatePreference('goalType', goal.value)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                preferences.goalType === goal.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{goal.icon}</span>
                <span className="font-medium text-sm">{goal.label}</span>
              </div>
              <p className="text-xs text-gray-600">{goal.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fitness Level */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-indigo-600" />
          Fitness Level
        </label>
        <div className="space-y-2">
          {fitnessLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => updatePreference('fitnessLevel', level.value)}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                preferences.fitnessLevel === level.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="font-medium text-sm">{level.label}</div>
              <div className="text-xs text-gray-600">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Time */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-indigo-600" />
          Time Per Session
        </label>
        <div className="grid grid-cols-3 gap-2">
          {timeOptions.map((time) => (
            <button
              key={time.value}
              onClick={() => updatePreference('availableTime', time.value)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                preferences.availableTime === time.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-lg mb-1">{time.icon}</div>
              <div className="font-medium text-xs">{time.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Workout Days */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Users className="h-4 w-4 mr-2 text-indigo-600" />
          Workout Frequency
        </label>
        <div className="space-y-2">
          {workoutDaysOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updatePreference('workoutDays', option.value)}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                preferences.workoutDays === option.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Target Muscle Groups */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Activity className="h-4 w-4 mr-2 text-indigo-600" />
          Focus Areas
        </label>
        <div className="grid grid-cols-3 gap-2">
          {muscleGroups.map((group) => (
            <button
              key={group.value}
              onClick={() => toggleMuscleGroup(group.value)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                preferences.targetMuscleGroups.includes(group.value)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-lg mb-1">{group.icon}</div>
              <div className="font-medium text-xs">{group.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Generating Your Exercise Program</h3>
      <p className="text-gray-600 mb-6">
        Our AI is creating a personalized 4-week program based on your preferences...
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(generationProgress)}%</span>
        </div>
        <Progress value={generationProgress} className="h-3" />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {generationProgress > 0 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Analyzing your fitness profile</div>}
        {generationProgress > 25 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Selecting optimal exercises</div>}
        {generationProgress > 50 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Creating progressive workouts</div>}
        {generationProgress > 75 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Optimizing weekly schedule</div>}
        {generationProgress > 90 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Saving to your account</div>}
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
        <CheckCircle2 className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Exercise Program Generated!</h3>
      <p className="text-gray-600">
        Your personalized 4-week exercise program is ready. Let's get stronger!
      </p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <DialogTitle>AI Exercise Program Generator</DialogTitle>
                <DialogDescription>
                  {step === 'preferences' && 'Customize your workout preferences'}
                  {step === 'generating' && 'Creating your personalized program'}
                  {step === 'complete' && 'Your program is ready!'}
                </DialogDescription>
              </div>
            </div>
            {!isGenerating && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Credit Status */}
        {!isPro && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {creditsRemaining} AI credits remaining
              </span>
            </div>
          </div>
        )}

        {step === 'preferences' && renderPreferencesStep()}
        {step === 'generating' && renderGeneratingStep()}
        {step === 'complete' && renderCompleteStep()}

        {step === 'preferences' && (
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={!isPro && creditsRemaining <= 0}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Program
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 