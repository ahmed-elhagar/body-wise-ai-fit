
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FeatureFlagToggleProps {
  flag: string;
  enabled: boolean;
  onToggle: (flag: string) => void;
  description?: string;
}

const FeatureFlagToggle: React.FC<FeatureFlagToggleProps> = ({
  flag,
  enabled,
  onToggle,
  description
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <Label htmlFor={flag} className="text-sm font-medium">
          {flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Label>
        {description && (
          <p className="text-xs text-gray-600">{description}</p>
        )}
      </div>
      <Switch
        id={flag}
        checked={enabled}
        onCheckedChange={() => onToggle(flag)}
      />
    </div>
  );
};

export default FeatureFlagToggle;
