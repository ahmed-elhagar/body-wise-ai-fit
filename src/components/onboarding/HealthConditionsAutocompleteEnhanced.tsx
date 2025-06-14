
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";
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

interface HealthConditionsAutocompleteEnhancedProps {
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const HEALTH_CONDITIONS = [
  'PCOS', 'Insulin Resistance', 'Type 1 Diabetes', 'Type 2 Diabetes', 
  'Pregnancy', 'Breastfeeding', 'Hypothyroidism', 'Hyperthyroidism',
  'Hypertension', 'High Cholesterol', 'Celiac Disease', 'IBS',
  'Crohn\'s Disease', 'Kidney Disease', 'Heart Disease', 'Asthma',
  'Arthritis', 'Osteoporosis', 'Depression', 'Anxiety',
  'Sleep Apnea', 'Migraine', 'Epilepsy', 'Fibromyalgia',
  'Chronic Fatigue Syndrome', 'Lupus', 'Multiple Sclerosis',
  'Parkinson\'s Disease', 'Alzheimer\'s Disease', 'Stroke History',
  'Cancer History', 'Eating Disorder', 'Food Allergies',
  'Lactose Intolerance', 'Gluten Sensitivity', 'Iron Deficiency',
  'Vitamin D Deficiency', 'B12 Deficiency', 'Anemia',
  'High Blood Pressure', 'Low Blood Pressure', 'Irregular Heartbeat'
];

const ALLERGIES = [
  'Nuts', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Eggs', 
  'Dairy', 'Milk', 'Soy', 'Wheat', 'Gluten', 'Sesame',
  'Mustard', 'Celery', 'Sulphites', 'Lupin', 'Molluscs',
  'Strawberries', 'Kiwi', 'Mango', 'Avocado', 'Banana',
  'Chocolate', 'Caffeine', 'Alcohol', 'Artificial Sweeteners',
  'Food Coloring', 'Preservatives', 'MSG', 'Yeast'
];

const HealthConditionsAutocompleteEnhanced = ({
  selectedConditions,
  onConditionsChange,
  label = "Health Conditions & Allergies",
  placeholder = "Search conditions or allergies...",
  className = ""
}: HealthConditionsAutocompleteEnhancedProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const allOptions = [...HEALTH_CONDITIONS, ...ALLERGIES].sort();
  
  const filteredOptions = allOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedConditions.includes(option)
  );

  const addCondition = (condition: string) => {
    if (!selectedConditions.includes(condition)) {
      onConditionsChange([...selectedConditions, condition]);
    }
    setSearchTerm("");
    setOpen(false);
  };

  const removeCondition = (condition: string) => {
    onConditionsChange(selectedConditions.filter(c => c !== condition));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 justify-start border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300 transition-colors rounded-xl bg-white"
          >
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-500">{placeholder}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-50 bg-white border shadow-lg" align="start">
          <Command>
            <CommandInput 
              placeholder={placeholder}
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="h-9" 
            />
            <CommandList>
              <CommandEmpty>No conditions found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.slice(0, 10).map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => addCondition(option)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2 text-green-600" />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Conditions */}
      {selectedConditions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Selected ({selectedConditions.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedConditions.map((condition) => (
              <Badge 
                key={condition} 
                variant="secondary" 
                className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                {condition}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={() => removeCondition(condition)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthConditionsAutocompleteEnhanced;
