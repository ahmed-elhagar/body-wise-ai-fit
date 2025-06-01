
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
    <Card className="relative p-6 border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fitness-primary/10 to-fitness-accent/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-fitness-primary-500 to-fitness-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-fitness-primary-700 to-fitness-accent-600 bg-clip-text text-transparent mb-1">
                  Smart Meal Planning
                </h1>
                <p className="text-lg text-fitness-primary-600 font-medium">
                  Personalized nutrition plans powered by AI
                </p>
              </div>
            </div>

            {/* Credits Display */}
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 text-white border-0 px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-shadow">
                <Zap className="w-4 h-4 mr-2" />
                {remainingCredits} {t('credits.remaining') || 'AI Credits'}
              </Badge>
              <span className="text-sm text-fitness-primary-500 font-medium">
                Generate unlimited meal plans
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating || remainingCredits <= 0}
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 hover:from-fitness-primary-600 hover:to-fitness-accent-600 text-white border-0 shadow-lg px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              {isGenerating ? 
                (t('mealPlan.generating') || 'Generating Plan...') : 
                (t('mealPlan.generateAI') || 'Generate AI Meal Plan')
              }
            </Button>
            
            {remainingCredits <= 0 && (
              <p className="text-sm text-red-600 mt-3 text-center font-medium">
                {t('credits.noCreditsRemaining') || 'No AI credits remaining. Upgrade to continue.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanHeader;
