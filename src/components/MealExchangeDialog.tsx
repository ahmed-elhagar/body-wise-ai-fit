
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RefreshCw, Check, Loader2, Database, Brain, Zap } from "lucide-react";
import { useAIMealExchange } from "@/hooks/useAIMealExchange";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import type { Meal } from "@/types/meal";

interface MealAlternative {
  name: string;
  calories: number;
  reason: string;
  protein: number;
  carbs: number;
  fat: number;
  source?: 'database' | 'ai';
  ingredients?: any[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

interface MealExchangeDialogProps {
  currentMeal: Meal | null;
  alternatives?: MealAlternative[];
  isOpen: boolean;
  onClose: () => void;
  onExchange: (alternative: MealAlternative) => void;
}

const MealExchangeDialog = ({ 
  currentMeal, 
  alternatives: propAlternatives,
  isOpen, 
  onClose, 
  onExchange 
}: MealExchangeDialogProps) => {
  const { generateAlternatives, isGenerating, alternatives: aiAlternatives } = useAIMealExchange();
  const { t, isRTL, language } = useLanguage();
  const [generationStep, setGenerationStep] = useState('');

  // Generate alternatives when dialog opens with a meal
  useEffect(() => {
    if (isOpen && currentMeal && !propAlternatives) {
      setGenerationStep('analyzing');
      generateAlternatives(currentMeal);
    }
  }, [isOpen, currentMeal, propAlternatives, generateAlternatives]);

  const handleRegenerateAlternatives = async () => {
    if (!currentMeal) return;
    setGenerationStep('generating');
    generateAlternatives(currentMeal);
  };

  if (!currentMeal) return null;

  const alternatives = propAlternatives || aiAlternatives;

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'database': return Database;
      case 'ai': return Brain;
      default: return Zap;
    }
  };

  const getSourceLabel = (source?: string) => {
    if (language === 'ar') {
      switch (source) {
        case 'database': return 'من قاعدة البيانات';
        case 'ai': return 'مولد بالذكاء الاصطناعي';
        default: return 'مقترح';
      }
    } else {
      switch (source) {
        case 'database': return 'From Database';
        case 'ai': return 'AI Generated';
        default: return 'Suggested';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <RefreshCw className="w-5 h-5" />
            {language === 'ar' ? 'تبديل الوجبة' : 'Exchange Meal'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Meal */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {language === 'ar' ? 'الوجبة الحالية' : 'Current Meal'}
            </h3>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">{currentMeal.name}</h4>
                  <div className={`flex space-x-4 mt-2 text-sm text-blue-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <span>{currentMeal.calories} {language === 'ar' ? 'سعرة' : 'cal'}</span>
                    <span>{currentMeal.protein}g {language === 'ar' ? 'بروتين' : 'protein'}</span>
                    <span>{currentMeal.carbs}g {language === 'ar' ? 'كربوهيدرات' : 'carbs'}</span>
                    <span>{currentMeal.fat}g {language === 'ar' ? 'دهون' : 'fat'}</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {language === 'ar' ? 'حالي' : 'Current'}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Alternative Meals */}
          <div>
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="text-lg font-semibold">
                {language === 'ar' ? 'البدائل المتاحة' : 'Alternative Meals'}
              </h3>
              {!propAlternatives && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateAlternatives}
                  disabled={isGenerating}
                  className={isRTL ? 'flex-row-reverse' : ''}
                >
                  {isGenerating ? (
                    <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  {isGenerating ? 
                    (language === 'ar' ? 'جاري التوليد...' : 'Generating...') :
                    (language === 'ar' ? 'توليد جديد' : 'Generate New')
                  }
                </Button>
              )}
            </div>

            {isGenerating && !alternatives.length ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center animate-pulse mb-4">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800 mb-2">
                  {language === 'ar' ? 'جاري توليد البدائل المخصصة...' : 'Generating Personalized Alternatives...'}
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>{language === 'ar' ? 'البحث في قاعدة البيانات...' : 'Searching database...'}</p>
                  <p>{language === 'ar' ? 'توليد بدائل بالذكاء الاصطناعي...' : 'Generating AI alternatives...'}</p>
                  <p>{language === 'ar' ? 'حفظ النتائج للمستقبل...' : 'Saving results for future use...'}</p>
                </div>
              </div>
            ) : alternatives.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {alternatives.map((alternative, index) => {
                  const SourceIcon = getSourceIcon(alternative.source);
                  
                  return (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h4 className="font-medium text-gray-900">{alternative.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              <SourceIcon className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {getSourceLabel(alternative.source)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{alternative.reason}</p>
                          
                          <div className={`flex space-x-4 text-sm text-gray-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <span className="font-medium">{alternative.calories} {language === 'ar' ? 'سعرة' : 'cal'}</span>
                            <span>{alternative.protein}g {language === 'ar' ? 'بروتين' : 'protein'}</span>
                            <span>{alternative.carbs}g {language === 'ar' ? 'كربوهيدرات' : 'carbs'}</span>
                            <span>{alternative.fat}g {language === 'ar' ? 'دهون' : 'fat'}</span>
                          </div>
                          
                          {/* Calorie difference indicator */}
                          {Math.abs(alternative.calories - currentMeal.calories) <= 50 && (
                            <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
                              {language === 'ar' ? 'سعرات مشابهة' : 'Similar calories'}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            onExchange(alternative);
                            onClose();
                          }}
                          className={`bg-fitness-gradient hover:opacity-90 text-white ${isRTL ? 'mr-4' : 'ml-4'}`}
                          size="sm"
                        >
                          <Check className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {language === 'ar' ? 'تبديل' : 'Exchange'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p>{language === 'ar' ? 
                  'اضغط "توليد جديد" للحصول على بدائل مخصصة' : 
                  'Click "Generate New" to get personalized alternatives'
                }</p>
              </div>
            )}
          </div>
        </div>

        <div className={`flex justify-end pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="outline" onClick={onClose}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealExchangeDialog;
