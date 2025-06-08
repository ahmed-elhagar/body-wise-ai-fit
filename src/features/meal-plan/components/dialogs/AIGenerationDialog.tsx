
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Target, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (preferences: any) => void;
  isGenerating: boolean;
}

const AIGenerationDialog = ({ isOpen, onClose, onGenerate, isGenerating }: AIGenerationDialogProps) => {
  const { t, isRTL } = useI18n();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();
  
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: '',
    cuisinePreference: '',
    mealComplexity: 'medium',
    includeSnacks: true,
    focusProtein: false,
    avoidProcessed: true,
    budgetFriendly: false
  });

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    onGenerate(preferences);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Brain className="w-5 h-5 text-purple-600" />
              {t('AI Meal Plan Generation')}
            </DialogTitle>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              {displayCredits}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Features */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                {t('AI-Powered Features')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>{t('Personalized nutrition targets')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>{t('Dietary restriction compliance')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>{t('Balanced macro distribution')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>{t('Recipe variety optimization')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('Customize Your Plan')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('Dietary Restrictions')}</Label>
                <Select 
                  value={preferences.dietaryRestrictions} 
                  onValueChange={(value) => updatePreference('dietaryRestrictions', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select restrictions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('None')}</SelectItem>
                    <SelectItem value="vegetarian">{t('Vegetarian')}</SelectItem>
                    <SelectItem value="vegan">{t('Vegan')}</SelectItem>
                    <SelectItem value="keto">{t('Keto')}</SelectItem>
                    <SelectItem value="gluten-free">{t('Gluten-Free')}</SelectItem>
                    <SelectItem value="dairy-free">{t('Dairy-Free')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('Cuisine Preference')}</Label>
                <Select 
                  value={preferences.cuisinePreference} 
                  onValueChange={(value) => updatePreference('cuisinePreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select cuisine')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('Mixed')}</SelectItem>
                    <SelectItem value="mediterranean">{t('Mediterranean')}</SelectItem>
                    <SelectItem value="asian">{t('Asian')}</SelectItem>
                    <SelectItem value="middle-eastern">{t('Middle Eastern')}</SelectItem>
                    <SelectItem value="western">{t('Western')}</SelectItem>
                    <SelectItem value="mexican">{t('Mexican')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('Meal Complexity')}</Label>
                <Select 
                  value={preferences.mealComplexity} 
                  onValueChange={(value) => updatePreference('mealComplexity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">{t('Simple (15-20 min)')}</SelectItem>
                    <SelectItem value="medium">{t('Medium (20-40 min)')}</SelectItem>
                    <SelectItem value="complex">{t('Complex (40+ min)')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{t('Include Snacks')}</Label>
                  <p className="text-sm text-gray-600">{t('Add healthy snack options')}</p>
                </div>
                <Switch
                  checked={preferences.includeSnacks}
                  onCheckedChange={(checked) => updatePreference('includeSnacks', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{t('High Protein Focus')}</Label>
                  <p className="text-sm text-gray-600">{t('Prioritize protein-rich meals')}</p>
                </div>
                <Switch
                  checked={preferences.focusProtein}
                  onCheckedChange={(checked) => updatePreference('focusProtein', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{t('Avoid Processed Foods')}</Label>
                  <p className="text-sm text-gray-600">{t('Focus on whole, natural ingredients')}</p>
                </div>
                <Switch
                  checked={preferences.avoidProcessed}
                  onCheckedChange={(checked) => updatePreference('avoidProcessed', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{t('Budget Friendly')}</Label>
                  <p className="text-sm text-gray-600">{t('Use affordable, accessible ingredients')}</p>
                </div>
                <Switch
                  checked={preferences.budgetFriendly}
                  onCheckedChange={(checked) => updatePreference('budgetFriendly', checked)}
                />
              </div>
            </div>
          </div>

          {/* Credits Warning */}
          {!hasCredits && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <p className="text-amber-700 font-medium text-center">
                  {t('No AI credits remaining. Upgrade your plan for unlimited access.')}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              {t('Cancel')}
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !hasCredits}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? t('Generating...') : t('Generate Meal Plan')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
