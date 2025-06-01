import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: any;
  setPreferences: (prefs: any) => void;
  onGenerate: (prefs: any) => void;
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
  const { t } = useI18n();

  const handleGenerate = () => {
    onGenerate(preferences);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t('exercise.customizeProgram')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('exercise.goal')}</Label>
            <Select 
              value={preferences.goal} 
              onValueChange={(value) => setPreferences({...preferences, goal: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('exercise.selectGoal')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">{t('exercise.weightLoss')}</SelectItem>
                <SelectItem value="muscle_gain">{t('exercise.muscleGain')}</SelectItem>
                <SelectItem value="strength">{t('exercise.strength')}</SelectItem>
                <SelectItem value="endurance">{t('exercise.endurance')}</SelectItem>
                <SelectItem value="general_fitness">{t('exercise.generalFitness')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('exercise.fitnessLevel')}</Label>
            <Select 
              value={preferences.level} 
              onValueChange={(value) => setPreferences({...preferences, level: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('exercise.selectLevel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{t('exercise.beginner')}</SelectItem>
                <SelectItem value="intermediate">{t('exercise.intermediate')}</SelectItem>
                <SelectItem value="advanced">{t('exercise.advanced')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('exercise.daysPerWeek')}</Label>
            <Select 
              value={preferences.daysPerWeek} 
              onValueChange={(value) => setPreferences({...preferences, daysPerWeek: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('exercise.selectDays')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 {t('exercise.days')}</SelectItem>
                <SelectItem value="4">4 {t('exercise.days')}</SelectItem>
                <SelectItem value="5">5 {t('exercise.days')}</SelectItem>
                <SelectItem value="6">6 {t('exercise.days')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('exercise.workoutDuration')}</Label>
            <Select 
              value={preferences.duration} 
              onValueChange={(value) => setPreferences({...preferences, duration: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('exercise.selectDuration')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 {t('exercise.minutes')}</SelectItem>
                <SelectItem value="45">45 {t('exercise.minutes')}</SelectItem>
                <SelectItem value="60">60 {t('exercise.minutes')}</SelectItem>
                <SelectItem value="90">90 {t('exercise.minutes')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('exercise.additionalNotes')}</Label>
            <Textarea
              placeholder={t('exercise.notesPlaceholder')}
              value={preferences.notes}
              onChange={(e) => setPreferences({...preferences, notes: e.target.value})}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full bg-fitness-gradient text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('exercise.generating')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {t('exercise.generateProgram')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
