
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ChefHat } from "lucide-react";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStep?: string;
}

const AIGenerationDialog = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  isGenerating, 
  generationStep 
}: AIGenerationDialogProps) => {
  if (isGenerating) {
    return (
      <UnifiedAILoadingDialog
        isOpen={isOpen}
        title="Generating Your Meal Plan"
        description="Creating personalized meals based on your preferences and nutritional needs"
        steps={[
          { id: 'analyzing', label: 'Analyzing preferences', description: 'Processing your dietary requirements', estimatedDuration: 3 },
          { id: 'generating', label: 'Generating meals', description: 'Creating your weekly meal plan', estimatedDuration: 5 },
          { id: 'optimizing', label: 'Optimizing nutrition', description: 'Balancing macronutrients', estimatedDuration: 2 }
        ]}
        currentStepIndex={0}
        isComplete={false}
        progress={0}
        estimatedTotalTime={10}
        allowClose={false}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Generate AI Meal Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate a personalized weekly meal plan using AI based on your preferences and nutritional goals.
          </p>
          
          <div className="flex gap-2">
            <Button onClick={onGenerate} className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Plan
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
