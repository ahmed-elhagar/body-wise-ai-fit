
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableNationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchableNationalitySelector = ({ value, onChange }: SearchableNationalitySelectorProps) => {
  const [open, setOpen] = useState(false);

  const nationalities = [
    { value: "prefer_not_to_say", label: "Prefer not to say" },
    { value: "saudi", label: "Saudi Arabian" },
    { value: "emirati", label: "Emirati" },
    { value: "qatari", label: "Qatari" },
    { value: "kuwaiti", label: "Kuwaiti" },
    { value: "bahraini", label: "Bahraini" },
    { value: "omani", label: "Omani" },
    { value: "egyptian", label: "Egyptian" },
    { value: "lebanese", label: "Lebanese" },
    { value: "jordanian", label: "Jordanian" },
    { value: "syrian", label: "Syrian" },
    { value: "iraqi", label: "Iraqi" },
    { value: "moroccan", label: "Moroccan" },
    { value: "tunisian", label: "Tunisian" },
    { value: "algerian", label: "Algerian" },
    { value: "american", label: "American" },
    { value: "british", label: "British" },
    { value: "canadian", label: "Canadian" },
    { value: "australian", label: "Australian" },
    { value: "indian", label: "Indian" },
    { value: "pakistani", label: "Pakistani" },
    { value: "bangladeshi", label: "Bangladeshi" },
    { value: "filipino", label: "Filipino" },
    { value: "indonesian", label: "Indonesian" },
    { value: "other", label: "Other" }
  ];

  const selectedNationality = nationalities.find(nat => nat.value === value);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Nationality (Optional)
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl justify-between"
          >
            {selectedNationality ? selectedNationality.label : "Select nationality..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search nationality..." />
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
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === nationality.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {nationality.label}
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
