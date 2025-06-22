
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface SearchableNationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchableNationalitySelector = ({ value, onChange }: SearchableNationalitySelectorProps) => {
  const [open, setOpen] = useState(false);

  const nationalities = [
    { value: 'american', label: 'American' },
    { value: 'british', label: 'British' },
    { value: 'canadian', label: 'Canadian' },
    { value: 'australian', label: 'Australian' },
    { value: 'german', label: 'German' },
    { value: 'french', label: 'French' },
    { value: 'italian', label: 'Italian' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'brazilian', label: 'Brazilian' },
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'south_korean', label: 'South Korean' },
    { value: 'egyptian', label: 'Egyptian' },
    { value: 'saudi', label: 'Saudi' },
    { value: 'emirati', label: 'Emirati' },
    { value: 'moroccan', label: 'Moroccan' },
    { value: 'tunisian', label: 'Tunisian' },
    { value: 'lebanese', label: 'Lebanese' },
    { value: 'jordanian', label: 'Jordanian' },
    { value: 'kuwaiti', label: 'Kuwaiti' },
    { value: 'qatari', label: 'Qatari' },
    { value: 'bahraini', label: 'Bahraini' },
    { value: 'omani', label: 'Omani' },
    { value: 'yemeni', label: 'Yemeni' },
    { value: 'iraqi', label: 'Iraqi' },
    { value: 'syrian', label: 'Syrian' },
    { value: 'palestinian', label: 'Palestinian' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  const selectedNationality = nationalities.find(n => n.value === value);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Nationality (Optional)
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-12 justify-between border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300 transition-colors rounded-xl text-left font-normal"
            data-testid="nationality"
          >
            {selectedNationality ? selectedNationality.label : "Search nationality..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search nationality..." className="h-9" />
            <CommandList>
              <CommandEmpty>No nationality found.</CommandEmpty>
              <CommandGroup>
                {nationalities.map((nationality) => (
                  <CommandItem
                    key={nationality.value}
                    value={nationality.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {nationality.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === nationality.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchableNationalitySelector;
