
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search, Loader2 } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { toast } from "sonner";

const HEALTH_CONDITIONS = [
  'PCOS', 'Insulin Resistance', 'Type 1 Diabetes', 'Type 2 Diabetes', 
  'Pregnancy', 'Breastfeeding', 'Hypothyroidism', 'Hyperthyroidism',
  'Hypertension', 'High Cholesterol', 'Celiac Disease', 'IBS',
  'Crohn\'s Disease', 'Kidney Disease', 'Heart Disease'
];

const HealthConditionsSection = () => {
  const { profile, updateProfile, isLoading: profileLoading } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.health_conditions) {
      setSelectedConditions(profile.health_conditions);
    }
  }, [profile]);

  const filteredConditions = HEALTH_CONDITIONS.filter(condition =>
    condition.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedConditions.includes(condition)
  );

  const addCondition = (condition: string) => {
    setSelectedConditions(prev => [...prev, condition]);
    setSearchTerm('');
  };

  const removeCondition = (condition: string) => {
    setSelectedConditions(prev => prev.filter(c => c !== condition));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ health_conditions: selectedConditions });
      toast.success('Health conditions updated successfully!');
    } catch (error) {
      console.error('Error updating health conditions:', error);
      toast.error('Failed to update health conditions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Search and Add Conditions</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search health conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {searchTerm && filteredConditions.length > 0 && (
            <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
              {filteredConditions.map(condition => (
                <div
                  key={condition}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => addCondition(condition)}
                >
                  <span>{condition}</span>
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Selected Conditions</Label>
          <div className="flex flex-wrap gap-2">
            {selectedConditions.map(condition => (
              <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                {condition}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={() => removeCondition(condition)}
                />
              </Badge>
            ))}
            {selectedConditions.length === 0 && (
              <p className="text-gray-500 text-sm">No health conditions selected</p>
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
            'Save Health Conditions'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HealthConditionsSection;
