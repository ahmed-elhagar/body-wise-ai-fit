
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, Target, Clock } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (show: boolean) => void;
  onGenerate: (prefs: string) => void;
  isGenerating: boolean;
}

// Mock AIExerciseDialog component
const AIExerciseDialog = ({ open, onOpenChange, onGenerate, isGenerating }: AIExerciseDialogProps) => {
  return null; // Placeholder - would contain actual dialog implementation
};

interface EmptyExerciseStateProps {
  onGenerateProgram: (preferences: string) => void;
  isGenerating: boolean;
}

const EmptyExerciseState = ({ onGenerateProgram, isGenerating }: EmptyExerciseStateProps) => {
  const { t } = useI18n();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [preferences, setPreferences] = useState({
    goal: 'general',
    duration: '30',
    equipment: 'bodyweight',
    experience: 'beginner'
  });

  const quickStartOptions = [
    {
      title: t('Quick Start Workout'),
      description: t('Get a personalized workout in seconds'),
      icon: Sparkles,
      action: () => onGenerateProgram('quick_start'),
      color: 'bg-blue-500'
    },
    {
      title: t('Beginner Friendly'),
      description: t('Perfect for those just starting out'),
      icon: Target,
      action: () => onGenerateProgram('beginner'),
      color: 'bg-green-500'
    },
    {
      title: t('Full Customization'),
      description: t('Tailor every aspect to your needs'),
      icon: Dumbbell,
      action: () => setShowAIDialog(true),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Dumbbell className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('Ready to Start Your Fitness Journey?')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('Create your personalized exercise program with AI-powered recommendations tailored to your goals and fitness level.')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {quickStartOptions.map((option, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{option.title}</h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <Button 
                  onClick={option.action}
                  disabled={isGenerating}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      {t('Generating...')}
                    </>
                  ) : (
                    t('Get Started')
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('Powered by Advanced AI')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('Our AI considers your fitness level, available equipment, time constraints, and personal goals to create the perfect workout program just for you.')}
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {t('Personalized')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {t('Adaptive')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {t('Evidence-Based')}
              </div>
            </div>
          </CardContent>
        </Card>

        <AIExerciseDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          onGenerate={(prefs: string) => {
            onGenerateProgram(prefs);
            setShowAIDialog(false);
          }}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default EmptyExerciseState;
