
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, Loader2 } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { toast } from "sonner";

interface SpecialCondition {
  type: 'muslim_fasting' | 'vacation_mood' | 'injury';
  startDate: string;
  endDate: string;
  details?: string;
}

const INJURY_AREAS = [
  'Lower Back', 'Upper Back', 'Neck', 'Shoulder', 'Elbow', 'Wrist',
  'Hip', 'Knee', 'Ankle', 'Foot', 'Chest', 'Abdomen', 'Head'
];

export const SpecialConditionsSettings = () => {
  const { profile, updateProfile, isLoading: profileLoading } = useProfile();
  const [conditions, setConditions] = useState<SpecialCondition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCondition, setNewCondition] = useState({
    type: 'muslim_fasting' as SpecialCondition['type'],
    startDate: '',
    endDate: '',
    details: ''
  });

  useEffect(() => {
    if (profile?.special_conditions) {
      setConditions(profile.special_conditions as SpecialCondition[]);
    }
  }, [profile]);

  const addCondition = () => {
    if (!newCondition.startDate || !newCondition.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (newCondition.type === 'injury' && !newCondition.details) {
      toast.error('Please select injury area');
      return;
    }

    setConditions(prev => [...prev, { ...newCondition }]);
    setNewCondition({
      type: 'muslim_fasting',
      startDate: '',
      endDate: '',
      details: ''
    });
  };

  const removeCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ 
        special_conditions: conditions 
      } as any);
      toast.success('Special conditions updated successfully! This will affect your workout and meal plan generation.');
    } catch (error) {
      console.error('Error updating special conditions:', error);
      toast.error('Failed to update special conditions');
    } finally {
      setIsLoading(false);
    }
  };

  const getConditionLabel = (condition: SpecialCondition) => {
    let label = condition.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (condition.details) label += ` (${condition.details})`;
    return label;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 p-4 border rounded-lg">
          <Label>Add Special Condition</Label>
          
          <div>
            <Label>Condition Type</Label>
            <Select value={newCondition.type} onValueChange={(value: any) => setNewCondition(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muslim_fasting">Muslim Fasting</SelectItem>
                <SelectItem value="vacation_mood">Vacation Mode</SelectItem>
                <SelectItem value="injury">Injury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newCondition.type === 'injury' && (
            <div>
              <Label>Injury Area</Label>
              <Select value={newCondition.details} onValueChange={(value) => setNewCondition(prev => ({ ...prev, details: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select injury area" />
                </SelectTrigger>
                <SelectContent>
                  {INJURY_AREAS.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={newCondition.startDate}
                onChange={(e) => setNewCondition(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={newCondition.endDate}
                onChange={(e) => setNewCondition(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={addCondition} className="w-full">
            Add Condition
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Active Conditions</Label>
          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{getConditionLabel(condition)}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {condition.startDate} to {condition.endDate}
                  </div>
                </div>
                <X
                  className="h-4 w-4 cursor-pointer hover:text-red-600"
                  onClick={() => removeCondition(index)}
                />
              </div>
            ))}
            {conditions.length === 0 && (
              <p className="text-gray-500 text-sm">No special conditions active</p>
            )}
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isLoading || profileLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Special Conditions'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
