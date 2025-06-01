import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/hooks/useI18n";

interface EnhancedSettingsFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const EnhancedSettingsForm = ({ onSave, onCancel }: EnhancedSettingsFormProps) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    measurementUnits: 'metric',
  });

  const [loading, setLoading] = useState({ 
    email: false, 
    password: false, 
    prefs: false 
  });

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('accountInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailAddress')}</Label>
            <Input
              type="email"
              id="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t('preferences')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">{t('notifications')}</Label>
            <Switch
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-updates">{t('emailUpdates')}</Label>
            <Switch
              id="email-updates"
              checked={preferences.emailUpdates}
              onCheckedChange={(checked) => setPreferences({ ...preferences, emailUpdates: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="measurement-units">{t('measurementUnits')}</Label>
            <Select
              value={preferences.measurementUnits}
              onValueChange={(value) => setPreferences({ ...preferences, measurementUnits: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button onClick={onSave}>
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSettingsForm;
