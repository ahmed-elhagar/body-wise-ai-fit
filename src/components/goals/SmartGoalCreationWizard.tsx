
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface SmartGoalCreationWizardProps {
  onCreateGoal: (goal: any) => void;
  onCancel: () => void;
}

export const SmartGoalCreationWizard = ({ onCreateGoal, onCancel }: SmartGoalCreationWizardProps) => {
  const { t, isRTL } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    category: '',
    target: '',
    unit: '',
    deadline: '',
    priority: 'medium',
    milestones: []
  });

  const steps = [
    { number: 1, title: t('goals:wizard.basic') || 'Basic Info', icon: Target },
    { number: 2, title: t('goals:wizard.details') || 'Details', icon: TrendingUp },
    { number: 3, title: t('goals:wizard.timeline') || 'Timeline', icon: Calendar },
    { number: 4, title: t('goals:wizard.review') || 'Review', icon: CheckCircle }
  ];

  const categories = [
    { value: 'weight', label: t('goals:categories.weight') || 'Weight Loss/Gain', icon: '⚖️' },
    { value: 'exercise', label: t('goals:categories.exercise') || 'Exercise', icon: '💪' },
    { value: 'nutrition', label: t('goals:categories.nutrition') || 'Nutrition', icon: '🥗' },
    { value: 'habit', label: t('goals:categories.habit') || 'Healthy Habits', icon: '✅' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onCreateGoal({
      ...goalData,
      id: Date.now().toString(),
      current: 0,
      createdAt: new Date().toISOString()
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('goals:goalTitle') || 'Goal Title'}</Label>
              <Input
                id="title"
                value={goalData.title}
                onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                placeholder={t('goals:titlePlaceholder') || 'Enter your goal title'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('goals:description') || 'Description'}</Label>
              <Textarea
                id="description"
                value={goalData.description}
                onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                placeholder={t('goals:descriptionPlaceholder') || 'Describe what you want to achieve'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('goals:category') || 'Category'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={goalData.category === category.value ? "default" : "outline"}
                    onClick={() => setGoalData({ ...goalData, category: category.value })}
                    className={`h-auto p-3 ${isRTL ? 'text-right' : 'text-left'} justify-start`}
                  >
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">{t('goals:targetValue') || 'Target Value'}</Label>
                <Input
                  id="target"
                  type="number"
                  value={goalData.target}
                  onChange={(e) => setGoalData({ ...goalData, target: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">{t('goals:unit') || 'Unit'}</Label>
                <Input
                  id="unit"
                  value={goalData.unit}
                  onChange={(e) => setGoalData({ ...goalData, unit: e.target.value })}
                  placeholder={t('goals:unitPlaceholder') || 'kg, lbs, days, etc.'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('goals:priority') || 'Priority'}</Label>
              <Select value={goalData.priority} onValueChange={(value) => setGoalData({ ...goalData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('goals:priority.low') || 'Low'}</SelectItem>
                  <SelectItem value="medium">{t('goals:priority.medium') || 'Medium'}</SelectItem>
                  <SelectItem value="high">{t('goals:priority.high') || 'High'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">{t('goals:deadline') || 'Target Deadline'}</Label>
              <Input
                id="deadline"
                type="date"
                value={goalData.deadline}
                onChange={(e) => setGoalData({ ...goalData, deadline: e.target.value })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">{t('goals:reviewGoal') || 'Review Your Goal'}</h3>
              <div className="space-y-2">
                <p><strong>{t('goals:title') || 'Title'}:</strong> {goalData.title}</p>
                <p><strong>{t('goals:description') || 'Description'}:</strong> {goalData.description}</p>
                <p><strong>{t('goals:target') || 'Target'}:</strong> {goalData.target} {goalData.unit}</p>
                <p><strong>{t('goals:deadline') || 'Deadline'}:</strong> {goalData.deadline}</p>
                <p><strong>{t('goals:priority') || 'Priority'}:</strong> {goalData.priority}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Target className="w-5 h-5 text-blue-500" />
          {t('goals:createSmartGoal') || 'Create SMART Goal'}
        </CardTitle>
        
        {/* Step Indicator */}
        <div className={`flex items-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {steps.map((step, index) => (
            <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-2">
          <Badge variant="outline">
            {t('goals:step') || 'Step'} {currentStep} {t('goals:of') || 'of'} {steps.length}: {steps[currentStep - 1].title}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handlePrevious}
          >
            {currentStep === 1 ? t('common:cancel') || 'Cancel' : t('common:previous') || 'Previous'}
          </Button>
          
          <Button
            onClick={currentStep === steps.length ? handleSubmit : handleNext}
            disabled={!goalData.title || !goalData.category}
          >
            {currentStep === steps.length ? t('goals:createGoal') || 'Create Goal' : t('common:next') || 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartGoalCreationWizard;
