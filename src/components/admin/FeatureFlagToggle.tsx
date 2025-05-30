
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export const FeatureFlagToggle: React.FC = () => {
  const { flags, isLoading, toggleFlag } = useFeatureFlags();

  if (isLoading) {
    return <div>Loading feature flags...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Feature Flags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="life-phase-nutrition" className="flex items-center gap-2">
              Life-Phase Nutrition
              <Badge variant="outline" className="text-xs">
                <TestTube className="w-3 h-3 mr-1" />
                BETA
              </Badge>
            </Label>
            <p className="text-sm text-muted-foreground">
              Enables specialized nutrition for fasting, pregnancy, and breastfeeding
            </p>
          </div>
          <Switch
            id="life-phase-nutrition"
            checked={flags.life_phase_nutrition}
            onCheckedChange={() => toggleFlag('life_phase_nutrition')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
