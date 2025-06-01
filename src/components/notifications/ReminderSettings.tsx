import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/hooks/useI18n";
import { Settings, Bell, Clock, Target, Apple, Dumbbell } from "lucide-react";

interface ReminderSetting {
  id: string;
  type: 'meal' | 'exercise' | 'goal' | 'weight';
  title: string;
  enabled: boolean;
  time: string;
  frequency: 'daily' | 'weekly' | 'custom';
}

const ReminderSettings = () => {
  const { t } = useI18n();
  const [settings, setSettings] = useState<ReminderSetting[]>([
    {
      id: '1',
      type: 'meal',
      title: t('Meal Reminders'),
      enabled: true,
      time: '30',
      frequency: 'daily'
    },
    {
      id: '2',
      type: 'exercise',
      title: t('Workout Reminders'),
      enabled: true,
      time: '60',
      frequency: 'daily'
    },
    {
      id: '3',
      type: 'goal',
      title: t('Goal Progress Updates'),
      enabled: false,
      time: '24',
      frequency: 'weekly'
    },
    {
      id: '4',
      type: 'weight',
      title: t('Weight Tracking Reminders'),
      enabled: true,
      time: '24',
      frequency: 'weekly'
    }
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const updateTime = (id: string, time: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, time } : setting
      )
    );
  };

  const updateFrequency = (id: string, frequency: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, frequency: frequency as 'daily' | 'weekly' | 'custom' } : setting
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Apple className="w-4 h-4 text-green-600" />;
      case 'exercise': return <Dumbbell className="w-4 h-4 text-blue-600" />;
      case 'goal': return <Target className="w-4 h-4 text-purple-600" />;
      case 'weight': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-blue-600" />
          {t('Reminder Settings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map(setting => (
          <div key={setting.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(setting.type)}
                <Label htmlFor={setting.id} className="font-medium">
                  {setting.title}
                </Label>
              </div>
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={() => toggleSetting(setting.id)}
              />
            </div>
            
            {setting.enabled && (
              <div className="ml-7 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    {t('Time before')} ({t('minutes')})
                  </Label>
                  <Select value={setting.time} onValueChange={(value) => updateTime(setting.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 {t('minutes')}</SelectItem>
                      <SelectItem value="30">30 {t('minutes')}</SelectItem>
                      <SelectItem value="60">1 {t('hour')}</SelectItem>
                      <SelectItem value="120">2 {t('hours')}</SelectItem>
                      <SelectItem value="1440">1 {t('day')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    {t('Frequency')}
                  </Label>
                  <Select value={setting.frequency} onValueChange={(value) => updateFrequency(setting.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t('Daily')}</SelectItem>
                      <SelectItem value="weekly">{t('Weekly')}</SelectItem>
                      <SelectItem value="custom">{t('Custom')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-200">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            {t('Save Reminder Settings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;
