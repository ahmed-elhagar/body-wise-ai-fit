import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from "@/hooks/useI18n";

const CalorieChecker = () => {
  const { t } = useI18n();
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');

  const handleCheck = () => {
    alert(`${t('Food')}: ${food}, ${t('Calories')}: ${calories}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('CalorieChecker')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food">{t('Food')}</Label>
            <Input
              id="food"
              placeholder={t('EnterFood')}
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">{t('Calories')}</Label>
            <Input
              id="calories"
              type="number"
              placeholder={t('EnterCalories')}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <Button onClick={handleCheck}>{t('Check')}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalorieChecker;
