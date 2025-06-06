
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";

interface HealthIssuesSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const HealthIssuesSelector = ({ value, onChange }: HealthIssuesSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCondition, setCustomCondition] = useState('');

  const commonHealthConditions = [
    'Diabetes Type 1',
    'Diabetes Type 2',
    'High Blood Pressure',
    'Heart Disease',
    'Asthma',
    'Arthritis',
    'Thyroid Issues',
    'High Cholesterol',
    'PCOS',
    'Anxiety',
    'Depression',
    'Sleep Apnea',
    'Migraine',
    'IBS',
    'Acid Reflux',
    'Osteoporosis',
    'Fibromyalgia',
    'Chronic Fatigue',
    'Food Allergies',
    'Lactose Intolerance',
    'Gluten Sensitivity',
    'Kidney Disease',
    'Liver Disease',
    'Back Pain',
    'Knee Problems',
    'Shoulder Issues'
  ];

  const filteredConditions = commonHealthConditions.filter(condition =>
    condition.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(condition)
  );

  const addCondition = (condition: string) => {
    if (!value.includes(condition)) {
      onChange([...value, condition]);
    }
  };

  const removeCondition = (condition: string) => {
    onChange(value.filter(c => c !== condition));
  };

  const addCustomCondition = () => {
    if (customCondition.trim() && !value.includes(customCondition.trim())) {
      onChange([...value, customCondition.trim()]);
      setCustomCondition('');
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Health Conditions (Optional)
      </Label>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search health conditions..."
          className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
        />
      </div>

      {/* Suggested Conditions */}
      {searchTerm && filteredConditions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
          {filteredConditions.slice(0, 8).map((condition) => (
            <Button
              key={condition}
              type="button"
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto py-2 px-3 text-xs"
              onClick={() => addCondition(condition)}
            >
              <Plus className="w-3 h-3 mr-1" />
              {condition}
            </Button>
          ))}
        </div>
      )}

      {/* Custom Condition Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={customCondition}
          onChange={(e) => setCustomCondition(e.target.value)}
          placeholder="Add custom condition"
          className="flex-1 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
        />
        <Button 
          type="button" 
          onClick={addCustomCondition}
          size="sm"
          className="w-full sm:w-auto"
          disabled={!customCondition.trim()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Selected Conditions */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Selected Conditions:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((condition) => (
              <Badge key={condition} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {condition}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeCondition(condition)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        This information helps us create safer, more personalized recommendations for you.
      </p>
    </div>
  );
};

export default HealthIssuesSelector;
