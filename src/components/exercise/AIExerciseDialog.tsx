import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const AIExerciseDialog = ({
  open,
  onOpenChange,
  onGenerate,
  isLoading
}: AIExerciseDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const { t } = useI18n();

  const handleSubmit = () => {
    onGenerate(prompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exercise.customizeProgram')}</DialogTitle>
        </DialogHeader>
        
        <Card className="p-4">
          <Label htmlFor="ai-prompt" className="text-sm">
            {t('exercise.aiPrompt')}
          </Label>
          <Textarea
            id="ai-prompt"
            placeholder={t('exercise.aiPromptPlaceholder')}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('exercise.aiPromptHelper')}
          </p>
        </Card>

        <div className="flex justify-between mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.generating')}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {t('exercise.generate')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
