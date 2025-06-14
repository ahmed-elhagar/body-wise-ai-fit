
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChefHat } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const EmptyState = ({ onGenerateAI, isGenerating }: EmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="p-12 text-center">
        <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {t('No meal plan yet')}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {t('Generate your personalized meal plan with AI to get started with healthy eating')}
        </p>
        <Button
          onClick={onGenerateAI}
          disabled={isGenerating}
          size="lg"
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isGenerating ? t('Generating...') : t('Generate AI Meal Plan')}
        </Button>
      </CardContent>
    </Card>
  );
};
