
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, Plus } from "lucide-react";

interface GoalsMotivationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const GoalsMotivationSection = ({ formData, setFormData }: GoalsMotivationSectionProps) => {
  const [newMotivation, setNewMotivation] = useState('');
  const [newGoal, setNewGoal] = useState('');

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
      <h3 className="text-base lg:text-lg font-semibold text-gray-800">Goals & Motivation</h3>
      
      <div className="space-y-3">
        <Label htmlFor="primary_motivation">Primary Motivation</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newMotivation}
            onChange={(e) => setNewMotivation(e.target.value)}
            placeholder="Add motivation (e.g., better health)"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('primary_motivation', newMotivation, setNewMotivation))}
          />
          <Button 
            type="button" 
            onClick={() => addArrayItem('primary_motivation', newMotivation, setNewMotivation)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.primary_motivation || []).map((motivation: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {motivation}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem('primary_motivation', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="specific_goals">Specific Goals</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add specific goal"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('specific_goals', newGoal, setNewGoal))}
          />
          <Button 
            type="button" 
            onClick={() => addArrayItem('specific_goals', newGoal, setNewGoal)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.specific_goals || []).map((goal: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {goal}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem('specific_goals', index)}
              />
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="text-sm">Commitment Level: {formData.commitment_level || 7}/10</Label>
        <Slider
          value={[formData.commitment_level || 7]}
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, commitment_level: value[0] }))}
          max={10}
          min={1}
          step={1}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div>
        <Label htmlFor="timeline_expectation">Timeline Expectation</Label>
        <Select 
          value={formData.timeline_expectation || ''} 
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, timeline_expectation: value }))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1_month">1 Month</SelectItem>
            <SelectItem value="3_months">3 Months</SelectItem>
            <SelectItem value="6_months">6 Months</SelectItem>
            <SelectItem value="1_year">1 Year</SelectItem>
            <SelectItem value="long_term">Long-term (1+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GoalsMotivationSection;
