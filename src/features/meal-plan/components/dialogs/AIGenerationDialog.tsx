
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Clock, UtensilsCrossed, Coffee } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: {
    cuisine: string;
    maxPrepTime: string;
    includeSnacks: boolean;
  };
  onPreferencesChange: (preferences: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasExistingPlan?: boolean;
}

const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  hasExistingPlan = false,
}: AIGenerationDialogProps) => {
  const { t } = useI18n();

  const handlePreferenceChange = (key: string, value: any) => {
    onPreferencesChange({ [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            {hasExistingPlan ? t('Regenerate Meal Plan') : t('Generate AI Meal Plan')}
          </DialogTitle>
          <DialogDescription>
            {hasExistingPlan 
              ? t('Customize your preferences and regenerate your meal plan.')
              : t('Customize your preferences to generate a personalized meal plan.')
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cuisine Preference */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-blue-600" />
                <Label className="font-medium">{t('Cuisine Style')}</Label>
              </div>
              <Select
                value={preferences.cuisine}
                onValueChange={(value) => handlePreferenceChange('cuisine', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select cuisine style')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">{t('Mixed International')}</SelectItem>
                  <SelectItem value="mediterranean">{t('Mediterranean')}</SelectItem>
                  <SelectItem value="asian">{t('Asian')}</SelectItem>
                  <SelectItem value="american">{t('American')}</SelectItem>
                  <SelectItem value="middle-eastern">{t('Middle Eastern')}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Prep Time */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <Label className="font-medium">{t('Max Prep Time')}</Label>
              </div>
              <Select
                value={preferences.maxPrepTime}
                onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select prep time')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">{t('15 minutes')}</SelectItem>
                  <SelectItem value="30">{t('30 minutes')}</SelectItem>
                  <SelectItem value="45">{t('45 minutes')}</SelectItem>
                  <SelectItem value="60">{t('1 hour')}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Include Snacks */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-orange-600" />
                  <Label className="font-medium">{t('Include Snacks')}</Label>
                </div>
                <Switch
                  checked={preferences.includeSnacks}
                  onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('Cancel')}
            </Button>
            <Button 
              onClick={onGenerate} 
              disabled={isGenerating}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              {isGenerating ? (
                <>{t('Generating...')}</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {hasExistingPlan ? t('Regenerate') : t('Generate')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
