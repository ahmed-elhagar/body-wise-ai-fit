
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const COMMON_ALLERGIES = [
  'Nuts', 'Peanuts', 'Shellfish', 'Fish', 'Eggs', 'Dairy', 'Soy',
  'Wheat', 'Gluten', 'Sesame', 'Mustard', 'Celery', 'Lupin'
];

interface AllergiesManagerProps {
  allergies: string[];
  onAdd: (allergy: string) => void;
  onRemove: (allergy: string) => void;
}

export const AllergiesManager: React.FC<AllergiesManagerProps> = ({
  allergies,
  onAdd,
  onRemove
}) => {
  const [newAllergy, setNewAllergy] = useState('');

  const handleAdd = (allergy: string) => {
    if (allergy && !allergies.includes(allergy)) {
      onAdd(allergy);
      setNewAllergy('');
    }
  };

  return (
    <div className="space-y-3">
      <Label>Allergies</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Type allergy or select common ones below..."
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd(newAllergy)}
          />
          <Button onClick={() => handleAdd(newAllergy)} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Common Allergies */}
        <div className="flex flex-wrap gap-1">
          {COMMON_ALLERGIES.filter(allergy => !allergies.includes(allergy)).map(allergy => (
            <button
              key={allergy}
              onClick={() => handleAdd(allergy)}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            >
              + {allergy}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allergies.map(allergy => (
          <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
            {allergy}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onRemove(allergy)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
