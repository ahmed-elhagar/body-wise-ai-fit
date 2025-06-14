import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";

interface SpecialCondition {
  type: string;
  startDate: string;
  endDate: string;
}

const SpecialConditionsSettings = () => {
  const { profile, updateProfile } = useProfile();
  const [conditions, setConditions] = useState<SpecialCondition[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.special_conditions) {
      try {
        // Safely convert the JSON data to SpecialCondition array
        const conditionsData = Array.isArray(profile.special_conditions) 
          ? profile.special_conditions 
          : [];
        
        const typedConditions: SpecialCondition[] = conditionsData
          .filter((item): item is any => typeof item === 'object' && item !== null)
          .map((item: any) => ({
            type: item.type || '',
            startDate: item.startDate || '',
            endDate: item.endDate || ''
          }));
        
        setConditions(typedConditions);
      } catch (error) {
        console.error('Error parsing special conditions:', error);
        setConditions([]);
      }
    }
  }, [profile]);

  const handleConditionChange = (index: number, field: keyof SpecialCondition, value: string) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const addCondition = () => {
    setConditions([...conditions, { type: '', startDate: '', endDate: '' }]);
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const saveConditions = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ special_conditions: conditions });
      console.log('Special conditions saved:', conditions);
    } catch (error) {
      console.error('Error saving special conditions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="grid gap-3">
            <Label htmlFor={`type-${index}`}>Condition Type</Label>
            <Input
              type="text"
              id={`type-${index}`}
              value={condition.type}
              onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  type="date"
                  id={`startDate-${index}`}
                  value={condition.startDate}
                  onChange={(e) => handleConditionChange(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  type="date"
                  id={`endDate-${index}`}
                  value={condition.endDate}
                  onChange={(e) => handleConditionChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
            
            <Button variant="destructive" size="sm" onClick={() => removeCondition(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addCondition}>
          Add Condition
        </Button>
        <Button onClick={saveConditions} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Conditions'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpecialConditionsSettings;
