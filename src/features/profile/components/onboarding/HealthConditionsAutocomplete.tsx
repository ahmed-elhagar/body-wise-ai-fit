
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HealthConditionsAutocompleteProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const commonHealthConditions = [
  "Diabetes Type 1",
  "Diabetes Type 2",
  "High Blood Pressure",
  "High Cholesterol",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Osteoporosis",
  "Thyroid Disorders",
  "PCOS",
  "Anxiety",
  "Depression",
  "Fibromyalgia",
  "Chronic Fatigue Syndrome",
  "Irritable Bowel Syndrome",
  "Crohn's Disease",
  "Celiac Disease",
  "Sleep Apnea",
  "Migraine",
  "Chronic Back Pain",
  "Knee Problems",
  "Shoulder Problems",
  "Previous Heart Surgery",
  "Previous Joint Surgery",
  "Pregnancy",
  "Breastfeeding",
  "Taking Blood Thinners",
  "Taking Insulin",
  "Food Allergies",
  "Lactose Intolerance",
];

const HealthConditionsAutocomplete = ({ value, onChange }: HealthConditionsAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [customCondition, setCustomCondition] = useState("");

  const addCondition = (condition: string) => {
    if (condition.trim() && !value.includes(condition.trim())) {
      onChange([...value, condition.trim()]);
    }
    setOpen(false);
  };

  const addCustomCondition = () => {
    if (customCondition.trim() && !value.includes(customCondition.trim())) {
      onChange([...value, customCondition.trim()]);
      setCustomCondition("");
    }
  };

  const removeCondition = (conditionToRemove: string) => {
    onChange(value.filter(condition => condition !== conditionToRemove));
  };

  const availableConditions = commonHealthConditions.filter(
    condition => !value.includes(condition)
  );

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-gray-800">
        Any health conditions or concerns? (Optional)
      </Label>
      
      <div className="space-y-3">
        {/* Autocomplete Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal border-2 border-gray-200 hover:border-blue-300 transition-colors"
            >
              {availableConditions.length > 0 
                ? "Select from common conditions..." 
                : "All common conditions selected"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search health conditions..." />
              <CommandList>
                <CommandEmpty>No conditions found.</CommandEmpty>
                <CommandGroup>
                  {availableConditions.map((condition) => (
                    <CommandItem
                      key={condition}
                      value={condition}
                      onSelect={() => addCondition(condition)}
                      className="cursor-pointer"
                    >
                      {condition}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Custom condition input */}
        <div className="flex gap-2">
          <Input
            value={customCondition}
            onChange={(e) => setCustomCondition(e.target.value)}
            placeholder="Add custom condition..."
            className="flex-1 border-2 border-gray-200 focus:border-blue-500 transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
          />
          <Button 
            type="button" 
            onClick={addCustomCondition}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected conditions */}
        {value.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Selected conditions:</Label>
            <div className="flex flex-wrap gap-2">
              {value.map((condition, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {condition}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" 
                    onClick={() => removeCondition(condition)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        This information helps us create safer, more personalized recommendations for you.
      </p>
    </div>
  );
};

export default HealthConditionsAutocomplete;
