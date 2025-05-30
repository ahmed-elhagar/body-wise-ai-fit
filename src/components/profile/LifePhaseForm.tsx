
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Moon, Baby, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface LifePhaseFormProps {
  fastingType?: string;
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  conditionStartDate?: Date;
  onFastingTypeChange: (value: string | undefined) => void;
  onPregnancyTrimesterChange: (value: number | undefined) => void;
  onBreastfeedingLevelChange: (value: string | undefined) => void;
  onConditionStartDateChange: (date: Date | undefined) => void;
}

export const LifePhaseForm: React.FC<LifePhaseFormProps> = ({
  fastingType,
  pregnancyTrimester,
  breastfeedingLevel,
  conditionStartDate,
  onFastingTypeChange,
  onPregnancyTrimesterChange,
  onBreastfeedingLevelChange,
  onConditionStartDateChange
}) => {
  const { t, isRTL } = useLanguage();

  const calculateCalorieOffset = () => {
    if (pregnancyTrimester === 2) return 340;
    if (pregnancyTrimester === 3) return 450;
    if (breastfeedingLevel === 'exclusive') return 400;
    if (breastfeedingLevel === 'partial') return 250;
    return 0;
  };

  const calorieOffset = calculateCalorieOffset();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Heart className="w-5 h-5 text-health-primary" />
          {t('profile.lifePhase.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fasting Section */}
        <div className="space-y-3">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Moon className="w-4 h-4 text-health-secondary" />
            <Label>{t('profile.lifePhase.fasting.title')}</Label>
          </div>
          <Select value={fastingType || ''} onValueChange={(value) => onFastingTypeChange(value || undefined)}>
            <SelectTrigger>
              <SelectValue placeholder={t('profile.lifePhase.fasting.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('profile.lifePhase.none')}</SelectItem>
              <SelectItem value="ramadan">{t('profile.lifePhase.fasting.ramadan')}</SelectItem>
              <SelectItem value="intermittent_16_8">{t('profile.lifePhase.fasting.intermittent168')}</SelectItem>
              <SelectItem value="sun_mon">{t('profile.lifePhase.fasting.sunMon')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pregnancy Section */}
        <div className="space-y-3">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Baby className="w-4 h-4 text-health-secondary" />
            <Label>{t('profile.lifePhase.pregnancy.title')}</Label>
          </div>
          <Select 
            value={pregnancyTrimester?.toString() || ''} 
            onValueChange={(value) => onPregnancyTrimesterChange(value ? parseInt(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('profile.lifePhase.pregnancy.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('profile.lifePhase.none')}</SelectItem>
              <SelectItem value="1">{t('profile.lifePhase.pregnancy.trimester1')}</SelectItem>
              <SelectItem value="2">{t('profile.lifePhase.pregnancy.trimester2')}</SelectItem>
              <SelectItem value="3">{t('profile.lifePhase.pregnancy.trimester3')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Breastfeeding Section */}
        <div className="space-y-3">
          <Label>{t('profile.lifePhase.breastfeeding.title')}</Label>
          <Select 
            value={breastfeedingLevel || ''} 
            onValueChange={(value) => onBreastfeedingLevelChange(value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('profile.lifePhase.breastfeeding.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('profile.lifePhase.none')}</SelectItem>
              <SelectItem value="exclusive">{t('profile.lifePhase.breastfeeding.exclusive')}</SelectItem>
              <SelectItem value="partial">{t('profile.lifePhase.breastfeeding.partial')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition Start Date */}
        {(pregnancyTrimester || breastfeedingLevel) && (
          <div className="space-y-3">
            <Label>{t('profile.lifePhase.startDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!conditionStartDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {conditionStartDate ? format(conditionStartDate, "PPP") : t('profile.lifePhase.selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={conditionStartDate}
                  onSelect={onConditionStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Calorie Offset Display */}
        {calorieOffset > 0 && (
          <div className="bg-health-soft border border-health-border rounded-lg p-3">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-health-text-primary">
                {t('profile.lifePhase.calorieAdjustment')}
              </span>
              <span className="text-lg font-bold text-health-primary">
                +{calorieOffset} {t('profile.lifePhase.kcalPerDay')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
