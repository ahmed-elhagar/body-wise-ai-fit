
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface HealthConditionsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const HealthConditionsSection = ({ formData, setFormData }: HealthConditionsSectionProps) => {
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newInjury, setNewInjury] = useState('');
  const [newLimitation, setNewLimitation] = useState('');

  const addArrayItem = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
      setter('');
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800">Health Information</h3>
      
      <div className="space-y-3">
        <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Add condition (e.g., diabetes)"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('chronic_conditions', newCondition, setNewCondition))}
          />
          <Button 
            type="button" 
            onClick={() => addArrayItem('chronic_conditions', newCondition, setNewCondition)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.chronic_conditions || []).map((condition: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {condition}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem('chronic_conditions', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="medications">Current Medications</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="Add medication"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('medications', newMedication, setNewMedication))}
          />
          <Button 
            type="button" 
            onClick={() => addArrayItem('medications', newMedication, setNewMedication)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.medications || []).map((medication: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {medication}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem('medications', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="injuries">Previous Injuries</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newInjury}
            onChange={(e) => setNewInjury(e.target.value)}
            placeholder="Add injury history"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('injuries', newInjury, setNewInjury))}
          />
          <Button 
            type="button" 
            onClick={() => addArrayItem('injuries', newInjury, setNewInjury)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.injuries || []).map((injury: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {injury}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem('injuries', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="physical_limitations">Physical Limitations</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newLimitation}
            onChange={(e) => setNewLimitation(e.target.value)}
            placeholder="Add physical limitation"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('physical_limitations', newLimitation, setNewLimitation))}
          />
          <Button 
            type="button" 
            onClick={() => addArrayItem('physical_limitations', newLimitation, setNewLimitation)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.physical_limitations || []).map((limitation: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {limitation}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem('physical_limitations', index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthConditionsSection;
