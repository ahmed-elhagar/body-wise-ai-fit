import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/useI18n";
import { Sparkles, Target, Clock, Users, Utensils, AlertCircle } from "lucide-react";

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
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
  const { t, isRTL } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="w-6 h-6 text-purple-600" />
            {t('Generate AI Meal Plan')}
          </DialogTitle>
        </DialogHeader>
        
        {/* Component content */}
        <div className="space-y-6">
          <p className="text-gray-600">
            {t('Customize your AI-generated meal plan preferences')}
          </p>
          
          {/* Preferences form would go here */}
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button 
              onClick={onGenerate} 
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? t('Generating...') : t('Generate Plan')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
