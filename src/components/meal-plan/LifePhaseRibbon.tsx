
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Moon, Baby } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LifePhaseRibbonProps {
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  fastingType?: string;
  extraCalories: number;
}

export const LifePhaseRibbon: React.FC<LifePhaseRibbonProps> = ({
  pregnancyTrimester,
  breastfeedingLevel,
  fastingType,
  extraCalories
}) => {
  const { t, isRTL } = useLanguage();

  if (!pregnancyTrimester && !breastfeedingLevel && !fastingType) {
    return null;
  }

  const getIcon = () => {
    if (pregnancyTrimester) return <Baby className="w-4 h-4" />;
    if (breastfeedingLevel) return <Heart className="w-4 h-4" />;
    if (fastingType) return <Moon className="w-4 h-4" />;
    return null;
  };

  const getLabel = () => {
    if (pregnancyTrimester) {
      return `${t('profile.lifePhase.pregnancy.trimester' + pregnancyTrimester)} (+${extraCalories} kcal)`;
    }
    if (breastfeedingLevel) {
      return `${t('profile.lifePhase.breastfeeding.' + breastfeedingLevel)} (+${extraCalories} kcal)`;
    }
    if (fastingType) {
      return t('profile.lifePhase.fasting.' + fastingType);
    }
    return '';
  };

  return (
    <div className="mb-4">
      <Badge 
        variant="secondary" 
        className={`bg-gradient-to-r from-health-primary/10 to-health-secondary/10 text-health-primary border-health-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {getIcon()}
        <span className={isRTL ? 'mr-2' : 'ml-2'}>{getLabel()}</span>
      </Badge>
      
      {extraCalories > 0 && (
        <p className="text-xs text-health-text-secondary mt-1">
          {t('profile.lifePhase.nutritionBoost')}
        </p>
      )}
    </div>
  );
};
