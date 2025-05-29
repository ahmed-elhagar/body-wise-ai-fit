
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, Calendar, Database, Apple } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
  includeSnacks: boolean;
}

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AIPreferences;
  onPreferencesChange: (preferences: AIPreferences) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AIGenerationDialog = ({ 
  isOpen, 
  onClose, 
  preferences, 
  onPreferencesChange, 
  onGenerate, 
  isGenerating 
}: AIGenerationDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {t('mealPlan.generateAIMealPlan')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-purple-800">{t('mealPlan.sevenDayCompletePlan')}</span>
            </div>
            <p className="text-xs text-purple-700">
              • {t('mealPlan.mealsTotal')}
              • {t('mealPlan.personalizedProfile')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-800">{t('mealPlan.foodDatabaseIntegration')}</span>
            </div>
            <p className="text-xs text-blue-700">
              • {t('mealPlan.automaticallyPopulates')}
              • {t('mealPlan.enablesQuickSearch')}
              • {t('mealPlan.storesNutritionalData')}
            </p>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Checkbox
              id="includeSnacks"
              checked={preferences.includeSnacks}
              onCheckedChange={(checked) => 
                onPreferencesChange({ ...preferences, includeSnacks: checked as boolean })
              }
            />
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4 text-green-600" />
              <Label htmlFor="includeSnacks" className="text-sm font-medium text-green-800">
                {t('mealPlan.includeSnacks')}
              </Label>
            </div>
          </div>
          
          <p className="text-xs text-gray-600">
            {preferences.includeSnacks 
              ? t('mealPlan.withSnacksDesc') 
              : t('mealPlan.withoutSnacksDesc')
            }
          </p>

          <div>
            <Label htmlFor="cuisine">{t('mealPlan.preferredCuisine')}</Label>
            <Input
              value={preferences.cuisine}
              onChange={(e) => onPreferencesChange({ ...preferences, cuisine: e.target.value })}
              placeholder={t('mealPlan.cuisinePlaceholder')}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">{t('mealPlan.leaveEmptyNationality')}</p>
          </div>
          
          <div>
            <Label htmlFor="maxPrepTime">{t('mealPlan.maxPrepTime')}</Label>
            <Select 
              value={preferences.maxPrepTime} 
              onValueChange={(value) => onPreferencesChange({ ...preferences, maxPrepTime: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 {t('mealPlan.minutes')}</SelectItem>
                <SelectItem value="30">30 {t('mealPlan.minutes')}</SelectItem>
                <SelectItem value="60">1 {t('mealPlan.hour')}</SelectItem>
                <SelectItem value="120">2 {t('mealPlan.hours')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('mealPlan.generating')}...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('mealPlan.generateSevenDayPlan')}
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-600">
                {t('mealPlan.creatingPersonalized')}
              </div>
              <div className="text-xs text-gray-500">
                {t('mealPlan.mayTakeTime')}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
