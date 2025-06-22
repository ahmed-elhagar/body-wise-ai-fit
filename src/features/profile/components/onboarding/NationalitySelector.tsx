
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const NationalitySelector = ({ value, onChange }: NationalitySelectorProps) => {
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
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Nationality (Optional)
      </Label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl" data-testid="nationality">
          <SelectValue placeholder="Select your nationality" />
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
