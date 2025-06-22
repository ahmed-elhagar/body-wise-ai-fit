
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DietaryRestrictionsTogglesProps {
  preferences: {
    isHalal: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    isKeto: boolean;
    isLowCarb: boolean;
  };
  onToggle: (key: string, value: boolean) => void;
}

export const DietaryRestrictionsToggles: React.FC<DietaryRestrictionsTogglesProps> = ({
  preferences,
  onToggle
}) => {
  const restrictions = [
    { key: 'isHalal', label: 'Halal Food Only' },
    { key: 'isVegetarian', label: 'Vegetarian' },
    { key: 'isVegan', label: 'Vegan' },
    { key: 'isKeto', label: 'Ketogenic Diet' },
    { key: 'isLowCarb', label: 'Low Carb Diet' }
  ];

  return (
    <div className="space-y-3">
      <Label>Dietary Restrictions</Label>
      <div className="space-y-3">
        {restrictions.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label>{label}</Label>
            <Switch
              checked={preferences[key as keyof typeof preferences] as boolean}
              onCheckedChange={(checked) => onToggle(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
