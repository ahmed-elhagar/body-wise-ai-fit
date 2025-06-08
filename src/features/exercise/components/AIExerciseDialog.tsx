
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Brain, Zap, Home, Building2, Target, Clock, Dumbbell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  setPreferences: (prefs: any) => void;
  onGenerate: (preferences: any) => void;
  isGenerating: boolean;
}

export const AIExerciseDialog = ({
  open,
  onOpenChange,
  preferences,
  setPreferences,
  onGenerate,
  isGenerating
}: AIExerciseDialogProps) => {
  const { t } = useLanguage();

  const handleGenerate = () => {
    onGenerate(preferences);
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-blue-600" />
            {t('Generate AI Exercise Program')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Type */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              {t('Workout Environment')}
            </h3>
            <RadioGroup
              value={preferences.workoutType}
              onValueChange={(value) => updatePreference('workoutType', value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {t('Home Workout')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gym" id="gym" />
                <Label htmlFor="gym" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {t('Gym Workout')}
                </Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Fitness Goals */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('Fitness Goals')}
            </h3>
            <RadioGroup
              value={preferences.goalType}
              onValueChange={(value) => updatePreference('goalType', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight_loss" id="weight_loss" />
                <Label htmlFor="weight_loss">{t('Weight Loss')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                <Label htmlFor="muscle_gain">{t('Muscle Gain')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general_fitness" id="general_fitness" />
                <Label htmlFor="general_fitness">{t('General Fitness')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="strength" id="strength" />
                <Label htmlFor="strength">{t('Strength Building')}</Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Fitness Level */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3">{t('Fitness Level')}</h3>
            <RadioGroup
              value={preferences.fitnessLevel}
              onValueChange={(value) => updatePreference('fitnessLevel', value)}
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">{t('Beginner')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">{t('Intermediate')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">{t('Advanced')}</Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Workout Duration */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('Workout Duration')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t('Available Time')}: {preferences.availableTime} {t('minutes')}</span>
                <Badge variant="outline">{preferences.availableTime} min</Badge>
              </div>
              <Slider
                value={[parseInt(preferences.availableTime)]}
                onValueChange={(value) => updatePreference('availableTime', value[0].toString())}
                max={120}
                min={15}
                step={15}
                className="w-full"
              />
            </div>
          </Card>

          {/* Equipment Available */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3">{t('Available Equipment')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'bodyweight',
                'dumbbells',
                'resistance_bands',
                'kettlebells',
                'barbells',
                'machines',
                'pull_up_bar',
                'yoga_mat'
              ].map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={equipment}
                    checked={preferences.equipment?.includes(equipment)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updatePreference('equipment', [...(preferences.equipment || []), equipment]);
                      } else {
                        updatePreference('equipment', preferences.equipment?.filter((e: string) => e !== equipment) || []);
                      }
                    }}
                  />
                  <Label htmlFor={equipment} className="text-sm">
                    {t(equipment)}
                  </Label>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('Generating...')}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {t('Generate Program')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
