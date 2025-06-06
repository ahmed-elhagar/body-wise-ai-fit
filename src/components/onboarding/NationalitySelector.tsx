
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface NationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const NationalitySelector = ({ value, onChange }: NationalitySelectorProps) => {
  const nationalities = [
    { value: "", label: "Prefer not to say" },
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

  return (
    <div className="space-y-2">
      <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
        Nationality (Optional)
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl" data-testid="nationality">
          <SelectValue placeholder="Select your nationality (optional)" />
        </SelectTrigger>
        <SelectContent>
          {nationalities.map((nationality) => (
            <SelectItem key={nationality.value} value={nationality.value}>
              {nationality.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NationalitySelector;
