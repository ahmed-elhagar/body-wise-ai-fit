
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface ExerciseProgramEmptyStateProps {
  workoutType: "home" | "gym";
  onGenerateClick: () => void;
}

const ExerciseProgramEmptyState = ({ workoutType, onGenerateClick }: ExerciseProgramEmptyStateProps) => {
  const { t } = useI18n();

  return (
    <div className="lg:col-span-3">
      <Card className="text-center p-12">
        <CardContent>
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Dumbbell className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {t('No Exercise Program Found')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t('Create your personalized exercise program with AI-powered recommendations.')}
          </p>
          <Button 
            onClick={onGenerateClick}
            className="bg-fitness-gradient hover:opacity-90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('Generate AI Program')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseProgramEmptyState;
