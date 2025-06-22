import React, { useState } from 'react';
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
  ChefHat,
  Target,
  Globe,
  Clock,
  Utensils,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (preferences: MealPlanPreferences) => Promise<void>;
  isGenerating: boolean;
  progress: number;
}

interface MealPlanPreferences {
  cuisine: string;
  cookingSkill: string;
  maxPrepTime: number;
  equipmentLevel: string;
  includeSnacks: boolean;
  weekOffset: number;
  culturalAdaptation: boolean;
}

const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  progress
}) => {
  const [preferences, setPreferences] = useState<MealPlanPreferences>({
    cuisine: 'international',
    cookingSkill: 'intermediate',
    maxPrepTime: 45,
    equipmentLevel: 'moderate',
    includeSnacks: true,
    weekOffset: 0,
    culturalAdaptation: true
  });

  const [step, setStep] = useState<'preferences' | 'generating' | 'complete'>('preferences');

  const cuisineOptions = [
    { value: 'international', label: 'International Mix', icon: '🌍' },
    { value: 'middle_eastern', label: 'Middle Eastern', icon: '🥙' },
    { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { value: 'asian', label: 'Asian', icon: '🍜' },
    { value: 'indian', label: 'Indian', icon: '🍛' },
    { value: 'italian', label: 'Italian', icon: '🍝' },
    { value: 'mexican', label: 'Mexican', icon: '🌮' }
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Simple recipes, minimal prep' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity' },
    { value: 'advanced', label: 'Advanced', description: 'Complex techniques welcome' }
  ];

  const equipmentLevels = [
    { value: 'basic', label: 'Basic', description: 'Stovetop, oven, basic tools' },
    { value: 'moderate', label: 'Moderate', description: 'Plus blender, food processor' },
    { value: 'full', label: 'Full Kitchen', description: 'All equipment available' }
  ];

  const prepTimeOptions = [
    { value: 15, label: '15 minutes', icon: '⚡' },
    { value: 30, label: '30 minutes', icon: '🕐' },
    { value: 45, label: '45 minutes', icon: '🕑' },
    { value: 60, label: '1 hour', icon: '🕒' },
    { value: 120, label: '2+ hours', icon: '🕓' }
  ];

  const handleGenerate = async () => {
    setStep('generating');
    try {
      await onGenerate(preferences);
      setStep('complete');
      setTimeout(() => {
        onClose();
        setStep('preferences');
      }, 2000);
    } catch (error) {
      setStep('preferences');
    }
  };

  const updatePreference = (key: keyof MealPlanPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      {/* Cuisine Selection */}
      <div>
        <label className="text-sm font-semibold text-brand-neutral-900 mb-3 flex items-center">
          <Globe className="h-4 w-4 mr-2 text-brand-primary-600" />
          Cuisine Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cuisineOptions.map((cuisine) => (
            <button
              key={cuisine.value}
              onClick={() => updatePreference('cuisine', cuisine.value)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                preferences.cuisine === cuisine.value
                  ? 'border-brand-primary-500 bg-brand-primary-50'
                  : 'border-brand-neutral-200 hover:border-brand-primary-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{cuisine.icon}</span>
                <span className="font-medium text-sm">{cuisine.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cooking Skill */}
      <div>
        <label className="text-sm font-semibold text-brand-neutral-900 mb-3 flex items-center">
          <ChefHat className="h-4 w-4 mr-2 text-brand-primary-600" />
          Cooking Skill Level
        </label>
        <div className="space-y-2">
          {skillLevels.map((skill) => (
            <button
              key={skill.value}
              onClick={() => updatePreference('cookingSkill', skill.value)}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                preferences.cookingSkill === skill.value
                  ? 'border-brand-primary-500 bg-brand-primary-50'
                  : 'border-brand-neutral-200 hover:border-brand-primary-300'
              }`}
            >
              <div className="font-medium text-sm">{skill.label}</div>
              <div className="text-xs text-brand-neutral-600">{skill.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Prep Time */}
      <div>
        <label className="text-sm font-semibold text-brand-neutral-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-brand-primary-600" />
          Maximum Prep Time
        </label>
        <div className="grid grid-cols-3 gap-2">
          {prepTimeOptions.map((time) => (
            <button
              key={time.value}
              onClick={() => updatePreference('maxPrepTime', time.value)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                preferences.maxPrepTime === time.value
                  ? 'border-brand-primary-500 bg-brand-primary-50'
                  : 'border-brand-neutral-200 hover:border-brand-primary-300'
              }`}
            >
              <div className="text-lg mb-1">{time.icon}</div>
              <div className="font-medium text-xs">{time.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Level */}
      <div>
        <label className="text-sm font-semibold text-brand-neutral-900 mb-3 flex items-center">
          <Utensils className="h-4 w-4 mr-2 text-brand-primary-600" />
          Kitchen Equipment
        </label>
        <div className="space-y-2">
          {equipmentLevels.map((equipment) => (
            <button
              key={equipment.value}
              onClick={() => updatePreference('equipmentLevel', equipment.value)}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                preferences.equipmentLevel === equipment.value
                  ? 'border-brand-primary-500 bg-brand-primary-50'
                  : 'border-brand-neutral-200 hover:border-brand-primary-300'
              }`}
            >
              <div className="font-medium text-sm">{equipment.label}</div>
              <div className="text-xs text-brand-neutral-600">{equipment.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-brand-neutral-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-brand-primary-600" />
            <span className="font-medium text-sm">Include Snacks</span>
          </div>
          <button
            onClick={() => updatePreference('includeSnacks', !preferences.includeSnacks)}
            className={`w-12 h-6 rounded-full transition-all ${
              preferences.includeSnacks ? 'bg-brand-primary-500' : 'bg-brand-neutral-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              preferences.includeSnacks ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-brand-neutral-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-brand-primary-600" />
            <span className="font-medium text-sm">Cultural Adaptation</span>
          </div>
          <button
            onClick={() => updatePreference('culturalAdaptation', !preferences.culturalAdaptation)}
            className={`w-12 h-6 rounded-full transition-all ${
              preferences.culturalAdaptation ? 'bg-brand-primary-500' : 'bg-brand-neutral-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              preferences.culturalAdaptation ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
      <h3 className="text-lg font-bold text-brand-neutral-900 mb-2">Generating Your Meal Plan</h3>
      <p className="text-brand-neutral-600 mb-6">
        Our AI is creating a personalized 7-day meal plan based on your preferences...
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="space-y-2 text-sm text-brand-neutral-600">
        {progress > 0 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Analyzing your profile</div>}
        {progress > 25 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Calculating nutrition needs</div>}
        {progress > 50 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Generating meal recipes</div>}
        {progress > 75 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Optimizing meal plan</div>}
        {progress > 90 && <div className="flex items-center justify-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Saving to your account</div>}
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
        <CheckCircle2 className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-brand-neutral-900 mb-2">Meal Plan Generated!</h3>
      <p className="text-brand-neutral-600">
        Your personalized 7-day meal plan is ready. Enjoy your healthy journey!
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <DialogTitle>AI Meal Plan Generator</DialogTitle>
                <DialogDescription>
                  {step === 'preferences' && 'Customize your meal plan preferences'}
                  {step === 'generating' && 'Creating your personalized meal plan'}
                  {step === 'complete' && 'Your meal plan is ready!'}
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
              className="flex-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white border-0"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationModal; 