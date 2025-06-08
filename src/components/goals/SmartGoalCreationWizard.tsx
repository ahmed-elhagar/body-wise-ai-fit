
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Sparkles, TrendingUp, Calendar, Zap } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useGoals } from "@/hooks/useGoals";

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  goalType: 'weight' | 'calories' | 'protein' | 'carbs' | 'fat';
  category: string;
  targetValue: number;
  targetUnit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: number; // days
  icon: string;
}

interface SmartGoalCreationWizardProps {
  onClose: () => void;
  onGoalCreated: () => void;
}

const SmartGoalCreationWizard = ({ onClose, onGoalCreated }: SmartGoalCreationWizardProps) => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { createGoal, isCreating } = useGoals();
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [customGoal, setCustomGoal] = useState({
    title: '',
    description: '',
    goalType: 'weight' as const,
    targetValue: 0,
    targetUnit: 'kg',
    difficulty: 'medium' as const,
    timeframe: 30
  });

  const goalTemplates: GoalTemplate[] = [
    {
      id: 'lose_5kg',
      title: t('Lose 5kg in 2 months'),
      description: t('Gradual weight loss with sustainable habits'),
      goalType: 'weight',
      category: 'weight_loss',
      targetValue: profile?.weight ? profile.weight - 5 : 65,
      targetUnit: 'kg',
      difficulty: 'medium',
      timeframe: 60,
      icon: '⚖️'
    },
    {
      id: 'protein_100g',
      title: t('100g Daily Protein'),
      description: t('Build and maintain muscle mass'),
      goalType: 'protein',
      category: 'nutrition',
      targetValue: 100,
      targetUnit: 'g',
      difficulty: 'easy',
      timeframe: 30,
      icon: '💪'
    },
    {
      id: 'calorie_deficit',
      title: t('Daily Calorie Deficit'),
      description: t('Maintain 500 calorie deficit for weight loss'),
      goalType: 'calories',
      category: 'nutrition',
      targetValue: 1800,
      targetUnit: 'kcal',
      difficulty: 'medium',
      timeframe: 30,
      icon: '🔥'
    },
    {
      id: 'gain_muscle',
      title: t('Gain 3kg Muscle'),
      description: t('Build lean muscle mass over 3 months'),
      goalType: 'weight',
      category: 'muscle_gain',
      targetValue: profile?.weight ? profile.weight + 3 : 75,
      targetUnit: 'kg',
      difficulty: 'hard',
      timeframe: 90,
      icon: '🏋️'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    setStep(2);
  };

  const handleCustomGoal = () => {
    setSelectedTemplate(null);
    setStep(2);
  };

  const handleCreateGoal = async () => {
    const goalData = selectedTemplate ? {
      goal_type: selectedTemplate.goalType,
      title: selectedTemplate.title,
      description: selectedTemplate.description,
      target_value: selectedTemplate.targetValue,
      target_unit: selectedTemplate.targetUnit,
      category: selectedTemplate.category,
      difficulty: selectedTemplate.difficulty,
      target_date: new Date(Date.now() + selectedTemplate.timeframe * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } : {
      goal_type: customGoal.goalType,
      title: customGoal.title,
      description: customGoal.description,
      target_value: customGoal.targetValue,
      target_unit: customGoal.targetUnit,
      category: customGoal.goalType,
      difficulty: customGoal.difficulty,
      target_date: new Date(Date.now() + customGoal.timeframe * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    createGoal(goalData);
    onGoalCreated();
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Sparkles className="w-5 h-5" />
          {step === 1 ? t('Smart Goal Creation') : t('Customize Your Goal')}
        </CardTitle>
        <p className="text-sm text-blue-600">
          {step === 1 
            ? t('Choose a template or create a custom goal')
            : t('Fine-tune your goal details')
          }
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('AI Recommendations')}
              </h3>
              <p className="text-sm text-purple-700">
                {t('Based on your profile, we recommend starting with weight or nutrition goals')}
              </p>
            </div>

            {/* Goal Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-800">
                        {template.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.timeframe} {t('days')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Goal Option */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleCustomGoal}
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                {t('Create Custom Goal')}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {selectedTemplate ? (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {selectedTemplate.title}
                </h3>
                <p className="text-sm text-blue-700">
                  {selectedTemplate.description}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-title">{t('Goal Title')}</Label>
                  <Input
                    id="goal-title"
                    value={customGoal.title}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={t('Enter your goal title')}
                  />
                </div>

                <div>
                  <Label htmlFor="goal-description">{t('Description')}</Label>
                  <Textarea
                    id="goal-description"
                    value={customGoal.description}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('Describe your goal')}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-type">{t('Goal Type')}</Label>
                    <Select value={customGoal.goalType} onValueChange={(value: any) => setCustomGoal(prev => ({ ...prev, goalType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">{t('Weight')}</SelectItem>
                        <SelectItem value="calories">{t('Calories')}</SelectItem>
                        <SelectItem value="protein">{t('Protein')}</SelectItem>
                        <SelectItem value="carbs">{t('Carbs')}</SelectItem>
                        <SelectItem value="fat">{t('Fat')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goal-difficulty">{t('Difficulty')}</Label>
                    <Select value={customGoal.difficulty} onValueChange={(value: any) => setCustomGoal(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">{t('Easy')}</SelectItem>
                        <SelectItem value="medium">{t('Medium')}</SelectItem>
                        <SelectItem value="hard">{t('Hard')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-value">{t('Target Value')}</Label>
                    <Input
                      id="target-value"
                      type="number"
                      value={customGoal.targetValue}
                      onChange={(e) => setCustomGoal(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeframe">{t('Timeframe (days)')}</Label>
                    <Input
                      id="timeframe"
                      type="number"
                      value={customGoal.timeframe}
                      onChange={(e) => setCustomGoal(prev => ({ ...prev, timeframe: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                {t('Back')}
              </Button>
              <Button
                onClick={handleCreateGoal}
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? t('Creating...') : t('Create Goal')}
                <Target className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartGoalCreationWizard;
