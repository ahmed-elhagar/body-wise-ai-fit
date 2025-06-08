
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface CompactControlBarProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
}

export const CompactControlBar = ({
  currentWeekOffset,
  onWeekChange,
  onRegeneratePlan,
  isGenerating
}: CompactControlBarProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onWeekChange(currentWeekOffset - 1)}
        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        {t('common:previousWeek') || 'Previous'}
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {t('mealPlan:week') || 'Week'} {currentWeekOffset + 1}
        </span>
      </div>

      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegeneratePlan}
          disabled={isGenerating}
          className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <RefreshCw className="w-3 h-3" />
          {t('mealPlan:regenerate') || 'Regenerate'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('common:nextWeek') || 'Next'}
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CompactControlBar;
