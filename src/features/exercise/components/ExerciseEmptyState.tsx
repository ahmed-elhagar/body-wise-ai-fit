
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Target, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseEmptyStateProps {
  onGenerateProgram?: () => void;
  onCreateCustom?: () => void;
  workoutType?: "home" | "gym";
}

export const ExerciseEmptyState = ({ 
  onGenerateProgram, 
  onCreateCustom,
  workoutType = "home" 
}: ExerciseEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-blue-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {t('exercise.noProgram') || 'No Exercise Program'}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {workoutType === 'gym' 
            ? t('exercise.noProgramGym') || 'Create your first gym workout program to start building strength and achieving your fitness goals.'
            : t('exercise.noProgramHome') || 'Create your first home workout program to start your fitness journey from the comfort of your home.'
          }
        </p>
        
        <div className="space-y-3">
          {onGenerateProgram && (
            <Button 
              onClick={onGenerateProgram}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('exercise.generateWithAI') || 'Generate with AI'}
            </Button>
          )}
          
          {onCreateCustom && (
            <Button 
              onClick={onCreateCustom}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('exercise.createCustom') || 'Create Custom Program'}
            </Button>
          )}
        </div>

        {/* Quick Facts */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-xs text-gray-600">{t('Days/Week')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">30</div>
              <div className="text-xs text-gray-600">{t('Min/Day')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-xs text-gray-600">{t('Possibilities')}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExerciseEmptyState;
