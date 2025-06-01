
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanHeaderProps {
  remainingCredits: number;
  onShowAIDialog: () => void;
  isGenerating: boolean;
}

const MealPlanHeader = ({ 
  remainingCredits, 
  onShowAIDialog, 
  isGenerating 
}: MealPlanHeaderProps) => {
  const { t } = useLanguage();

  return (
    <Card className="relative p-6 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-fitness-primary/20 to-fitness-accent/20 rounded-full blur-xl" />
      <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary to-fitness-accent rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {t('mealPlan.title') || 'Meal Plan'}
                </h1>
                <p className="text-base text-gray-600 font-medium">
                  {t('mealPlan.subtitle') || 'AI-Powered Personalized Nutrition'}
                </p>
              </div>
            </div>

            {/* Credits Display */}
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-fitness-primary to-fitness-accent text-white border-0 px-3 py-1 font-semibold shadow-md">
                <Zap className="w-4 h-4 mr-1" />
                {remainingCredits} {t('credits.remaining') || 'Credits'}
              </Badge>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating || remainingCredits <= 0}
              className="bg-gradient-to-r from-fitness-primary to-fitness-accent hover:opacity-90 text-white border-0 shadow-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isGenerating ? 
                (t('mealPlan.generating') || 'Generating...') : 
                (t('mealPlan.generateAI') || 'Generate AI Plan')
              }
            </Button>
            
            {remainingCredits <= 0 && (
              <p className="text-sm text-red-600 mt-2 text-center">
                {t('credits.noCreditsRemaining') || 'No credits remaining'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanHeader;
