
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const CaloriesCard = () => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('dashboard:calories') || 'Calories'}</CardTitle>
        <Flame className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,847</div>
        <p className="text-xs text-muted-foreground">
          +12% from yesterday
        </p>
      </CardContent>
    </Card>
  );
};

export default CaloriesCard;
