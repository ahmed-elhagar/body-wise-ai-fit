
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureHeader } from '@/shared/components/design-system';
import { ActionButton } from '@/shared/components/design-system';
import { Plus, Target, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SimplifiedDashboardHeaderProps {
  userName: string;
}

const SimplifiedDashboardHeader: React.FC<SimplifiedDashboardHeaderProps> = ({ userName }) => {
  const { t } = useTranslation(['dashboard']);
  const navigate = useNavigate();

  const headerActions = (
    <div className="flex items-center gap-3">
      <ActionButton
        variant="outline"
        size="sm"
        icon={Target}
        onClick={() => navigate('/goals')}
      >
        Goals
      </ActionButton>
      
      <ActionButton
        variant="primary"
        size="sm"
        icon={Plus}
        onClick={() => navigate('/meal-plan')}
      >
        Quick Start
      </ActionButton>
    </div>
  );

  return (
    <FeatureHeader
      title={`${t('welcome')}, ${userName}!`}
      subtitle={t('trackProgress')}
      actions={headerActions}
      size="lg"
    />
  );
};

export default SimplifiedDashboardHeader;
