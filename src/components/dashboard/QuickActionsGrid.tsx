
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import DashboardQuickActions from './DashboardQuickActions';

interface QuickActionsGridProps {
  onAction: (action: string) => void;
}

const QuickActionsGrid = ({ onAction }: QuickActionsGridProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {t('dashboard:quickActions') || 'Quick Actions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardQuickActions onAction={onAction} />
      </CardContent>
    </Card>
  );
};

export default QuickActionsGrid;
