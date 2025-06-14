
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnhancedNationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EnhancedNationalitySelector = ({ value, onChange }: EnhancedNationalitySelectorProps) => {
  const nationalities = [
    { value: 'american', label: 'American' },
    { value: 'british', label: 'British' },
    { value: 'canadian', label: 'Canadian' },
    { value: 'saudi', label: 'Saudi Arabian' },
    { value: 'emirati', label: 'Emirati' },
    { value: 'egyptian', label: 'Egyptian' },
    { value: 'jordanian', label: 'Jordanian' },
    { value: 'lebanese', label: 'Lebanese' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Nationality
      </Label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
          <SelectValue placeholder="Select your nationality" />
        </SelectTrigger>
        <SelectContent>
          {nationalities.map((nationality) => (
            <SelectItem key={nationality.value} value={nationality.value}>
              {nationality.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnhancedNationalitySelector;
