
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Target, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface EmptyStateProps {
  onGeneratePlan: () => void;
}

const EmptyState = ({ onGeneratePlan }: EmptyStateProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-2xl p-12 text-center bg-gradient-to-br from-white to-blue-50/50 shadow-2xl rounded-3xl border-0">
        <div className="space-y-8">
          {/* Hero Icon */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <ChefHat className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">No Meal Plan Yet</h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Generate your personalized meal plan to get started with healthy eating habits tailored just for you
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-900">Personalized</div>
              <div className="text-sm text-gray-600">Based on your goals</div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-900">AI-Powered</div>
              <div className="text-sm text-gray-600">Smart recommendations</div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-900">Track Progress</div>
              <div className="text-sm text-gray-600">Monitor your journey</div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onGeneratePlan}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Generate My Meal Plan
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmptyState;
