
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface SpecialCondition {
  type: string;
  startDate: string;
  endDate?: string;
}

const SpecialConditionsSettings = () => {
  const { profile } = useProfile();
  const [conditions, setConditions] = useState<SpecialCondition[]>(
    (profile?.special_conditions as SpecialCondition[]) || []
  );
  const [newCondition, setNewCondition] = useState({ type: '', startDate: '', endDate: '' });

  const addCondition = () => {
    if (newCondition.type && newCondition.startDate) {
      setConditions([...conditions, { ...newCondition }]);
      setNewCondition({ type: '', startDate: '', endDate: '' });
    }
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="condition-type">Condition Type</Label>
            <Input
              id="condition-type"
              value={newCondition.type}
              onChange={(e) => setNewCondition({ ...newCondition, type: e.target.value })}
              placeholder="e.g., Pregnancy, Injury"
            />
          </div>
          <div>
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={newCondition.startDate}
              onChange={(e) => setNewCondition({ ...newCondition, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="end-date">End Date (Optional)</Label>
            <Input
              id="end-date"
              type="date"
              value={newCondition.endDate}
              onChange={(e) => setNewCondition({ ...newCondition, endDate: e.target.value })}
            />
          </div>
        </div>
        
        <Button onClick={addCondition} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Condition
        </Button>

        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Badge variant="outline">{condition.type}</Badge>
                <span className="ml-2 text-sm text-gray-600">
                  {condition.startDate} {condition.endDate && `- ${condition.endDate}`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialConditionsSettings;
