import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from "@/hooks/useI18n";

interface SmartGoalCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: () => void;
}

const SmartGoalCreationWizard = ({ open, onOpenChange, onGoalCreated }: SmartGoalCreationWizardProps) => {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [goalDetails, setGoalDetails] = useState({
    name: '',
    description: '',
    category: '',
    targetDate: '',
    initialValue: '',
    targetValue: '',
    unit: ''
  });

  const categories = [
    { value: 'weight_loss', label: t('Weight Loss') },
    { value: 'muscle_gain', label: t('Muscle Gain') },
    { value: 'endurance', label: t('Endurance') },
    { value: 'strength', label: t('Strength') },
    { value: 'flexibility', label: t('Flexibility') },
    { value: 'nutrition', label: t('Nutrition') },
    { value: 'sleep', label: t('Sleep') },
    { value: 'stress_reduction', label: t('Stress Reduction') }
  ];

  const units = [
    { value: 'kg', label: 'kg' },
    { value: 'lbs', label: 'lbs' },
    { value: 'minutes', label: 'minutes' },
    { value: 'hours', label: 'hours' },
    { value: 'steps', label: 'steps' },
    { value: 'calories', label: 'calories' },
    { value: 'percent', label: 'percent' },
    { value: 'count', label: 'count' }
  ];

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setGoalDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement goal creation logic here
    console.log('Goal Details:', goalDetails);
    onGoalCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('Create Smart Goal')}</DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div>
                <Label htmlFor="name">{t('Goal Name')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={goalDetails.name}
                  onChange={handleChange}
                />

                <Label htmlFor="description">{t('Goal Description')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={goalDetails.description}
                  onChange={handleChange}
                />

                <Label htmlFor="category">{t('Goal Category')}</Label>
                <Select name="category" onValueChange={(value) => setGoalDetails(prevState => ({ ...prevState, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select a category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 2 && (
              <div>
                <Label htmlFor="targetDate">{t('Target Date')}</Label>
                <Input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={goalDetails.targetDate}
                  onChange={handleChange}
                />

                <Label htmlFor="initialValue">{t('Initial Value')}</Label>
                <Input
                  id="initialValue"
                  name="initialValue"
                  value={goalDetails.initialValue}
                  onChange={handleChange}
                />

                <Label htmlFor="targetValue">{t('Target Value')}</Label>
                <Input
                  id="targetValue"
                  name="targetValue"
                  value={goalDetails.targetValue}
                  onChange={handleChange}
                />

                <Label htmlFor="unit">{t('Unit')}</Label>
                <Select name="unit" onValueChange={(value) => setGoalDetails(prevState => ({ ...prevState, unit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select a unit')} />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  {t('Back')}
                </Button>
              )}
              {step < 2 ? (
                <Button onClick={handleNext}>{t('Next')}</Button>
              ) : (
                <Button onClick={handleSubmit}>{t('Create Goal')}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SmartGoalCreationWizard;
