
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Plus, X } from "lucide-react";

interface HealthIssuesSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const HealthIssuesSelector = ({ value, onChange }: HealthIssuesSelectorProps) => {
  const [customCondition, setCustomCondition] = useState("");

  const commonConditions = [
    'Diabetes',
    'High Blood Pressure',
    'Heart Conditions',
    'Arthritis',
    'Back Problems',
    'Knee Problems',
    'Asthma',
    'None'
  ];

  const toggleCondition = (condition: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    if (condition === 'None') {
      onChange(['None']);
      return;
    }
    
    const filteredValues = currentValues.filter(v => v !== 'None');
    
    if (filteredValues.includes(condition)) {
      onChange(filteredValues.filter(v => v !== condition));
    } else {
      onChange([...filteredValues, condition]);
    }
  };

  const addCustomCondition = () => {
    if (customCondition.trim() && !value.includes(customCondition.trim())) {
      const currentValues = Array.isArray(value) ? value.filter(v => v !== 'None') : [];
      onChange([...currentValues, customCondition.trim()]);
      setCustomCondition("");
    }
  };

  const removeCondition = (condition: string) => {
    onChange((Array.isArray(value) ? value : []).filter(v => v !== condition));
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
        Health Conditions (Optional)
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {commonConditions.map((condition) => {
          const isSelected = Array.isArray(value) && value.includes(condition);
          
          return (
            <Button
              key={condition}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`text-xs ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => toggleCondition(condition)}
            >
              {condition}
            </Button>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gray-600">Add custom condition:</Label>
        <div className="flex gap-2">
          <Textarea
            value={customCondition}
            onChange={(e) => setCustomCondition(e.target.value)}
            placeholder="Type any other health condition..."
            className="text-sm"
            rows={2}
          />
          <Button
            type="button"
            size="sm"
            onClick={addCustomCondition}
            disabled={!customCondition.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {Array.isArray(value) && value.length > 0 && value[0] !== 'None' && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Selected conditions:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((condition) => (
              <div
                key={condition}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
              >
                <span>{condition}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-blue-200"
                  onClick={() => removeCondition(condition)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthIssuesSelector;
