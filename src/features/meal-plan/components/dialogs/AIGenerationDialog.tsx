
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Target, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
  onGenerate: () => Promise<boolean>;
  isGenerating: boolean;
  hasExistingPlan: boolean;
}

export const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  const { t, isRTL } = useLanguage();

  const handleGenerate = async () => {
    const success = await onGenerate();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {hasExistingPlan 
              ? (t('mealPlan.regenerateMealPlan') || 'Regenerate Meal Plan')
              : (t('mealPlan.generateNewMealPlan') || 'Generate New Meal Plan')
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {t('mealPlan.aiWillCreate') || 'AI will create a personalized meal plan'}
                </h4>
                <p className="text-sm text-blue-700">
                  {t('mealPlan.aiDescription') || 'Based on your profile, dietary preferences, and nutrition goals, our AI will generate a complete 7-day meal plan with recipes and shopping lists.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              {t('mealPlan.quickOptions') || 'Quick Options'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`flex items-center justify-between p-3 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <Label className="font-medium text-gray-900">
                    {t('mealPlan.includeSnacks') || 'Include Snacks'}
                  </Label>
                  <p className="text-sm text-gray-600">
                    {t('mealPlan.includeSnacksDescription') || 'Add healthy snacks between meals'}
                  </p>
                </div>
                <Switch
                  checked={preferences?.includeSnacks || false}
                  onCheckedChange={(checked) => 
                    onPreferencesChange({ ...preferences, includeSnacks: checked })
                  }
                />
              </div>

              <div className={`flex items-center justify-between p-3 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <Label className="font-medium text-gray-900">
                    {t('mealPlan.focusProtein') || 'Focus on Protein'}
                  </Label>
                  <p className="text-sm text-gray-600">
                    {t('mealPlan.focusProteinDescription') || 'Prioritize high-protein meals'}
                  </p>
                </div>
                <Switch
                  checked={preferences?.focusProtein || false}
                  onCheckedChange={(checked) => 
                    onPreferencesChange({ ...preferences, focusProtein: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-3">
            <Label className="font-semibold text-gray-900">
              {t('mealPlan.specialInstructions') || 'Special Instructions (Optional)'}
            </Label>
            <Textarea
              placeholder={t('mealPlan.specialInstructionsPlaceholder') || 'Any specific dietary requirements, food preferences, or restrictions...'}
              value={preferences?.specialInstructions || ''}
              onChange={(e) => 
                onPreferencesChange({ ...preferences, specialInstructions: e.target.value })
              }
              className="min-h-[100px]"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Generation Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {t('mealPlan.whatToExpect') || 'What to expect:'}
              </span>
            </div>
            <ul className={`text-sm text-gray-600 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <li>• {t('mealPlan.expectation1') || '7-day personalized meal plan'}</li>
              <li>• {t('mealPlan.expectation2') || 'Detailed recipes with ingredients'}</li>
              <li>• {t('mealPlan.expectation3') || 'Nutrition information for each meal'}</li>
              <li>• {t('mealPlan.expectation4') || 'Automated shopping list generation'}</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1"
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('mealPlan.generating') || 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {hasExistingPlan 
                  ? (t('mealPlan.regenerate') || 'Regenerate Plan')
                  : (t('mealPlan.generatePlan') || 'Generate Plan')
                }
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
