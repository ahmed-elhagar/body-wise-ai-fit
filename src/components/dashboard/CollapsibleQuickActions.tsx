
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";

interface CollapsibleQuickActionsProps {
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}

const CollapsibleQuickActions = ({ onViewMealPlan, onViewExercise }: CollapsibleQuickActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {t('Quick Actions')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isOpen ? 'Click to collapse' : 'Click to expand quick actions'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          <CardContent className="pt-0">
            <QuickActionsGrid />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CollapsibleQuickActions;
