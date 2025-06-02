
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface CustomRestrictionsManagerProps {
  restrictions: string[];
  onAdd: (restriction: string) => void;
  onRemove: (restriction: string) => void;
}

export const CustomRestrictionsManager: React.FC<CustomRestrictionsManagerProps> = ({
  restrictions,
  onAdd,
  onRemove
}) => {
  const [newRestriction, setNewRestriction] = useState('');

  const handleAdd = () => {
    if (newRestriction && !restrictions.includes(newRestriction)) {
      onAdd(newRestriction);
      setNewRestriction('');
    }
  };

  return (
    <div className="space-y-3">
      <Label>Additional Dietary Restrictions</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add custom restriction..."
          value={newRestriction}
          onChange={(e) => setNewRestriction(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {restrictions.map(restriction => (
          <Badge key={restriction} variant="secondary" className="flex items-center gap-1">
            {restriction}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-600"
              onClick={() => onRemove(restriction)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
